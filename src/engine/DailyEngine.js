
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
export const runDailyEngine = (previousState, action, serverDate) => {
    let state = JSON.parse(JSON.stringify(previousState)); // Deep clone for immutability

    const lastDay = state.last_evaluated_day;
    const diff = getDayDiff(lastDay, serverDate);

    // 1. Process Missed Days (Time Travel)
    // If last_evaluated was 2023-01-01 and today is 2023-01-03, we must close 01 and 02.
    // Wait, if last_eval was 01, that means 01 was "touched". 
    // If today is 03, we missed 02.

    // Iterate strictly for days BETWEEN last evaluated and today
    let pointerDate = lastDay;

    // Safety Break
    if (diff > 365) throw new Error("State too old to reconcile.");

    // Advance time day-by-day until YESTERDAY
    // (We stop before Today because Today is open for business)
    while (addDays(pointerDate, 1) < serverDate) {
        pointerDate = addDays(pointerDate, 1);

        // This intermediate day was definitely MISSED because we are only seeing it now
        // (unless we had future planned leaves, but Phase 1 doesn't support that)

        // Close the day
        const dayStatus = 'MISSED'; // Resolved status

        // Update Stats
        state.streak = resolveStreak(state.streak, dayStatus);
        state.engagement = resolveEngagement(state.engagement, state.streak.count, dayStatus);
        state.lifecycle.days_missed += 1;
        state.lifecycle.days_active += 1; // Time passed

        // Log it (In a real system we'd push to an event array, here we just mutate state)
    }

    // 2. Setup TODAY (serverDate)
    if (state.current_day !== serverDate) {
        // New Day Dawn
        state.previous_day_status = state.today.status; // Archive yesterday's final status
        state.current_day = serverDate;
        state.last_evaluated_day = serverDate;

        // Reset Today Shell
        state.today = {
            status: 'PENDING',
            primary_action_done: false,
            secondary_actions: 0,
            action_log: []
        };
    }

    // 3. Process Action (If any)
    if (action) {
        // Validate Action
        if (action.type === 'CHECK_IN') {
            state.today.primary_action_done = true;
            state.today.status = 'COMPLETED';
            state.today.action_log.push(action.id);

            // Immediate Gratification
            state.streak = resolveStreak(state.streak, 'COMPLETED');
            state.engagement = resolveEngagement(state.engagement, state.streak.count, 'COMPLETED');
            state.lifecycle.total_actions += 1;
        }
    }

    return state;
};
