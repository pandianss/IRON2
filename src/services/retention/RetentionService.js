import { getLocalToday, getLocalYesterday, getDaysArray, subtractDays, getSystemTimezone } from '../../utils/dateHelpers.js';

const STORAGE_KEY = 'iron_streak_data_v2';

class RetentionService {
    constructor() {
        this.storageKey = STORAGE_KEY;
    }

    /**
     * Loads streak data from persistence or returns default.
     * @returns {Object} Streak Data
     */
    loadData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            let data = saved ? JSON.parse(saved) : this.getDefaultData();

            // Migration: Ensure anchorTimezone exists
            if (!data.anchorTimezone) {
                console.log("Iron Retention: Migrating Timezone Anchor");
                data.anchorTimezone = getSystemTimezone();
                this.saveData(data);
            }

            return data;
        } catch (e) {
            console.error("Failed to load streak data", e);
            return this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastCheckInDate: null,
            lastCheckInTime: null,
            anchorTimezone: getSystemTimezone(), // Set once, never changes automatically
            history: {}
        };
    }

    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save streak data", e);
        }
    }

    /**
     * Public method to force resolution of past days ("Day Close").
     * Should be called on App Open.
     */
    syncHistory() {
        const currentData = this.loadData();
        const resolvedData = this.resolveDay(currentData);

        // RECALCULATE STREAK after gap resolution
        const timezone = currentData.anchorTimezone || getSystemTimezone();
        const today = getLocalToday(timezone);
        const yesterday = getLocalYesterday(timezone);

        // If today is done, anchor today. Else anchor yesterday (safeguard streak until missed).
        const anchor = resolvedData.history[today] ? today : yesterday;
        const newStreak = this.recalculateStreak(resolvedData.history, anchor);

        const finalData = {
            ...resolvedData,
            currentStreak: newStreak
        };

        // Save if changed
        if (JSON.stringify(currentData) !== JSON.stringify(finalData)) {
            console.log("Iron Retention: Synced History & Streak");
            this.saveData(finalData);
        }

        return finalData;
    }

    /**
     * Resolves the status of past days (handling missed days).
     * Fills history for any days between last check-in and "yesterday".
     * @param {Object} currentData 
     * @param {Object} [dateOverride] 
     * @returns {Object} Updated data with resolved history
     */
    resolveDay(currentData, dateOverride = null) {
        const timezone = currentData.anchorTimezone || getSystemTimezone();
        const today = dateOverride?.today || getLocalToday(timezone);
        const yesterday = dateOverride?.yesterday || getLocalYesterday(timezone);
        const { lastCheckInDate, history } = currentData;

        // If no history, nothing to resolve (first run)
        if (!lastCheckInDate) return currentData;

        // If up to date, return as is
        if (lastCheckInDate === today || lastCheckInDate === yesterday) {
            return currentData;
        }

        // GAP DETECTED: We have missed days.
        // Logic: Iterate from lastCheckInDate + 1 up to yesterday.
        // Mark all as 'missed'.

        const newHistory = { ...history };
        const missingDays = getDaysArray(lastCheckInDate, yesterday);

        missingDays.forEach(day => {
            if (!newHistory[day]) {
                newHistory[day] = 'missed';
            }
        });

        // Break Detection
        let breakReason = currentData.streakBreakReason; // Preserve existing if not cleared
        if (missingDays.length > 0 && currentData.currentStreak > 0) {
            // Streak just broke.
            breakReason = `Missed ${missingDays.length} day${missingDays.length > 1 ? 's' : ''}`;
        }

        return {
            ...currentData,
            history: newHistory,
            streakBreakReason: breakReason
        };
    }

    /**
     * Pure function to calculate new streak state.
     * @param {Object} currentData 
     * @param {'trained' | 'rest'} status 
     * @param {Object} [dateOverride] - Optional dates for testing validation { today, yesterday }
     * @returns {Object} { newData, result: { streak, isNewRecord } }
     */
    calculateCheckIn(currentData, status, dateOverride = null) {
        // 1. Resolve pending state first (fill gaps with MISSED)
        const resolvedData = this.resolveDay(currentData, dateOverride);
        const timezone = currentData.anchorTimezone || getSystemTimezone();

        const today = dateOverride?.today || getLocalToday(timezone);

        const { lastCheckInDate, longestStreak, history } = resolvedData;

        // Idempotency Check (if already done today)
        if (lastCheckInDate === today) {
            return {
                newData: resolvedData,
                result: { streak: resolvedData.currentStreak, isNewRecord: false, alreadyCheckedIn: true }
            };
        }

        // 2. Update History (The Truth)
        const newHistory = {
            ...history,
            [today]: status
        };

        // 3. DERIVE STREAK (Deterministic)
        // We do not mutate streak. We calculate it from history.
        const newStreak = this.recalculateStreak(newHistory, today);

        const newLongest = Math.max(longestStreak, newStreak);

        const newData = {
            ...resolvedData,
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastCheckInDate: today,
            lastCheckInTime: new Date().toISOString(),
            history: newHistory
        };

        return {
            newData,
            result: {
                streak: newStreak,
                isNewRecord: newStreak > longestStreak,
                status
            }
        };
    }

    /**
     * Derives streak count from history ledger.
     * @param {Object} history 
     * @param {string} anchorDate - Start counting backwards from here (inclusive)
     * @returns {number}
     */
    recalculateStreak(history, anchorDate) {
        let count = 0;
        let currentDate = anchorDate;

        while (true) {
            const status = history[currentDate];
            if (status === 'trained' || status === 'rest') {
                count++;
                currentDate = subtractDays(currentDate, 1);
            } else {
                // 'missed' or undefined breaks the streak
                break;
            }

            // Safety break (e.g. 10 years)
            if (count > 3650) break;
        }
        return count;
    }

    /**
     * Checks if the current day has been resolved (action taken).
     * @param {Object} currentData 
     * @param {Object} [dateOverride] 
     * @returns {boolean}
     */
    isDayResolved(currentData, dateOverride = null) {
        const timezone = currentData.anchorTimezone || getSystemTimezone();
        const today = dateOverride?.today || getLocalToday(timezone);
        return currentData.history[today] !== undefined;
    }

    /**
     * Determines if a nudge is needed based on retention state.
     * Decoupled from UI lifecycle.
     * @param {Object} currentData 
     * @param {Object} [dateOverride]
     * @returns {Object} { shouldNudge: boolean, type: string }
     */
    checkNudgeEligibility(currentData, dateOverride = null) {
        const isResolved = this.isDayResolved(currentData, dateOverride);
        const { currentStreak, lastCheckInDate } = currentData;
        const timezone = currentData.anchorTimezone || getSystemTimezone();
        const today = dateOverride?.today || getLocalToday(timezone);

        // Already done today? Silence.
        if (isResolved) return { shouldNudge: false };

        // Already checked in today (redundant check but safe)? Silence.
        if (lastCheckInDate === today) return { shouldNudge: false };

        // Nudge Policy:
        // 1. High Streak Protection (Streak >= 3)
        if (currentStreak >= 3) {
            return { shouldNudge: true, type: 'risk_alert' };
        }

        // 2. Habit Formation (Streak 1-2) - gentle reminder?
        // For now, only high stakes.

        return { shouldNudge: false };
    }
}

export const retentionService = new RetentionService();
