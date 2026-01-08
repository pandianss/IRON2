import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Clapperboard, ArrowLeft, ChevronLeft, Share2, Shield } from 'lucide-react';
import BottomNav from './BottomNav';
import { useAppContext } from '../../app/context/AppContext';
import Notifications from '../UI/Notifications';
import { useStreaks } from '../../features/streak';
import { CheckInModal } from '../../features/checkin';

import { useSmartNudges } from '../../features/insights';

const AppShell = () => {
    useSmartNudges(); // Activates retention guardian

    const navigate = useNavigate();
    const location = useLocation();
    const { onboardingCompleted, toast, userType, currentUser, isLoading, appMode, logActivity, showToast } = useAppContext();

    // Daily Check-In Logic
    const { shouldShowCheckIn, performCheckIn, dismissCheckIn, streak } = useStreaks();

    const handleCheckIn = (status) => {
        const { streak: newStreak } = performCheckIn(status);

        // Log to Feed
        logActivity({
            type: 'check_in',
            status: status,
            streak: newStreak,
            message: status === 'trained' ? `checked in on day ${newStreak}.` : `is resting consciously (Day ${newStreak}).`
        });

        const msg = status === 'trained'
            ? `TRAINED. STREAK: ${newStreak}`
            : `RECOVERING. STREAK ALIVE: ${newStreak}`;

        showToast(msg);
    };

    useEffect(() => {
        if (!appMode) {
            navigate('/welcome');
            return;
        }

        if (isLoading) return; // Wait for auth check

        if (!currentUser && appMode === 'live') {
            navigate('/auth');
        } else if (!onboardingCompleted && userType !== 'super_admin' && appMode === 'live') {
            navigate('/onboarding');
        } else if (userType !== 'gym' && userType !== 'gym_owner' && location.pathname.startsWith('/partner') && userType !== 'super_admin') {
            navigate('/');
        } else if ((userType === 'gym' || userType === 'gym_owner') && (location.pathname === '/' || location.pathname === '/home')) {
            navigate('/partner');
        } else if (location.pathname === '/admin' && userType !== 'super_admin') {
            navigate('/');
        }
    }, [currentUser, onboardingCompleted, userType, navigate, location.pathname, isLoading, appMode]);

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                color: 'var(--accent-orange)'
            }}>
                <div className="animate-spin" style={{ marginBottom: '16px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                </div>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    letterSpacing: '2px',
                    fontSize: '0.9rem',
                    animation: 'pulse 2s infinite'
                }}>
                    CALIBRATING...
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
                                IRON<span style={{ color: 'var(--accent-orange)' }}>.</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Notifications />

                        {!showBack && (
                            <>
                                <div
                                    onClick={() => navigate('/viral')}
                                    className="icon-box icon-box-muted"
                                    style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer' }}
                                >
                                    <TrendingUp size={18} />
                                </div>
                                <div
                                    onClick={() => navigate('/studio')}
                                    className="icon-box icon-box-muted"
                                    style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer' }}
                                >
                                    <Clapperboard size={18} />
                                </div>
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
                            {userType === 'super_admin' ? 'CMD' : 'MV'}
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
            {toast && (
                <div className="fade-in" style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--accent-orange)',
                    color: '#000',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '900',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-display)',
                    zIndex: 1000,
                    boxShadow: '0 10px 30px rgba(255, 77, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap'
                }}>
                    <Share2 size={16} />
                    {toast.toUpperCase()}
                </div>
            )}

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
