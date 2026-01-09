import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseRetentionService } from '../../services/retention/FirebaseRetentionService';
import { getLocalToday, getLocalYesterday, getSystemTimezone } from '../../utils/dateHelpers';
import { useAuth } from './AuthContext';

export const RetentionContext = createContext(null);

export const RetentionProvider = ({ children }) => {
    const { currentUser: user } = useAuth();
    const [retentionState, setRetentionState] = useState({
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null,
        history: {},
        loading: true,
        // Day Contract State
        streakState: 'pending', // 'completed' | 'pending' | 'broken'
        missedDays: 0
    });

    // Helper: Calculate Day Contract
    const resolveDayContract = (lastDate, currentStreak) => {
        const today = getLocalToday();
        const yesterday = getLocalYesterday();

        if (lastDate === today) {
            return { streakState: 'completed', missedDays: 0 };
        }

        if (lastDate === yesterday) {
            return { streakState: 'pending', missedDays: 0 };
        }

        // If no last date (new user) -> Pending (0 missed)
        if (!lastDate) {
            return { streakState: 'pending', missedDays: 0 };
        }

        // Otherwise: Broken
        // TODO: precise day diff for recovery price
        return { streakState: 'broken', missedDays: 1 };
    };

    // Initial Load
    useEffect(() => {
        if (!user) {
            setRetentionState(prev => ({ ...prev, loading: false }));
            return;
        }

        const loadData = async () => {
            // Reset loading state while fetching new user data
            setRetentionState(prev => ({ ...prev, loading: true }));
            try {
                // Sync first to resolve any time-based logic (if we moved logic to backend, this might just be a fetch)
                const data = await firebaseRetentionService.syncHistory(user.uid);
                if (data) {
                    // Apply Contract Logic derived from fetched data
                    const { currentStreak, lastCheckInDate } = data;
                    const contract = resolveDayContract(lastCheckInDate, currentStreak);

                    setRetentionState(prev => ({
                        ...prev,
                        currentStreak: data.currentStreak || 0,
                        longestStreak: data.longestStreak || 0,
                        lastCheckInDate: data.lastCheckInDate || null,
                        ...contract,
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
                    lastCheckInDate: data.lastCheckInDate || null,
                    streakState: 'completed', // Immediate optimistic update
                    missedDays: 0
                }));

                // Fire Event for UI Effects (Toast, Feed)
                // Import eventBus and EVENTS first (needed at top of file)
                console.log("Loading EventBus...");
                const { eventBus, EVENTS } = await import('../../services/events/index');
                console.log("EventBus Loaded", eventBus);
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

    const recoverSession = async () => {
        console.warn("Recovery Mode Implementation Pending");
        // Future: specific service call to pay 'freeze' and repair streak
    };

    return (
        <RetentionContext.Provider value={{ ...retentionState, checkIn, recoverSession }}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => useContext(RetentionContext);
