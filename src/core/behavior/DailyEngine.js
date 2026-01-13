
import { TIERS } from './EngineSchema.js';

/**
 * Helper: Add days to a Date string YYYY-MM-DD
 */
const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

/**
 * Helper: Difference in days
 */
const getDayDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Phase 3: Streak Engine
 * Deterministic transition of streak state based on Day Status
 */
const resolveStreak = (currentStreak, dayStatus) => {
    const next = { ...currentStreak };

    if (dayStatus === 'COMPLETED') {
        if (!next.active) {
            next.active = true;
            next.count = 1;
        } else {
            next.count += 1;
        }
        if (next.count > next.longest) next.longest = next.count;
        next.last_action_date = new Date().toISOString(); // Note: Ideally passed in from context
    } else if (dayStatus === 'MISSED') {
        if (next.freeze_tokens > 0) {
            // Automatic Freeze Application
            next.freeze_tokens -= 1;
            // Streak stays active but count doesn't increase
        } else {
            // Break Streak
            next.active = false;
            next.count = 0;
            next.recovery_mode = true; // Enable recovery for next day
        }
    } else if (dayStatus === 'RECOVERED') {
        // Assume external logic handled the "how", we just restore active
        next.active = true;
        // Maybe penalty? For now just restore.
        next.recovery_mode = false;
    }

    return next;
};

/**
 * Phase 4: Engagement Engine
 */
const resolveEngagement = (currentEng, streakCount, dayStatus) => {
    const next = { ...currentEng };

    // Simple Score Math
    if (dayStatus === 'COMPLETED') {
        next.score += 10 + (Math.floor(streakCount / 10)); // Bonus for momentum
        next.decay_risk = Math.max(0, next.decay_risk - 10);
    } else if (dayStatus === 'MISSED') {
        next.decay_risk = Math.min(100, next.decay_risk + 20);
        // Score decay based on tier
        const tierData = TIERS[next.tier] || TIERS.DORMANT;
        next.score = Math.max(0, next.score - tierData.decay);
    }

    // Tier Promotion/Demotion logic could go here
    return next;
};

/**
 * Phase 1 & 2: Temporal Reconciliation & Resolution
 * This function evolves a state from day N to day M.
 * 
 * @param {object} previousState - The UserState before this run
 * @param {object} action - Optional action occurring TODAY (or null if just time processing)
 * @param {string} serverDate - YYYY-MM-DD
 */
const RECOVERY_DAYS_REQUIRED = 3;

/**
 * Phase 5: Retention State Engine
 * Determines psychological state (ENGAGED, AT_RISK, etc.)
 */
const resolveRiskState = (currentState, dayStatus, streakCount) => {
    let nextState = currentState;

    // Transitions based on Day Status
    if (dayStatus === 'COMPLETED' || dayStatus === 'RESTED') {
        if (currentState === 'STREAK_BROKEN') {
            nextState = 'RECOVERING';
        } else if (currentState === 'RECOVERING') {
            // Check if recovery is complete (simplified logic: essentially if streak > N)
            // Ideally we track separate recovery counter, but streak count works if we reset it to 0 on break.
            if (streakCount >= RECOVERY_DAYS_REQUIRED) {
                nextState = 'ENGAGED';
            }
        } else if (currentState === 'AT_RISK' || currentState === 'DORMANT') {
            nextState = 'ENGAGED'; // Saved!
        }
    } else if (dayStatus === 'MISSED') {
        if (currentState === 'ENGAGED' || currentState === 'RECOVERING') {
            // First miss? AT_RISK (Grace) or Straight to BROKEN?
            // Iron Philosophy: 1 Miss = AT_RISK (can recover with Freeze or Action next day)
            // But if no freeze tokens?
            // Let's say: Miss -> AT_RISK. Second Miss -> BROKEN.
            nextState = 'AT_RISK';
        } else if (currentState === 'AT_RISK') {
            nextState = 'STREAK_BROKEN';
        }
    }

    return nextState;
};

