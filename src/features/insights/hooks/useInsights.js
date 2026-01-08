import { useState, useEffect } from 'react';
import { useStreaks } from '../../streak';

// Mock insights for demo purposes
const INSIGHT_TYPES = {
    STREAK_PROTECTOR: {
        type: 'POSITIVE',
        title: 'STREAK PROTECTOR',
        message: 'You never miss a Monday. That is your anchor.',
        icon: 'Anchor'
    },
    WEEKEND_WARRIOR: {
        type: 'WARNING',
        title: 'WEEKEND WARRIOR?',
        message: 'Your consistency drops 40% on Saturdays. Plan ahead.',
        icon: 'AlertTriangle'
    },
    MORNING_RITUAL: {
        type: 'POSITIVE',
        title: 'EARLY RISER',
        message: '80% of your check-ins are before 8AM. Keep the routine.',
        icon: 'Sun'
    }
};

export const useInsights = () => {
    const { streak } = useStreaks();
    const [insight, setInsight] = useState(null);

    useEffect(() => {
        // Simple logic to rotate or select insight based on state
        // In real app, analyze `checkInHistory` timestamps

        if (streak > 5) {
            setInsight(INSIGHT_TYPES.STREAK_PROTECTOR);
        } else if (streak < 3) {
            setInsight(INSIGHT_TYPES.WEEKEND_WARRIOR);
        } else {
            setInsight(INSIGHT_TYPES.MORNING_RITUAL);
        }
    }, [streak]);

    return {
        insight
    };
};
