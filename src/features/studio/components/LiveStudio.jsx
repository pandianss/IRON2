import React, { useState, useRef, useEffect } from 'react';
import { Video, Users } from 'lucide-react';
import Button from '../../../components/UI/Button';

const LiveStudio = ({ onEndSession }) => {
    const [viewers, setViewers] = useState(0);
    const [isLive, setIsLive] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [cameraError, setCameraError] = useState(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setCameraError(null);
            } catch (err) {
                console.error("Camera Access Error:", err);
                setCameraError("Camera access denied or unavailable.");
            }
        };

        startCamera();

        return () => {
            // Cleanup tracks on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        let interval;
        if (isLive) {
            interval = setInterval(() => {
                setViewers(prev => prev + Math.floor(Math.random() * 5));
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isLive]);

    const handleToggleLive = () => {
        if (!isLive) {
            setIsLive(true);
        } else {
            setIsLive(false);
        }
    };

    return (
        <div className="fade-in page-container" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, background: '#000', borderRadius: '16px', position: 'relative', overflow: 'hidden', border: '1px solid #333' }}>
                {/* Real Camera Feed */}
                {cameraError ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'red', flexDirection: 'column' }}>
                        <Video size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>{cameraError}</p>
                        <Button variant="ghost" onClick={() => window.location.reload()} style={{ marginTop: '16px' }}>Retry</Button>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                )}

                {/* Overlays */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 12px', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLive ? 'red' : '#666' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{isLive ? 'LIVE' : 'PREVIEW'}</span>
                </div>

                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                    <div style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} /> {viewers}
                    </div>
                </div>

                {isLive && (
                    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                        <div className="pulse-circle" style={{ width: '12px', height: '12px', background: 'red', borderRadius: '50%' }}></div>
                        <span style={{ fontWeight: '900', color: 'red', textShadow: '0 0 10px red' }}>ON AIR</span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Button variant="secondary" onClick={onEndSession}>CANCEL</Button>
                <Button
                    variant={isLive ? "outline" : "primary"}
                    style={isLive ? { borderColor: 'red', color: 'red' } : {}}
                    onClick={handleToggleLive}
                >
                    {isLive ? "END STREAM" : "GO LIVE"}
                </Button>
            </div>
        </div>
    );
};

export default LiveStudio;
