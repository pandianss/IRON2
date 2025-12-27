import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Share2, Users, Flame, Copy, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Viral = () => {
    const { showToast } = useAppContext();
    const [copied, setCopied] = useState(false);
    const inviteCode = "IRON-M-1337";

    const handleCopy = () => {
        setCopied(true);
        showToast("Invite key copied");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        showToast("Link shared to network");
    };

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>The Circuit</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        JUMP THE LINE. INVITE YOUR SQUAD.
                    </p>
                </div>
                <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                    <Flame size={20} />
                </div>
            </header>
            <section style={{ marginBottom: '40px' }}>
                <Card className="glass-panel" style={{
                    textAlign: 'center',
                    padding: '32px',
                    border: '1px solid var(--accent-orange)',
                    background: 'linear-gradient(180deg, rgba(255, 77, 0, 0.1) 0%, transparent 100%)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'var(--bg-dark)',
                            border: '2px solid var(--accent-orange)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(255, 77, 0, 0.2)'
                        }}>
                            <Flame size={40} color="var(--accent-orange)" />
                        </div>
                    </div>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>WAITLIST POSITION</h2>
                    <div style={{ fontSize: '3rem', fontWeight: '900', fontFamily: 'var(--font-display)', color: 'var(--accent-orange)' }}>
                        #14,208
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        Join the first 1,000 (The Anvil) by proving your discipline.
                    </p>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        <Button fullWidth variant="primary" icon={Share2} onClick={handleShare}>
                            Jump the Line (+50 Spots)
                        </Button>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Share a Proof-of-Workout with #IRONverified
                        </p>
                    </div>
                </Card>
            </section>

            {/* Invite Keys */}
            <h3 className="section-label">YOUR INVITE KEYS</h3>

            <Card className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)'
                    }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontWeight: '700' }}>3 Keys Remaining</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unlocks "Silver Tier" for friends.</p>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-dark)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-glass)'
                }}>
                    <code style={{ flex: 1, color: 'var(--accent-orange)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {inviteCode}
                    </code>
                    <div onClick={handleCopy} style={{ cursor: 'pointer', padding: '8px', color: 'var(--text-secondary)' }}>
                        {copied ? <Check size={20} color="var(--accent-green)" /> : <Share2 size={20} />}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Viral;
