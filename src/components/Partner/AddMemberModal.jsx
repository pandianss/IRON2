import React, { useState } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { X, User, Check, Wallet } from 'lucide-react';
import { useAppContext } from '../../app/context/AppContext';

const AddMemberModal = ({ onClose }) => {
    const { addMember, showToast, selectedGymId } = useAppContext();
    const [name, setName] = useState('');
    const [plan, setPlan] = useState('Monthly');

    const handleSubmit = () => {
        if (!name) {
            showToast("Please enter a member name");
            return;
        }

        const newMember = {
            name,
            gymId: selectedGymId,
            rank: 'IRON V', // Default starting rank
            status: 'Active',
            plan,
            expiry: '30/01/2026', // Mock expiry for now
            lastLogin: 'Never',
            medical: 'None'
        };

        addMember(newMember);
        showToast(`Member "${name}" added successfully`);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
        }}>
            <Card className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '0', overflow: 'hidden', border: '1px solid var(--accent-orange)' }}>
                {/* Header */}
                <div style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(255, 77, 0, 0.1) 0%, transparent 100%)', textAlign: 'center', position: 'relative' }}>
                    <div onClick={onClose} style={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', padding: '8px' }}>
                        <X size={20} color="var(--text-secondary)" />
                    </div>

                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '20px',
                        background: '#111',
                        border: '2px solid var(--accent-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'var(--accent-orange)',
                        margin: '0 auto 16px'
                    }}>
                        <User size={24} />
                    </div>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>ADD MEMBER</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manual Entry</p>
                </div>

                {/* Form */}
                <div style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>FULL NAME</label>
                        <input
                            className="iron-input-border"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                color: '#fff',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-glass)'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>PLAN</label>
                        <select
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                color: '#fff',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-glass)'
                            }}
                        >
                            <option value="Monthly" style={{ background: '#111' }}>Monthly</option>
                            <option value="Quarterly" style={{ background: '#111' }}>Quarterly</option>
                            <option value="Annual" style={{ background: '#111' }}>Annual</option>
                        </select>
                    </div>

                    <Button fullWidth variant="accent" onClick={handleSubmit} icon={Check}>Add Member</Button>
                </div>
            </Card>
        </div>
    );
};

export default AddMemberModal;
