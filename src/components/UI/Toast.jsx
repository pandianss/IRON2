import React from 'react';
import { Share2, AlertCircle, CheckCircle } from 'lucide-react';
import { useUIFeedback } from '../../app/context';

const Toast = () => {
    const { toast } = useUIFeedback();

    if (!toast) return null;

    const message = toast.message || toast;
    const type = toast.type || 'info';
    const exiting = toast.exiting;

    // HERO VARIANT (Center, Energetic)
    if (type === 'hero') {
        return (
            <div className={exiting ? "animate-pop-out" : "animate-pop-in"} style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none' // allow clicks through surrounding area if needed, but maybe not for hero
            }}>
                <div className="animate-pop-in" style={{
                    background: 'var(--accent-orange)',
                    color: '#000',
                    padding: '40px 60px',
                    borderRadius: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: '0 0 100px rgba(255, 77, 0, 0.4), 0 20px 40px rgba(0,0,0,0.4)',
                    border: '4px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <CheckCircle size={64} strokeWidth={3} color="#000" />
                    <span style={{
                        fontSize: '2rem',
                        fontWeight: '900',
                        fontFamily: 'var(--font-display)',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {message}
                    </span>
                </div>
            </div>
        );
    }

    // STANDARD VARIANT
    const isError = message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') || message.toLowerCase().includes('wrong') || message.toLowerCase().includes('not registered');
    const isSuccess = message.toLowerCase().includes('success') || message.toLowerCase().includes('welcome') || message.toLowerCase().includes('logged');

    return (
        <div className="fade-in" style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isError ? '#ef4444' : (isSuccess ? '#22c55e' : 'var(--accent-orange)'),
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '900',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-display)',
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.2)'
        }}>
            {isError ? <AlertCircle size={18} /> : (isSuccess ? <CheckCircle size={18} /> : <Share2 size={18} />)}
            {message.toUpperCase()}
        </div>
    );
};

export default Toast;
