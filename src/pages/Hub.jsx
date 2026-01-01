import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { MapPin, Star, ShieldAlert, Users, ArrowRight, PenTool } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StarRating from '../components/UI/StarRating';
import ReviewModal from '../components/UI/ReviewModal';

const Hub = () => {
    const { isRusting, toggleRust, showToast, users, getRatingStats, addRating } = useAppContext();
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

            <section style={{ marginBottom: '32px' }}>
                <h3 className="section-label">NEARBY FORGES</h3>

                <Card noPadding className="glass-panel" style={{ overflow: 'hidden' }}>
                    <div style={{ height: '140px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <MapPin size={32} />
                    </div>
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontWeight: '800', fontSize: '1.2rem' }}>ANVIL FORGE MUMBAI</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 255, 148, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                                <Star size={12} color="var(--accent-green)" fill="var(--accent-green)" />
                                <span style={{ color: 'var(--accent-green)', fontWeight: '900', fontSize: '0.75rem' }}>4.9</span>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                            The elite standard in powerlifting. Bandra West, Mumbai. Verified IRON equipment.
                        </p>
                        <Button variant="secondary" fullWidth>View Details</Button>
                    </div>
                </Card>
            </section>

            {/* Rust Simulation (Debug/Demo) */}
            <section style={{ marginBottom: '40px' }}>
                <h3 className="section-label">SYSTEM HEALTH</h3>
                <Card className="glass-panel" style={{
                    padding: '20px',
                    border: isRusting ? '1px solid var(--rust-primary)' : '1px solid var(--border-glass)',
                    background: isRusting ? 'rgba(139, 62, 47, 0.1)' : 'var(--bg-card)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div className={`icon-box ${isRusting ? 'icon-box-accent' : 'icon-box-muted'}`} style={{ color: isRusting ? 'var(--rust-primary)' : 'var(--text-secondary)' }}>
                            <ShieldAlert size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: '700' }}>{isRusting ? 'IRON IS RUSTING' : 'IRON IS SHARP'}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {isRusting ? 'Log an activity to polish your gear.' : 'System prime. Discipline verified.'}
                            </p>
                        </div>
                    </div>
                    <Button onClick={toggleRust} variant={isRusting ? 'accent' : 'secondary'} fullWidth>
                        {isRusting ? 'Polish the Iron' : 'Simulate Inactivity'}
                    </Button>
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
                    Become an Expert
                </Button>
            </div>
        </div>
    );
};

export default Hub;
