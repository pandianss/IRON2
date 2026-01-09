import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Moon, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../components/UI/Button';
import { useAppContext } from '../app/context/AppContext';

const InitialCheckIn = () => {
    const navigate = useNavigate();
    const { checkIn, currentUser } = useAppContext();
    const [submitting, setSubmitting] = useState(false);

    const handleAction = async (status) => {
        setSubmitting(true);
        try {
            await checkIn(status);
            // Artificial delay for emotional weight
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error("First check-in failed", error);
            setSubmitting(false);
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
                    disabled={submitting}
                    style={{
                        padding: '24px',
                        background: 'var(--accent-orange)',
                        border: 'none',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: submitting ? 'wait' : 'pointer',
                        transition: 'transform 0.2s',
                        color: '#000'
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-display)' }}>
                            I DID THE WORK
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            Log training session
                        </div>
                    </div>
                    <Dumbbell size={32} strokeWidth={2.5} />
                </button>

                <button
                    onClick={() => handleAction('rest')}
                    disabled={submitting}
                    style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: submitting ? 'wait' : 'pointer',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-display)' }}>
                            REST DAY
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                            Conscious recovery
                        </div>
                    </div>
                    <Moon size={32} />
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
