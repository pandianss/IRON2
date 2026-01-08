import { useState, useEffect } from 'react';

const STORAGE_KEY = 'iron_streak_data';

export const useStreaks = () => {
    const [streakData, setStreakData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {
            count: 0,
            lastCheckIn: null
        };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(streakData));
    }, [streakData]);

    // Check if streak is broken on load
    useEffect(() => {
        if (!streakData.lastCheckIn) return;

        const lastDate = new Date(streakData.lastCheckIn);
        const now = new Date();
        const diffHours = (now - lastDate) / (1000 * 60 * 60);

        // If more than 48 hours (missed a day + buffer), reset
        if (diffHours > 48) {
            setStreakData(prev => ({ ...prev, count: 0 }));
        }
    }, []);

    const checkIn = () => {
        const now = new Date();
        const today = now.toDateString();

        // Prevent double check-in
        if (streakData.lastCheckIn) {
            const lastDate = new Date(streakData.lastCheckIn).toDateString();
            if (lastDate === today) return; // Already checked in today
        }

        setStreakData(prev => ({
            count: prev.count + 1,
            lastCheckIn: now.toISOString()
        }));

        return true; // Success
    };

    const isCheckedInToday = () => {
        if (!streakData.lastCheckIn) return false;
        const lastDate = new Date(streakData.lastCheckIn).toDateString();
        const today = new Date().toDateString();
        return lastDate === today;
    };

    return {
        streak: streakData.count,
        checkIn,
        isCheckedInToday: isCheckedInToday()
    };
};
