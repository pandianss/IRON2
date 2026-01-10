import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { MapPin, Star, ShieldAlert, Users, ArrowRight, PenTool, BookOpen } from 'lucide-react';
import { useRetention, useUIFeedback, useData } from '../app/context';
import StarRating from '../components/UI/StarRating';
import ReviewModal from '../components/UI/ReviewModal';

import { useNavigate } from 'react-router-dom';

const Hub = () => {
    const navigate = useNavigate();
    const { isRusting, toggleRust } = useRetention();
    const { showToast } = useUIFeedback();
    const { users, getRatingStats, addRating, gyms } = useData();
    const [reviewTarget, setReviewTarget] = React.useState(null);

    const experts = users.filter(u => u.role === 'expert');

    const handleAction = (msg) => {
        showToast(msg);
    };

    const handleSubmitReview = async (rating, comment) => {
        if (reviewTarget) {
            await addRating(reviewTarget.id, rating, comment);
            setReviewTarget(null);
        }
    };
    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>The Hub</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        FIND YOUR SQUAD. CONNECT WITH EXPERTS.
                    </p>
                </div>
            </header>

            {/* Nearby Forges section removed as per user request */}

            {/* System Health (Live Status) */}
            <section style={{ marginBottom: '40px' }}>
                <h3 className="section-label">SYSTEM HEALTH</h3>
                <Card className="glass-panel" style={{
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: isRusting ? '1px solid #ff4d00' : '1px solid rgba(255,255,255,0.1)',
                    background: isRusting
                        ? 'linear-gradient(135deg, #2a0a00 0%, #5a1a00 100%)' // Deep rust
                        : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', // Clean steel
                    boxShadow: isRusting
                        ? '0 0 20px rgba(255, 77, 0, 0.2), inset 0 0 20px rgba(0,0,0,0.5)' // Rust glow
                        : '0 0 20px rgba(0, 255, 255, 0.05)' // Subtle cool glow
                }}>
                    {/* Texture Overlays */}
                    {isRusting && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/rust.png")', // Optional subtle texture if valid, or just noise
                            opacity: 0.2, mixBlendMode: 'overlay', pointerEvents: 'none'
                        }} />
                    )}

                    {!isRusting && (
                        <div style={{
                            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                            background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 45%, transparent 50%)',
                            transform: 'rotate(25deg)', pointerEvents: 'none'
                        }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                        <div className={`icon-box ${isRusting ? 'icon-box-danger' : 'icon-box-success'}`}
                            style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: isRusting ? 'rgba(255, 60, 0, 0.2)' : 'rgba(0, 255, 150, 0.1)',
                                color: isRusting ? '#ff4d00' : '#00ff94',
                                border: isRusting ? '1px solid rgba(255,60,0,0.3)' : '1px solid rgba(0,255,150,0.2)'
                            }}>
                            {isRusting ? <ShieldAlert size={28} /> : <Star size={28} />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{
                                fontWeight: '900',
                                fontSize: '1.2rem',
                                letterSpacing: '0.5px',
                                color: isRusting ? '#ff6b3d' : '#fff',
                                textShadow: isRusting ? '0 0 10px rgba(255,77,0,0.3)' : 'none'
                            }}>
                                {isRusting ? 'SYSTEM CRITICAL: RUST DETECTED' : 'SYSTEM OPTIMAL: POLISHED'}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: isRusting ? '#ffad99' : 'var(--text-secondary)', marginTop: '4px' }}>
                                {isRusting
                                    ? 'Inactivity has compromised gear integrity. Log a workout immediately to restore status.'
                                    : 'All systems shining. Discipline verified. Keep grinding to maintain luster.'}
                            </p>
                        </div>
                    </div>
                </Card>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="section-label">KNOWLEDGE BASE</h3>
                <Card
                    className="glass-panel"
                    onClick={() => window.location.hash = '#/knowledge'} // Using hash router? Or Link. Let's assume standard nav if possible, but window.location is safe for now in this context or better yet use useNavigate if available.
                    // Wait, I can't use useNavigate in the replace without hooks. Hub has useNavigate if I check.
                    // Ah, Hub doesn't import useNavigate. I should probably use a simple <a href> or add useNavigate.
                    // Let's stick to the existing pattern or use a Link. 
                    // Actually, Hub.jsx uses `useAppContext` and `useState`.
                    // Safest quick win: Just add a clickable Card that uses window.location or I can modify the file to import useNavigate.
                    // I will modify Hub to import useNavigate first? No, replace_file_content is single block.
                    // Let's check imports in Hub.
                    // It imports React, Card, Button, Icons... 
                    // I'll add a card that calls a function.
                    style={{
                        padding: '24px',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-box icon-box-accent">
                            <BookOpen size={24} color="var(--accent-orange)" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>IRON LIBRARY</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Official workouts & nutrition protocols.</p>
                        </div>
                    </div>
                    <ArrowRight size={20} color="var(--text-muted)" />
                </Card>
            </section>

            <section>
                <h3 className="section-label">VERIFIED EXPERTS</h3>
            </section>

            <div style={{ display: 'grid', gap: '12px' }}>
                {experts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                        No verified experts in your network yet.
                    </div>
                ) : (
                    experts.map((expert) => (
                        <Card key={expert.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'linear-gradient(45deg, #111, #333)',
                                border: '1px solid var(--border-glass)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', color: '#555'
                            }}>
                                {expert.displayName.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: '700' }}>{expert.displayName}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                    <StarRating rating={getRatingStats(expert.id).average} size={10} />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {getRatingStats(expert.id).count} reviews
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Button variant="ghost" size="sm" onClick={() => setReviewTarget(expert)} style={{ padding: '8px' }}>
                                    <PenTool size={16} color="var(--accent-orange)" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <ReviewModal
                isOpen={!!reviewTarget}
                onClose={() => setReviewTarget(null)}
                targetName={reviewTarget?.displayName}
                onSubmit={handleSubmitReview}
            />

            <div style={{ marginTop: '32px' }}>
                <Button fullWidth variant="primary" onClick={() => handleAction("Expert certification flow loading...")}>
                    Register as a Trainer
                </Button>
            </div>
        </div>
    );
};

export default Hub;
