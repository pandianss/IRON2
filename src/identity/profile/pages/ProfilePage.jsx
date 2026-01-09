import React, { useState } from 'react';
import { User, Settings, Shield, HardDrive, LogOut, ChevronRight, Bluetooth, Award } from 'lucide-react';
import Card from '../../../components/UI/Card';
import PassportCard from '../../../components/UI/PassportCard';
import BiometricView from '../components/BiometricView';
import IdentityView from '../components/IdentityView';
import DataLockerView from '../components/DataLockerView';
import SettingsView from '../components/SettingsView';
import CertificationsView from '../components/CertificationsView';

import { useRetention, useSession } from '../../../app/context';

const ProfilePage = () => {
    const [activeView, setActiveView] = useState('main');

    const { currentUser, logout } = useSession(); // Correctly destructure logout
    const { streak, lastCheckInDate } = useRetention();

    const name = currentUser?.displayName || "Marcus V.";
    const rank = currentUser?.rank || "IRON IV";
    const uid = currentUser?.uid?.substring(0, 8).toUpperCase() || "IRN-7742";

    const handleAction = (label) => {
        if (label === 'Biometric Security') setActiveView('biometric');
        if (label === 'Identity Details') setActiveView('identity');
        if (label === 'Data Locker') setActiveView('locker');
        if (label === 'System Preferences') setActiveView('settings');
        if (label === 'Professional Credentials') setActiveView('certifications');
    };

    const handleLogout = async () => {
        await logout();
        // Router will handle redirect via AuthGuard
    };

    if (activeView === 'biometric') return <BiometricView onBack={() => setActiveView('main')} />;
    if (activeView === 'identity') return <IdentityView onBack={() => setActiveView('main')} />;
    if (activeView === 'locker') return <DataLockerView onBack={() => setActiveView('main')} />;
    if (activeView === 'settings') return <SettingsView onBack={() => setActiveView('main')} />;
    if (activeView === 'certifications') return <CertificationsView onBack={() => setActiveView('main')} />;

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
                    {name.charAt(0)}
                </div>
                <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{name.toUpperCase()}</h2>
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginTop: '16px' }}>
                    <PassportCard
                        userName={name}
                        rank={rank}
                        userId={uid}
                        streak={streak}
                        lastCheckIn={lastCheckInDate}
                    />
                </div>
            </div>

            <section style={{ marginBottom: '32px' }}>
                <h3 className="section-label">ACCOUNT</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                    {[
                        { icon: User, label: "Identity Details" },
                        { icon: Award, label: "Professional Credentials" },
                        { icon: Bluetooth, label: "Biometric Security" },
                        { icon: HardDrive, label: "Data Locker" },
                        { icon: Settings, label: "System Preferences" }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleAction(item.label)}
                            className="list-item-standard"
                            style={{
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--border-glass)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="icon-box icon-box-muted" style={{ width: '40px', height: '40px' }}>
                                    <item.icon size={18} />
                                </div>
                                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {item.label}
                                </span>
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
        </div>
    );
};

export default ProfilePage;
