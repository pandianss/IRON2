import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
    Mail, Lock, Smartphone, Globe, ArrowRight, Github,
    Check, Loader2, AlertCircle, Dumbbell
} from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { useSession, useUIFeedback } from '../app/context';

const AuthPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Session Context (Auth & Mode)
    const {
        login, loginWithGoogle, registerUser, checkEmail,
        AuthService, syncUserFromAuth, appMode
    } = useSession();

    // UI Feedback Context
    const { showToast } = useUIFeedback();

    const location = useLocation(); // Add useLocation import hook

    // Form States
    const [mode, setMode] = useState(location.state?.mode || 'login');
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState(null);

    // Initial Check for Magic Link Finish
    useEffect(() => {
        const checkMagicLink = async () => {
            if (searchParams.get('finish') === 'true') {
                setLoading(true);
                try {
                    const result = await AuthService.completeLoginLink(window.location.href);
                    if (result.error) {
                        showToast(result.error);
                        if (result.error.includes('provide email')) {
                            setMode('magic-link-confirm');
                        }
                    } else {
                        await syncUserFromAuth(result);
                        navigate('/');
                    }
                } catch (e) {
                    showToast("Link validation failed.");
                } finally {
                    setLoading(false);
                }
            }
        };
        checkMagicLink();
    }, [searchParams]);

    const handleGoogle = async () => {
        setLoading(true);
        const success = await loginWithGoogle();
        setLoading(false);
        if (success) navigate('/');
    };

    const handleEmailLogin = async () => {
        if (!email || !password) return showToast("Credentials missing");
        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        if (success) navigate('/');
    };

    const handleRegister = async () => {
        // Validation
        if (!email || !password || !name) {
            showToast("Missing Required Fields: Name, Email or Password.");
            return;
        }
        if (password.length < 6) {
            showToast("Security Alert: Password must be at least 6 characters.");
            return;
        }
        if (!email.includes('@')) {
            showToast("Invalid Email Protocol.");
            return;
        }

        if (!email.includes('@')) {
            showToast("Invalid Email Protocol.");
            return;
        }

        // Check if email exists
        setLoading(true);
        const exists = await checkEmail(email);
        setLoading(false);

        if (exists) {
            showToast("Account already exists. Please Login.");
            setMode('login'); // Switch to login mode automatically
            return;
        }

        // Defer Registration to Onboarding Process
        navigate('/onboarding', {
            state: {
                email,
                password,
                name,
                fromSignup: true
            }
        });
    };

    const handlePhoneRequest = async () => {
        if (!phone) return showToast("Phone Number required");
        setLoading(true);
        try {
            const verifier = AuthService.setupRecaptcha('recaptcha-container');
            const confirmation = await AuthService.loginWithPhone(phone, verifier);
            setVerificationId(confirmation);
            showToast("OTP Sent!");
        } catch (e) {
            showToast("SMS Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || !verificationId) return;
        setLoading(true);
        try {
            const result = await verificationId.confirm(otp);
            await syncUserFromAuth(result.user);
            navigate('/');
        } catch (e) {
            showToast("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async () => {
        if (!email) return showToast("Email required");
        setLoading(true);
        try {
            await AuthService.sendLoginLink(email);
            showToast("Check your email for the magic link.");
        } catch (e) {
            showToast("Failed to send link");
        } finally {
            setLoading(false);
        }
    };

    // Demo Login Handler
    const handleDemoLogin = async (persona) => {
        setLoading(true);
        // Map persona to mock credentials
        const credentials = {
            enthusiast: { email: 'demo@iron.com', password: 'password' },
            partner: { email: 'owner@iron.com', password: 'password' },
            trainer: { email: 'trainer@iron.com', password: 'password' },
            admin: { email: 'admin@iron.com', password: 'password' }
        };
        const { email, password } = credentials[persona];
        const success = await login(email, password);
        setLoading(false);
        if (success) navigate('/');
    };



    // --- LIVE MODE UI ---
    return (
        <div className="page-container" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="title-display" style={{ fontSize: '3rem', fontStyle: 'italic' }}>
                    IRON<span style={{ color: 'var(--accent-orange)' }}>.</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>AUTHENTICATION PROTOCOL</p>
            </div>

            <Card className="glass-panel" style={{ padding: '32px' }}>
                {/* Mode Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
                    <Tab active={mode === 'login'} onClick={() => setMode('login')}>LOGIN</Tab>
                    <Tab active={mode === 'register'} onClick={() => setMode('register')}>JOIN</Tab>
                    <Tab active={mode === 'phone'} onClick={() => setMode('phone')}>PHONE</Tab>
                </div>

                {/* Google Button - Always Visible exception Register/Phone specific flows */}
                {mode !== 'phone' && (
                    <Button variant="secondary" fullWidth icon={Globe} onClick={handleGoogle}>
                        Continue with Google
                    </Button>
                )}

                {(mode === 'login' || mode === 'register') && (
                    <form onSubmit={(e) => { e.preventDefault(); mode === 'login' ? handleEmailLogin() : handleRegister(); }} style={{ display: 'grid', gap: '16px' }}>
                        {mode === 'register' && (
                            <Input
                                icon={Check}
                                placeholder="Display Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        )}
                        <Input
                            icon={Mail}
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <Button type="submit" variant="accent" fullWidth disabled={loading}>
                            {loading && <Loader2 className="animate-spin" size={16} />}
                            {mode === 'login' ? 'ENTER THE FORGE' : 'INITIATE REGISTRATION'}
                        </Button>

                        {mode === 'login' && (
                            <div
                                onClick={() => setMode('magic-link')}
                                style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '8px' }}
                            >
                                Forgot Password? Use <span style={{ color: 'var(--accent-orange)' }}>Magic Link</span>
                            </div>
                        )}
                    </form>
                )}

                {mode === 'magic-link' && (
                    <form onSubmit={(e) => { e.preventDefault(); handleMagicLink(); }} style={{ display: 'grid', gap: '16px' }}>
                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            We will send a secure entry link to your inbox.
                        </p>
                        <Input
                            icon={Mail}
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Button type="submit" variant="accent" fullWidth disabled={loading}>
                            {loading ? 'SENDING...' : 'SEND LINK'}
                        </Button>
                        <Button variant="ghost" fullWidth onClick={() => setMode('login')}>Return</Button>
                    </form>
                )}

                {mode === 'phone' && (
                    <form onSubmit={(e) => { e.preventDefault(); !verificationId ? handlePhoneRequest() : handleVerifyOtp(); }} style={{ display: 'grid', gap: '16px' }}>
                        {!verificationId ? (
                            <>
                                <Input
                                    icon={Smartphone}
                                    placeholder="+1 555-0123"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                                <div id="recaptcha-container"></div>
                                <Button type="submit" variant="accent" fullWidth disabled={loading}>
                                    {loading ? 'SENDING...' : 'SEND CODE'}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Input
                                    icon={Lock}
                                    placeholder="123456"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                />
                                <Button type="submit" variant="accent" fullWidth disabled={loading}>
                                    {loading ? 'VERIFYING...' : 'VERIFY & ENTER'}
                                </Button>
                            </>
                        )}
                    </form>
                )}

            </Card >
        </div >
    );
};

// UI Components
const Input = ({ icon: Icon, ...props }) => (
    <div style={{ position: 'relative' }}>
        <Icon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
            className="iron-input-border"
            style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)'
            }}
            {...props}
        />
    </div>
);

const Tab = ({ active, children, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '700',
            background: active ? 'var(--accent-orange)' : 'transparent',
            color: active ? '#000' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
    >
        {children}
    </div>
);

export default AuthPage;
