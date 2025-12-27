import React from 'react';
import PropTypes from 'prop-types';
import { Lock, ShoppingCart, Info } from 'lucide-react';

const ProductCard = ({
    title,
    price,
    levelRequired,
    isLocked = true,
    tag
}) => {
    return (
        <div className="glass-panel" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: isLocked ? '1px solid var(--border-glass)' : '1px solid rgba(255, 77, 0, 0.3)',
            background: isLocked ? 'rgba(10, 10, 10, 0.6)' : 'var(--bg-card)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            filter: isLocked ? 'grayscale(1)' : 'none',
            opacity: isLocked ? 0.8 : 1
        }}>
            {/* Tag Overlay */}
            {tag && !isLocked && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'var(--accent-orange)',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    zIndex: 2,
                    textTransform: 'uppercase'
                }}>
                    {tag}
                </div>
            )}

            {/* Product Image Placeholder */}
            <div style={{
                height: '180px',
                background: isLocked ? '#111' : 'linear-gradient(135deg, #1A1A1A 0%, #252525 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {isLocked ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Lock size={40} style={{ marginBottom: '12px' }} />
                        <p style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            LOCKED: LVL {levelRequired}
                        </p>
                    </div>
                ) : (
                    <div style={{ width: '80%', height: '80%', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        {/* Realistic image would go here */}
                    </div>
                )}
            </div>

            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    marginBottom: '4px',
                    color: isLocked ? 'var(--text-muted)' : 'var(--text-primary)'
                }}>
                    {title}
                </h4>

                <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '900',
                        fontFamily: 'var(--font-display)',
                        color: isLocked ? 'var(--text-muted)' : 'var(--accent-orange)'
                    }}>
                        {price}
                    </span>

                    {isLocked ? (
                        <Info size={18} color="var(--text-muted)" />
                    ) : (
                        <div style={{
                            padding: '10px',
                            background: 'var(--accent-orange)',
                            borderRadius: '10px',
                            color: '#000',
                            display: 'flex'
                        }}>
                            <ShoppingCart size={18} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    levelRequired: PropTypes.number.isRequired,
    isLocked: PropTypes.bool,
    tag: PropTypes.string
};

export default ProductCard;
