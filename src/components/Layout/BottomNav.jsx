import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Trophy, MapPin, User, Lock } from 'lucide-react';
import { useRetention } from '../../app/context';

const BottomNav = () => {
    const { streak } = useRetention();

    const navItems = [
        { icon: Home, label: 'Command', path: '/', minStreak: 0 },
        { icon: MapPin, label: 'Nexus', path: '/hub', minStreak: 3 }, // Unlock with Partner
        { icon: Trophy, label: 'Arena', path: '/arena', minStreak: 7 }, // Unlock with Squads
        { icon: Activity, label: 'Pulse', path: '/viral', minStreak: 14 }, // Unlock with Challenges
        { icon: User, label: 'Identity', path: '/profile', minStreak: 0 },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '448px',
            height: '65px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 100,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
            {navItems.map((item) => {
                const isLocked = streak < item.minStreak;

                if (isLocked) {
                    return (
                        <div
                            key={item.label}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255, 255, 255, 0.2)',
                                cursor: 'not-allowed'
                            }}
                        >
                            <Lock size={16} style={{ marginBottom: '4px' }} />
                        </div>
                    );
                }

                return (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
                            transition: 'all 0.3s ease',
                            transform: isActive ? 'translateY(-2px)' : 'none'
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <div style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <item.icon
                                        size={24}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        style={{
                                            filter: isActive ? 'drop-shadow(0 0 8px rgba(255, 77, 0, 0.6))' : 'none'
                                        }}
                                    />

                                    {/* Active Dot Indicator */}
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-8px',
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            background: 'var(--accent-orange)',
                                            boxShadow: '0 0 5px var(--accent-orange)'
                                        }} />
                                    )}
                                </div>
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
