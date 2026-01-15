import React, { useState } from 'react';
import { Bell, Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../app/context/AppContext';

const Notifications = () => {
    const { notifications, markNotificationRead, userType, selectedGymId, approveMember, showToast, toggleBanMember } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const navigate = useNavigate();

    // Filter notifications based on user type
    const filteredNotifications = notifications.filter(n => {
        if (userType === 'gym_owner') {
            return n.gymId === selectedGymId || n.type === 'system';
        }
        return !n.gymId; // Enthusiasts see general notifications
    });

    const unreadCount = filteredNotifications.filter(n => !n.read).length;

    const handleNotificationClick = (notification) => {
        markNotificationRead(notification.id);

        // If it has a payload, open the detail popover
        if (notification.payload) {
            setSelectedNotification(notification);
            setIsOpen(false); // Close list
        } else {
            // Default Navigation Logic
            setIsOpen(false);
            if (notification.type === 'message' && userType === 'gym_owner') {
                navigate('/partner');
            } else if (notification.type === 'alert' && userType === 'gym_owner') {
                navigate('/partner');
            } else if (notification.type === 'success') {
                navigate('/profile');
            }
        }
    };

    const handleAction = (action) => {
        if (!selectedNotification) return;
        const { payload } = selectedNotification;

        if (action === 'approve') {
            approveMember(payload.memberId);
            showToast(`${payload.name} Approved`);
            setSelectedNotification(null);
        } else if (action === 'reject') {
            // Mock rejection
            showToast("Request Rejected");
            setSelectedNotification(null);
        } else if (action === 'reply') {
            showToast("Reply sent: Thanks for reaching out!");
            setSelectedNotification(null);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Detail Popover (Floating Panel) */}
            {selectedNotification && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, backdropFilter: 'blur(4px)' }}
                        onClick={() => setSelectedNotification(null)}
                    />
                    <div className="glass-panel" style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '400px',
                        padding: '24px',
                        zIndex: 2001,
                        border: '1px solid var(--accent-orange)',
                        borderRadius: '16px',
                        background: 'rgba(10, 10, 10, 0.95)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div className="icon-box" style={{ width: '40px', height: '40px', background: 'rgba(255, 77, 0, 0.1)' }}>
                                    {selectedNotification.type === 'alert' ? <AlertCircle size={20} color="var(--accent-orange)" /> : <MessageSquare size={20} color="var(--accent-blue)" />}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>
                                        {selectedNotification.type === 'alert' ? 'MEMBER REQUEST' : 'NEW ENQUIRY'}
                                    </h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From {selectedNotification.payload?.userName || selectedNotification.payload?.name}</span>
                                </div>
                            </div>
                            <div onClick={() => setSelectedNotification(null)} style={{ cursor: 'pointer' }}>
                                <X size={20} color="var(--text-muted)" />
                            </div>
                        </div>

                        {/* Content Body */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                            {selectedNotification.type === 'alert' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Plan:</span>
                                        <span style={{ fontWeight: '700' }}>{selectedNotification.payload.plan}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Status:</span>
                                        <span style={{ color: 'var(--accent-orange)', fontWeight: '700' }}>Pending Action</span>
                                    </div>
                                </>
                            )}
                            {selectedNotification.type === 'message' && (
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                                    "{selectedNotification.payload.message}"
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {selectedNotification.type === 'alert' ? (
                                <>
                                    <button
                                        onClick={() => handleAction('reject')}
                                        className="btn-glass"
                                        style={{ width: '100%', height: '48px', color: 'var(--rust-primary)' }}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction('approve')}
                                        className="btn-glass"
                                        style={{ width: '100%', height: '48px', background: 'var(--accent-green)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Approve
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSelectedNotification(null)}
                                        className="btn-glass"
                                        style={{ width: '100%', height: '48px' }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => handleAction('reply')}
                                        className="btn-glass"
                                        style={{ width: '100%', height: '48px', background: 'var(--accent-blue)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Reply
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ position: 'relative', cursor: 'pointer' }}
            >
                <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                    <Bell size={20} />
                </div>
                {unreadCount > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: 'var(--accent-orange)',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {unreadCount}
                    </div>
                )}
            </div>

            {/* Notification Dropdown */}
            {isOpen && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="glass-panel" style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        width: '320px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '16px',
                        zIndex: 1000,
                        border: '1px solid var(--border-glass)',
                        background: 'rgba(5, 5, 5, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '1px' }}>ACTIVITY LOG</h3>
                            <div onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>
                                <X size={16} color="var(--text-muted)" />
                            </div>
                        </div>

                        {filteredNotifications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                All caught up. Silence is golden.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {filteredNotifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            background: notification.read ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
                                            borderLeft: notification.read ? '2px solid transparent' : '2px solid var(--accent-orange)',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(255, 255, 255, 0.03)'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                                            {notification.type === 'message' && <MessageSquare size={14} color="var(--accent-blue)" style={{ marginTop: '2px' }} />}
                                            {notification.type === 'alert' && <AlertCircle size={14} color="var(--accent-orange)" style={{ marginTop: '2px' }} />}
                                            {notification.type === 'success' && <Check size={14} color="var(--accent-green)" style={{ marginTop: '2px' }} />}
                                            {notification.type === 'system' && <Bell size={14} color="var(--text-muted)" style={{ marginTop: '2px' }} />}

                                            <div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px', lineHeight: '1.3' }}>{notification.message}</p>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{notification.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;
