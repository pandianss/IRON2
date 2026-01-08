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
     * Pure function to calculate new streak state.
     * @param {Object} currentData 
     * @param {'trained' | 'rest'} status 
     * @param {Object} [dateOverride] - Optional dates for testing validation { today, yesterday }
     * @returns {Object} { newData, result: { streak, isNewRecord } }
     */
    calculateCheckIn(currentData, status, dateOverride = null) {
        const today = dateOverride?.today || getLocalToday();
        const yesterday = dateOverride?.yesterday || getLocalYesterday();

        const { lastCheckInDate, currentStreak, longestStreak, history } = currentData;

        // Idempotency Check
        if (lastCheckInDate === today) {
            return {
                newData: currentData,
                result: { streak: currentStreak, isNewRecord: false, alreadyCheckedIn: true }
            };
        }

        let newStreak = 1;

        // Continuity Check
        if (lastCheckInDate === yesterday) {
            newStreak = currentStreak + 1;
        } else if (lastCheckInDate === today) {
            // Should be caught by idempotency, but safe fallback
            newStreak = currentStreak;
        } else {
            // Broken Streak (unless first time, which is handled by init 0)
            // Logic: if lastCheckInDate is null, newStreak is 1.
            // If lastCheckInDate is older than yesterday, newStreak is 1.
            newStreak = 1;
        }

        const newLongest = Math.max(longestStreak, newStreak);

        const newData = {
            ...currentData,
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
}

export const retentionService = new RetentionService();
