import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Shield, Check, X, Building, Users, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdminDashboard = () => {
    const { gyms, users, approveGym, rejectGym } = useAppContext();
    const [activeTab, setActiveTab] = useState('gyms');

    const pendingGyms = gyms.filter(g => g.status === 'Pending');
    const activeGyms = gyms.filter(g => g.status === 'Active');

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>COMMAND</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        SYSTEM ADMINISTRATION
                    </p>
                </div>
                <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                    <Shield size={20} />
                </div>
            </header>

            {/* Quick Stats */}
            <div className="stat-grid" style={{ marginBottom: '32px' }}>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <span className="stat-label">PENDING GYMS</span>
                        <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{pendingGyms.length}</div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <span className="stat-label">ACTIVE GYMS</span>
                        <div className="stat-value">{activeGyms.length}</div>
                    </div>
                </Card>
                <Card noPadding className="glass-panel">
                    <div className="stat-card-inner">
                        <span className="stat-label">TOTAL USERS</span>
                        <div className="stat-value">{users.length}</div>
                    </div>
                </Card>
            </div>

            {/* Pending Requests */}
            <section>
                <h3 className="section-label">GYM APPLICATIONS</h3>
                {pendingGyms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <Check size={40} style={{ marginBottom: '16px', opacity: 0.2 }} />
                        <p>All queues cleared. No pending applications.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {pendingGyms.map(gym => (
                            <Card key={gym.id} className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-orange)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>{gym.name}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Building size={14} /> {gym.location || 'Unknown Location'}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255, 77, 0, 0.1)', color: 'var(--accent-orange)', borderRadius: '4px', fontWeight: 'bold' }}>
                                        PENDING
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Button variant="primary" icon={Check} onClick={() => approveGym(gym.id)} style={{ flex: 1, backgroundColor: 'var(--accent-green)', borderColor: 'var(--accent-green)', color: '#000' }}>
                                        APPROVE
                                    </Button>
                                    <Button variant="secondary" icon={X} onClick={() => rejectGym(gym.id)} style={{ flex: 1 }}>
                                        REJECT
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
