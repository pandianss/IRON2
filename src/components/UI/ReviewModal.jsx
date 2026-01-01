import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import StarRating from './StarRating';
import { X } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, targetName, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(rating, comment);
        setComment('');
        setRating(5);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <Card className="glass-panel" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <h3 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>RATE EXPERIENCE</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Reviewing: <span style={{ color: 'var(--accent-orange)' }}>{targetName}</span>
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <StarRating rating={rating} onChange={setRating} interactive size={32} />
                </div>

                <textarea
                    className="iron-input-border"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience (optional)..."
                    style={{
                        width: '100%', minHeight: '100px', marginBottom: '24px',
                        background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '16px', borderRadius: '8px'
                    }}
                />

                <Button variant="accent" fullWidth onClick={handleSubmit}>
                    SUBMIT REVIEW
                </Button>
            </Card>
        </div>
    );
};

export default ReviewModal;
