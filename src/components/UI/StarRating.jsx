import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onChange, size = 16, interactive = false, color = "var(--accent-orange)" }) => {
    const handleStarClick = (index) => {
        if (interactive && onChange) {
            onChange(index + 1);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '4px' }}>
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    onClick={() => handleStarClick(index)}
                    style={{ cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.1s' }}
                    onMouseEnter={(e) => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseLeave={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <Star
                        size={size}
                        fill={index < Math.round(rating) ? color : 'transparent'}
                        color={index < Math.round(rating) ? color : 'var(--text-muted)'}
                        strokeWidth={interactive ? 1.5 : 2}
                    />
                </div>
            ))}
        </div>
    );
};

export default StarRating;
