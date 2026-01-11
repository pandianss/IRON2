import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Moon, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '../components/UI/Button';
import { useAppContext } from '../app/context/AppContext';
import { useRetention } from '../app/context/RetentionContext';

const InitialCheckIn = () => {
    const navigate = useNavigate();
    const { checkIn, currentUser, completeOnboarding, showToast, logActivity, initiateTrainingSession } = useAppContext();

    // STRICT GATE: If already checked in (Rest OR Trained), go to Hub.
    // Upgrades happen in the Hub now.
    const { checkInStatus } = useRetention(); // Direct access for gate logic

    React.useEffect(() => {
        if (checkInStatus) {
            navigate('/hub', { replace: true });
        }
    }, [checkInStatus, navigate]);

    const [loadingAction, setLoadingAction] = useState(null); // 'trained' | 'rest' | null

    const handleAction = async (status) => {
        setLoadingAction(status);
        try {
            let result;
            let xpAwarded = 0;
            let title = "";
            let message = "";

            if (status === 'trained') {
                result = await initiateTrainingSession(); // Sets pending proof & calls checkIn internally

                if (result.status === 'success') {
                    xpAwarded = 100;
                    title = "MISSION COMPLETE";
                    message = "+100 XP | My Workout for the Day";
                } else if (result.status === 'upgraded') {
                    xpAwarded = 90; // Diff (100 - 10)
                    title = "STATUS UPGRADED";
                    message = "+90 XP | My Workout for the Day";
                } else {
                    // Ignored / Already Done
                    showToast("Training already logged for today.", "info");
                    setTimeout(() => {
                        navigate('/hub');
                    }, 100);
                    return;
                }

            } else {
                result = await checkIn(status);

                if (result.status === 'success') {
                    xpAwarded = 10;
                    title = "RECOVERY LOGGED";
                    message = "+10 XP";
                } else if (result.status === 'ignored') {
                    showToast("Status already logged for today.", "info");
                    // PROCEED ANYWAY (Fix for stuck users)
                    setTimeout(() => {
                        navigate('/hub');
                    }, 100);
                    return;
                }
            }

            // Log Activity & Award XP
            const activityPayload = status === 'trained'
                ? { type: 'check_in', title: title, xp: xpAwarded, details: message }
                : { type: 'check_in', title: title, xp: xpAwarded, details: "Active Recovery" };

            // Only log activity if XP was actually awarded
            if (xpAwarded > 0) {
                await logActivity({
                    activityType: "Check In",
                    title: activityPayload.title,
                    description: activityPayload.details,
                    xp: activityPayload.xp
                });
            }

            // Show Toast
            showToast(
                <div className="flex flex-col">
                    <span className="font-black text-lg glitch-text">{activityPayload.title}</span>
                    <span className="text-sm font-mono opacity-80">{activityPayload.details}</span>
                </div>
                , 'hero');

            // Navigate
            setTimeout(() => {
                navigate('/hub');
            }, 100);

        } catch (error) {
            console.error("Check-in failed:", error);
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
