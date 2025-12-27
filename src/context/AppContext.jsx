/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isRusting, setIsRusting] = useState(false);
    const [bpm, setBpm] = useState(72);
    const [toast, setToast] = useState(null);
    const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
        return localStorage.getItem('iron_onboarding_done') === 'true';
    });
    const [userType, setUserType] = useState(() => {
        return localStorage.getItem('iron_user_type') || 'enthusiast';
    });

    // Partner Mode Data
    const [gyms] = useState([
        { id: 'g1', name: 'Iron Forge Bandra', location: 'Bandra West' },
        { id: 'g2', name: 'Iron Forge Juhu', location: 'Juhu Beach' }
    ]);
    const [members, setMembers] = useState([
        { id: 1, name: "Marcus V.", gymId: 'g1', rank: 'IRON IV', status: 'Active', plan: 'Annual PR', expiry: '01/12/2025', lastLogin: '2m ago', medical: 'None', history: [] },
        { id: 2, name: "Sarah J.", gymId: 'g1', rank: 'IRON II', status: 'Active', plan: 'Quarterly', expiry: '15/06/2025', lastLogin: '5m ago', medical: 'Asthma', history: [] },
        { id: 3, name: "Mike T.", gymId: 'g1', rank: 'NON-IRON', status: 'Expired', plan: 'Monthly', expiry: '20/11/2024', lastLogin: '2d ago', medical: 'Knee Injury', history: [] },
        { id: 4, name: "Rahul D.", gymId: 'g2', rank: 'IRON I', status: 'Active', plan: 'Annual', expiry: '10/08/2025', lastLogin: '1h ago', medical: 'None', history: [] },
        { id: 5, name: "Priya S.", gymId: 'g2', rank: 'IRON III', status: 'Active', plan: 'Special Camp', expiry: '28/02/2025', lastLogin: 'Just now', medical: 'None', history: [] }
    ]);
    const [partnerPlans, setPartnerPlans] = useState([]);

    const addPlan = (plan) => {
        setPartnerPlans([...partnerPlans, plan]);
    };

    const toggleBanMember = (memberId) => {
        setMembers(prevMembers => prevMembers.map(member => {
            if (member.id === memberId) {
                const isBanned = member.status === 'Banned';
                const newStatus = isBanned ? 'Active' : 'Banned';
                const action = isBanned ? 'Unbanned' : 'Banned';
                const date = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

                return {
                    ...member,
                    status: newStatus,
                    history: [...member.history, { action, date }]
                };
            }
            return member;
        }));
    };

    const switchGym = (gymId) => setSelectedGymId(gymId);

    const completeOnboarding = (type = 'enthusiast') => {
        localStorage.setItem('iron_onboarding_done', 'true');
        localStorage.setItem('iron_user_type', type);
        setUserType(type);
        setOnboardingCompleted(true);
    };

    // In a real app, this would be calculated from the last activity timestamp
    // For now, we provide a way to toggle it manually for demonstration
    const toggleRust = () => setIsRusting(prev => !prev);

    // Simulate BPM fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setBpm(prev => {
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                const next = prev + change;
                return Math.min(Math.max(next, 65), 180); // Keep between rest and peak
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isRusting) {
            document.body.classList.add('is-rusting');
        } else {
            document.body.classList.remove('is-rusting');
        }
    }, [isRusting]);

    return (
        <AppContext.Provider value={{
            isRusting,
            setIsRusting,
            toggleRust,
            bpm,
            onboardingCompleted,
            completeOnboarding,
            userType,
            gyms,
            selectedGymId,
            members,
            switchGym,
            partnerPlans,
            addPlan,
            toggleBanMember,
            toast,
            showToast: (msg) => {
                setToast(msg);
                setTimeout(() => setToast(null), 3000);
            }
        }}>
            {children}
            {isRusting && <div className="rust-texture" />}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};
