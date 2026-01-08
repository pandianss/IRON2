import React from 'react';
import { ArrowLeft, Activity, Bluetooth } from 'lucide-react';
import Button from '../../../components/UI/Button';
import { useAppContext } from '../../../app/context/AppContext';

const BiometricView = ({ onBack }) => {
    const { showToast, connectDevice, disconnectDevice, isDeviceConnected, deviceName } = useAppContext();

    return (
        <div className="page-container fade-in">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button variant="ghost" onClick={onBack} style={{ padding: '8px' }}>
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
};

export default BiometricView;
