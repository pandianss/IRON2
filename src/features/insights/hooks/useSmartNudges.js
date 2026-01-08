import { useEffect, useRef } from 'react';
import { useStreaks } from '../../streak';
import { useAppContext } from '../../../app/context/AppContext';

export const useSmartNudges = () => {
    const { isCheckedInToday, streak } = useStreaks();
    const { showToast } = useAppContext();
    const hasNudgedRef = useRef(false);

    useEffect(() => {
        const checkNudge = () => {
            if (hasNudgedRef.current) return;

            const now = new Date();
            const hour = now.getHours();

            // LOGIC: High Risk Time (Evening) + Not Checked In
            // In a real app, this would be smarter (user specific time)
            // For now, we simulate a check.

            // DEMO HACK: If we are running this hook, and haven't checked in, just show it for demo purposes
            // after a short delay, but only once.
            if (!isCheckedInToday) {
                // If streak is high (>3), use Loss Aversion message
                if (streak > 3) {
                    showToast(`⚠️ Risk Alert: ${streak} day streak at risk!`);
                } else {
                    // Gentle nudge
                    showToast(`🔔 The Forge awaits. Log your work.`);
                }
                hasNudgedRef.current = true;
            }
        };

        // Check after 5 seconds of app load for demo impact
        const timer = setTimeout(checkNudge, 5000);

        return () => clearTimeout(timer);
    }, [isCheckedInToday, streak, showToast]);
};
