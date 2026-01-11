import React from 'react';
import { Radio, Video, FileText, TrendingUp } from 'lucide-react';
import Card from '../../../components/UI/Card';
import { useData } from '../../../app/context/DataContext';

const OverviewView = ({ handleAction }) => {
    const { revenueStats, members, feedActivities } = useData();

    // Calculate dynamic stats
    const totalRevenue = revenueStats?.total || 0;
    const memberCount = members?.length || 0;

    // Simple Engagement: Avg likes per post (mock logic for now using real feed data)
    const totalLikes = feedActivities?.reduce((acc, curr) => acc + (curr.likes || 0), 0) || 0;
    const engagementRate = feedActivities?.length ? ((totalLikes / feedActivities.length) * 10).toFixed(1) : '0.0';

    return (
        <div className="fade-in">
            {/* Quick Stats */}
            <div className="stat-grid" style={{ marginBottom: '32px' }}>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <span className="stat-label">REVENUE</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>
                                <TrendingUp size={12} /> +12%
                            </span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <span className="stat-label">MEMBERS</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="stat-value">{memberCount}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>
                                <TrendingUp size={12} /> +2
                            </span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <span className="stat-label">ENGAGEMENT</span>
                        <span className="stat-value" style={{ color: 'var(--accent-green)' }}>{engagementRate}%</span>
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
};

export default OverviewView;
