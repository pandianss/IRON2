import React from 'react';
import PropTypes from 'prop-types';
import { Flame } from 'lucide-react';

const ActivityCard = ({
    userName,
    activityType,
    location,
    timeAgo,
    stats,
    isPR = false
}) => {
    return (
        <div className={`glass-panel ${isPR ? 'pr-glow heat-streak-pulse' : ''}`} style={{
            borderRadius: '20px',
            marginBottom: '16px',
            padding: '20px',
            background: isPR ? 'linear-gradient(145deg, #1A0D00 0%, #111111 100%)' : 'var(--bg-card)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {isPR && (
                <>
                    <div className="heat-ripple" style={{ top: '10%', left: '85%', width: '30px', height: '30px' }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'var(--accent-orange)',
                        color: '#000',
                        fontSize: '0.65rem',
                        fontWeight: '900',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                        zIndex: 3,
                        boxShadow: '0 0 10px var(--accent-orange)'
                    }}>
                        New PR
                    </div>
                </>
            )}

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(45deg, #333, #111)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{userName.charAt(0)}</span>
                </div>
                <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>{userName}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {activityType} <span style={{ color: 'var(--text-muted)' }}>at</span> {location}
                    </p>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {timeAgo}
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                zIndex: 1
            }}>
                {stats.map((stat, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="stat-label" style={{ marginBottom: '4px' }}>
                            {stat.label}
                        </span>
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            fontFamily: 'var(--font-display)',
                            color: stat.accent ? 'var(--accent-orange)' : 'var(--text-primary)',
                            textShadow: stat.accent ? '0 0 10px rgba(255, 77, 0, 0.4)' : 'none'
                        }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {isPR && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        padding: '8px',
                        borderRadius: '10px',
                        background: 'rgba(255, 77, 0, 0.15)',
                        display: 'flex',
                        position: 'relative'
                    }}>
                        <Flame className="flame-flicker" size={18} color="var(--accent-orange)" style={{ filter: 'drop-shadow(0 0 5px var(--accent-orange))' }} />
                        <Flame className="flame-flicker" size={12} color="var(--accent-orange)" style={{ position: 'absolute', top: '-4px', left: '14px', opacity: 0.6, animationDelay: '0.1s' }} />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', alignSelf: 'center', fontWeight: '600', letterSpacing: '0.5px' }}>
                        HEAT STREAK ACTIVE <span style={{ color: 'var(--accent-orange)', fontSize: '0.7rem' }}>+1.5x XP</span>
                    </p>
                </div>
            )}
        </div>
    );
};

ActivityCard.propTypes = {
    userName: PropTypes.string.isRequired,
    activityType: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    timeAgo: PropTypes.string.isRequired,
    stats: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        accent: PropTypes.bool
    })).isRequired,
    isPR: PropTypes.bool
};

export default ActivityCard;
