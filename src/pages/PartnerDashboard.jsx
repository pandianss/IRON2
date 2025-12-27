import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Users, Activity, DollarSign, Scan, Settings, TrendingUp, Plus, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PlanCreator from '../components/Partner/PlanCreator';
import MemberProfileModal from '../components/Partner/MemberProfileModal';

const PartnerDashboard = () => {
    const { showToast, gyms, selectedGymId, switchGym, members, partnerPlans } = useAppContext();
    const [showPlanCreator, setShowPlanCreator] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const currentGym = gyms.find(g => g.id === selectedGymId) || gyms[0];
    const gymMembers = members.filter(m => m.gymId === selectedGymId);

    // Derived Metrics
    const totalMembers = gymMembers.length;
    const activeMembers = gymMembers.filter(m => m.status === 'Active').length;
    const revenue = activeMembers * 5000; // Mock calculation

    const handleScan = () => {
        showToast("Scanning member ID...");
        setTimeout(() => showToast("Access Granted: Marcus V."), 1500);
    };

    const handleStatClick = (stat) => {
        showToast(`Syncing ${stat} data...`);
    };

    return (
        <div className="page-container">
            {/* Modals */}
            {showPlanCreator && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <PlanCreator onClose={() => setShowPlanCreator(false)} />
                    </div>
                </div>
            )}

            {selectedMember && (
                <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
            )}

            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Command</h1>

                    {/* Gym Selector */}
                    <div className="glass-panel" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-glass)',
                        cursor: 'pointer'
                    }}>
                        <select
                            value={selectedGymId}
                            onChange={(e) => switchGym(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                paddingRight: '24px' // Space for custom arrow
                            }}
                        >
                            {gyms.map(gym => (
                                <option key={gym.id} value={gym.id} style={{ background: '#111', color: '#fff' }}>{gym.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} color="var(--accent-orange)" style={{ marginLeft: '-20px', pointerEvents: 'none' }} />
                    </div>
                </div>
                <div
                    onClick={() => showToast("Dashboard refreshed")}
                    className="icon-box icon-box-muted"
                    style={{ width: '45px', height: '45px', cursor: 'pointer' }}
                >
                    <Activity size={20} />
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="stat-grid" style={{ marginBottom: '32px' }}>
                <Card noPadding className="glass-panel" onClick={() => handleStatClick('Live Occupancy')} style={{ cursor: 'pointer' }}>
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <Users size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>MEMBERS</span>
                        </div>
                        <div className="stat-value">
                            {totalMembers} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>TOTAL</span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel" onClick={() => handleStatClick('Traffic Trends')} style={{ cursor: 'pointer' }}>
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <TrendingUp size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>ACTIVE</span>
                        </div>
                        <div className="stat-value">
                            {activeMembers} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>USERS</span>
                        </div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel" onClick={() => handleStatClick('Revenue')} style={{ cursor: 'pointer' }}>
                    <div className="stat-card-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            <DollarSign size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>REVENUE</span>
                        </div>
                        <div className="stat-value">
                            ₹{(revenue / 1000).toFixed(1)}k <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>MTD</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Actions: Scanner & Plans */}
            <section style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Card className="glass-panel" noPadding onClick={handleScan} style={{
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--accent-orange)'
                }}>
                    <Scan size={24} color="var(--accent-orange)" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '700' }}>SCANNER</h3>
                </Card>
                <Card className="glass-panel" noPadding onClick={() => setShowPlanCreator(true)} style={{
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--border-glass)'
                }}>
                    <Plus size={24} color="#fff" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '700' }}>NEW PLAN</h3>
                </Card>
            </section>

            {/* Member List */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="section-label" style={{ marginBottom: 0 }}>{currentGym.name.toUpperCase()} ROSTER</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gymMembers.length} MEMBERS</span>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                    {gymMembers.map((member, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedMember(member)}
                            className="list-item-standard"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
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
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{member.plan} • {member.expiry}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    display: 'block',
                                    fontSize: '0.65rem',
                                    color: member.status === 'Active' ? 'var(--accent-green)' : 'var(--rust-primary)',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    marginBottom: '4px',
                                    padding: '2px 6px',
                                    background: member.status === 'Active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 77, 0, 0.1)',
                                    borderRadius: '4px'
                                }}>
                                    {member.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {gymMembers.length === 0 && (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No active members found in this roster.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PartnerDashboard;
