import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', noPadding = false, style = {}, ...props }) => {
    // We use the .glass-panel utility from index.css
    const combinedStyle = {
        padding: noPadding ? '0' : '20px',
        borderRadius: '20px',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    return (
        <div className={`glass-panel ${className}`} style={combinedStyle} {...props}>
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    noPadding: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func
};

export default Card;
