import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, HardDrive, LogOut, ChevronRight } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
    const navigate = useNavigate();
    const { showToast } = useAppContext();

    const handleAction = (label) => {
        showToast(`${label} settings loading...`);
    };

    const handleLogout = () => {
        localStorage.removeItem('iron_onboarding_done');
        window.location.reload(); // Force re-onboarding for demo
    };

    return (
        <div className="page-container">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '30px',
                    background: 'linear-gradient(45deg, #222, #111)',
                    border: '1px solid var(--border-glass)',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: 'var(--accent-orange)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    MV
                </div>
                <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>MARCUS V.</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '2px' }}>RANK: IRON IV • ID: IRN-7742</p>
            </div>

            <section style={{ marginBottom: '32px' }}>
                <h3 className="section-label">ACCOUNT</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                    {[
                        { icon: User, label: "Identity Details" },
                        { icon: Shield, label: "Biometric Security" },
                        { icon: HardDrive, label: "Data Locker" },
                        { icon: Settings, label: "System Preferences" }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleAction(item.label)}
                            className="list-item-standard"
                            style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="icon-box icon-box-muted" style={{ width: '40px', height: '40px' }}>
                                    <item.icon size={18} />
                                </div>
                                <span style={{ fontWeight: '600' }}>{item.label}</span>
                            </div>
                            <ChevronRight size={18} color="var(--text-muted)" />
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="section-label">DANGER ZONE</h3>
                <Card className="glass-panel" style={{ padding: '0', border: '1px solid rgba(139, 62, 47, 0.2)' }}>
                    <div
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--rust-primary)' }}>
                            <LogOut size={20} />
                            <span style={{ fontWeight: '700' }}>Relinquish Status</span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Logout & Reset</p>
                    </div>
                </Card>
            </section>

            <div style={{ textAlign: 'center', opacity: 0.3 }}>
                <p style={{ fontSize: '0.65rem' }}>IRON APPLICATION v1.0.4-BUILD-99</p>
                <p style={{ fontSize: '0.65rem' }}>ENCRYPTED SESSION ACTIVE</p>
            </div>
        </div>
    );
};

export default Profile;
