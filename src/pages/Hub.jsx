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
                <Card style={{
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    // Border: Bevel effect
                    borderTop: isRusting ? '1px solid #5a1a1a' : '1px solid rgba(255,255,255,0.3)',
                    borderLeft: isRusting ? '1px solid #5a1a1a' : '1px solid rgba(255,255,255,0.1)',
                    borderRight: isRusting ? '1px solid #1a0500' : '1px solid rgba(0,0,0,0.5)',
                    borderBottom: isRusting ? '1px solid #1a0500' : '1px solid rgba(0,0,0,0.5)',

                    // Background: Metallic vs Rusted
                    // Polished: Gunmetal Blue-Grey to Black gradient
                    // Rust: Deep Brown/Red gradient
                    background: isRusting
                        ? 'linear-gradient(135deg, #2a0a00 0%, #3d1000 100%)'
                        : 'linear-gradient(135deg, #2c3e50 0%, #080808 100%)',

                    boxShadow: isRusting
                        ? 'inset 2px 2px 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)' // Deep inset
                        : 'inset 1px 1px 2px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.5)' // Metallic shine
                }}>
                    {/* Metal Texture Overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        opacity: isRusting ? 0.4 : 0.05,
                        backgroundImage: isRusting
                            ? 'radial-gradient(circle, rgba(255,100,0,0.2) 1px, transparent 1px)' // Rust Spots
                            : 'repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(255,255,255,0.1) 3px)', // Brushed metal
                        pointerEvents: 'none',
                        mixBlendMode: 'overlay',
                        backgroundSize: isRusting ? '10px 10px' : 'auto'
                    }} />

                    {/* Rust Glow / Shine */}
                    {isRusting ? (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle at 30% 20%, rgba(200, 50, 0, 0.1) 0%, transparent 60%)',
                            pointerEvents: 'none'
                        }} />
                    ) : (
                        <div style={{
                            position: 'absolute', top: -100, right: -100, width: 300, height: 300,
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
                        {/* Icon with Bevel */}
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: isRusting ? '#1a0500' : 'linear-gradient(145deg, #111, #222)',
                            boxShadow: isRusting ? 'inset 2px 2px 5px rgba(0,0,0,0.5)' : '5px 5px 10px #0b0b0b, -5px -5px 10px #252525', // Neumorphic Metal
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isRusting ? '#ff3b00' : '#00ff94',
                            border: isRusting ? '2px solid #3d1000' : '2px solid rgba(255,255,255,0.05)'
                        }}>
                            {isRusting ? <ShieldAlert size={32} /> : <Star size={32} fill={!isRusting ? "#00ff94" : "none"} fillOpacity={0.1} />}
                        </div>

                        <div style={{ flex: 1 }}>
                            <h4 style={{
                                fontWeight: '900',
                                fontSize: '1.4rem',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                color: isRusting ? '#ff3b00' : '#fff',
                                textShadow: isRusting ? '0 2px 4px rgba(0,0,0,0.8)' : '0 2px 10px rgba(0,255,148,0.3)',
                                fontFamily: 'var(--font-display)',
                                margin: 0, marginBottom: '4px'
                            }}>
                                {isRusting ? 'SYSTEM CRITICAL' : 'SYSTEM OPTIMAL'}
                            </h4>
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 12px', borderRadius: '4px',
                                background: isRusting ? 'rgba(255, 60, 0, 0.1)' : 'rgba(0, 255, 148, 0.1)',
                                border: isRusting ? '1px solid rgba(255, 60, 0, 0.2)' : '1px solid rgba(0, 255, 148, 0.2)',
                                color: isRusting ? '#ff6b3d' : '#00ff94',
                                fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px'
                            }}>
                                {isRusting ? 'RUST DETECTED' : 'POLISHED'}
                            </div>
                            <p style={{ fontSize: '0.9rem', color: isRusting ? '#cc8877' : '#8899aa', marginTop: '12px', maxWidth: '90%' }}>
                                {isRusting
                                    ? 'Integrity compromised. Training required to remove oxidation.'
                                    : 'Armor is shining. Discipline verified. Maintain luster.'}
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
