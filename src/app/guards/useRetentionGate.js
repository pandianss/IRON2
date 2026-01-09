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
        loading
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

        if (!loading && currentUser && streak === 0 &&
            !['/auth', '/onboarding', '/checkin/initial', '/welcome'].includes(location.pathname)) {
            console.warn("RetentionGate: Redirecting to initial check-in due to 0 streak.");
            navigate('/checkin/initial', { replace: true });
        }
    }, [streak, location.pathname, navigate, currentUser, loading]);

    return {
        shouldShowCheckIn,
        streak,
        handleCheckIn,
        dismissCheckIn
    };
};
