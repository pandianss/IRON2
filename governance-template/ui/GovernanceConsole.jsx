import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtocolService } from '../core/protocols/ProtocolService';
import {
    Shield, Activity, Database, FileText,
    ChevronRight, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useSession, useRetention } from '../app/context';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const GovernanceConsole = () => {
    const navigate = useNavigate();
    const { currentUser } = useSession();
    const { activeProtocol, checkInStatus, streak, tier, statusColor } = useRetention();

    const [protocolStatus, setProtocolStatus] = useState('Loading...');
    const [protocolName, setProtocolName] = useState('...');

    useEffect(() => {
        if (activeProtocol) {
            setProtocolName(activeProtocol.name);
            // Example: Determine status based on activeProtocol properties
            if (activeProtocol.isActive) {
                setProtocolStatus('ACTIVE');
            } else {
                setProtocolStatus('INACTIVE');
            }
        } else {
            setProtocolName('No Active Protocol');
            setProtocolStatus('INACTIVE');
        }
    }, [activeProtocol]);

    return (
        <div className="governance-console" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '24px', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
                GOVERNANCE CONSOLE
            </h1>

            {/* 1. IDENTITY & STATUS */}
            <section style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 className="section-label">CITIZEN STATUS</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                        VIEW PROFILE <ChevronRight size={16} />
                    </Button>
                </div>
                <Card className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                                    CITIZEN IDENTITY
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '4px 0', fontFamily: 'var(--font-display)' }}>
                                    {currentUser?.displayName || "Anonymous"}
                                </h2>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '4px',
                                    marginTop: '8px'
                                }}>
                                    <Shield size={14} color="var(--accent-orange)" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-orange)' }}>
                                        {tier}
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '900', lineHeight: 1, color: statusColor }}>
                                    {streak}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: statusColor, fontWeight: '700', letterSpacing: '1px' }}>
                                    DISCIPLINE CYCLES
                                </div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div style={{
                            height: '4px',
                            width: '100%',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: '100%', // Percentage could be leveling logic later
                                background: statusColor,
                                opacity: 0.7
                            }} />
                        </div>
                    </div>
                </Card>
            </section>

            {/* 2. CONTRACT MONITOR */}
            <section style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 className="section-label">ACTIVE PROTOCOL</h3>
                    <div style={{ fontSize: '0.75rem', color: statusColor, fontWeight: 'bold' }}>
                        {protocolStatus}
                    </div>
                </div>

                <Card className="glass-panel" style={{ padding: '0' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div className="icon-box" style={{ background: 'rgba(255, 60, 0, 0.1)' }}>
                                <Activity size={20} color="var(--accent-orange)" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{protocolName}</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeProtocol.description}</p>
                            </div>
                        </div>

                        {checkInStatus ? (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(0, 255, 100, 0.05)',
                                border: '1px solid var(--accent-success)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <CheckCircle2 size={20} color="var(--accent-success)" />
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-success)' }}>
                                        OBLIGATION MET
                                    </div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                        Proof accepted for this cycle.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(255, 60, 0, 0.05)',
                                border: '1px solid var(--accent-orange)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <AlertTriangle size={20} color="var(--accent-orange)" />
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-orange)' }}>
                                        PROTOCOL CALLS
                                    </div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                        Submit proof before sunset.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {!checkInStatus && (
                        <div style={{ padding: '12px' }}>
                            <Button
                                variant="accent"
                                fullWidth
                                icon={FileText}
                                onClick={() => navigate('/checkin/initial')}
                            >
                                SUBMIT PROOF
                            </Button>
                        </div>
                    )}
                </Card>
            </section>

            {/* 3. LEDGER UPLINK */}
            <section style={{ marginBottom: '24px' }}>
                <h3 className="section-label">SYSTEM LEDGER</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Card
                        className="glass-panel"
                        style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                        onClick={() => navigate('/mirror')}
                    >
                        <Database size={24} color="var(--text-secondary)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>VIEW LEDGER</span>
                    </Card>

                    <Card
                        className="glass-panel"
                        style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                        onClick={() => navigate('/hub')}
                    >
                        <FileText size={24} color="var(--text-secondary)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>PROTOCOLS</span>
                    </Card>
                </div>
            </section>

            {/* 4. DATA INTEGRITY */}
            <section style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 className="section-label">DATA INTEGRITY</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/data-vault')}>
                        VIEW VAULT <ChevronRight size={16} />
                    </Button>
                </div>
                <Card className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="icon-box" style={{ background: 'rgba(0, 120, 255, 0.1)' }}>
                        <Database size={20} color="var(--accent-blue)" />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>PRAMANA VAULT</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Secure storage for all your submitted pramana.
                        </p>
                    </div>
                </Card>
            </section>

            {/* 4. SYSTEM LOGS */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 className="section-label">SYSTEM LOGS</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/system-logs')}>
                        VIEW LOGS <ChevronRight size={16} />
                    </Button>
                </div>
                <Card className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="icon-box" style={{ background: 'rgba(255, 255, 0, 0.1)' }}>
                        <FileText size={20} color="var(--accent-yellow)" />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>AUDIT TRAIL</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Review system activities and governance actions.
                        </p>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default GovernanceConsole;
