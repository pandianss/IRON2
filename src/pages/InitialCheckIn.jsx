import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Moon, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '../components/UI/Button';
import { useAppContext } from '../app/context/AppContext';

const InitialCheckIn = () => {
    const navigate = useNavigate();
    const { checkIn, currentUser, completeOnboarding, showToast, logActivity } = useAppContext();

    const [loadingAction, setLoadingAction] = useState(null); // 'trained' | 'rest' | null

    const handleAction = async (status) => {
        setLoadingAction(status);
        try {
            await checkIn(status);

            // Log Activity & Award XP
            const activityPayload = status === 'trained'
                ? {
                    activityType: 'Mission Complete',
                    description: 'Contract fulfilled. Daily training executed.',
                    xp: 100,
                    privacy: 'public'
                }
                : {
                    activityType: 'Rest Day',
                    description: 'Strategic recovery initiated.',
                    xp: 10,
                    privacy: 'public'
                };

            await logActivity(activityPayload);

            completeOnboarding();

            showToast(status === 'trained' ? "Activity Logged (+100 XP)" : "Rest Logged (+10 XP).", 'hero');

            // Artificial delay for emotional weight
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error("First check-in failed", error);
            // Fallback for toast if not available via context, but we should add it
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
            background: 'linear-gradient(135deg, #000 0%, #1a0500 100%)',
            color: '#fff',
            textAlign: 'center'
        }}>
            <h1 className="title-display" style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: 'var(--accent-orange)'
            }}>
                CONTRACT INITIATION
            </h1>

            <p style={{
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                marginBottom: '3rem',
                fontSize: '1.1rem',
                lineHeight: '1.6'
            }}>
                To join the network, you must prove you are active.
                What did you do today?
            </p>

            <div style={{
                display: 'grid',
                gap: '20px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <button
                    onClick={() => handleAction('trained')}
                    disabled={!!loadingAction}
                    style={{
                        padding: '24px',
                        background: loadingAction === 'trained' ? '#333' : 'var(--accent-orange)',
                        opacity: (loadingAction && loadingAction !== 'trained') ? 0.3 : 1,
                        border: 'none',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: !!loadingAction ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        color: loadingAction === 'trained' ? '#666' : '#000',
                        width: '100%'
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-display)' }}>
                            {loadingAction === 'trained' ? 'SYNCING...' : 'I AM TRAINING TODAY'}
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            {loadingAction === 'trained' ? 'Validating proof of work' : 'Log training session'}
                        </div>
                    </div>
                    {loadingAction === 'trained' ? <Loader2 className="animate-spin" size={32} /> : <Dumbbell size={32} strokeWidth={2.5} />}
                </button>

                <button
                    onClick={() => handleAction('rest')}
                    disabled={!!loadingAction}
                    style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        opacity: (loadingAction && loadingAction !== 'rest') ? 0.3 : 1,
                        borderRadius: '16px',
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
                            {loadingAction === 'rest' ? 'SYNCING...' : 'REST DAY'}
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                            {loadingAction === 'rest' ? 'Updating recovery status' : 'Conscious recovery'}
                        </div>
                    </div>
                    {loadingAction === 'rest' ? <Loader2 className="animate-spin" size={32} /> : <Moon size={32} />}
                </button>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
                <AlertTriangle size={14} color="var(--rust-primary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    ACTION REQUIRED TO PROCEED
                </span>
            </div>
        </div>
    );
};

export default InitialCheckIn;
