import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { TrendingUp, Clapperboard, ArrowLeft, ChevronLeft, Share2, Shield } from 'lucide-react';
import BottomNav from './BottomNav';
import Notifications from '../UI/Notifications';
import Toast from '../UI/Toast';
import { CheckInModal } from '../../features/checkin'; // Component stays
import { useSmartNudges } from '../../features/insights'; // Feature logic stays

// Context Aliases
import {
    useSession,
    useUIFeedback
} from '../../app/context';

// Guards
import { useAuthGuard, useRetentionGate } from '../../app/guards';
import { useRetentionEffects } from '../../app/hooks';

// 1. Auth Guard (Handles Routing & Protection)
const AppShell = () => {
    // 1. Auth Guard (Handles Routing & Protection)
    const { isLoading } = useAuthGuard();
    const navigate = useNavigate();
    const location = useLocation();

    console.log("DEBUG: AppShell Location:", location.pathname);

    // 2. Retention Gate (Handles Check-in Logic)
    const {
        shouldShowCheckIn,
        handleCheckIn,
        dismissCheckIn,
        streak
    } = useRetentionGate();

    // 3. Session (Layout Data)
    const { userType, currentUser } = useSession();

    // 4. UI Feedback
    // Toast handled by component directly

    // 5. Session Persistence: Save Last Visited Path
    useEffect(() => {
        if (!['/auth', '/welcome', '/onboarding'].includes(location.pathname)) {
            localStorage.setItem('iron_last_path', location.pathname);
        }
    }, [location.pathname]);

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                color: 'var(--accent-orange)'
            }}>
                {/* Sprinter Silhouette GIF */}
                <div style={{ marginBottom: '24px', opacity: 0.8 }}>
                    <img
                        src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif"
                        alt="Loading..."
                        style={{ width: '100px', height: 'auto', filter: 'invert(1)' }}
                    />
                </div>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    letterSpacing: '2px',
                    fontSize: '0.9rem',
                    animation: 'pulse 1.5s infinite',
                    color: '#fff'
                }}>
                    WARMING UP...
                </div>
            </div>
        );
    }

    const isSubPage = location.pathname !== '/';
    const showBack = ['/settings', '/profile'].includes(location.pathname);

    const getPageTitle = (path) => {
        switch (path) {
            case '/viral': return 'PULSE';
            case '/studio': return 'STUDIO';
            case '/hub': return 'PROTOCOLS';
            case '/settings': return 'SETTINGS';
            case '/profile': return 'IDENTITY';
            case '/partner': return 'COMMAND';
            default: return '';
        }
    };



    return (
        <div className="app-container">
            <div style={{ padding: '20px 16px' }}>
                <header style={{
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '44px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {showBack ? (
                            <>
                                <div
                                    onClick={() => navigate(-1)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '8px',
                                        marginLeft: '-8px',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </div>
                                <h2 className="title-display" style={{ fontSize: '1.2rem', margin: 0 }}>
                                    {getPageTitle(location.pathname)}
                                </h2>
                            </>
                        ) : (
                            <div
                                onClick={() => navigate('/')}
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 900,
                                    fontSize: '1.5rem',
                                    letterSpacing: '-1px',
                                    fontStyle: 'italic',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}>
                                CONSOLE<span style={{ color: 'var(--accent-orange)' }}>.</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Notifications />

                        {!showBack && (
                            <>
                                {/* PROGRESSIVE DISCLOSURE: Unlocks */}
                                {/* Day 14+: Pulse/Challenges */}
                                {streak >= 14 && (
                                    <div
                                        onClick={() => navigate('/viral')}
                                        className="icon-box icon-box-muted"
                                        style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer' }}
                                    >
                                        <TrendingUp size={18} />
                                    </div>
                                )}
                                {/* Day 7+: Studio/Squads */}
                                {streak >= 7 && (
                                    <div
                                        onClick={() => navigate('/studio')}
                                        className="icon-box icon-box-muted"
                                        style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer' }}
                                    >
                                        <Clapperboard size={18} />
                                    </div>
                                )}
                            </>
                        )}
                        <div
                            onClick={() => navigate('/profile')}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(45deg, #222, #111)',
                                border: '1px solid var(--border-glass)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}>
                            {currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'ME'}
                        </div>
                        {(userType === 'gym' || userType === 'gym_owner') && location.pathname !== '/partner' && (
                            <div
                                onClick={() => navigate('/partner')}
                                style={{
                                    height: '40px',
                                    padding: '0 12px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--accent-orange)',
                                    color: 'var(--accent-orange)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: '900',
                                    cursor: 'pointer',
                                    marginLeft: '6px'
                                }}>
                                BACK
                            </div>
                        )}
                        {userType === 'super_admin' && (
                            <div
                                onClick={() => navigate('/admin')}
                                className="icon-box icon-box-muted"
                                style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer', marginLeft: '6px' }}
                            >
                                <Shield size={18} color="var(--accent-orange)" />
                            </div>
                        )}
                    </div>
                </header>

                <main style={{ minHeight: '80vh' }}>
                    <Outlet />{/* Renders the child route */}
                </main>
            </div>

            {/* Notification Toast */}
            {/* Global Toast */}
            <Toast />

            {/* Only show navigation for standard users, not partners */}
            {userType !== 'gym' && <BottomNav />}

            {/* Daily Check-In Modal */}
            <CheckInModal
                isOpen={shouldShowCheckIn && !isLoading && !!currentUser}
                onCheckIn={handleCheckIn}
                onDismiss={dismissCheckIn}
                currentStreak={streak}
            />
        </div>
    );
};

export default AppShell;
