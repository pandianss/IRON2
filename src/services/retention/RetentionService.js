import { getLocalToday, getLocalYesterday } from '../../utils/dateHelpers.js';

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
            return saved ? JSON.parse(saved) : this.getDefaultData();
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
     * Resolves the status of past days (handling missed days).
     * Fills history for any days between last check-in and "yesterday".
     * @param {Object} currentData 
     * @param {Object} [dateOverride] 
     * @returns {Object} Updated data with resolved history
     */
    resolveDay(currentData, dateOverride = null) {
        const today = dateOverride?.today || getLocalToday();
        const yesterday = dateOverride?.yesterday || getLocalYesterday();
        const { lastCheckInDate, history } = currentData;

        // If no history, nothing to resolve (first run)
        if (!lastCheckInDate) return currentData;

        // If up to date, return as is
        if (lastCheckInDate === today || lastCheckInDate === yesterday) {
            return currentData;
        }

        // GAP DETECTED: We have missed days.
        // Simple logic: If last check-in was before yesterday, yesterday was MISSED.

        const newHistory = { ...history };

        // Mark yesterday as missed if it wasn't recorded (and last checkin wasn't yesterday)
        if (!newHistory[yesterday]) {
            newHistory[yesterday] = 'missed';
        }

        return {
            ...currentData,
            history: newHistory
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
        // 1. Resolve pending state first
        const resolvedData = this.resolveDay(currentData, dateOverride);

        const today = dateOverride?.today || getLocalToday();
        const yesterday = dateOverride?.yesterday || getLocalYesterday();

        const { lastCheckInDate, currentStreak, longestStreak, history } = resolvedData;

        // Idempotency Check
        if (lastCheckInDate === today) {
            return {
                newData: resolvedData,
                result: { streak: currentStreak, isNewRecord: false, alreadyCheckedIn: true }
            };
        }

        let newStreak = 1;

        // Continuity Check
        if (lastCheckInDate === yesterday) {
            newStreak = currentStreak + 1;
        } else if (lastCheckInDate === today) {
            newStreak = currentStreak;
        } else {
            // Broken Streak
            newStreak = 1;
        }

        const newLongest = Math.max(longestStreak, newStreak);

        const newData = {
            ...resolvedData,
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastCheckInDate: today,
            lastCheckInTime: new Date().toISOString(),
            history: {
                ...history,
                [today]: status
            }
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
     * Checks if the current day has been resolved (action taken).
     * @param {Object} currentData 
     * @param {Object} [dateOverride] 
     * @returns {boolean}
     */
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
        const today = dateOverride?.today || getLocalToday();

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
