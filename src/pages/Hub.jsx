import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { MapPin, Star, ShieldAlert, Users, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Hub = () => {
    const { isRusting, toggleRust, showToast } = useAppContext();

    const handleAction = (msg) => {
        showToast(msg);
    };
    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>The Lab</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        YOUR CRYPTOGRAPHIC FITNESS IDENTITY.
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
                {[
                    { name: "Coach Aryan", specialty: "Power & Speed", students: 120 },
                    { name: "Ishani S.", specialty: "Hybrid Performance", students: 340 }
                ].map((expert, idx) => (
                    <Card key={idx} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            background: 'linear-gradient(45deg, #111, #333)',
                            border: '1px solid var(--border-glass)'
                        }}></div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: '700' }}>{expert.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{expert.specialty}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <Users size={12} />
                                {expert.students}
                            </div>
                            <ArrowRight size={16} color="var(--accent-orange)" />
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{ marginTop: '32px' }}>
                <Button fullWidth variant="primary">Become an Expert</Button>
            </div>
        </div>
    );
};

export default Hub;
