import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Plus, Save, Play, Users, BarChart3, ChevronRight, Video, FileText, Radio, Mic, Eye, ThumbsUp, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const OverviewTab = ({ handleAction }) => (
    <div className="fade-in">
        {/* Quick Stats */}
        <div className="stat-grid" style={{ marginBottom: '32px' }}>
            <Card noPadding className="glass-panel">
                <div className="stat-card-inner">
                    <span className="stat-label">REVENUE</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="stat-value">₹1.2L</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>
                            <TrendingUp size={12} /> +12%
                        </span>
                    </div>
                </div>
            </Card>
            <Card noPadding className="glass-panel">
                <div className="stat-card-inner">
                    <span className="stat-label">FOLLOWERS</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="stat-value">8.5k</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>
                            <TrendingUp size={12} /> +54
                        </span>
                    </div>
                </div>
            </Card>
            <Card noPadding className="glass-panel">
                <div className="stat-card-inner">
                    <span className="stat-label">ENGAGEMENT</span>
                    <span className="stat-value" style={{ color: 'var(--accent-green)' }}>4.9%</span>
                </div>
            </Card>
        </div>

        {/* Creator Actions */}
        <section style={{ marginBottom: '32px' }}>
            <h3 className="section-label">QUICK ACTIONS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <Card className="glass-panel" noPadding onClick={() => handleAction('Go Live')} style={{ padding: '20px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--accent-orange)' }}>
                    <Radio size={24} color="var(--accent-orange)" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '700' }}>GO LIVE</h4>
                </Card>
                <Card className="glass-panel" noPadding onClick={() => handleAction('Upload Video')} style={{ padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                    <Video size={24} color="#fff" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '700' }}>UPLOAD</h4>
                </Card>
                <Card className="glass-panel" noPadding onClick={() => handleAction('Write Article')} style={{ padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                    <FileText size={24} color="#fff" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '700' }}>WRITE</h4>
                </Card>
            </div>
        </section>
    </div>
);

const ContentTab = ({ contentList }) => (
    <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="section-label">MY LIBRARY</h3>
            <Button variant="ghost" icon={Plus} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>New</Button>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
            {contentList.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            width: '48px', height: '48px',
                            background: item.type === 'video' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 77, 0, 0.1)',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {item.type === 'video' ? <Video size={20} color="var(--accent-blue)" /> : <FileText size={20} color="var(--accent-orange)" />}
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h4>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {item.views}</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '4px',
                        background: item.status === 'Published' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        color: item.status === 'Published' ? 'var(--accent-green)' : 'var(--text-muted)'
                    }}>
                        {item.status.toUpperCase()}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const RoutinesTab = ({ routineName, setRoutineName, exercises, addExercise }) => (
    <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="section-label">ROUTINE ARCHITECT</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="ghost" style={{ padding: '4px' }}><Save size={20} /></Button>
                <Button variant="ghost" style={{ padding: '4px' }}><Play size={20} color="var(--accent-orange)" /></Button>
            </div>
        </div>

        <Card className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
            <input
                className="iron-input-border title-display"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                style={{ fontSize: '1.5rem', marginBottom: '24px' }}
            />

            <div style={{ display: 'grid', gap: '12px' }}>
                {exercises.map((ex) => (
                    <div key={ex.id} className="list-item-standard" style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-glass)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: '700', fontSize: '1rem', display: 'block' }}>{ex.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {ex.sets} SETS • {ex.reps} REPS • RPE {ex.rpe}
                            </span>
                        </div>
                        <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '24px' }}>
                <Button fullWidth variant="secondary" icon={Plus} onClick={addExercise}>
                    Add Exercise
                </Button>
            </div>
        </Card>
    </div>
);

const LiveStudio = ({ onEndSession }) => {
    const [viewers, setViewers] = useState(0);
    const [isLive, setIsLive] = useState(false);
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);
    const [cameraError, setCameraError] = useState(null);

    React.useEffect(() => {
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

    React.useEffect(() => {
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
            // In a real app, here we would connect to a WebRTC server or RTMP ingest
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

const ExpertStudio = () => {
    const { showToast, studioContent, addStudioContent, studioExercises, addStudioExercise, studioRoutineName, setStudioRoutineName, currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState('overview');

    // Access Control
    if (currentUser?.role !== 'expert' && currentUser?.role !== 'gym_owner' && currentUser?.role !== 'super_admin') {
        return (
            <div className="page-container fade-in" style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="icon-box icon-box-muted" style={{ width: '80px', height: '80px', marginBottom: '24px' }}>
                    <BarChart3 size={40} color="var(--accent-orange)" />
                </div>
                <h1 className="title-display" style={{ fontSize: '2rem', marginBottom: '16px' }}>IRON STUDIO</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '300px' }}>
                    Unlock creator tools, track analytics, and monetize your expertise.
                </p>
                <Button variant="accent" onClick={() => showToast("Request sent to Admin")}>
                    BECOME A CREATOR
                </Button>
            </div>
        );
    }

    const addExercise = () => {
        const id = studioExercises.length + 1;
        addStudioExercise({ id, name: "New Exercise", sets: 3, reps: "10", rpe: 7 });
    };

    const handleAction = (action) => {
        if (action === 'Go Live') {
            setActiveTab('live');
        } else {
            showToast(`${action} initiated`);
        }
    };

    const handleUpload = () => {
        showToast("Uploading 'New_Content.mp4'...");
        setTimeout(() => {
            addStudioContent({ id: Date.now(), title: "New_Content.mp4", type: 'video', views: '-', date: 'Just now', status: 'Processing' });
            showToast("Upload Complete");
        }, 1500);
    };

    if (activeTab === 'live') {
        return <LiveStudio onEndSession={() => setActiveTab('overview')} />;
    }

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <header className="page-header" style={{ marginBottom: '24px' }}>
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>STUDIO</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        CREATOR DASHBOARD
                    </p>
                </div>
                <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                    <BarChart3 size={20} />
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={{
                display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)',
                padding: '4px', borderRadius: '12px', marginBottom: '24px'
            }}>
                {['overview', 'content', 'routines'].map(tab => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: activeTab === tab ? 'var(--accent-orange)' : 'transparent',
                            color: activeTab === tab ? '#000' : 'var(--text-muted)',
                            textTransform: 'uppercase'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Content Area */}
            {activeTab === 'overview' && <OverviewTab handleAction={handleAction} />}
            {activeTab === 'content' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 className="section-label">MY LIBRARY</h3>
                        <Button variant="ghost" icon={Plus} onClick={handleUpload} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>New</Button>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        {studioContent.map(item => (
                            <div key={item.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px', height: '48px',
                                        background: item.type === 'video' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 77, 0, 0.1)',
                                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {item.type === 'video' ? <Video size={20} color="var(--accent-blue)" /> : <FileText size={20} color="var(--accent-orange)" />}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h4>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {item.views}</span>
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '4px',
                                    background: item.status === 'Published' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                                    color: (item.status === 'Published' || item.status === 'Processing') ? 'var(--accent-green)' : 'var(--text-muted)'
                                }}>
                                    {item.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'routines' && (
                <RoutinesTab
                    routineName={studioRoutineName}
                    setRoutineName={setStudioRoutineName}
                    exercises={studioExercises}
                    addExercise={addExercise}
                />
            )}

        </div>
    );
};

export default ExpertStudio;
