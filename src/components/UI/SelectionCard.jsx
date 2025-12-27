import React from 'react';
import PropTypes from 'prop-types';

const SelectionCard = (props) => {
    const { title, description, icon: Icon, selected, onClick } = props;
    return (
        <div
            onClick={onClick}
            style={{
                padding: '20px',
                borderRadius: '20px',
                background: selected ? 'rgba(255, 77, 0, 0.1)' : 'var(--bg-card)',
                border: selected ? '2px solid var(--accent-orange)' : '1px solid var(--border-glass)',
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                transform: selected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selected ? '0 10px 20px rgba(255, 77, 0, 0.15)' : 'none',
                overflow: 'hidden'
            }}
        >
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: selected ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selected ? '#000' : 'var(--text-primary)',
                transition: 'all 0.3s ease'
            }}>
                <Icon size={24} strokeWidth={selected ? 2.5 : 2} />
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '4px',
                    color: selected ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                    {title}
                </h3>
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.4'
                }}>
                    {description}
                </p>
            </div>

            {selected && (
                <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-orange)',
                    boxShadow: '0 0 10px var(--accent-orange)'
                }}></div>
            )}
        </div>
    );
};

SelectionCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default SelectionCard;
