import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import RankingItem from '../components/UI/RankingItem';
import { Sword, Zap, Filter } from 'lucide-react';

const Arena = () => {
    const leaderboards = [
        { rank: 1, userName: "Iron Titan", value: "14,800 XP", trend: 'neutral', badge: "Platinum" },
        { rank: 2, userName: "Sprint King", value: "12,450 XP", trend: 'up', badge: "Gold" },
        { rank: 3, userName: "Power Haus", value: "11,200 XP", trend: 'down', badge: "Gold" },
        { rank: 17, userName: "Marcus V.", value: "4,200 XP", trend: 'up', isUser: true, badge: "Silver" },
        { rank: 18, userName: "Lifting Legend", value: "4,150 XP", trend: 'neutral', badge: "Silver" }
    ];

    return (
        <div style={{ paddingBottom: '100px' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>The Arena</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        ASCEND THE LADDER. PROVE YOUR RANK.
                    </p>
                </div>
                <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)'
                }}>
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
                        <Button fullWidth variant="accent" icon={Zap}>
                            Initiate Duel
                        </Button>
                    </div>
                </Card>
            </section>

            <h3 className="title-display" style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                letterSpacing: '1px'
            }}>
                GLOBAL RANKINGS
            </h3>

            <Card noPadding className="glass-panel" style={{ background: 'transparent', border: 'none' }}>
                {leaderboards.map((item, idx) => (
                    <RankingItem key={idx} {...item} />
                ))}
            </Card>

            <div style={{ marginTop: '32px' }}>
                <Button fullWidth variant="secondary">View Full Leaderboard</Button>
            </div>
        </div>
    );
};

export default Arena;
