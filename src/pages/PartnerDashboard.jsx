import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Users, Activity, DollarSign, Scan, Settings, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PartnerDashboard = () => {
    const { showToast } = useAppContext();

    const handleScan = () => {
        showToast("Scanning member ID...");
        setTimeout(() => showToast("Access Granted: Marcus V."), 1500);
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Command</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        FACILITY OVERSIGHT & ACCESS CONTROL.
                    </p>
                </div>
                <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                    <Activity size={20} />
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="stat-grid" style={{ marginBottom: '32px' }}>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <Users size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>LIVE</span>
                        </div>
                        <div className="stat-value">
                            48 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/ 120</span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <TrendingUp size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>TRAFFIC</span>
                        </div>
                        <div className="stat-value">
                            High <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>+12%</span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <DollarSign size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>REVENUE</span>
                        </div>
                        <div className="stat-value">
                            ₹2.4L <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>MTD</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Action: Scanner */}
            <section style={{ marginBottom: '40px' }}>
                <Card className="glass-panel" style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--accent-orange)' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(255, 77, 0, 0.1)',
                            border: '1px solid var(--accent-orange)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 0 30px rgba(255, 77, 0, 0.2)'
                        }}>
                            <Scan size={32} color="var(--accent-orange)" />
                        </div>
                        <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>VERIFY MEMBER</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Scan QR code to verify membership status and log entry.
                        </p>
                    </div>
                    <Button fullWidth variant="primary" onClick={handleScan} icon={Scan}>
                        Activate Scanner
                    </Button>
                </Card>
            </section>

            {/* Recent Check-ins */}
            <section>
                <h3 className="section-label">RECENT ARRIVALS</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                    {[
                        { name: "Marcus V.", time: "2m ago", status: "Active", rank: "IRON IV" },
                        { name: "Sarah J.", time: "5m ago", status: "Active", rank: "IRON II" },
                        { name: "Mike T.", time: "12m ago", status: "Expired", rank: "NON-IRON" }
                    ].map((member, idx) => (
                        <div key={idx} className="list-item-standard" style={{
                            background: 'rgba(255,255,255,0.02)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: '#111',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '700', fontSize: '0.95rem', display: 'block' }}>{member.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.rank}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    color: member.status === 'Active' ? 'var(--accent-green)' : 'var(--rust-primary)',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    marginBottom: '4px'
                                }}>
                                    {member.status}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PartnerDashboard;
