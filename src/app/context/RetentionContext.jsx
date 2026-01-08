import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseRetentionService } from '../../services/retention/FirebaseRetentionService';
import { useAuth } from './AuthContext';

const RetentionContext = createContext(null);

export const RetentionProvider = ({ children }) => {
    const { user } = useAuth();
    const [retentionState, setRetentionState] = useState({
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null,
        history: {},
        loading: true
    });

    // Initial Load
    useEffect(() => {
        if (!user) {
            setRetentionState(prev => ({ ...prev, loading: false }));
            return;
        }

        const loadData = async () => {
            try {
                // Sync first to resolve any time-based logic (if we moved logic to backend, this might just be a fetch)
                const data = await firebaseRetentionService.syncHistory(user.uid);
                if (data) {
                    setRetentionState(prev => ({
                        ...prev,
                        currentStreak: data.currentStreak || 0,
                        longestStreak: data.longestStreak || 0,
                        lastCheckInDate: data.lastCheckInDate || null,
                        loading: false
                    }));
                } else {
                    setRetentionState(prev => ({ ...prev, loading: false }));
                }
            } catch (error) {
                console.error("Failed to load retention data", error);
                setRetentionState(prev => ({ ...prev, loading: false }));
            }
        };

        loadData();
    }, [user]);

    const checkIn = async (status) => {
        if (!user) return;
        try {
            await firebaseRetentionService.checkIn(user.uid, status);
            // Optimistic Update or specific fetch could go here. 
            // For now, we rely on the realtime listener or re-fetch.
            // Let's re-fetch for safety in V1.
            const data = await firebaseRetentionService.syncHistory(user.uid);
            if (data) {
                setRetentionState(prev => ({
                    ...prev,
                    currentStreak: data.currentStreak || 0,
                    longestStreak: data.longestStreak || 0,
                    lastCheckInDate: data.lastCheckInDate || null
                }));

                // Fire Event for UI Effects (Toast, Feed)
                // Import eventBus and EVENTS first (needed at top of file)
                const { eventBus, EVENTS } = await import('../../services/events');
                eventBus.emit(EVENTS.RETENTION.CHECK_IN, {
                    status,
                    streak: data.currentStreak || 0
                });
            }
        } catch (error) {
            console.error("Check-in failed", error);
            throw error;
        }
    };

    return (
        <RetentionContext.Provider value={{ ...retentionState, checkIn }}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => useContext(RetentionContext);
