import React, { useState } from 'react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import { X, User, Check, Wallet } from 'lucide-react';
import { useAppContext } from '../../../app/context/AppContext';

const AddMemberModal = ({ onClose }) => {
    const { addMember, showToast, selectedGymId } = useAppContext();
    const [mode, setMode] = useState('manual'); // 'manual' | 'link'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState(''); // Added Mobile State
    const [plan, setPlan] = useState('Monthly');

    const joinLink = `${window.location.origin}/join/${selectedGymId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(joinLink);
        showToast("Link copied to clipboard");
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`Join our gym here: ${joinLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleSubmit = () => {
        if (!name) {
            showToast("Please enter a member name");
            return;
        }

        const newMember = {
            name,
            email,
            mobileNumber: mobile, // Added Mobile Number
            gymId: selectedGymId,
            rank: 'IRON V',
            status: 'Active',
            plan,
            expiry: '30/01/2026',
            lastLogin: 'Never',
            medical: 'None'
        };

        addMember(newMember);
        showToast(`Member "${name}" added successfully`);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
        }}>
            <Card className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '0', overflow: 'hidden', border: '1px solid var(--accent-orange)' }}>
                {/* Header */}
                <div style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(255, 77, 0, 0.1) 0%, transparent 100%)', textAlign: 'center', position: 'relative' }}>
                    <div onClick={onClose} style={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', padding: '8px' }}>
                        <X size={20} color="var(--text-secondary)" />
                    </div>

                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '20px',
                        background: '#111',
                        border: '2px solid var(--accent-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'var(--accent-orange)',
                        margin: '0 auto 16px'
                    }}>
                        <User size={24} />
                    </div>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>ADD MEMBER</h2>

                    {/* Tabs */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                        <span
                            onClick={() => setMode('manual')}
                            style={{
                                fontSize: '0.8rem',
                                color: mode === 'manual' ? 'var(--accent-orange)' : 'var(--text-muted)',
                                borderBottom: mode === 'manual' ? '1px solid var(--accent-orange)' : 'none',
                                cursor: 'pointer',
                                paddingBottom: '4px'
                            }}
                        >
                            MANUAL ENTRY
                        </span>
                        <span
                            onClick={() => setMode('link')}
                            style={{
                                fontSize: '0.8rem',
                                color: mode === 'link' ? 'var(--accent-orange)' : 'var(--text-muted)',
                                borderBottom: mode === 'link' ? '1px solid var(--accent-orange)' : 'none',
                                cursor: 'pointer',
                                paddingBottom: '4px'
                            }}
                        >
                            SHARE LINK
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {mode === 'manual' ? (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>FULL NAME</label>
                                <input
                                    className="iron-input-border"
                                    placeholder="e.g. John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: '#fff',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-glass)'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                                <input
                                    className="iron-input-border"
                                    placeholder="e.g. valid@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: '#fff',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-glass)'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>MOBILE NUMBER</label>
                                <input
                                    className="iron-input-border"
                                    placeholder="e.g. +91 98765 43210"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: '#fff',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-glass)'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>PLAN</label>
                                <select
                                    value={plan}
                                    onChange={(e) => setPlan(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: '#fff',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-glass)'
                                    }}
                                >
                                    <option value="Monthly" style={{ background: '#111' }}>Monthly</option>
                                    <option value="Quarterly" style={{ background: '#111' }}>Quarterly</option>
                                    <option value="Annual" style={{ background: '#111' }}>Annual</option>
                                </select>
                            </div>

                            <Button fullWidth variant="accent" onClick={handleSubmit} icon={Check}>Add Member</Button>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                Share this link with potential members. They can register and pay online.
                            </p>

                            <div style={{
                                background: '#111',
                                padding: '12px',
                                borderRadius: '8px',
                                wordBreak: 'break-all',
                                fontSize: '0.8rem',
                                color: 'var(--accent-orange)',
                                border: '1px dashed var(--border-glass)',
                                marginBottom: '24px'
                            }}>
                                {joinLink}
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                <Button fullWidth variant="ghost" onClick={handleCopy}>Copy Link</Button>
                                <Button fullWidth variant="secondary" onClick={handleWhatsApp} style={{ background: '#25D366', color: '#000', border: 'none' }}>Share on WhatsApp</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AddMemberModal;
