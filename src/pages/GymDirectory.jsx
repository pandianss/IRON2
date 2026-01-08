import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { MapPin, MessageSquare, Star, ArrowRight, PenTool } from 'lucide-react';
import StarRating from '../components/UI/StarRating';
import ReviewModal from '../components/UI/ReviewModal';


const GymDirectory = () => {
    const { gyms, sendEnquiry, showToast, getRatingStats, addRating } = useAppContext();
    const [message, setMessage] = useState('');
    const [selectedGym, setSelectedGym] = useState(null);
    const [reviewTarget, setReviewTarget] = useState(null);


    const handleSend = () => {
        if (!message.trim()) return;
        sendEnquiry('currentUser', selectedGym.id, message);
        showToast("Request Sent!");
        setMessage('');
        setSelectedGym(null);
    };

    const handleAction = (gym, type) => {
        setSelectedGym(gym);
        if (type === 'join') setMessage("I'm interested in a membership. Please share details.");
        if (type === 'visit') setMessage("I'd like to book a visit/trial.");
    };

    const handleSubmitReview = async (rating, comment) => {
        if (reviewTarget) {
            await addRating(reviewTarget.id, rating, comment);
            setReviewTarget(null);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className="title-display">GYM DIRECTORY</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Find your forge.</p>
            </header>

            <div style={{ display: 'grid', gap: '16px' }}>
                {gyms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border-glass)', borderRadius: '16px' }}>
                        <MapPin size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>SECTOR CLEAR</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>No Forges detected in range. <br />Establish your own legacy.</p>
                        <Button variant="outline" style={{ marginTop: '24px' }}>Register New Forge</Button>
                    </div>
                ) : (
                    gyms.map(gym => (
                        <Card key={gym.id} className="glass-panel">
                            {/* ... existing card content ... */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>{gym.name}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <MapPin size={14} />
                                        {gym.location}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                        <StarRating rating={getRatingStats(gym.id).average} size={12} />
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', marginLeft: '4px' }}>
                                            {getRatingStats(gym.id).average || 'New'}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setReviewTarget(gym)} style={{ padding: '4px' }}>
                                        <PenTool size={14} />
                                    </Button>
                                </div>
                            </div>

                            {selectedGym?.id === gym.id ? (
                                <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Message {gym.name}:</p>
                                    <textarea
                                        className="iron-input-border"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Ask about membership, facilities..."
                                        style={{ width: '100%', minHeight: '80px', marginBottom: '12px', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '12px', borderRadius: '8px' }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button variant="accent" onClick={handleSend} fullWidth>
                                            Send Message
                                        </Button>
                                        <Button variant="ghost" onClick={() => setSelectedGym(null)} fullWidth>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button variant="accent" style={{ flex: 1 }} onClick={() => handleAction(gym, 'join')}>
                                        JOIN NOW
                                    </Button>
                                    <Button variant="secondary" style={{ flex: 1 }} onClick={() => handleAction(gym, 'visit')}>
                                        BOOK VISIT
                                    </Button>
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <ReviewModal
                isOpen={!!reviewTarget}
                onClose={() => setReviewTarget(null)}
                targetName={reviewTarget?.name}
                onSubmit={handleSubmitReview}
            />
        </div >
    );
};

export default GymDirectory;
