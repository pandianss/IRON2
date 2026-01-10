import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStreaks } from '../../features/streak';
import { eventBus, EVENTS } from '../../services/events';

import { useSession } from '../context';

export const useRetentionGate = () => {
    const {
        shouldShowCheckIn,
        performCheckIn,
        dismissCheckIn,
        streak,
        loading,
        isCheckedInToday
    } = useStreaks();

    const { currentUser } = useSession();

    const handleCheckIn = (status) => {
        const { streak: newStreak } = performCheckIn(status);

        // EMIT EVENT (Decoupled Side Effects)
        eventBus.emit(EVENTS.RETENTION.CHECK_IN, {
            status,
            streak: newStreak
        });
    };

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Behavioral Refactor: Mandatory First Action
        // Only enforce for LOGGED IN users
        // Wait for Loading to complete to avoid false positives (streak 0 while loading)
        // console.log("RetentionGate Check:", { loading, hasUser: !!currentUser, streak, path: location.pathname });

        // CONDITION:
        // 1. Not Loading
        // 2. Logged In
        // 3. Zero Streak
        // 4. NOT Checked In Today (Critical fix: prevents loop if streak calc is 0 but action done)
        if (!loading && currentUser && streak === 0 && !isCheckedInToday &&
            !['/auth', '/onboarding', '/checkin/initial', '/welcome'].includes(location.pathname)) {
            console.warn("RetentionGate: Redirecting to initial check-in due to 0 streak.");
            navigate('/checkin/initial', { replace: true });
        }
    }, [streak, isCheckedInToday, location.pathname, navigate, currentUser, loading]);

    return {
        shouldShowCheckIn,
        streak,
        handleCheckIn,
        dismissCheckIn
    };
};
