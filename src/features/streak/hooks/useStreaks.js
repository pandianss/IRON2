import { useState, useEffect, useCallback } from 'react';
import { getLocalToday } from '../../../utils/dateHelpers';
import { retentionService } from '../../../services/retention';

export const useStreaks = () => {
    // ---- STATE ----
    const [streakData, setStreakData] = useState(() => retentionService.loadData());
    const [sessionDismissed, setSessionDismissed] = useState(false);

    // ---- PERSISTENCE ----
    useEffect(() => {
        retentionService.saveData(streakData);
    }, [streakData]);

    // ---- ACTIONS ----
    /**
     * @param {'trained' | 'rest'} status 
     */
    // CRITICAL: STREAK CALCULATION DELEGATED TO SERVICE
    const performCheckIn = useCallback((status) => {
        const { newData, result } = retentionService.calculateCheckIn(streakData, status);

        if (result.alreadyCheckedIn) {
            return { streak: streakData.currentStreak, isNewRecord: false };
        }

        setStreakData(newData);
        return result;
    }, [streakData]);

    const dismissCheckIn = useCallback(() => {
        setSessionDismissed(true);
    }, []);

    // ---- STATUS CHECKS ----
    const isCheckedInToday = streakData.lastCheckInDate === getLocalToday();
    const shouldShowCheckIn = !isCheckedInToday && !sessionDismissed;
    const isDayResolved = retentionService.isDayResolved(streakData);

    return {
        streak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastCheckInDate: streakData.lastCheckInDate,
        isCheckedInToday,
        shouldShowCheckIn,
        isDayResolved,
        performCheckIn,
        dismissCheckIn
    };
};
