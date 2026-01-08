import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'iron_streak_data_v2';

export const useStreaks = () => {
    // ---- STATE ----
    const [streakData, setStreakData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {
                currentStreak: 0,
                longestStreak: 0,
                lastCheckInDate: null, // "YYYY-MM-DD"
                lastCheckInTime: null, // ISO string for debug
                history: {} // Map "YYYY-MM-DD" -> "trained" | "rest"
            };
        } catch (e) {
            return { currentStreak: 0, longestStreak: 0, lastCheckInDate: null, history: {} };
        }
    });

    const [sessionDismissed, setSessionDismissed] = useState(false);

    // ---- PERSISTENCE ----
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(streakData));
    }, [streakData]);

    // ---- HELPERS ----
    const getTodayDate = () => {
        // Use local calendar date
        const now = new Date();
        return now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
    };

    const getYesterdayDate = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    };

    // ---- ACTIONS ----
    /**
     * @param {'trained' | 'rest'} status 
     */
    const performCheckIn = useCallback((status) => {
        const today = getTodayDate();
        const yesterday = getYesterdayDate();
        const { lastCheckInDate, currentStreak } = streakData;

        // Prevent double
        if (lastCheckInDate === today) return;

        let newStreak = 1;

        if (lastCheckInDate === yesterday) {
            newStreak = currentStreak + 1;
        } else if (lastCheckInDate === today) {
            newStreak = currentStreak; // Should be handled by guard above, but safe fallback
        } else {
            // Missed more than 1 day -> Reset
            // Unless it's the very first check-in
            newStreak = 1;
        }

        const newLongest = Math.max(streakData.longestStreak, newStreak);

        setStreakData(prev => ({
            ...prev,
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastCheckInDate: today,
            lastCheckInTime: new Date().toISOString(),
            history: {
                ...prev.history,
                [today]: status
            }
        }));

        return { streak: newStreak, isNewRecord: newStreak > streakData.longestStreak };
    }, [streakData]);

    const dismissCheckIn = useCallback(() => {
        setSessionDismissed(true);
    }, []);

    // ---- STATUS CHECKS ----
    const isCheckedInToday = streakData.lastCheckInDate === getTodayDate();
    const shouldShowCheckIn = !isCheckedInToday && !sessionDismissed;

    return {
        streak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastCheckInDate: streakData.lastCheckInDate,
        isCheckedInToday,
        shouldShowCheckIn,
        performCheckIn,
        dismissCheckIn
    };
};
