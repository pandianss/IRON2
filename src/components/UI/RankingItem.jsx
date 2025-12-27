import React from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const RankingItem = ({
    rank,
    userName,
    value,
    trend = 'neutral',
    isUser = false,
    badge = 'Silver'
}) => {
    const trendIcon = {
        up: <TrendingUp size={14} color="var(--accent-green)" />,
        down: <TrendingDown size={14} color="var(--accent-orange)" />,
        neutral: <Minus size={14} color="var(--text-muted)" />
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            background: isUser ? 'rgba(255, 77, 0, 0.05)' : 'transparent',
            borderRadius: '16px',
            border: isUser ? '1px solid rgba(255, 77, 0, 0.2)' : '1px solid transparent',
            marginBottom: '4px',
            transition: 'all 0.2s ease',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '40px',
                fontSize: '1.2rem',
                fontWeight: '900',
                fontFamily: 'var(--font-display)',
                color: rank <= 3 ? 'var(--accent-orange)' : 'var(--text-muted)'
            }}>
                {rank}
            </div>

            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#222',
                marginRight: '16px',
                border: '1px solid var(--border-glass)',
                position: 'relative'
            }}>
                {/* User avatar placeholder */}
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: isUser ? '800' : '600',
                    color: isUser ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                    {userName}
                    {isUser && <span style={{ color: 'var(--accent-orange)', marginLeft: '8px', fontSize: '0.7rem' }}>YOU</span>}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{badge}</span>
                </div>
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    fontFamily: 'var(--font-display)'
                }}>
                    {value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    {trendIcon[trend]}
                </div>
            </div>
        </div>
    );
};

RankingItem.propTypes = {
    rank: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(['up', 'down', 'neutral']),
    isUser: PropTypes.bool,
    badge: PropTypes.string
};

export default RankingItem;
