import React, { useState } from 'react';
import { ReplayService } from '../../services/forensics/ReplayService';
import { useSession } from '../../app/context';
import Button from '../../components/UI/Button';
import { Shield, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const VerificationDashboard = () => {
    const { currentUser } = useSession();
    const [status, setStatus] = useState('IDLE'); // IDLE, RUNNING, SUCCESS, FAILURE
    const [report, setReport] = useState(null);

    const runDestructiveVerify = async () => {
        if (!currentUser) return;
        if (!window.confirm("WARNING: This will DELETE your local state cache and rebuild it from the Ledger. This is a destructive test of Sovereignty. Proceed?")) return;

        setStatus('RUNNING');
        try {
            const result = await ReplayService.destructiveReplay(currentUser.uid);
            setReport(result);
            setStatus('SUCCESS');
        } catch (e) {
            console.error(e);
            setStatus('FAILURE');
            setReport({ error: e.message });
        }
    };

    return (
        <div style={{ padding: '24px', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <h2 className="title-display" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield color="var(--accent-blue)" />
                SOVEREIGNTY VERIFICATION
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Institutional Litmus Test: Prove that State is purely derived from the Ledger.
            </p>

            <div style={{ marginBottom: '24px' }}>
                <Button
                    variant="accent"
                    onClick={runDestructiveVerify}
                    disabled={status === 'RUNNING'}
                    icon={RefreshCw}
                >
                    {status === 'RUNNING' ? 'REBUILDING AUTHENTICITY...' : 'RUN DESTRUCTIVE REPLAY'}
                </Button>
            </div>

            {status === 'SUCCESS' && (
                <div className="fade-in" style={{ padding: '16px', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--accent-green)', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={20} /> VERIFIED
                    </h3>
                    <pre style={{ fontSize: '0.8rem', marginTop: '12px' }}>
                        {JSON.stringify(report, null, 2)}
                    </pre>
                    <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                        The System successfully deleted the User State and reconstructed it perfectly from {report.eventCount} immutable Ledger Events.
                        <br />
                        <strong>Institutional Memory is Real.</strong>
                    </p>
                </div>
            )}

            {status === 'FAILURE' && (
                <div className="fade-in" style={{ padding: '16px', background: 'rgba(255,0,0,0.1)', border: '1px solid var(--rust-primary)', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--rust-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={20} /> VERIFICATION FAILED
                    </h3>
                    <pre style={{ fontSize: '0.8rem', marginTop: '12px' }}>
                        {JSON.stringify(report, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default VerificationDashboard;
