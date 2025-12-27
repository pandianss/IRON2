import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import RankingItem from '../components/UI/RankingItem';
import { Sword, Zap, Filter, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Arena = () => {
    const { showToast } = useAppContext();
    const [activeTab, setActiveTab] = useState('GLOBAL'); // This state is added but not used in the provided snippet, keeping it as per diff.

    const handleInitiateDuel = () => {
        showToast("Matchmaking initiated...");
    };

    // Assuming handleAction is a placeholder for actions related to the new buttons
    const handleAction = (message) => {
        showToast(message);
    };

    const leaderboards = [
        { rank: 1, userName: "Iron Titan", value: "14,800 XP", trend: 'neutral', badge: "Platinum" },
        { rank: 2, userName: "Sprint King", value: "12,450 XP", trend: 'up', badge: "Gold" },
        { rank: 3, userName: "Power Haus", value: "11,200 XP", trend: 'down', badge: "Gold" },
        { rank: 17, userName: "Marcus V.", value: "4,200 XP", trend: 'up', isUser: true, badge: "Silver" },
        { rank: 18, userName: "Lifting Legend", value: "4,150 XP", trend: 'neutral', badge: "Silver" }
    ];

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
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                            No active challenges. Nudge a friend to start a 24-hour calorie battle.
                        </p>
                        <Button fullWidth variant="accent" icon={Zap} onClick={handleInitiateDuel}>
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
        </div>
    );
};

export default Arena;
