
import React from 'react';
import Card from '../../../components/UI/Card';

const ConsistencyGraph = ({ activities = [] }) => {
    // 1. Generate last 90 days (approx 3 months) for mobile friendliness
    const days = [];
    const today = new Date();

    // Create a map of date strings to activity counts
    const activityMap = {};
    activities.forEach(act => {
        // Handle both Firestore Timestamp (converted to date in hooks) or ISO strings
        const dateObj = new Date(act.timestamp || act.date);
        // Normalize to YYYY-MM-DD
        const dateKey = dateObj.toISOString().split('T')[0];
        activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
    });

    // Generate grid data
    for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        days.push({
            date: dateKey,
            count: activityMap[dateKey] || 0
        });
    }

    const getColor = (count) => {
        if (count === 0) return 'rgba(255,255,255,0.03)';
        if (count === 1) return 'rgba(255, 77, 0, 0.2)';
        if (count === 2) return 'rgba(255, 77, 0, 0.5)';
        return 'rgba(255, 77, 0, 0.9)'; // High intensity
    };

    return (
        <Card className="glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
            <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
            }}>
                Consistency Matrix (90 Days)
            </h4>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, 1fr)', // 15 columns roughly
                gap: '4px',
                width: '100%'
            }}>
                {days.map((day) => (
                    <div
                        key={day.date}
                        title={`${day.date}: ${day.count} activities`}
                        style={{
                            aspectRatio: '1',
                            backgroundColor: getColor(day.count),
                            borderRadius: '4px',
                            cursor: 'help'
                        }}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.7rem', color: '#666' }}>
                <span>Lazy</span>
                <div style={{ width: '10px', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px' }} />
                <div style={{ width: '10px', height: '10px', background: 'rgba(255, 77, 0, 0.2)', borderRadius: '2px' }} />
                <div style={{ width: '10px', height: '10px', background: 'rgba(255, 77, 0, 0.9)', borderRadius: '2px' }} />
                <span>Legend</span>
            </div>
        </Card>
    );
};

export default ConsistencyGraph;
