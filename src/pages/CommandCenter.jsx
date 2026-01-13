import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ActivityCard from '../components/UI/ActivityCard';
import { StreakCard } from '../features/streak';
import { SquadCard } from '../social/squads';
import { ChallengeCard } from '../social/challenges';
import { InsightCard } from '../features/insights';
import {
    Activity, AlertTriangle, Dumbbell, Heart, LayoutDashboard, Search, Shield, ShieldAlert, Star, Store, TrendingUp, Trophy, Users, Zap
} from 'lucide-react';
import {
    useSession,
    useRetention,
    useActivity,
    useUIFeedback,
    useBluetooth,
    useData
} from '../app/context';
import LogWorkoutModal from '../components/Workouts/LogWorkoutModal';
import CommandDashboard from '../features/gym-admin/pages/CommandDashboard';
import { StudioPage } from '../features/studio';
import { mockFeedActivities } from '../services/mockData';

const CommandCenter = () => {
    const { isLoading, currentUser } = useSession();
    const { isRusting, streak, verifyProofOfWork } = useRetention(); // verifyProofOfWork already here? Yes step 969 added it to Modal, not here.
    const { bpm } = useBluetooth();
    const { showToast } = useUIFeedback();
    const { feedActivities, loadMoreFeed, hasMoreFeed, logActivity } = useActivity();
    const { verifyActivity, promoteToHub, reportActivity } = useData(); // Get verify, promote, report
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);
    const [dashboardMode, setDashboardMode] = useState('enthusiast'); // 'enthusiast' | 'command' | 'expert'

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
    // const activities = allActivities.filter(a => a.type === 'check_in' || a.title?.includes('Check-in') || a.activityType === 'Check In');
    const activities = allActivities;

    // Determine available modes based on role
    // For now, allowing all for testing as requested "trainers, gym partners should have the option"
    // Ideally: const hasPartnerAccess = currentUser?.role === 'gym_owner' || currentUser?.role === 'super_admin';
    const hasPartnerAccess = true;
    const hasExpertAccess = true;



    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-title-group">
                    COMMAND
                    <span className="text-accent">CENTER</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        LIVE FROM THE FORGE.
                    </p>
                </div>
            </header>

            {/* ROLE TOGGLE */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
                <button
                    onClick={() => setDashboardMode('enthusiast')}
                    style={{
                        flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                        background: dashboardMode === 'enthusiast' ? 'var(--accent-orange)' : 'transparent',
                        color: dashboardMode === 'enthusiast' ? '#000' : 'var(--text-muted)',
                        fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <Users size={14} /> ENTHUSIAST
                </button>
                {hasPartnerAccess && (
                    <button
                        onClick={() => setDashboardMode('command')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                            background: dashboardMode === 'command' ? 'var(--accent-blue)' : 'transparent',
                            color: dashboardMode === 'command' ? '#000' : 'var(--text-muted)',
                            fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                    >
                        <Store size={14} /> COMMAND
                    </button>
                )}
                {hasExpertAccess && (
                    <button
                        onClick={() => setDashboardMode('expert')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                            background: dashboardMode === 'expert' ? 'var(--accent-green)' : 'transparent',
                            color: dashboardMode === 'expert' ? '#000' : 'var(--text-muted)',
                            fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                    >
                        <Dumbbell size={14} /> EXPERT
                    </button>
                )}
            </div>


            {/* ENTHUSIAST DASHBOARD */}
            {dashboardMode === 'enthusiast' && (
                <>
                    {/* System Health (Live Status) */}
                    <section style={{ marginBottom: '24px' }}>
                        <Card style={{
                            padding: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            // Border: Bevel effect
                            borderTop: isRusting ? '1px solid #5a1a1a' : '1px solid rgba(255,255,255,0.3)',
                            borderLeft: isRusting ? '1px solid #5a1a1a' : '1px solid rgba(255,255,255,0.1)',
                            borderRight: isRusting ? '1px solid #1a0500' : '1px solid rgba(0,0,0,0.5)',
                            borderBottom: isRusting ? '1px solid #1a0500' : '1px solid rgba(0,0,0,0.5)',

                            // Background: Metallic vs Rusted
                            // Polished: Gunmetal Blue-Grey to Black gradient
                            // Rust: Deep Brown/Red gradient
                            background: isRusting
                                ? 'linear-gradient(135deg, #2a0a00 0%, #3d1000 100%)'
                                : 'linear-gradient(135deg, #2c3e50 0%, #080808 100%)',

                            boxShadow: isRusting
                                ? 'inset 2px 2px 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)' // Deep inset
                                : 'inset 1px 1px 2px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.5)' // Metallic shine
                        }}>
                            {/* Metal Texture Overlay */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                opacity: isRusting ? 0.4 : 0.05,
                                backgroundImage: isRusting
                                    ? 'radial-gradient(circle, rgba(255,100,0,0.2) 1px, transparent 1px)' // Rust Spots
                                    : 'repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(255,255,255,0.1) 3px)', // Brushed metal
                                pointerEvents: 'none',
                                mixBlendMode: 'overlay',
                                backgroundSize: isRusting ? '10px 10px' : 'auto'
                            }} />

                            {/* Rust Glow / Shine */}
                            {isRusting ? (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'radial-gradient(circle at 30% 20%, rgba(200, 50, 0, 0.1) 0%, transparent 60%)',
                                    pointerEvents: 'none'
                                }} />
                            ) : (
                                <div style={{
                                    position: 'absolute', top: -100, right: -100, width: 300, height: 300,
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                    pointerEvents: 'none'
                                }} />
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
                                {/* Icon with Bevel */}
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: isRusting ? '#1a0500' : 'linear-gradient(145deg, #111, #222)',
                                    boxShadow: isRusting ? 'inset 2px 2px 5px rgba(0,0,0,0.5)' : '5px 5px 10px #0b0b0b, -5px -5px 10px #252525', // Neumorphic Metal
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: isRusting ? '#ff3b00' : '#00ff94',
                                    border: isRusting ? '2px solid #3d1000' : '2px solid rgba(255,255,255,0.05)'
                                }}>
                                    {isRusting ? <ShieldAlert size={32} /> : <Star size={32} fill={!isRusting ? "#00ff94" : "none"} fillOpacity={0.1} />}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h4 style={{
                                        fontWeight: '900',
                                        fontSize: '1.2rem',
                                        letterSpacing: '0.5px',
                                        color: isRusting ? '#ff6b3d' : '#fff',
                                        textShadow: isRusting ? '0 0 10px rgba(255,77,0,0.3)' : 'none',
                                        fontFamily: 'var(--font-display)',
                                        margin: 0, marginBottom: '4px'
                                    }}>
                                        {isRusting ? 'CRITICAL: RUST ACCUMULATING' : 'STATUS: TEMPERED STEEL'}
                                    </h4>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '4px 12px', borderRadius: '4px',
                                        background: isRusting ? 'rgba(255, 60, 0, 0.1)' : 'rgba(0, 255, 148, 0.1)',
                                        border: isRusting ? '1px solid rgba(255, 60, 0, 0.2)' : '1px solid rgba(0, 255, 148, 0.2)',
                                        color: isRusting ? '#ff6b3d' : '#00ff94',
                                        fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px'
                                    }}>
                                        {isRusting ? 'RUST DETECTED' : 'POLISHED'}
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: isRusting ? '#cc8877' : '#8899aa', marginTop: '12px', maxWidth: '90%' }}>
                                        {isRusting
                                            ? 'Integrity compromised. Training required to remove oxidation.'
                                            : 'Armor is shining. Discipline verified. Maintain luster.'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Retention Engine: Daily Check-in */}
                    {/* Retention Engine: Daily Check-in */}
                    <div className="mb-6 px-1">
                        <StreakCard />

                        {/* PROGRESSIVE UNLOCKS */}

                        {/* Day 7+: Squads */}
                        {streak >= 7 && <SquadCard />}

                        {/* Day 14+: Challenges */}
                        {streak >= 14 && <ChallengeCard />}

                        {/* Day 3+: Insights (Guardian) */}
                        {streak >= 3 && <InsightCard />}

                        {/* LOCKED STATE TEASERS (Optional, keeps them hungry) */}
                        {streak < 7 && (
                            <div className="p-4 mb-4 rounded-xl border border-glass bg-glass-deep text-center opacity-50">
                                <div className="text-sm font-bold text-gray-400">CLASSFIED INTEL</div>
                                <div className="text-xs text-gray-500 mt-1">REACH STREAK 7 TO DECRYPT</div>
                            </div>
                        )}
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
                        <Card noPadding className="glass-panel">
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
                            onClick={() => setShowLogModal(true)}
                            style={{ height: '56px' }}
                        >
                            LOG WORKOUT
                        </Button>
                    </div>

                    {/* Activities List */}
                    <h3 className="section-label">THE CIRCUIT</h3>

                    {activities.map((activity, index) => (
                        <ActivityCard
                            key={activity.id || index}
                            {...activity}
                            distance={calculateDistance(activity.coordinates)}
                            currentUserId={currentUser?.uid || currentUser?.id}
                            onVerify={() => verifyActivity(activity.id)}
                            onPromote={() => promoteToHub(activity.id, activity.category)}
                            onReport={(reason) => reportActivity(activity.id, reason)}
                            isAdmin={['expert', 'gym_owner', 'admin', 'super_admin'].includes(currentUser?.role)}
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

                            {!hasMoreFeed && activities.length > 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.8rem', paddingBottom: '100px' }}>
                                    END OF CIRCUIT
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* PARTNER VIEW */}
            {dashboardMode === 'command' && <CommandDashboard isEmbedded={true} />}

            {/* EXPERT VIEW */}
            {dashboardMode === 'expert' && <StudioPage isEmbedded={true} />}

            {/* Log Workout Modal */}
            {showLogModal && (
                <LogWorkoutModal
                    onClose={() => setShowLogModal(false)}
                    onLog={(data) => {
                        return logActivity({
                            ...data,
                            activityType: "Workout Log",
                            location: userLocation ? "Field Ops" : "Unknown",
                            coordinates: userLocation
                        });
                    }}
                />
            )}
        </div>
    );
};

export default CommandCenter;
