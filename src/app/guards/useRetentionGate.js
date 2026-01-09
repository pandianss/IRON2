import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStreaks } from '../../features/streak';
import { eventBus, EVENTS } from '../../services/events';

export const useRetentionGate = () => {
    const {
        shouldShowCheckIn,
        performCheckIn,
        dismissCheckIn,
        streak
    } = useStreaks();

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
        // If user is authenticated, has NO streak, and is NOT on the onboarding/auth/initial screen
        // Redirect to Initial Contract
        if (streak === 0 &&
            !['/auth', '/onboarding', '/checkin/initial', '/welcome'].includes(location.pathname)) {
            // We need to ensure we don't redirect while loading, handled by AuthGuard. 
            // But if we are here, we are likely inside AppShell.
            navigate('/checkin/initial', { replace: true });
        }
    }, [streak, location.pathname, navigate]);

    return {
        shouldShowCheckIn,
        streak,
        handleCheckIn,
        dismissCheckIn
    };
};