export const runDailyEngine = (previousState, action, serverDate) => {
    // Optimization: If today is already settled and date hasn't changed, return state as-is
    // BUT exception: Social events (support/witness) can happen anytime
    if (action && previousState.current_day === serverDate && previousState.today.primary_action_done) {
        if (['CHECK_IN', 'REST', 'GROUP_CHECKIN'].includes(action.type)) {
            console.warn("DailyEngine: Optimization - Returning previous state (Done for today).");
            return previousState;
        }
    }

    let state = JSON.parse(JSON.stringify(previousState)); // Deep clone for immutability

    // Ensure new schema fields exist if migration didn't happen
    if (!state.engagement_state) state.engagement_state = 'DORMANT';
    if (!state.recovery) state.recovery = { is_salvageable: false, window_remaining_hours: 0, missed_day_count: 0 };

    const lastDay = state.last_evaluated_day;
    const diff = getDayDiff(lastDay, serverDate);

    // Safety Break
    if (diff > 365) throw new Error("State too old to reconcile.");

    // 1. Process Missed Days (Time Travel)
    let pointerDate = lastDay;
    while (addDays(pointerDate, 1) < serverDate) {
        pointerDate = addDays(pointerDate, 1);
        const dayStatus = 'MISSED'; // Intermediate day missed

        // Engine Logic
        state.streak = resolveStreak(state.streak, dayStatus);
        state.engagement = resolveEngagement(state.engagement, state.streak.count, dayStatus);

        // Retention Logic
        state.engagement_state = resolveRiskState(state.engagement_state, dayStatus, state.streak.count);

        if (dayStatus === 'MISSED') {
            state.lifecycle.days_missed += 1;
            state.recovery.missed_day_count += 1;
        }
        state.lifecycle.days_active += 1;
    }

    // 2. Setup TODAY (serverDate)
    if (state.current_day !== serverDate) {
        state.previous_day_status = state.today.status;
        state.current_day = serverDate;
        state.last_evaluated_day = serverDate;

        state.today = {
            status: 'PENDING',
            primary_action_done: false,
            secondary_actions: 0,
            action_log: []
        };

        // Reset recovery count if we were ENGAGED? No, handle in Resolve
    }

    // 3. Process Action (If any)
    // 3. Process Action (If any)
    if (action) {
        if (['CHECK_IN', 'REST', 'GROUP_CHECKIN'].includes(action.type)) {
            const statusType = (action.type === 'CHECK_IN' || action.type === 'GROUP_CHECKIN') ? 'COMPLETED' : 'RESTED';

            state.today.primary_action_done = true;
            state.today.status = statusType;
            state.today.action_log.push(action.id || action.type);

            state.streak = resolveStreak(state.streak, statusType === 'RESTED' ? 'COMPLETED' : 'COMPLETED');
            state.engagement = resolveEngagement(state.engagement, state.streak.count, 'COMPLETED');

            // BONUS: Group Check-in Multiplier
            if (action.type === 'GROUP_CHECKIN') {
                state.engagement.score += 10; // Synergy Bonus
                state.social.witness_count += (action.participantCount || 1);
            }

            // Retention Update
            state.engagement_state = resolveRiskState(state.engagement_state, statusType, state.streak.count);
            state.recovery.missed_day_count = 0; // Reset consecutive misses

            state.lifecycle.total_actions += 1;
        }
        else if (action.type === 'SEND_SUPPORT') {
            // "PACT SAVE" Mechanic
            // If user is AT_RISK, support saves them from breaking streak tomorrow.
            // We give them a "Freeze Token" essentially, OR we treat today as handled?
            // Iron Model: Support grants 1 Freeze Token (max 1) if they have none, 
            // giving them a "Free Pass" for the missed day.

            if (state.engagement_state === 'AT_RISK') {
                if (state.streak.freeze_tokens === 0) {
                    state.streak.freeze_tokens += 1;
                    state.social.pact_saves += 1;
                    // Note: We don't change state to ENGAGED immediately, 
                    // the token will be consumed tomorrow to prevent STREAK_BROKEN.
                }
            } else if (state.engagement_state === 'ENGAGED') {
                // Boosting morale? Maybe just log it.
            }
        }
        else if (action.type === 'WITNESS_WORKOUT') {
            // "WITNESS" Mechanic
            // Increases score for the day
            if (state.today.status === 'COMPLETED') {
                state.engagement.score += 5; // Bonus
                state.social.witness_count += 1;
            }
        }
    }

    // 4. Post-Processing Calculation (Recovery Windows)
    // If AT_RISK, calculate time remaining? 
    if (state.engagement_state === 'AT_RISK') {
        state.recovery.is_salvageable = true;
        state.recovery.window_remaining_hours = 24;
    } else {
        state.recovery.is_salvageable = false;
        state.recovery.window_remaining_hours = 0;
    }

    return state;
};
