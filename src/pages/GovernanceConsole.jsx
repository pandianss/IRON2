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
    const { activeProtocol, checkInStatus, streak, fileProof, integrity, scars, standing, era } = useRetention();

    // COLOR MAPPING
    const STATUS_COLORS = {
        'STABLE': 'var(--accent-success)',
        'WARNING': 'var(--accent-orange)',
        'CRITICAL': 'var(--accent-red)',
        'BREACHED': '#ff0000' // Alarm red
    };

    const riskColor = STATUS_COLORS[standing] || 'var(--text-primary)';

    return (
        <div className="system-status" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>

            {/* 1. HEADER: RISK LEVEL */}
            <header style={{ marginBottom: '40px', textAlign: 'center', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    SYSTEM STATUS
                </div>
                <div style={{
                    fontSize: '3rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '900',
                    color: riskColor,
                    textShadow: `0 0 20px ${riskColor}30`
                }}>
                    {standing}
                </div>
                {standing !== 'STABLE' && (
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Compliance window active.
                    </div>
                )}
            </header>

            {/* ERA INDICATOR */}
            <div style={{ textAlign: 'center', marginBottom: '20px', opacity: 0.6, fontSize: '0.8rem', letterSpacing: '1px' }}>
                {era ? (era.title || `ERA ${era.index}`).toUpperCase() : 'NO ERA ESTABLISHED'}
            </div>

            {/* 2. PRIMARY ACTION */}
            <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '40px' }}>
                {checkInStatus ? (
                    <Card className="glass-panel" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--accent-success)' }}>
                        <CheckCircle2 size={64} color="var(--accent-success)" style={{ margin: '0 auto 24px' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>COMPLIANCE VERIFIED</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Day {streak} recorded on Ledger.
                        </p>
                    </Card>
                ) : (
                    <>
                        <input
                            type="file"
                            id="proof-upload"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const btn = document.getElementById('submit-btn');
                                if (btn) btn.innerText = "UPLOADING EVIDENCE...";

                                await checkIn('trained', file);
                            }}
                        />
                        <Button
                            id="submit-btn"
                            onClick={() => document.getElementById('proof-upload').click()}
                            variant="primary"
                            style={{ height: '120px', fontSize: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}
                        >
                            <FileText size={32} />
                            SUBMIT PROOF
                        </Button>
                        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            * PHOTO EVIDENCE REQUIRED
                        </div>
                    </>
                )}
            </section>

            {/* 3. LEDGER STATE */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Card className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        CURRENT STANDING
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {streak} <span style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.5 }}>DAYS</span>
                    </div>
                </Card>

                <Card
                    className="glass-panel"
                    style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    onClick={() => navigate('/mirror')}
                >
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            LAST ENTRY
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            VIEW LEDGER
                        </div>
                    </div>
                    <ChevronRight size={20} color="var(--text-secondary)" />
                </Card>
            </section>

            <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.3, fontSize: '0.8rem' }}>
                ID: {currentUser?.uid?.slice(0, 8) || 'UNKNOWN'}
            </div>
        </div>
    );
};

export default GovernanceConsole;
