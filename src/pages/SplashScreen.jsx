import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, Globe } from 'lucide-react';
import Button from '../components/UI/Button';
import { useAppContext } from '../context/AppContext';

const SplashScreen = () => {
    const navigate = useNavigate();
    const { setAppMode } = useAppContext();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleModeSelect = (mode) => {
        setAppMode(mode);
        if (mode === 'live') {
            navigate('/auth');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="splash-container" style={{
            height: '100vh',
            width: '100vw',
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-20%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(255,77,0,0.15) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />

            <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                <div className={`fade-in-scale ${animate ? 'visible' : ''}`} style={{ marginBottom: '60px' }}>
                    <h1 className="title-display" style={{
                        fontSize: '5rem',
                        fontStyle: 'italic',
                        lineHeight: 0.8,
                        marginBottom: '16px'
                    }}>
                        IRON<span style={{ color: 'var(--accent-orange)' }}>.</span>
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        letterSpacing: '4px',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase'
                    }}>
                        The Forge Awaits
                    </p>
                </div>

                <div className="fade-in" style={{
                    display: 'grid',
                    gap: '20px',
                    opacity: animate ? 1 : 0,
                    transition: 'opacity 1s ease 0.5s'
                }}>
                    {/* Live Mode Option */}
                    <div
                        onClick={() => handleModeSelect('live')}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            transition: 'all 0.3s ease'
                        }}
                        className="mode-card"
                    >
                        <div style={{
                            background: 'rgba(255, 77, 0, 0.1)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-orange)'
                        }}>
                            <Globe size={24} />
                        </div>
                        <div style={{ textAlign: 'left', flex: 1 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px', color: '#fff' }}>LIVE PROTOCOL</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Connect to the global network. Real data. Real competition.
                            </p>
                        </div>
                        <Lock size={16} color="var(--text-muted)" />
                    </div>

                    {/* Demo Mode Option */}
                    <div
                        onClick={() => handleModeSelect('demo')}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            transition: 'all 0.3s ease'
                        }}
                        className="mode-card"
                    >
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                        }}>
                            <Zap size={24} />
                        </div>
                        <div style={{ textAlign: 'left', flex: 1 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px', color: '#fff' }}>DEMO SIMULATION</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Enter a simulated environment. Mock data. Zero risk.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .mode-card:hover {
                    background: rgba(255,255,255,0.08) !important;
                    border-color: rgba(255,255,255,0.3) !important;
                    transform: translateY(-2px);
                }
                .fade-in-scale {
                    opacity: 0;
                    transform: scale(0.9);
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .fade-in-scale.visible {
                    opacity: 1;
                    transform: scale(1);
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
