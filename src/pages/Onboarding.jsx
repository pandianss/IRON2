import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Dumbbell, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import Button from '../components/UI/Button';
import SelectionCard from '../components/UI/SelectionCard';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [userType, setUserType] = useState(null);

    const handleTypeSelect = (type) => {
        setUserType(type);
    };

    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1 && userType) {
            setStep(2);
            // Simulate "Verification" process
            setTimeout(() => {
                setStep(3);
            }, 3000); // 3 seconds suspense
        } else if (step === 3) {
            navigate('/');
        }
    };

    return (
        <div className="app-container" style={{
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)'
        }}>

            {step === 0 && (
                <MotionDivPlaceholder className="fade-in">
                    <div style={{ marginBottom: '40px' }}>
                        <h2 className="title-display" style={{
                            color: 'var(--accent-orange)',
                            fontSize: '1rem',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            marginBottom: '20px'
                        }}>
                            The Manifesto
                        </h2>
                        <h1 className="title-display" style={{
                            fontSize: '2.5rem',
                            lineHeight: '1.1',
                            marginBottom: '30px',
                            color: 'var(--text-primary)'
                        }}>
                            Gold is for show.<br />
                            Silver is for second place.<br />
                            <span style={{ color: 'var(--accent-orange)' }}>IRON</span> is for the dedicated.
                        </h1>

                        <div style={{
                            height: '1px',
                            width: '60px',
                            background: 'var(--accent-orange)',
                            marginBottom: '30px'
                        }}></div>

                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            marginBottom: '24px'
                        }}>
                            Most fitness apps are digital graveyards of unused subscriptions. IRON is different. We don't just track your reps; we verify your discipline.
                        </p>

                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            marginBottom: '24px'
                        }}>
                            This is a closed circuit for those who live the lifestyle. To enter, you must be invited. To stay, you must perform. To shop, you must earn the rank.
                        </p>

                        <p style={{
                            color: 'var(--text-primary)',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            fontFamily: 'var(--font-display)'
                        }}>
                            Prove your strength.<br />
                            Earn your status.<br />
                            Welcome to IRON.
                        </p>
                    </div>

                    <Button fullWidth variant="accent" onClick={handleNext} icon={ChevronRight}>
                        Enter The Forge
                    </Button>
                </MotionDivPlaceholder>
            )}

            {step === 1 && (
                <MotionDivPlaceholder className="fade-in">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                        Identify Yourself.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
                        Appropriate clearance is required to access the network.
                    </p>

                    <SelectionCard
                        title="Enthusiast"
                        description="I want to track my progress, compete, and unlock rewards."
                        icon={Dumbbell}
                        selected={userType === 'enthusiast'}
                        onClick={() => handleTypeSelect('enthusiast')}
                    />

                    <SelectionCard
                        title="Expert Trainer"
                        description="I offer coaching, programs, and want to verify my credentials."
                        icon={Shield}
                        selected={userType === 'expert'}
                        onClick={() => handleTypeSelect('expert')}
                    />

                    <SelectionCard
                        title="Gym Partner"
                        description="I own a facility and want to manage members or foot traffic."
                        icon={MapPin}
                        selected={userType === 'gym'}
                        onClick={() => handleTypeSelect('gym')}
                    />

                    <div style={{ marginTop: '40px' }}>
                        <Button
                            fullWidth
                            variant="accent"
                            disabled={!userType}
                            onClick={handleNext}
                            icon={ChevronRight}
                        >
                            Begin Vetting
                        </Button>
                    </div>
                </MotionDivPlaceholder>
            )}

            {step === 2 && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 30px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Loader2 size={60} color="var(--accent-orange)" className="animate-spin" />
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 30px var(--accent-orange)', opacity: 0.3 }}></div>
                    </div>

                    <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
                        Analyzing Discipline...
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Cross-referencing global performance metrics.
                    </p>
                </div>
            )}

            {step === 3 && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto 30px',
                        borderRadius: '50%',
                        background: 'rgba(255, 77, 0, 0.1)',
                        border: '2px solid var(--accent-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-orange)',
                        boxShadow: '0 0 40px rgba(255, 77, 0, 0.3)'
                    }}>
                        <Shield size={50} />
                    </div>

                    <h1 className="title-display" style={{ fontSize: '2rem', marginBottom: '16px' }}>
                        Access Granted.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', padding: '0 20px' }}>
                        Welcome to the inner circle. Your initial rank is <strong>IRON IV</strong>.
                    </p>

                    <Button fullWidth variant="primary" onClick={handleNext}>
                        Enter The Pulse
                    </Button>
                </div>
            )}

        </div>
    );
};

const MotionDivPlaceholder = ({ children, className }) => <div className={className}>{children}</div>;

export default Onboarding;
