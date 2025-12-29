import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, HardDrive, LogOut, ChevronRight, Bluetooth, Activity, ArrowLeft } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import PassportCard from '../components/UI/PassportCard';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
    const navigate = useNavigate();
    const { showToast, connectDevice, disconnectDevice, isDeviceConnected, deviceName, preferences, togglePreference, biometricHistory, medicalRecords, addMedicalRecord } = useAppContext();
    const [activeView, setActiveView] = React.useState('main');
    const [expandedFile, setExpandedFile] = React.useState(null);

    const handleAction = async (label) => {
        if (label === 'Biometric Security') setActiveView('biometric');
        if (label === 'Identity Details') setActiveView('identity');
        if (label === 'Data Locker') setActiveView('locker');
        if (label === 'System Preferences') setActiveView('settings');
    };

    const handleLogout = () => {
        localStorage.removeItem('iron_onboarding_done');
        window.location.reload(); // Force re-onboarding for demo
    };

    if (activeView === 'biometric') {
        return (
            <div className="page-container fade-in">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" onClick={() => setActiveView('main')} style={{ padding: '8px' }}>
                        <ArrowLeft size={24} />
                    </Button>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', margin: 0 }}>SECURITY</h2>
                </header>
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: isDeviceConnected ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: isDeviceConnected ? '2px solid var(--accent-blue)' : '2px dashed #444',
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        {isDeviceConnected && <div className="pulse-circle" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--accent-blue)', opacity: 0.5 }}></div>}
                        {isDeviceConnected ? <Activity size={48} color="var(--accent-blue)" /> : <Bluetooth size={48} color="#666" />}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                        {isDeviceConnected ? `Connected: ${deviceName}` : "No Device Paired"}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        {isDeviceConnected ? "Biometric stream active. Secure." : "Scan for nearby Iron Pulse devices."}
                    </p>

                    <Button
                        onClick={isDeviceConnected ? () => { disconnectDevice(); showToast('Device disconnected'); } : async () => { try { await connectDevice(); showToast('Device connected'); } catch (e) { showToast('Connection failed'); } }}
                        variant={isDeviceConnected ? 'outline' : 'primary'}
                        style={{ minWidth: '200px' }}
                    >
                        {isDeviceConnected ? "Disconnect" : "Scan & Connect"}
                    </Button>

                    {isDeviceConnected && (
                        <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <span>SIGNAL STRENGTH</span>
                                <span>EXCELLENT</span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--surface-card)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '92%', height: '100%', background: 'var(--accent-blue)' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (activeView === 'identity') {
        return (
            <div className="page-container fade-in">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" onClick={() => setActiveView('main')} style={{ padding: '8px' }}>
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
    }

    if (activeView === 'medical-records') {
        const handleUpload = () => {
            // Simulation of File Picker
            const newFile = {
                id: Date.now(),
                title: `Scan_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
                size: '1.2MB',
                date: new Date().toLocaleDateString('en-GB')
            };
            addMedicalRecord(newFile);
            showToast('Document encrypted & uploaded');
        };

        return (
            <div className="page-container fade-in">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Button variant="ghost" onClick={() => setActiveView('locker')} style={{ padding: '8px' }}>
                            <ArrowLeft size={24} />
                        </Button>
                        <h2 className="title-display" style={{ fontSize: '1.5rem', margin: 0 }}>VAULT</h2>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleUpload} style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        + Upload
                    </Button>
                </header>
                <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
                    {medicalRecords.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            <Shield size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                            <p>Vault is empty. Upload secure documents.</p>
                        </div>
                    ) : (
                        medicalRecords.map((doc, idx) => (
                            <Card key={idx} className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent-blue)' }}>
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{doc.title}</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.date} • {doc.size}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => showToast(`Opening ${doc.title}...`)}>View</Button>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        );
    }

    if (activeView === 'locker') {

        const handleExport = (e) => {
            e.stopPropagation();

            if (biometricHistory.length === 0) {
                showToast('No biometric data recorded. Connect device to log stats.');
                return;
            }

            showToast(`Encrypting ${biometricHistory.length} logs...`);

            // Real CSV Generation
            const headers = ['Timestamp', 'BPM', 'Activity'];
            const rows = biometricHistory.map(entry => [
                new Date(entry.timestamp).toLocaleString(),
                entry.bpm,
                entry.activity
            ]);

            const csvContent = "data:text/csv;charset=utf-8,"
                + [headers, ...rows].map(e => e.join(",")).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `iron_forge_session_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => showToast('Export Complete'), 1500);
        };

        const handleAccess = (e) => {
            e.stopPropagation();
            showToast('Verifying biometric signature...');
            setTimeout(() => {
                showToast('Access Granted');
                setActiveView('medical-records');
            }, 1000);
        };

        const toggleExpand = (file) => {
            setExpandedFile(expandedFile === file ? null : file);
        };

        return (
            <div className="page-container fade-in">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" onClick={() => setActiveView('main')} style={{ padding: '8px' }}>
                        <ArrowLeft size={24} />
                    </Button>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', margin: 0 }}>DATA LOCKER</h2>
                </header>

                <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
                    {/* Cloud Storage Status */}
                    <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(0,0,0,0))', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', letterSpacing: '1px' }}>CLOUD STORAGE</span>
                            <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>24MB / 1GB</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: '2.4%', height: '100%', background: 'var(--accent-blue)', transition: 'width 1s ease' }}></div>
                        </div>
                        <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Encryption: AES-256 • Last Backup: 2m ago
                        </div>
                    </div>

                    {/* File List */}
                    <Card className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        {/* File 1 */}
                        <div
                            onClick={() => toggleExpand('bio')}
                            style={{
                                padding: '16px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                background: expandedFile === 'bio' ? 'rgba(255,255,255,0.03)' : 'transparent',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
                                        <HardDrive size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Biometric History</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CSV • 24MB</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleExport} style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                                    Export
                                </Button>
                            </div>
                            {expandedFile === 'bio' && (
                                <div className="fade-in" style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ color: 'var(--text-muted)' }}>Integrity Check</div>
                                        <div style={{ color: 'var(--accent-green)', textAlign: 'right' }}>Passed ✅</div>
                                        <div style={{ color: 'var(--text-muted)' }}>Last Modified</div>
                                        <div style={{ textAlign: 'right' }}>Today, 10:42 AM</div>
                                        <div style={{ color: 'var(--text-muted)' }}>Access Log</div>
                                        <div style={{ textAlign: 'right' }}>4 events</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* File 2 */}
                        <div
                            onClick={() => toggleExpand('med')}
                            style={{
                                padding: '16px',
                                cursor: 'pointer',
                                background: expandedFile === 'med' ? 'rgba(255,255,255,0.03)' : 'transparent',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--accent-green)' }}>
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Medical Records</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF • Secure Vault</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleAccess} style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                                    Access
                                </Button>
                            </div>
                            {expandedFile === 'med' && (
                                <div className="fade-in" style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ color: 'var(--text-muted)' }}>Vault Status</div>
                                        <div style={{ color: 'var(--accent-green)', textAlign: 'right' }}>Locked 🔒</div>
                                        <div style={{ color: 'var(--text-muted)' }}>Provider</div>
                                        <div style={{ textAlign: 'right' }}>Iron Health Inc.</div>
                                        <div style={{ color: 'var(--text-muted)' }}>Permissions</div>
                                        <div style={{ textAlign: 'right' }}>Owner Only</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '12px' }}>
                        All data is locally encrypted. Use your Iron Key to decrypt on other devices.
                    </p>
                </div>
            </div>
        );
    }


    if (activeView === 'settings') {
        return (
            <div className="page-container fade-in">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" onClick={() => setActiveView('main')} style={{ padding: '8px' }}>
                        <ArrowLeft size={24} />
                    </Button>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', margin: 0 }}>PREFERENCES</h2>
                </header>
                <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
                    {Object.entries(preferences).map(([setting, isEnabled]) => (
                        <div
                            key={setting}
                            onClick={() => togglePreference(setting)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ fontWeight: '600' }}>{setting}</span>
                            <div style={{
                                width: '44px',
                                height: '24px',
                                background: isEnabled ? 'var(--accent-orange)' : '#333',
                                borderRadius: '12px',
                                position: 'relative',
                                transition: 'background-color 0.2s ease'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: '#fff',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: isEnabled ? '22px' : '2px',
                                    transition: 'left 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

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
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginTop: '16px' }}>
                    <PassportCard userName="Marcus V." rank="IRON IV" userId="IRN-7742" />
                </div>
            </div>

            <section style={{ marginBottom: '32px' }}>
                <h3 className="section-label">ACCOUNT</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                    {[
                        { icon: User, label: "Identity Details" },
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

            <div style={{ textAlign: 'center', opacity: 0.3 }}>
                <p style={{ fontSize: '0.65rem' }}>IRON APPLICATION v1.0.4-BUILD-99</p>
                <p style={{ fontSize: '0.65rem' }}>ENCRYPTED SESSION ACTIVE</p>
            </div>
        </div>
    );
};

export default Profile;
