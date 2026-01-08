import { useRetention } from '../context';
import { eventBus, EVENTS } from '../../services/events';

export const useRetentionGate = () => {
    const {
        shouldShowCheckIn,
        performCheckIn,
        dismissCheckIn,
        streak
    } = useRetention();

    const handleCheckIn = (status) => {
        const { streak: newStreak } = performCheckIn(status);

        // EMIT EVENT (Decoupled Side Effects)
        eventBus.emit(EVENTS.RETENTION.CHECK_IN, {
            status,
            streak: newStreak
        });
    };

    return {
        shouldShowCheckIn,
        streak,
        handleCheckIn,
        dismissCheckIn
    };
};
