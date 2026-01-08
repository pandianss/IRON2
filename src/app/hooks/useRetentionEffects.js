import { useEffect } from 'react';
import { eventBus, EVENTS } from '../../services/events';
import { useActivity, useUIFeedback } from '../context';

export const useRetentionEffects = () => {
    const { logActivity } = useActivity();
    const { showToast } = useUIFeedback();

    useEffect(() => {
        const handleCheckIn = ({ status, streak }) => {
            // 1. Log to Feed
            logActivity({
                type: 'check_in',
                status: status,
                streak: streak,
                message: status === 'trained'
                    ? `checked in on day ${streak}.`
                    : `is resting consciously (Day ${streak}).`
            });

            // 2. Show Toast
            const msg = status === 'trained'
                ? `TRAINED. STREAK: ${streak}`
                : `RECOVERING. STREAK ALIVE: ${streak}`;

            showToast(msg);
        };

        const unsubscribe = eventBus.on(EVENTS.RETENTION.CHECK_IN, handleCheckIn);
        return () => unsubscribe();
    }, [logActivity, showToast]);
};
