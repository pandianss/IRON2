import { useState, useCallback } from 'react';
import { getLocalToday, getSystemTimezone } from '../../../utils/dateHelpers';
import { useRetention } from '../../../app/context/RetentionContext';

export const useStreaks = () => {
    // Consume Global Retention State
    const {
        currentStreak,
        longestStreak,
        lastCheckInDate,
        checkIn,
        loading
    } = useRetention();

    const [sessionDismissed, setSessionDismissed] = useState(false);
    const [streakBreakReason, setStreakBreakReason] = useState(null); // Managed locally for now or needs to be in context

    // ---- ACTIONS ----
    /**
     * @param {'trained' | 'rest'} status 
     */
    const performCheckIn = useCallback(async (status) => {
        try {
            await checkIn(status);
            return { streak: currentStreak + 1, isNewRecord: (currentStreak + 1) > longestStreak };
            // Note: Optimistic result return, though Context will update shortly
        } catch (e) {
            console.error("CheckIn Error", e);
            throw e;
        }
    }, [checkIn, currentStreak, longestStreak]);

    const dismissCheckIn = useCallback(() => {
        setSessionDismissed(true);
    }, []);

    const dismissBreakAlert = useCallback(() => {
        setStreakBreakReason(null);
    }, []);

    // ---- STATUS CHECKS ----
    const timezone = getSystemTimezone();
    const isCheckedInToday = lastCheckInDate === getLocalToday(timezone);
    const shouldShowCheckIn = !isCheckedInToday && !sessionDismissed && !loading;
    const isDayResolved = isCheckedInToday; // Simplified for now

    return {
        streak: currentStreak,
        longestStreak,
        lastCheckInDate,
        streakBreakReason,
        isCheckedInToday,
        shouldShowCheckIn,
        isDayResolved,
        performCheckIn,
        dismissCheckIn,
        dismissBreakAlert,
        loading
    };
};
