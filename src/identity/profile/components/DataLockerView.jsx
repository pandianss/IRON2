import React, { useState } from 'react';
import { ArrowLeft, HardDrive, Shield } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import { useAppContext } from '../../../app/context/AppContext';

const DataLockerView = ({ onBack }) => {
    const { showToast, biometricHistory, medicalRecords, addMedicalRecord } = useAppContext();
    const [viewState, setViewState] = useState('locker'); // locker | medical-records
    const [expandedFile, setExpandedFile] = useState(null);

    const handleAccess = (e) => {
        e.stopPropagation();
        showToast('Verifying biometric signature...');
        setTimeout(() => {
            showToast('Access Granted');
            setViewState('medical-records');
        }, 1000);
    };

    const handleExport = (e) => {
        e.stopPropagation();
        if (biometricHistory.length === 0) {
            showToast('No biometric data recorded.');
            return;
        }
        showToast(`Encrypting ${biometricHistory.length} logs...`);
        setTimeout(() => showToast('Export Complete'), 1500);
    };

    const toggleExpand = (file) => {
        setExpandedFile(expandedFile === file ? null : file);
    };

    const handleUpload = () => {
        const newFile = {
            id: Date.now(),
            title: `Scan_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
            size: '1.2MB',
            date: new Date().toLocaleDateString('en-GB')
        };
        addMedicalRecord(newFile);
        showToast('Document encrypted & uploaded');
    };

    if (viewState === 'medical-records') {
        return (
            <div className="page-container fade-in">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Button variant="ghost" onClick={() => setViewState('locker')} style={{ padding: '8px' }}>
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

    return (
        <div className="page-container fade-in">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button variant="ghost" onClick={onBack} style={{ padding: '8px' }}>
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
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DataLockerView;
