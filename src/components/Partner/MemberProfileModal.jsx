import React, { useAppContext } from '../context/AppContext';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { X, User, Activity, AlertCircle, Calendar, Ban, History as HistoryIcon, CheckCircle } from 'lucide-react';

const MemberProfileModal = ({ member, onClose }) => {
    const { toggleBanMember, showToast } = useAppContext();

    if (!member) return null;

    const isBanned = member.status === 'Banned';

    const handleBanToggle = () => {
        toggleBanMember(member.id);
        const action = isBanned ? 'Unbanned' : 'Banned';
        showToast(`Member ${action} successfully`);
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
            <Card className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '0', overflow: 'hidden', border: isBanned ? '1px solid var(--rust-primary)' : '1px solid var(--border-glass)' }}>
                {/* Header */}
                <div style={{ padding: '24px', background: isBanned ? 'rgba(139, 62, 47, 0.1)' : 'linear-gradient(180deg, rgba(255, 77, 0, 0.1) 0%, transparent 100%)', textAlign: 'center', position: 'relative' }}>
                    <div onClick={onClose} style={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', padding: '8px' }}>
                        <X size={20} color="var(--text-secondary)" />
                    </div>

                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '30px',
                        background: '#111',
                        border: isBanned ? '2px solid var(--rust-primary)' : '2px solid var(--accent-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: '900',
                        color: isBanned ? 'var(--rust-primary)' : 'var(--accent-orange)',
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
                                color: isBanned ? 'var(--rust-primary)' : (member.status === 'Active' ? 'var(--accent-green)' : 'var(--rust-primary)'),
                                fontWeight: '900',
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                                background: isBanned ? 'rgba(139, 62, 47, 0.1)' : (member.status === 'Active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 77, 0, 0.1)'),
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
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            <AlertCircle size={20} color="var(--rust-primary)" style={{ flexShrink: 0 }} />
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--rust-primary)', marginBottom: '4px' }}>Medical Notice</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{member.medical}</p>
                            </div>
                        </div>
                    )}

                    {/* HISTORY LOG */}
                    {member.history && member.history.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <HistoryIcon size={14} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACTION HISTORY</span>
                            </div>
                            <div style={{ display: 'grid', gap: '8px', maxHeight: '100px', overflowY: 'auto' }}>
                                {member.history.slice().reverse().map((log, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                        <span style={{ color: log.action === 'Banned' ? 'var(--rust-primary)' : 'var(--accent-green)', fontWeight: '700' }}>{log.action}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{log.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 'auto' }}>
                        <Button
                            fullWidth
                            variant={isBanned ? 'primary' : 'secondary'}
                            style={{
                                background: isBanned ? 'var(--accent-green)' : 'rgba(139, 62, 47, 0.1)',
                                color: isBanned ? '#000' : 'var(--rust-primary)',
                                border: isBanned ? 'none' : '1px solid var(--rust-primary)'
                            }}
                            onClick={handleBanToggle}
                            icon={isBanned ? CheckCircle : Ban}
                        >
                            {isBanned ? 'Unban Member' : 'Ban Member'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MemberProfileModal;
