import React from 'react';

export const TrustSurface = ({ reason, onDismiss }) => {
    if (!reason) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: '#ef4444', // Red-500
            color: 'white',
            padding: '1rem',
            zIndex: 9999, // Above everything
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div>
                <strong style={{ display: 'block' }}>Streak Reset</strong>
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {reason}. It happens! Start fresh today.
                </span>
            </div>
            <button
                onClick={onDismiss}
                style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Got it
            </button>
        </div>
    );
};
