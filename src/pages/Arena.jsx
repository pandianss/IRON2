import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import RankingItem from '../components/UI/RankingItem';
import { Sword, Zap, Filter, Trophy } from 'lucide-react';
import { useData, useUIFeedback, useSession } from '../app/context';

const Arena = () => {
    const { showToast } = useUIFeedback();
    const { challenges, createChallenge, users } = useData();
    const { currentUser } = useSession();
    const [activeTab, setActiveTab] = useState('GLOBAL');
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [challengeForm, setChallengeForm] = useState({ title: '', targetId: '', stake: 50 });

    const handleCreateChallenge = () => {
        if (!challengeForm.title || !challengeForm.targetId) {
            showToast("Fill all fields");
            return;
        }
        const targetUser = users.find(u => u.id === challengeForm.targetId);
        createChallenge({
            challenger: { id: currentUser?.id || 'demo_user', name: currentUser?.displayName || 'User' },
            target: { id: targetUser.id, name: targetUser.displayName },
            title: challengeForm.title,
            stake: challengeForm.stake
        });
        setShowChallengeModal(false);
        setChallengeForm({ title: '', targetId: '', stake: 50 });
    };

    // Assuming handleAction is a placeholder for actions related to the new buttons
    const handleAction = (message) => {
        showToast(message);
    };

    // Compute real leaderboard from users data
    const leaderboards = users
        .slice() // Copy to avoid mutating context
        .sort((a, b) => (b.xp || 0) - (a.xp || 0)) // Sort by XP descending
        .slice(0, 10) // Top 10
        .map((user, index) => ({
            rank: index + 1,
            userName: user.displayName || 'Unknown',
            value: `${(user.xp || 0).toLocaleString()} XP`,
            trend: 'neutral', // Future: Calculate trend based on history
            badge: index === 0 ? 'Platinum' : index < 3 ? 'Gold' : 'Silver',
            isUser: user.id === currentUser?.id
        }));

    // If current user is not in top 10, maybe we should append them? (Optional, but good for UX)
    // For V1 let's stick to Top 10 lists.

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>The Arena</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        ASCEND THE LADDER. PROVE YOUR RANK.
                    </p>
                </div>
                <div className="icon-box icon-box-muted" style={{ width: '44px', height: '44px' }}>
                    <Filter size={20} />
                </div>
            </header>

            {/* Active Duel Action */}
            <section style={{ marginBottom: '40px' }}>
                <Card noPadding className="glass-panel" style={{
                    background: 'linear-gradient(135deg, rgba(255, 77, 0, 0.2) 0%, transparent 100%)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <Sword color="var(--accent-orange)" size={24} />
                            <h3 className="title-display" style={{ fontSize: '1.25rem' }}>ACTIVE DUELS</h3>
                        </div>

                        {challenges.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                {challenges.map(c => (
                                    <div key={c.id} style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{c.title}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-orange)' }}>{c.stake} XP</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            <span>vs {c.target.name}</span>
                                            <span style={{ textTransform: 'uppercase', color: c.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)' }}>{c.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                                No active challenges. Nudge a friend to start a 24-hour calorie battle.
                            </p>
                        )}

                        <Button fullWidth variant="accent" icon={Zap} onClick={() => setShowChallengeModal(true)}>
                            Initiate Duel
                        </Button>
                    </div>
                </Card>
            </section>

            <h3 className="section-label">GLOBAL RANKINGS</h3>

            <Card noPadding className="glass-panel" style={{ background: 'transparent', border: 'none' }}>
                {leaderboards.map((item, idx) => (
                    <RankingItem key={idx} {...item} />
                ))}
            </Card>

            <div style={{ marginTop: '32px' }}>
                <Button fullWidth variant="secondary" onClick={() => showToast("Full leaderboard syncing...")}>
                    View Full Leaderboard
                </Button>
            </div>
            {showChallengeModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Card className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '24px', border: '1px solid var(--accent-orange)' }}>
                        <h3 className="title-display" style={{ marginBottom: '16px' }}>NEW CHALLENGE</h3>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>CHALLENGE</label>
                            <input
                                type="text"
                                className="iron-input-border"
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', color: '#fff' }}
                                placeholder="e.g. 50 Burpees"
                                value={challengeForm.title}
                                onChange={e => setChallengeForm({ ...challengeForm, title: e.target.value })}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>OPPONENT</label>
                            <select
                                className="iron-input-border"
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', color: '#fff' }}
                                value={challengeForm.targetId}
                                onChange={e => setChallengeForm({ ...challengeForm, targetId: e.target.value })}
                            >
                                <option value="">Select Rival</option>
                                {users.filter(u => u.id !== currentUser?.id).map(u => (
                                    <option key={u.id} value={u.id}>{u.displayName}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Button fullWidth variant="ghost" onClick={() => setShowChallengeModal(false)}>CANCEL</Button>
                            <Button fullWidth variant="accent" onClick={handleCreateChallenge}>SEND</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Arena;
