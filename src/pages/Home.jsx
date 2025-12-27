import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ActivityCard from '../components/UI/ActivityCard';
import { Trophy, TrendingUp, Search, AlertTriangle, Activity, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Home = () => {
    const { isRusting, bpm, showToast } = useAppContext();

    const handleLogActivity = () => {
        showToast("Activity logged! XP +50");
    };

    const activities = [
        {
            userName: "Marcus V.",
            activityType: "HEAVY LIFTING",
            location: "ANVIL GYM",
            timeAgo: "12m",
            isPR: true,
            stats: [
                { label: "Weight", value: "240kg" },
                { label: "Reps", value: "5", accent: true },
                { label: "XP", value: "+450" }
            ]
        },
        {
            userName: "Elena S.",
            activityType: "STAMINA SPRINT",
            location: "STADIUM X",
            timeAgo: "45m",
            stats: [
                { label: "Distance", value: "5.2km" },
                { label: "Pace", value: "4'12\"" },
                { label: "Heart", value: "168bpm" }
            ]
        }
    ];

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', lineHeight: '1', marginBottom: '8px' }}>
                        The Pulse
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        LIVE FROM THE FORGE.
                    </p>
                </div>
                <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                    <Search size={20} />
                </div>
            </header>

            {isRusting && (
                <Card noPadding className="glass-panel" style={{
                    marginBottom: '24px',
                    border: '1px solid var(--rust-primary)',
                    background: 'rgba(139, 62, 47, 0.2)',
                    padding: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertTriangle color="var(--rust-primary)" size={20} />
                        <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--rust-primary)' }}>RUST DETECTED</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Log an activity within 24h to stop oxidation.</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Quick Stats Banner */}
            <div className="stat-grid">
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <Trophy size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>RANK</span>
                        </div>
                        <div className="stat-value">
                            #17 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>IRON IV</span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel pr-glow heat-streak-pulse">
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <TrendingUp size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>LEVEL</span>
                        </div>
                        <div className="stat-value">
                            12 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>78%</span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <Heart size={14} className="heartbeat" color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>PULSE</span>
                        </div>
                        <div className="stat-value">
                            {bpm} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>BPM</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Primary Action */}
            <div style={{ marginBottom: '32px' }}>
                <Button fullWidth variant="accent" onClick={handleLogActivity}>
                    Log Activity
                </Button>
            </div>

            {/* Activities List */}
            <h3 className="section-label">THE FEED</h3>

            {activities.map((activity, index) => (
                <ActivityCard key={index} {...activity} />
            ))}

            {/* Skeleton / Zero-Loading State Indicator */}
            <div style={{
                textAlign: 'center',
                padding: '20px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem'
            }}>
                Synchronizing live data...
            </div>
        </div>
    );
};

export default Home;
