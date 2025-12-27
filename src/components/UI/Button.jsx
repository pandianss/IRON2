import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  icon: Icon,
  disabled = false
}) => {
  const getVariantStyle = (v) => {
    switch (v) {
      case 'text-black': return { color: '#000' };
      case 'primary': return {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        boxShadow: '0 0 15px rgba(255,255,255,0.3)'
      };
      case 'secondary': return {
        backgroundColor: 'var(--bg-card)',
        color: '#FFFFFF',
        border: '1px solid var(--border-glass)'
      };
      case 'accent': return {
        backgroundColor: 'var(--accent-orange)',
        color: '#000000',
        boxShadow: 'var(--shadow-neon)'
      };
      case 'ghost': return {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)'
      };
      default: return {};
    }
  };

  const buttonStyle = {
    ...getVariantStyle(variant),
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '12px',
    padding: '12px 24px',
    height: '50px',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    border: variant === 'secondary' ? '1px solid var(--border-glass)' : 'none'
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      className={variant === 'primary' || variant === 'accent' ? 'neon-glow' : ''}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.96)')}
      onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'ghost']),
  fullWidth: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool
};

export default Button;
