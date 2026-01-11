
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../app/context/DataContext'; // Assuming useData covers it or need AppContext? Reusing what's there.
import { useAppContext } from '../app/context/AppContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { Check, Shield, Lock, CreditCard } from 'lucide-react';

const GymJoin = () => {
    const { gymId } = useParams();
    const navigate = useNavigate();
    const { gyms, partnerPlans, addMember, showToast } = useAppContext();

    // Safety: Handle if gyms/plans not loaded yet (useData should handle init, but better to be safe)
    const gym = gyms?.find(g => g.id === gymId);

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [step, setStep] = useState(1); // 1: Plan, 2: Details/Pay
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

    // Auto-select first plan if available
    useEffect(() => {
        if (partnerPlans && partnerPlans.length > 0 && !selectedPlan) {
            setSelectedPlan(partnerPlans[0]);
        }
    }, [partnerPlans]);

    const handleJoin = async () => {
        if (!formData.name || !formData.phone) return showToast("Please fill all details");

        showToast("Processing Payment...");

        // Simulate Payment Delay
        setTimeout(() => {
            const newMember = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                gymId: gymId,
                plan: selectedPlan.name,
                rank: 'IRON V',
                status: 'Pending', // Pending aproval OR Active depending on policy. Let's say Pending for safey.
                joinedVia: 'Public Link',
                expiry: '30/01/2026',
                lastLogin: 'Never'
            };

            addMember(newMember);
            showToast("Payment Successful! Welcome to the squad.");
            navigate('/auth'); // Redirect to auth to login/signup
        }, 2000);
    };

    if (!gym) return <div className="page-container" style={{ textAlign: 'center', paddingTop: '100px' }}>Loading Facility...</div>;

    return (
        <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="title-display" style={{ fontSize: '2.5rem', color: 'var(--accent-orange)' }}>{gym.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>OFFICIAL RECRUITMENT PORTAL</p>
            </div>

            {step === 1 && (
                <div>
                    <h3 className="section-label" style={{ textAlign: 'center' }}>SELECT YOUR PROTOCOL</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {partnerPlans?.map(plan => (
                            <Card
                                key={plan.id}
                                className="glass-panel"
                                onClick={() => setSelectedPlan(plan)}
                                style={{
                                    cursor: 'pointer',
                                    border: selectedPlan?.id === plan.id ? '1px solid var(--accent-orange)' : '1px solid var(--border-glass)',
                                    background: selectedPlan?.id === plan.id ? 'rgba(255, 77, 0, 0.1)' : 'var(--bg-glass)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{plan.name}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{plan.duration}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>₹{plan.price}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div style={{ marginTop: '32px' }}>
                        <Button fullWidth variant="accent" onClick={() => setStep(2)}>PROCEED TO CHECKOUT</Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <Card className="glass-panel" style={{ padding: '32px', border: '1px solid var(--accent-orange)' }}>
                    <h3 className="section-label" style={{ textAlign: 'center', marginBottom: '24px' }}>CONFIRM DEPLOYMENT</h3>

                    <div style={{ background: '#000', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SELECTED PLAN</span>
                            <span style={{ fontWeight: '700', color: 'var(--accent-orange)' }}>{selectedPlan?.name}</span>
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '1.2rem' }}>₹{selectedPlan?.price}</span>
                    </div>

                    <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
                        <input
                            className="iron-input-border"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="email"
                            className="iron-input-border"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            className="iron-input-border"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <Button fullWidth variant="accent" onClick={handleJoin} icon={CreditCard}>
                        PAY & JOIN NOW
                    </Button>

                    <div style={{ marginTop: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <Shield size={12} />
                        <span>Secure SSL Encryption</span>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GymJoin;
