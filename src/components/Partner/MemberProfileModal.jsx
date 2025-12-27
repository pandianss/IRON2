import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { X, User, Activity, AlertCircle, Calendar } from 'lucide-react';

const MemberProfileModal = ({ member, onClose }) => {
    if (!member) return null;

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
            <Card className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '0', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                {/* Header */}
                <div style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(255, 77, 0, 0.1) 0%, transparent 100%)', textAlign: 'center', position: 'relative' }}>
                    <div onClick={onClose} style={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', padding: '8px' }}>
                        <X size={20} color="var(--text-secondary)" />
                    </div>

                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '30px',
                        background: '#111',
                        border: '2px solid var(--accent-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: '900',
                        color: 'var(--accent-orange)',
                        margin: '0 auto 16px'
                    }}>
                        {member.name.charAt(0)}
                    </div>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{member.name}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '2px' }}>{member.rank}</p>
                </div>

                {/* Details */}
                <div style={{ padding: '24px' }}>

                    <div className="list-item-standard" style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <Activity size={16} color="var(--accent-orange)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>MEMBERSHIP STATUS</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{member.plan}</span>
                            <span style={{
                                color: member.status === 'Active' ? 'var(--accent-green)' : 'var(--rust-primary)',
                                fontWeight: '900',
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                                background: member.status === 'Active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 77, 0, 0.1)',
                                borderRadius: '4px'
                            }}>{member.status.toUpperCase()}</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                        <div className="list-item-standard" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <Calendar size={14} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EXPIRY</span>
                            </div>
                            <span style={{ fontWeight: '700' }}>{member.expiry}</span>
                        </div>
                        <div className="list-item-standard" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <User size={14} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LAST SEEN</span>
                            </div>
                            <span style={{ fontWeight: '700' }}>{member.lastLogin}</span>
                        </div>
                    </div>

                    {member.medical !== 'None' && (
                        <div style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(255, 77, 0, 0.05)',
                            border: '1px dashed var(--rust-primary)',
                            display: 'flex',
                            gap: '12px'
                        }}>
                            <AlertCircle size={20} color="var(--rust-primary)" style={{ flexShrink: 0 }} />
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--rust-primary)', marginBottom: '4px' }}>Medical Notice</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{member.medical}</p>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '24px' }}>
                        <Button fullWidth variant="secondary" onClick={onClose}>Close Profile</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MemberProfileModal;
