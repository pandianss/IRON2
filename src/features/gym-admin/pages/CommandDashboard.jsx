import React, { useState } from 'react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import { Users, Activity, IndianRupee, Scan, TrendingUp, Plus, ChevronDown, UserPlus, CheckCircle, MessageSquare, MapPin } from 'lucide-react';

import { useSession, useUIFeedback, useData } from '../../../app/context';
import PlanCreator from '../components/PlanCreator';
import MemberProfileModal from '../components/MemberProfileModal';
import AddMemberModal from '../components/AddMemberModal';

const CommandDashboard = ({ isEmbedded }) => {
    const { currentUser } = useSession();
    const { showToast } = useUIFeedback();
    const {
        refreshData, // Assuming I add this to DataContext
        gyms,
        selectedGymId,
        switchGym,
        members,
        approveMember,
        toggleBanMember,
        enquiries,
        registerGym,
        partnerPlans
    } = useData();
    const [showPlanCreator, setShowPlanCreator] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showGymSelector, setShowGymSelector] = useState(false);

    const [newGymData, setNewGymData] = useState({ name: '', location: '' });
    const [coords, setCoords] = useState(null);
    const [isDetecting, setIsDetecting] = useState(false);

    const detectLocation = () => {
        setIsDetecting(true);
        if (!navigator.geolocation) {
            showToast("Geolocation not supported");
            setIsDetecting(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                showToast("Location Locked.");
                setIsDetecting(false);
            },
            (err) => {
                showToast("Location denied or unavailable.");
                setIsDetecting(false);
            }
        );
    };

    // Handle Zero State (No Gyms)
    if (!gyms || gyms.length === 0) {
        return (
            <div className={isEmbedded ? "" : "page-container"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="icon-box" style={{ width: '80px', height: '80px', marginBottom: '24px', background: 'rgba(255, 77, 0, 0.1)' }}>
                    <IndianRupee size={40} color="var(--accent-orange)" />
                </div>
                <h1 className="title-display" style={{ fontSize: '2rem', marginBottom: '16px' }}>ESTABLISH HQ</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center', maxWidth: '400px' }}>
                    You have clearance, but no facility. Register your gym to begin command operations.
                </p>

                <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', display: 'grid', gap: '16px' }}>
                    <input
                        type="text"
                        placeholder="Gym Name"
                        value={newGymData.name}
                        onChange={e => setNewGymData({ ...newGymData, name: e.target.value })}
                        className="iron-input-border"
                        style={{ width: '100%', padding: '16px', background: 'var(--surface-card)', color: 'var(--text-primary)' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Location / City"
                            value={newGymData.location}
                            onChange={e => setNewGymData({ ...newGymData, location: e.target.value })}
                            className="iron-input-border"
                            style={{ width: '100%', padding: '16px', background: 'var(--surface-card)', color: 'var(--text-primary)' }}
                        />
                        <Button
                            variant="secondary"
                            onClick={detectLocation}
                            disabled={isDetecting}
                            style={{ width: 'auto', padding: '0 16px' }}
                        >
                            {isDetecting ? '...' : <MapPin size={20} color={coords ? 'var(--accent-green)' : '#fff'} />}
                        </Button>
                    </div>
                    {coords && <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', textAlign: 'right', marginTop: '-12px' }}>
                        GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </div>}

                    <Button
                        fullWidth
                        variant="accent"
                        onClick={() => {
                            if (!newGymData.name) return showToast("Name required");

                            // Register with Coords
                            registerGym({
                                ...newGymData,
                                coordinates: coords
                            }, {
                                uid: currentUser?.uid,
                                email: currentUser?.email,
                                displayName: currentUser?.displayName || 'Gym Owner'
                            });
                            showToast("Gym Registered. Welcome, Commander.");
                        }}
                    >
                        INITIALIZE FACILITY
                    </Button>
                </div>
            </div>
        );
    }

    // Safety check for selectedGymId
    const currentGym = gyms.find(g => g.id === selectedGymId) || gyms[0];
    if (!currentGym) return <div className={isEmbedded ? "" : "page-container"}>Loading Headquarters...</div>;

    const allGymMembers = members.filter(m => m.gymId === selectedGymId);

    // Filter enquiries for this gym
    const gymEnquiries = enquiries?.filter(e => e.gymId === currentGym.id) || []; // Use currentGym.id instead of selectedGymId safety

    const pendingMembers = allGymMembers.filter(m => m.status === 'Pending');
    const rosterMembers = allGymMembers.filter(m => m.status !== 'Pending');

    // Derived Metrics
    const totalMembers = rosterMembers.length;
    const activeMembers = rosterMembers.filter(m => m.status === 'Active').length;
    const revenue = activeMembers * 5000; // Mock calculation

    const handleScan = () => {
        showToast("Scanning member ID...");
        setTimeout(() => showToast("Access Granted: Marcus V."), 1500);
    };

    const handleStatClick = (stat) => {
        showToast(`Syncing ${stat} data...`);
    };

    return (
        <div className={isEmbedded ? "" : "page-container"}>
            {/* Modals */}
            {showPlanCreator && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <PlanCreator onClose={() => setShowPlanCreator(false)} />
                    </div>
                </div>
            )}

            {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} />}

            {selectedMember && (
                <MemberProfileModal
                    member={members.find(m => m.id === selectedMember)}
                    onClose={() => setSelectedMember(null)}
                />
            )}

            <header className="page-header" style={isEmbedded ? { paddingTop: 0 } : {}}>
                <div className="header-title-group">
                    {!isEmbedded && <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Command</h1>}

                    {/* Custom Gym Selector & Refresh */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative' }}>
                            <div
                                className="glass-panel"
                                onClick={() => setShowGymSelector(!showGymSelector)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--border-glass)',
                                    cursor: 'pointer',
                                    minWidth: '200px',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{currentGym.name}</span>
                                <ChevronDown size={16} color="var(--accent-orange)" />
                            </div>

                            {showGymSelector && (
                                <div className="glass-panel" style={{
                                    position: 'absolute',
                                    top: '110%',
                                    left: 0,
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '12px',
                                    zIndex: 100,
                                    border: '1px solid var(--border-glass)',
                                    background: 'rgba(10, 10, 10, 0.95)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    {gyms.map(gym => (
                                        <div
                                            key={gym.id}
                                            onClick={() => {
                                                switchGym(gym.id);
                                                setShowGymSelector(false);
                                            }}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: gym.id === selectedGymId ? '700' : '400',
                                                color: gym.id === selectedGymId ? 'var(--accent-orange)' : '#fff',
                                                background: gym.id === selectedGymId ? 'rgba(255, 77, 0, 0.1)' : 'transparent',
                                                marginBottom: '4px'
                                            }}
                                        >
                                            {gym.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Refresh Button */}
                        <div
                            onClick={() => {
                                refreshData && refreshData();
                                showToast(`Syncing... Found ${gyms?.length || 0} gyms`);
                            }}
                            className="glass-panel"
                            style={{
                                height: '40px',
                                padding: '0 12px',
                                borderRadius: '12px',
                                border: '1px solid var(--accent-orange)',
                                color: 'var(--accent-orange)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '900',
                                cursor: 'pointer'
                            }}>
                            SYNC
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => showToast("Dashboard refreshed")}
                    className="icon-box icon-box-muted"
                    style={{ width: '45px', height: '45px', cursor: 'pointer' }}
                >
                    <Activity size={20} />
                </div>
            </header >

            {/* Quick Stats Grid */}
            < div className="stat-grid" style={{ marginBottom: '32px' }}>
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
                            <IndianRupee size={14} color="var(--accent-orange)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>REVENUE</span>
                        </div>
                        <div className="stat-value">
                            ₹{(revenue / 1000).toFixed(1)}k <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>MTD</span>
                        </div>
                    </div>
                </Card>
            </div >

            {/* Pending Approvals Section */}
            {
                pendingMembers.length > 0 && (
                    <section style={{ marginBottom: '32px' }}>
                        <h3 className="section-label" style={{ color: 'var(--accent-orange)' }}>PENDING APPROVALS ({pendingMembers.length})</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {pendingMembers.map(member => (
                                <div key={member.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--accent-orange)' }}>
                                    <div>
                                        <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{member.name}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Requested: {member.plan}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button
                                            variant="accent"
                                            icon={CheckCircle}
                                            onClick={() => {
                                                approveMember(member.id);
                                                showToast(`${member.name} approved`);
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                toggleBanMember(member.id); // Assuming we can use ban to 'reject' or just leave them pending for now, or use delete? User only asked for addition/approval. 
                                                // Actually, for now let's just implement Approve. Banning a pending user essentially rejects them.
                                                showToast(`${member.name} rejected`);
                                            }}
                                            style={{ color: 'var(--rust-primary)' }}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }

            {/* Enquiries Section */}
            {
                gymEnquiries.length > 0 && (
                    <section style={{ marginBottom: '32px' }}>
                        <h3 className="section-label" style={{ color: 'var(--accent-blue)' }}>MESSAGES ({gymEnquiries.length})</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {gymEnquiries.map(enquiry => (
                                <div key={enquiry.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', border: '1px solid var(--accent-blue)' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div className="icon-box" style={{ width: '40px', height: '40px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)' }}>
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>{enquiry.userName}</h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>"{enquiry.message}"</p>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{enquiry.date}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => showToast("Reply feature coming soon")}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Reply
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }
            {/* Active Plans Section */}
            {
                partnerPlans && partnerPlans.length > 0 && (
                    <section style={{ marginBottom: '32px' }}>
                        <h3 className="section-label" style={{ color: 'var(--text-primary)' }}>MEMBERSHIP PLANS ({partnerPlans.length})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {partnerPlans.map(plan => (
                                <Card key={plan.id} className="glass-panel" style={{ border: '1px solid var(--border-glass)', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{plan.name}</h4>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '1px' }}>{plan.duration}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff' }}>₹{plan.price}</span>
                                        </div>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {plan.benefits && plan.benefits.map((benefit, i) => (
                                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '4px', height: '4px', background: 'var(--accent-orange)', borderRadius: '50%' }} />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    </section>
                )
            }

            {/* Actions with Add Member */}
            <section style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <Card className="glass-panel" noPadding onClick={handleScan} style={{
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--accent-orange)'
                }}>
                    <Scan size={24} color="var(--accent-orange)" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '0.8rem', fontWeight: '700' }}>SCANNER</h3>
                </Card>
                <Card className="glass-panel" noPadding onClick={() => setShowPlanCreator(true)} style={{
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--border-glass)'
                }}>
                    <Plus size={24} color="#fff" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '0.8rem', fontWeight: '700' }}>NEW PLAN</h3>
                </Card>
                <Card className="glass-panel" noPadding onClick={() => setShowAddMember(true)} style={{
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--border-glass)'
                }}>
                    <UserPlus size={24} color="#fff" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '0.8rem', fontWeight: '700' }}>ADD MEMBER</h3>
                </Card>
            </section>

            {/* Member List (Active/Banned only) */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="section-label" style={{ marginBottom: 0 }}>{currentGym.name.toUpperCase()} ROSTER</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rosterMembers.length} MEMBERS</span>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                    {rosterMembers.map((member) => (
                        <div
                            key={member.id}
                            onClick={() => setSelectedMember(member.id)}
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
                                    {(member.name || '?').charAt(0)}
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
                    {rosterMembers.length === 0 && (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No active members found in this roster.
                        </div>
                    )}
                </div>
            </section >
        </div >
    );
};

export default CommandDashboard;
