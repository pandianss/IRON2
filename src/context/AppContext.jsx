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

    const completeOnboarding = () => {
        localStorage.setItem('iron_onboarding_done', 'true');
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
