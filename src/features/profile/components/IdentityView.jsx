import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import { useAppContext } from '../../../context/AppContext';

const IdentityView = ({ onBack }) => {
    const { showToast } = useAppContext();

    return (
        <div className="page-container fade-in">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button variant="ghost" onClick={onBack} style={{ padding: '8px' }}>
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="title-display" style={{ fontSize: '1.5rem', margin: 0 }}>IDENTITY</h2>
            </header>
            <Card className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--surface-dark)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-orange)' }}>
                    <User size={40} color="var(--accent-orange)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Marcus V.</h3>
                <p style={{ color: 'var(--text-muted)' }}>ID: IRN-7742</p>
                <div style={{ marginTop: '24px', textAlign: 'left', display: 'grid', gap: '12px' }}>
                    <div
                        onClick={() => { navigator.clipboard.writeText('marcus.v@ironforge.dev'); showToast('Email copied to clipboard'); }}
                        style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', position: 'relative' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>EMAIL</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>marcus.v@ironforge.dev</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>COPY</span>
                        </div>
                    </div>
                    <div
                        onClick={() => { navigator.clipboard.writeText('+91 98765 43210'); showToast('Phone copied to clipboard'); }}
                        style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PHONE</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>+91 98765 43210</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>COPY</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default IdentityView;
