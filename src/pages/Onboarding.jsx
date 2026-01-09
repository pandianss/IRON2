import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Shield, MapPin, ChevronRight, Loader2, ChefHat, Rocket, Trophy } from 'lucide-react';
import Button from '../components/UI/Button';
import SelectionCard from '../components/UI/SelectionCard';
import { useAppContext } from '../app/context/AppContext';

const Onboarding = () => {
    const navigate = useNavigate();
    const { state } = useLocation(); // Get passed credentials
    const { completeOnboarding, registerUser, showToast, currentUser, checkEmail, updateUser } = useAppContext();
    const [step, setStep] = useState(0);
    const [userType, setUserType] = useState(null);
    const [formData, setFormData] = useState({
        name: state?.name || '',
        email: state?.email || '',
        password: state?.password || ''
    });
    const [isRegistering, setIsRegistering] = useState(false);

    // Effect to auto-fill if coming from Signup
    useEffect(() => {
        if (state?.fromSignup) {
            setFormData({
                name: state.name,
                email: state.email,
                password: state.password
            });
        }
    }, [state]);

    const handleTypeSelect = (type) => {
        setUserType(type);
    };

    const handleNext = async () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1 && userType) {
            // If already logged in, skip credentials. 
            // If from Signup (deferred), show credentials pre-filled (confirmation) OR skip?
            // User requested "registered only after entire onboarding".
            // So we proceed to Step 2 (Credentials/Review) -> Step 3 (Register)

            if (currentUser) {
                // Already authenticated (e.g. Google Login flow or existing session)
                // Persist the selected role
                const role = userType === 'gym' ? 'gym_owner' : userType === 'expert' ? 'trainer' : 'user';
                updateUser(currentUser.uid, { role });

                setStep(3);
                // Fake analysis time then success
                setTimeout(() => setStep(4), 3000);
            } else {
                setStep(2); // Go to verification/credentials input
            }

        } else if (step === 2) {
            if (!formData.email || !formData.password || !formData.name) {
                showToast("Identity Incomplete: All fields required.");
                return;
            }
            if (formData.password.length < 6) {
                showToast("Security Alert: Password must be at least 6 characters.");
                return;
            }
            if (!formData.email.includes('@')) {
                showToast("Invalid Email Protocol.");
                return;
            }
            // Check email before proceeding
            const exists = await checkEmail(formData.email);
            if (exists) {
                showToast("Email already linked to an account.");
                // Optional: Allow them to force login or just stop
                return;
            }

            // Move to Analysis Step to separate UI from Async Action
            setStep(3);

            // Trigger Registration here (The "Processing" Phase)
            setIsRegistering(true);
            try {
                // Determine Role
                const role = userType === 'gym' ? 'gym_owner' : userType === 'expert' ? 'trainer' : 'user';

                // Actual Registration Call
                const result = await registerUser(formData.email, formData.password, {
                    displayName: formData.name,
                    role
                });

                if (result.success) {
                    // Success! Wait for animation then go to Step 4
                    setTimeout(() => {
                        setStep(4);
                    }, 2000);
                } else if (result.code === 'auth/email-already-in-use') {
                    // Handle Duplicate: Redirect to Login
                    showToast("Account exists. Redirecting to Login...");
                    setTimeout(() => {
                        navigate('/auth', {
                            state: {
                                mode: 'login',
                                email: formData.email
                            }
                        });
                    }, 1500);
                } else {
                    // Other Failed (e.g. week password)
                    setStep(2); // Go back to credentials
                }
            } catch (e) {
                setStep(2);
            } finally {
                setIsRegistering(false);
            }

        } else if (step === 4) {
            completeOnboarding(userType);
            // Behavioral Refactor: ALL roads lead to the First Check-in.
            // No dashboards. No specific landing pages. Action first.
            navigate('/checkin/initial');
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
                            Next Step
                        </Button>
                    </div>
                </MotionDivPlaceholder>
            )}

            {step === 2 && (
                <MotionDivPlaceholder className="fade-in">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                        Credentials.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
                        Create your identity on the network.
                    </p>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <input
                            type="text"
                            placeholder="Codename / Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="iron-input-border"
                            style={{ width: '100%', padding: '16px', background: 'var(--surface-card)', color: 'var(--text-primary)' }}
                        />
                        <input
                            type="email"
                            placeholder="Email Priority Comms"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="iron-input-border"
                            style={{ width: '100%', padding: '16px', background: 'var(--surface-card)', color: 'var(--text-primary)' }}
                        />
                        <input
                            type="password"
                            placeholder="Security Key"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="iron-input-border"
                            style={{ width: '100%', padding: '16px', background: 'var(--surface-card)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <Button fullWidth variant="accent" onClick={handleNext} icon={ChevronRight}>
                            Initialize Protocol
                        </Button>
                    </div>
                </MotionDivPlaceholder>
            )}

            {step === 3 && (
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

            {step === 4 && (
                <div className="fade-in-scale" style={{ textAlign: 'center' }}>
                    <style>{`
                        @keyframes pulse-glow {
                            0% { box-shadow: 0 0 0 0 rgba(255, 77, 0, 0.4); }
                            70% { box-shadow: 0 0 0 20px rgba(255, 77, 0, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(255, 77, 0, 0); }
                        }
                        @keyframes reveal-text {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .fade-in-scale { animation: reveal-text 0.8s ease-out forwards; }
                        .shield-pulse { animation: pulse-glow 2s infinite; }
                    `}</style>

                    <div className="shield-pulse" style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto 40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255, 77, 0, 0.2), rgba(0,0,0,0))',
                        border: '2px solid var(--accent-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-orange)',
                        boxShadow: '0 0 40px rgba(255, 77, 0, 0.3)'
                    }}>
                        <Shield size={60} strokeWidth={1} fill="rgba(255,77,0,0.1)" />
                    </div>

                    <h1 className="title-display" style={{
                        fontSize: '3rem',
                        marginBottom: '16px',
                        background: 'linear-gradient(to right, #fff, #999)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        ACCESS GRANTED
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '40px',
                        padding: '0 20px',
                        fontSize: '1.2rem',
                        lineHeight: '1.6'
                    }}>
                        Welcome to the Forge.<br />
                        Your initial rank is <strong style={{ color: 'var(--accent-orange)' }}>IRON IV</strong>.
                    </p>

                    <div style={{ animation: 'reveal-text 0.8s ease-out 0.4s forwards', opacity: 0 }}>
                        <Button fullWidth variant="primary" onClick={handleNext}>
                            ENTER THE PULSE
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};

const MotionDivPlaceholder = ({ children, className }) => <div className={className}>{children}</div>;

export default Onboarding;
