import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import PassportCard from '../components/UI/PassportCard';
import { Settings, Save, Activity, Zap, Heart, ShieldCheck, Calendar, History } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Lab = () => {
    const { bpm } = useAppContext();
    return (
        <div style={{ paddingBottom: '100px' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>The Lab</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    YOUR CRYPTOGRAPHIC FITNESS IDENTITY.
                </p>
            </header>

            {/* Biometric Sync Status */}
            <section style={{ marginBottom: '32px' }}>
                <Card className="glass-panel" style={{ padding: '16px', background: 'rgba(0, 255, 148, 0.05)', border: '1px solid rgba(0, 255, 148, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <Heart size={24} color="var(--accent-green)" className="heartbeat" />
                            <div style={{ position: 'absolute', top: -4, right: -4, width: '10px', height: '10px', background: 'var(--accent-green)', borderRadius: '50%', border: '2px solid var(--bg-dark)' }}></div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-green)' }}>PULSE SYNC ACTIVE</p>
                                <span style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{bpm} BPM</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Secure biometric link established via IronLink™</p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Unified Passport */}
            <section style={{ marginBottom: '40px' }}>
                <PassportCard
                    userName="Marcus V."
                    rank="IRON IV"
                    userId="IRN-7742-X90"
                />
                <div style={{ marginTop: '16px' }}>
                    <Button variant="secondary" fullWidth icon={Save}>
                        Save to Iron Passport
                    </Button>
                </div>
            </section>

            <h3 className="title-display" style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                letterSpacing: '1px'
            }}>
                UTILITIES
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
                <Card className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                    <div style={{ padding: '12px', background: 'rgba(255, 77, 0, 0.1)', borderRadius: '14px' }}>
                        <Calendar size={24} color="var(--accent-orange)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '700' }}>Session Planner</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Drag & drop routines from your trainer.</p>
                    </div>
                </Card>

                <Card className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                    <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px' }}>
                        <History size={24} color="var(--text-primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '700' }}>Re-Forging Logs</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Past cycles and consistency reports.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Lab;
