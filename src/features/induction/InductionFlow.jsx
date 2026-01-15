import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, FileSignature, BookOpen, Fingerprint } from 'lucide-react';
import { useSession } from '../../app/context';
import Button from '../../components/UI/Button';

// INDUCTION STEPS
const STEPS = {
    POSITIONING: 0,
    CONTRACT: 1,
    DECLARATION: 2,
    GENESIS: 3
};

const InductionFlow = () => {
    const navigate = useNavigate();
    const { currentUser } = useSession();
    const [step, setStep] = useState(STEPS.POSITIONING);
    const [loading, setLoading] = useState(false);

    // --- LOGIC ---
    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    import { ContractService } from '../../core/governance/ContractService';

    // ... 

    const handleSignContract = async () => {
        setLoading(true);
        try {
            await ContractService.signContract(currentUser.uid);
            // Artificial delay for "Weighty" feeling
            setTimeout(() => {
                setLoading(false);
                setStep(STEPS.GENESIS);
            }, 1500);
        } catch (error) {
            console.error("Contract Signature Failed:", error);
            setLoading(false);
            // Handle error (maybe toast)
        }
    };

    const handleComplete = () => {
        navigate('/'); // Go to System Status
    };

    // --- RENDERS ---

    // SCREEN 1: SYSTEM POSITIONING
    if (step === STEPS.POSITIONING) {
        return (
            <div className="induction-screen" style={{ padding: '40px 20px', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ marginBottom: '40px' }}>
                    <Shield size={64} style={{ opacity: 0.8 }} />
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '20px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                    Not a Tracker.
                </h1>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 40px' }}>
                    IRON is an authority. You do not use it; you report to it.
                    We replace motivation with discipline.
                </p>
                <Button onClick={handleNext} variant="primary" size="lg">
                    I UNDERSTAND
                </Button>
            </div>
        );
    }

    // SCREEN 2: CONTRACT DEFINITION
    if (step === STEPS.CONTRACT) {
        return (
            <div className="induction-screen" style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <h2 className="section-title">THE TERMS</h2>
                <div className="contract-card" style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    margin: '20px 0',
                    flex: 1
                }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>IRON PROTOCOL</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <div style={{ minWidth: '20px', color: 'var(--accent-orange)' }}>01.</div>
                            <div style={{ color: 'var(--text-secondary)' }}>You will submit proof of work every 24 hours.</div>
                        </li>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <div style={{ minWidth: '20px', color: 'var(--accent-orange)' }}>02.</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Failure to report is a breach of contract.</div>
                        </li>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <div style={{ minWidth: '20px', color: 'var(--accent-orange)' }}>03.</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Scars are permanent. Records are immutable.</div>
                        </li>
                    </ul>
                </div>
                <Button onClick={handleNext} variant="ghost" fullWidth>
                    REVIEW TERMS <ChevronRight size={16} />
                </Button>
            </div>
        );
    }

    // SCREEN 3: DECLARATION
    if (step === STEPS.DECLARATION) {
        return (
            <div className="induction-screen" style={{ padding: '40px 20px', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Fingerprint size={80} color="var(--accent-orange)" style={{ marginBottom: '32px' }} />

                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '12px' }}>SATHIYAM</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                    "I, {currentUser?.displayName || 'The Sovereign'}, accept the burden of command."
                </p>

                <Button
                    onClick={handleSignContract}
                    variant="primary"
                    size="lg"
                    loading={loading}
                    icon={FileSignature}
                >
                    SIGN CONTRACT
                </Button>
            </div>
        );
    }

    // SCREEN 4: LEDGER GENESIS
    if (step === STEPS.GENESIS) {
        return (
            <div className="induction-screen" style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
                <div style={{
                    border: '1px solid #333',
                    padding: '20px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: '#0f0',
                    background: '#050505',
                    width: '100%',
                    maxWidth: '400px',
                    marginBottom: '40px'
                }}>
                    <div>&gt; SYSTEM.INIT()</div>
                    <div>&gt; WRITING BLOCK 0...</div>
                    <div style={{ opacity: 0.5 }}>...</div>
                    <div>&gt; CONTRACT: ACCEPTED</div>
                    <div>&gt; HASH: 0x8F3...2AA</div>
                    <div>&gt; DAY 0 STARTED.</div>
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '8px' }}>DAY 0</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>The record has begun.</p>

                <Button onClick={handleComplete} variant="accent" fullWidth>
                    ENTER CONSOLE
                </Button>
            </div>
        );
    }

    return null;
};

export default InductionFlow;
