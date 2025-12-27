import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', noPadding = false }) => {
    // We use the .glass-panel utility from index.css
    const style = {
        padding: noPadding ? '0' : '20px',
        borderRadius: '20px',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden'
    };

    return (
        <div className={`glass-panel ${className}`} style={style}>
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    noPadding: PropTypes.bool
};

export default Card;
