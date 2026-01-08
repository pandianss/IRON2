import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Shield, Check, X, Building, Users, Activity, FileText } from 'lucide-react';
import { useData, useUIFeedback } from '../app/context';
import { AuditService } from '../services/audit';

const AdminDashboard = () => {
    const { gyms, users, approveGym, rejectGym } = useData();
    const { showToast } = useUIFeedback();
    const [activeTab, setActiveTab] = useState('gyms');
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        if (activeTab === 'logs') {
            loadLogs();
        }
    }, [activeTab]);

    const loadLogs = async () => {
        const logs = await AuditService.getLogs();
        setAuditLogs(logs);
    };

    const handleApprove = async (gym) => {
        await approveGym(gym.id);
        AuditService.log('GYM_APPROVED', { role: 'admin' }, { id: gym.id, name: gym.name }, { status: 'Active' });
    };

    const handleReject = async (gym) => {
        await rejectGym(gym.id);
        AuditService.log('GYM_REJECTED', { role: 'admin' }, { id: gym.id, name: gym.name }, { status: 'Rejected' });
    };

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

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                <button
                    onClick={() => setActiveTab('gyms')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'gyms' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'gyms' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderBottom: activeTab === 'gyms' ? '2px solid var(--accent-orange)' : 'none'
                    }}
                >
                    GYM REQUESTS
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'logs' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'logs' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderBottom: activeTab === 'logs' ? '2px solid var(--accent-orange)' : 'none'
                    }}
                >
                    AUDIT LOGS
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'gyms' && (
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
                                        <Button variant="primary" icon={Check} onClick={() => handleApprove(gym)} style={{ flex: 1, backgroundColor: 'var(--accent-green)', borderColor: 'var(--accent-green)', color: '#000' }}>
                                            APPROVE
                                        </Button>
                                        <Button variant="secondary" icon={X} onClick={() => handleReject(gym)} style={{ flex: 1 }}>
                                            REJECT
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {activeTab === 'logs' && (
                <section>
                    <h3 className="section-label">SYSTEM AUDIT TRAIL</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {auditLogs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <p>No logs found.</p>
                            </div>
                        ) : (
                            auditLogs.map((log) => (
                                <Card key={log.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'var(--accent-blue)'
                                            }}>
                                                {log.action}
                                            </span>
                                            <span style={{ fontSize: '0.9rem', color: '#fff' }}>
                                                {log.target?.name || log.target?.id || 'Unknown Target'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            By: {log.performedBy?.email || 'System'} | {new Date(log.metadata?.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    {log.details && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {JSON.stringify(log.details)}
                                        </div>
                                    )}
                                </Card>
                            ))
                        )}
                    </div>
                </section>
            )}

        </div>
    );
};

export default AdminDashboard;
