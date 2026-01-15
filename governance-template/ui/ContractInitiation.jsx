import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Moon, Loader2, AlertTriangle, FileSignature } from 'lucide-react'; // Added FileSignature
import { useAppContext } from '../app/context/AppContext';
import { useRetention } from '../app/context/RetentionContext';

const ContractInitiation = () => {
    const navigate = useNavigate();
    const { checkIn, showToast, logActivity, initiateTrainingSession } = useAppContext();

    // STRICT GATE: If already checked in (Rest OR Trained), go to Hub.
    const { checkInStatus } = useRetention();

    React.useEffect(() => {
        if (checkInStatus) {
            navigate('/', { replace: true }); // Go to Console
        }
    }, [checkInStatus, navigate]);

    const [loadingAction, setLoadingAction] = useState(null); // 'proof' | 'defer' | null

    const handleAction = async (type) => {
        setLoadingAction(type);
        try {
            let result;
            let xpAwarded = 0;
            let title = "";
            let message = "";

            if (type === 'proof') {
                // "I AM TRAINING" -> "SUBMIT PROOF"
                // Protocol: IRON (Hardcoded for now)
                result = await initiateTrainingSession();

                if (result.status === 'success') {
                    xpAwarded = 100;
                    title = "PROOF ACCEPTED";
                    message = "+100 XP | Protocol Adherence Verified";
                } else if (result.status === 'upgraded') {
                    xpAwarded = 90;
                    title = "STATUS UPGRADED";
                    message = "+90 XP | Protocol Adherence Verified";
                } else {
                    showToast("Proof already logged for this cycle.", "info");
                    setTimeout(() => navigate('/'), 100);
                    return;
                }

            } else {
                // "REST DAY" -> "DEFER CONTRACT" (Rest is a valid deferral in Iron)
                result = await checkIn('rest');

                if (result.status === 'success') {
                    xpAwarded = 10;
                    title = "DEFERRAL LOGGED";
                    message = "+10 XP | Conscious Recovery";
                } else if (result.status === 'ignored') {
                    setTimeout(() => navigate('/'), 100);
                    return;
                }
            }

            // Log Activity & Award XP
            if (xpAwarded > 0) {
                await logActivity({
                    activityType: "Governance Action",
                    title: title,
                    description: message,
                    xp: xpAwarded
                });
            }

            navigate('/');

        } catch (error) {
            console.error("Contract initiation failed:", error);
            showToast("System Failure. Try again.", "error");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #000 0%, #051a00 100%)', // Subtle change to Green/Dark for Governance feeling? Or keep Iron Rust? Let's keep dark.
            color: '#fff',
            textAlign: 'center'
        }}>
            <h1 className="title-display" style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: 'var(--text-primary)',
                letterSpacing: '2px'
            }}>
                PROTOCOL: <span style={{ color: 'var(--accent-orange)' }}>IRON</span>
            </h1>

            <p style={{
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                marginBottom: '3rem',
                fontSize: '1.1rem',
                lineHeight: '1.6'
            }}>
                Daily governance cycle active.
                Submit Proof or Defer Contract.
            </p>

            <div style={{
                display: 'grid',
                gap: '20px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <button
                    onClick={() => handleAction('proof')}
                    disabled={!!loadingAction}
                    style={{
                        padding: '24px',
                        background: loadingAction === 'proof' ? '#333' : 'var(--accent-orange)',
                        opacity: (loadingAction && loadingAction !== 'proof') ? 0.3 : 1,
                        border: 'none',
                        borderRadius: '4px', // More square = more "governance"
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: !!loadingAction ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        color: loadingAction === 'proof' ? '#666' : '#000',
                        width: '100%'
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-display)' }}>
                            {loadingAction === 'proof' ? 'VERIFYING...' : 'SUBMIT PROOF'}
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            {loadingAction === 'proof' ? 'Validating on Ledger' : 'Log Iron Session'}
                        </div>
                    </div>
                    {loadingAction === 'proof' ? <Loader2 className="animate-spin" size={32} /> : <FileSignature size={32} strokeWidth={2} />}
                </button>

                <button
                    onClick={() => handleAction('defer')}
                    disabled={!!loadingAction}
                    style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        opacity: (loadingAction && loadingAction !== 'defer') ? 0.3 : 1,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: !!loadingAction ? 'not-allowed' : 'pointer',
                        color: 'var(--text-secondary)',
                        width: '100%'
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-display)' }}>
                            {loadingAction === 'defer' ? 'LOGGING...' : 'TAKE REST'}
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                            {loadingAction === 'defer' ? 'Updating status' : 'Authorized Recovery'}
                        </div>
                    </div>
                    {loadingAction === 'defer' ? <Loader2 className="animate-spin" size={32} /> : <Moon size={32} />}
                </button>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
                <AlertTriangle size={14} color="var(--rust-primary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    PLEDGE (SATHIYAM) REQUIRED
                </span>
            </div>
        </div>
    );
};

export default ContractInitiation;
