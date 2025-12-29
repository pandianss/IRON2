import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { MapPin, MessageSquare, Star, ArrowRight } from 'lucide-react';

const GymDirectory = () => {
    const { gyms, sendEnquiry, showToast } = useAppContext();
    const [message, setMessage] = useState('');
    const [selectedGym, setSelectedGym] = useState(null);

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

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className="title-display">GYM DIRECTORY</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Find your forge.</p>
            </header>

            <div style={{ display: 'grid', gap: '16px' }}>
                {gyms.map(gym => (
                    <Card key={gym.id} className="glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>{gym.name}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <MapPin size={14} />
                                    {gym.location}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                <Star size={12} fill="var(--accent-orange)" color="var(--accent-orange)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>4.9</span>
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
                ))}
            </div>
        </div>
    );
};

export default GymDirectory;
