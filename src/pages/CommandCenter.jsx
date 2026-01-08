import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ActivityCard from '../components/UI/ActivityCard';
import { StreakCard } from '../features/streak';
import { SquadCard } from '../social/squads';
import { ChallengeCard } from '../social/challenges';
import { InsightCard } from '../features/insights';
import { Trophy, TrendingUp, Search, AlertTriangle, Activity, Heart } from 'lucide-react';
import { useAppContext } from '../app/context/AppContext';
import { mockFeedActivities } from '../services/mockData';

const CommandCenter = () => {
    const { isRusting, bpm, showToast, feedActivities, isLoading, currentUser, loadMoreFeed, hasMoreFeed, logActivity } = useAppContext();
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.warn("Location access denied")
            );
        }
    }, []);

    const calculateDistance = (targetCoords) => {
        if (!userLocation || !targetCoords) return null;
        const R = 6371; // Earth radius in km
        const dLat = (targetCoords.lat - userLocation.lat) * Math.PI / 180;
        const dLng = (targetCoords.lng - userLocation.lng) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(targetCoords.lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d < 1 ? '< 1km' : `${d.toFixed(1)}km`;
    };

    const handleLogActivity = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    logActivity({
                        activityType: "Quick Log",
                        location: "Field Ops",
                        coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                    });
                },
                () => {
                    // Fallback without location
                    logActivity({ activityType: "Quick Log", location: "Unknown" });
                    showToast("Location unavailable - Logged anyway");
                }
            );
        } else {
            logActivity({ activityType: "Quick Log", location: "Unknown" });
        }
    };

    // Use real feed or empty array (MOCKING DATA FOR DEMO)
    // mockActivities removed, using imported mockFeedActivities

    // Locked Down Feed: Check-ins Only (Retention Contract)
    const allActivities = feedActivities && feedActivities.length > 0 ? feedActivities : mockFeedActivities;
    const activities = allActivities.filter(a => a.type === 'check_in' || a.title?.includes('Check-in') || a.activityType === 'Check In');

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-title-group">
                    COMMAND
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

            {/* Retention Engine: Daily Check-in */}
            {/* Retention Engine: Daily Check-in */}
            <div className="mb-6 px-1">
                <StreakCard />
                <SquadCard />
                <ChallengeCard />
                <InsightCard />
            </div>

            {/* Quick Stats Banner */}
            <div className="stat-grid">
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <Trophy size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>RANK</span>
                        </div>
                        <div className="stat-value">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '4px' }}>#</span>
                            {/* Mock Global Rank logic or simple field */}
                            {currentUser?.globalRank || '--'}
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400', marginLeft: '6px' }}>
                                {currentUser?.rank || 'UNRANKED'}
                            </span>
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
                            {currentUser?.level || 1}
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400', marginLeft: '6px' }}>
                                {/* Mock progress calculation based on XP */}
                                {currentUser?.xp ? `${(currentUser.xp % 100)}%` : '0%'}
                            </span>
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
            <div style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Button
                    variant="secondary"
                    icon={Search}
                    onClick={() => navigate('/gyms')}
                    style={{ height: '56px' }}
                >
                    FIND GYM
                </Button>
                <Button
                    variant="accent"
                    icon={Activity}
                    onClick={handleLogActivity}
                    style={{ height: '56px' }}
                >
                    LOG WORK
                </Button>
            </div>

            {/* Activities List */}
            <h3 className="section-label">THE CIRCUIT</h3>

            {activities.map((activity, index) => (
                <ActivityCard
                    key={index}
                    {...activity}
                    distance={calculateDistance(activity.coordinates)}
                />
            ))}

            {/* Skeleton / Zero-Loading State Indicator */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Synchronizing live data...
                </div>
            ) : activities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No recent activity. Start the fire.
                </div>
            ) : (
                <>
                    {/* Load More Trigger */}
                    {hasMoreFeed && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', paddingBottom: '80px' }}>
                            <Button
                                variant="secondary"
                                onClick={loadMoreFeed}
                                style={{ width: 'auto', padding: '12px 32px' }}
                            >
                                LOAD OLDER
                            </Button>
                        </div>
                    )}
                    {!hasMoreFeed && activities.length > 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.8rem', paddingBottom: '100px' }}>
                            END OF CIRCUIT
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommandCenter;
