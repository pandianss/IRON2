import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isRusting, setIsRusting] = useState(false);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Preferences
    const [preferences, setPreferences] = useState(() => {
        try {
            const saved = localStorage.getItem('iron_preferences');
            return saved ? JSON.parse(saved) : { 'Notifications': true, 'Haptic Feedback': true, 'Sounds': true };
        } catch (e) {
            console.warn("Failed to parse preferences", e);
            return { 'Notifications': true, 'Haptic Feedback': true, 'Sounds': true };
        }
    });

    const togglePreference = (key) => {
        setPreferences(prev => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem('iron_preferences', JSON.stringify(next));
            return next;
        });
    };

    const timerRef = React.useRef(null);

    const showToast = (msg, type = 'info') => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setToast({ message: msg, type, exiting: false });

        timerRef.current = setTimeout(() => {
            setToast(prev => prev ? { ...prev, exiting: true } : null);
            timerRef.current = setTimeout(() => {
                setToast(null);
                timerRef.current = null;
            }, 300);
        }, 3000);
    };

    const toggleRust = () => setIsRusting(prev => !prev);

    // Audio Context
    const playAppSound = (type = 'click', forcePlay = false) => {
        if (!preferences['Sounds'] && !forcePlay) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.05);
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.05);
            }
        } catch (e) { console.warn("Audio play failed", e); }
    };

    return (
        <UIContext.Provider value={{
            isRusting, setIsRusting, toggleRust,
            toast, showToast,
            isLoading, setIsLoading,
            preferences, togglePreference, playAppSound
        }}>
            {children}
            {isRusting && <div className="rust-texture" />}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};

UIProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default UIContext;
