import React, { useState } from 'react';
import { LogOut, ChevronRight, Download, Trash2 } from 'lucide-react';
import Card from '../../../components/UI/Card';
import PassportCard from '../../../components/UI/PassportCard';
import { PartnerWidget } from '../../../social/partner';
import ConsistencyGraph from '../components/ConsistencyGraph';
import { useRetention, useSession, useData } from '../../../app/context';

const ProfilePage = () => {
    const { currentUser, logout } = useSession();
    const { streak, lastCheckInDate } = useRetention();
    const { feedActivities = [], gyms = [] } = useData();

    const name = currentUser?.displayName || "Marcus V.";
    const rank = currentUser?.rank || "IRON IV";
    const uid = currentUser?.uid?.substring(0, 8).toUpperCase() || "IRN-7742";

    // Resolve Home Gym
    const homeGymName = gyms.find(g => g.id === currentUser?.gymId)?.name?.toUpperCase() || 'RONIN (NO GYM)';

    const handleLogout = async () => {
        await logout();
    };

    const handleDeactivate = () => {
        if (window.confirm("Are you sure you want to deactivate your profile? This action cannot be undone.")) {
            alert("Profile deactivation request sent to admin.");
        }
    };

    const handleDownload = () => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm("Generate and download IRON dossier?")) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>IRON User Data - ${name}</title>
                    <style>
                        body { font-family: monospace; background: #050505; color: #fff; padding: 20px; }
                        .activity { border-bottom: 1px solid #333; padding: 10px 0; }
                        .time { color: #888; font-size: 0.8rem; }
                        .type { color: #ff4d00; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>User Data Export</h1>
                    <p>User: ${name} (${uid})</p>
                    <p>Exported: ${new Date().toLocaleString()}</p>
                    <hr/>
                    <h2>Activity Feed</h2>
                    ${feedActivities.length > 0 ? feedActivities.map(a => `
                        <div class="activity">
                            <div class="time">${a.timestamp}</div>
                            <div class="type">${a.type.toUpperCase()}</div>
                            <div>${a.content || 'No content'}</div>
                        </div>
                    `).join('') : '<p>No activity recorded.</p>'}
                </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iron_data_${uid}_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page-container">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '30px',
                    background: 'linear-gradient(45deg, #222, #111)',
                    border: '1px solid var(--border-glass)',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: 'var(--accent-orange)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    {name.charAt(0)}
                </div>
                <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{name.toUpperCase()}</h2>

                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginTop: '16px' }}>
                    <PassportCard
                        userName={name}
                        rank={rank}
                        userId={uid}
                        streak={streak}
                        lastCheckIn={lastCheckInDate}
                        homeGym={homeGymName}
                    />
                </div>

                <div style={{ maxWidth: '400px', margin: '0 auto' }}>

                    <ConsistencyGraph activities={feedActivities.filter(a => a.userId === currentUser?.uid)} />

                    <PartnerWidget />
                </div>
            </div>

            <section style={{ marginBottom: '32px' }}>
                <h3 className="section-label">ACTIONS</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                    {/* DOWNLOAD DATA */}
                    <div
                        onClick={handleDownload}
                        className="list-item-standard"
                        style={{
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="icon-box icon-box-muted">
                                <Download size={20} />
                            </div>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                Download User Data
                            </span>
                        </div>
                        <ChevronRight size={18} color="var(--text-muted)" />
                    </div>

                    {/* LOGOUT */}
                    <div
                        onClick={handleLogout}
                        className="list-item-standard"
                        style={{
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="icon-box" style={{ background: 'rgba(255, 77, 0, 0.1)', color: 'var(--accent-orange)' }}>
                                <LogOut size={20} />
                            </div>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                Logout
                            </span>
                        </div>
                        <ChevronRight size={18} color="var(--text-muted)" />
                    </div>

                    {/* DEACTIVATE */}
                    <div
                        onClick={handleDeactivate}
                        className="list-item-standard"
                        style={{
                            cursor: 'pointer',
                            background: 'rgba(20, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 0, 0, 0.2)',
                            borderRadius: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="icon-box" style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4444' }}>
                                <Trash2 size={20} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '600', color: '#ff4444' }}>
                                    Deactivate Profile
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#888' }}>
                                    This cannot be undone
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
