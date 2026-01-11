import React from 'react';
import PropTypes from 'prop-types';
import { Flame, Music, CheckCircle2, AlertCircle } from 'lucide-react';

const ActivityCard = ({
    userName,
    activityType,
    location,
    timeAgo,
    stats,
    isPR = false,
    mediaUrl,
    mediaType = 'image', // 'image' | 'video'
    isLive = false,
    distance = null,
    description,
    audioTrack,
    audioMode,
    // Verification Props
    userId,
    isVerified,
    currentUserId,
    onVerify,
    // Admin Props
    hubCandidate = false,
    promoted = false,
    onPromote,
    onReport,
    isAdmin = false
}) => {
    return (
        <div className={`glass-panel ${isPR ? 'pr-glow heat-streak-pulse' : ''} ${hubCandidate && !promoted ? 'hub-candidate-glow' : ''}`} style={{
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

            {isLive && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#ff0000',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-display)',
                    zIndex: 3,
                    boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <span className="live-dot" style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }}></span>
                    LIVE
                </div>
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
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {distance && (
                            <span style={{ color: 'var(--accent-green)', marginRight: '6px', fontWeight: 'bold' }}>
                                📍 {distance} •
                            </span>
                        )}
                        {activityType} <span style={{ color: 'var(--text-muted)' }}>at</span> {location}
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {timeAgo}
                </div>
            </div>

            {description && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.4' }}>
                    {description}
                </div>
            )}

            {audioTrack && (
                <div style={{
                    marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                    <div style={{
                        width: '32px', height: '32px', background: 'var(--accent-orange)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Music size={16} color="#000" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{audioTrack.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Workout Soundtrack</div>
                    </div>
                    <audio controls src={audioTrack.url} style={{ height: '30px', width: '120px', filter: 'invert(1) hue-rotate(180deg)' }} />
                </div>
            )}

            {mediaUrl && (
                <div style={{
                    marginBottom: '16px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-glass)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {mediaType === 'video' ? (
                        <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Placeholder for video player or thumbnail */}
                            <img src={mediaUrl} alt="Video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                            <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #fff', marginLeft: '4px' }}></div>
                            </div>
                        </div>
                    ) : (
                        <img src={mediaUrl} alt="Activity" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    )}
                </div>
            )}

            {stats && stats.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    paddingTop: mediaUrl ? '0' : '16px', // Remove padding if media separates top from bottom
                    marginTop: mediaUrl ? '0' : '0',
                    borderTop: mediaUrl ? 'none' : '1px solid rgba(255,255,255,0.05)',
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
            )}

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

            {/* Admin / Verification Actions */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

                {/* Report Action (Community Moderation) */}
                <button
                    onClick={() => {
                        if (window.confirm("Report this content as inappropriate?")) {
                            onReport('inappropriate');
                        }
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: 'auto' // Pushes other actions to the right
                    }}
                    title="Report Content"
                >
                    <AlertCircle size={14} />
                </button>

                {/* Admin Promotion Action */}
                {promoted ? (
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> LIBRARY CONTENT
                    </div>
                ) : (
                    hubCandidate && isAdmin && (
                        <button
                            onClick={onPromote}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            + ADD TO LIBRARY
                        </button>
                    )
                )}

                {/* Verification Action */}
                {isVerified ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        <CheckCircle2 size={14} /> VERIFIED
                    </div>
                ) : (
                    currentUserId && currentUserId !== userId ? (
                        <button
                            onClick={onVerify}
                            className="heat-streak-pulse" // Add pulse animation
                            style={{
                                background: 'transparent',
                                color: 'var(--accent-orange)',
                                border: '1px solid var(--accent-orange)',
                                padding: '6px 16px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '900',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(255, 77, 0, 0.3)',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <CheckCircle2 size={14} /> VERIFY THIS POST
                        </button>
                    ) : (
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--accent-orange)',
                            border: '1px dashed var(--accent-orange)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            letterSpacing: '0.5px'
                        }}>
                            WAITING FOR VERIFICATION
                        </div>
                    )
                )}
            </div>
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
    })), // Stats can be optional if media is present
    isPR: PropTypes.bool,
    mediaUrl: PropTypes.string,
    mediaType: PropTypes.oneOf(['image', 'video']),
    isLive: PropTypes.bool,
    description: PropTypes.string,
    audioTrack: PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string
    }),
    userId: PropTypes.string,
    isVerified: PropTypes.bool,
    currentUserId: PropTypes.string,
    onVerify: PropTypes.func
};

export default ActivityCard;
