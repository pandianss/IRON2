import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import { useSession, useUIFeedback, useData } from '../../../app/context';

import OverviewView from '../components/OverviewView';
import ContentLibrary from '../components/ContentLibrary';
import RoutineArchitect from '../components/RoutineArchitect';
import LiveStudio from '../components/LiveStudio';

const StudioPage = ({ isEmbedded }) => {
    const { currentUser } = useSession();
    const { showToast } = useUIFeedback();
    const {
        studioContent,
        addStudioContent,
        studioExercises,
        addStudioExercise,
        studioRoutineName,
        setStudioRoutineName
    } = useData();
    const [activeTab, setActiveTab] = useState('overview');

    // Access Control
    if (currentUser?.role !== 'expert' && currentUser?.role !== 'gym_owner' && currentUser?.role !== 'super_admin') {
        const [showCertUpload, setShowCertUpload] = useState(false);

        // State 2: Application Submitted / Pending
        if (currentUser?.expertStatus === 'pending') {
            return (
                <div className={isEmbedded ? "fade-in" : "page-container fade-in"} style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div className="icon-box icon-box-warning" style={{ width: '80px', height: '80px', marginBottom: '24px', background: 'rgba(255, 165, 0, 0.1)', color: 'orange' }}>
                        <BarChart3 size={40} />
                    </div>
                    <h1 className="title-display" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>UNDER REVIEW</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '300px' }}>
                        Your application is currently being reviewed by our administrators. You will be notified once approved.
                    </p>
                    <Button variant="secondary" onClick={() => showToast("We'll email you soon.")}>
                        CHECK STATUS
                    </Button>
                </div>
            );
        }

        // State 3: Applying
        if (showCertUpload) {
            return (
                <div className={isEmbedded ? "" : "page-container"} style={{ paddingBottom: '100px' }}>
                    <CertificationsView onBack={() => setShowCertUpload(false)} />
                </div>
            );
        }

        // State 1: Not an Expert (Splash)
        return (
            <div className={isEmbedded ? "fade-in" : "page-container fade-in"} style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="icon-box icon-box-muted" style={{ width: '80px', height: '80px', marginBottom: '24px' }}>
                    <BarChart3 size={40} color="var(--accent-orange)" />
                </div>
                <h1 className="title-display" style={{ fontSize: '2rem', marginBottom: '16px' }}>IRON STUDIO</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '300px' }}>
                    Unlock creator tools, track analytics, and monetize your expertise.
                </p>
                <Button variant="accent" onClick={() => setShowCertUpload(true)}>
                    START APPLICATION
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
        <div className={isEmbedded ? "" : "page-container"} style={{ paddingBottom: '100px' }}>
            {!isEmbedded && (
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
            )}

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
            {activeTab === 'overview' && <OverviewView handleAction={handleAction} />}
            {activeTab === 'content' && <ContentLibrary contentList={studioContent} onUpload={handleUpload} />}
            {activeTab === 'routines' && (
                <RoutineArchitect
                    routineName={studioRoutineName}
                    setRoutineName={setStudioRoutineName}
                    exercises={studioExercises}
                    addExercise={addExercise}
                />
            )}

        </div>
    );
};

export default StudioPage;
