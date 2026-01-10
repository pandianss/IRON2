import React, { useState } from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

const ACTIVITY_ICONS = {
    'workout': '🏋️',
    'log': '📝',
    'check_in': '📍',
    'milestone': '🏆',
    'status': '💭',
    'level_up': '🆙'
};

const REACTIONS = ['🔥', '❤️', '💪', '👏', '🫡'];

const FeedPost = ({ post, onLike, variant = 'default' }) => {
    const [showReactions, setShowReactions] = useState(false);
    const activityIcon = ACTIVITY_ICONS[post.type] || '📌';

    const handleReaction = (emoji) => {
        onLike(post.id); // Core toggle
        setShowReactions(false);
    };

    const isTrending = variant === 'trending';

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            padding: '16px',
            marginBottom: '12px',
            background: isTrending
                ? 'linear-gradient(145deg, rgba(255, 77, 0, 0.08) 0%, rgba(20, 10, 5, 0.5) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
            border: isTrending
                ? '1px solid rgba(255, 77, 0, 0.15)'
                : '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            transition: 'background 0.2s ease',
            position: 'relative', // For z-index context if needed
            boxShadow: isTrending ? '0 4px 20px rgba(0,0,0,0.2)' : 'none'
        },
        avatarCol: { flexShrink: 0 },
        avatar: {
            width: '48px',
            height: '48px',
            minWidth: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            backgroundColor: '#222',
            border: '2px solid rgba(255,255,255,0.1)'
        },
        contentCol: { flex: 1, minWidth: 0 },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '4px'
        },
        userInfo: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
        userName: { fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' },
        badge: {
            fontSize: '0.65rem',
            padding: '2px 8px',
            borderRadius: '10px',
            background: 'rgba(255, 77, 0, 0.1)',
            color: 'var(--accent-orange)',
            border: '1px solid rgba(255, 77, 0, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        time: { color: 'var(--text-muted)', fontSize: '0.75rem' },
        activityType: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#aaa', // Brighter than 888
            marginBottom: '8px',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.5px'
        },
        textContent: {
            color: '#eee',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            marginBottom: '12px',
            whiteSpace: 'pre-wrap'
        },
        mediaContainer: {
            marginBottom: '12px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: '#000'
        },
        media: {
            width: '100%',
            maxHeight: '400px',
            objectFit: 'cover',
            display: 'block'
        },
        actions: {
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative'
        },
        actionBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#cccccc', // Much Lighter for Visibility
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'color 0.2s',
            padding: '4px 0'
        },
        reactionMenu: {
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: '8px',
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '4px 8px',
            display: 'flex',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10
        },
        reactionOption: {
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '4px',
            transition: 'transform 0.1s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.avatarCol}>
                <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    style={styles.avatar}
                    loading="lazy"
                />
            </div>

            <div style={styles.contentCol}>
                <div style={styles.header}>
                    <div style={styles.userInfo}>
                        <span style={styles.userName}>{post.user.name}</span>
                        {post.user.badge && <span style={styles.badge}>{post.user.badge}</span>}
                        <span style={styles.time}>{post.timestamp}</span>
                    </div>
                </div>

                <div style={styles.activityType}>
                    <span>{activityIcon}</span>
                    <span>{post.type.replace('_', ' ')}</span>
                </div>

                {post.content && <p style={styles.textContent}>{post.content}</p>}

                {post.image && (
                    <div style={styles.mediaContainer}>
                        {post.image.endsWith('.mp4') ? (
                            <video src={post.image} controls style={styles.media} />
                        ) : (
                            <img src={post.image} alt="Attachment" style={styles.media} />
                        )}
                    </div>
                )}

                <div style={styles.actions}>
                    {/* Reaction Button Container */}
                    <div
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setShowReactions(true)}
                        onMouseLeave={() => setShowReactions(false)}
                    >
                        {showReactions && (
                            <div style={styles.reactionMenu}>
                                {REACTIONS.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={(e) => { e.stopPropagation(); handleReaction(emoji); }}
                                        style={styles.reactionOption}
                                        className="hover:scale-125" // Fallback class if tailwind acts up, but we want inline logic ideally
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => onLike(post.id)}
                            style={{ ...styles.actionBtn, color: post.isLiked ? '#ec4899' : '#cccccc' }}
                        >
                            <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} strokeWidth={post.isLiked ? 0 : 2} />
                            <span>{post.likes > 0 ? post.likes : 'Like'}</span>
                        </button>
                    </div>

                    <button style={styles.actionBtn}>
                        <MessageSquare size={18} />
                        <span>{post.comments > 0 ? post.comments : 'Comment'}</span>
                    </button>

                    <button style={{ ...styles.actionBtn, marginLeft: 'auto' }}>
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedPost;
