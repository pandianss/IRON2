import React, { useState } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { Plus, Check, IndianRupee, Calendar } from 'lucide-react';
import { useAppContext } from '../../app/context/AppContext';

const PlanCreator = ({ onClose }) => {
    const { addPlan, showToast } = useAppContext();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('Monthly');
    const [benefits, setBenefits] = useState('');

    const handleSubmit = () => {
        if (!name || !price) {
            showToast("Please fill in all fields");
            return;
        }

        const newPlan = {
            id: Date.now(),
            name,
            price,
            duration,
            benefits: benefits.split(',').map(b => b.trim()),
            active: true
        };

        addPlan(newPlan);
        showToast(`Plan "${name}" created!`);
        onClose();
    };

    return (
        <Card className="glass-panel" style={{ padding: '24px', border: '1px solid var(--accent-orange)' }}>
            <h3 className="section-label">CREATE NEW PLAN</h3>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>PLAN NAME</label>
                    <input
                        className="iron-input-border"
                        placeholder="e.g. Summer Shred"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>PRICE (₹)</label>
                        <div style={{ position: 'relative' }}>
                            <IndianRupee size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                            <input
                                className="iron-input-border"
                                type="number"
                                placeholder="999"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '12px 12px 12px 36px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>DURATION</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
                        >
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Annual">Annual</option>
                            <option value="Special Camp">Special Camp</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>BENEFITS (Comma separated)</label>
                    <textarea
                        className="iron-input-border"
                        placeholder="e.g. Gym Access, 2 Personal Sessions, Diet Plan"
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', height: '80px' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
                <Button variant="accent" onClick={handleSubmit} style={{ flex: 2 }} icon={Check}>Publish Plan</Button>
            </div>
        </Card>
    );
};

export default PlanCreator;
