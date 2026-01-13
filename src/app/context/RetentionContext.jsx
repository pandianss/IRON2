import React, { createContext, useContext, useEffect, useState } from 'react';
import { EngineService } from '../../services/engine/EngineService';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase';
import { INITIAL_USER_STATE } from '../../core/behavior/EngineSchema';

export const RetentionContext = createContext(null);

export const RetentionProvider = ({ children }) => {
    const { currentUser: user } = useAuth();
    const [userState, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Subscribe to Canonical State
    useEffect(() => {
        if (!user) {
            setUserState(null);
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(doc(db, 'user_state', user.uid), (snap) => {
            if (snap.exists()) {
                setUserState(snap.data());
            } else {
                // If no state exists (new user or migration needed), we might need to initialize it.
                // For now, in UI context, we can show a default shell or trigger initialization.
                setUserState(INITIAL_USER_STATE(user.uid));
            }
            setLoading(false);
        }, (err) => {
            console.error("State subscription failed", err);
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    // Action: Check-in
    const checkIn = async (status = 'trained') => {
        if (!user) return;
        try {
            const actionType = status === 'rest' ? 'REST' : 'CHECK_IN';
            await EngineService.processAction(user.uid, { type: actionType, status });
            // No need to manually update state, the snapshot will fire
            return { status: 'success' };
        } catch (err) {
            console.error("Engine check-in failed", err);
            return { status: 'error', error: err.message };
        }
    };

    // Derived UI Props (Projections)
    const streak = userState?.streak?.active ? userState.streak.count : 0;
    const isRusting = (userState?.engagement?.tier === 'DORMANT');
    const todayStatus = userState?.today?.status === 'COMPLETED' ? 'trained' : null;

    return (
        <RetentionContext.Provider value={{
            // Core State
            userState,
            loading,

            // Legacy/UI Compatibility Props
            streak: streak,
            currentStreak: streak,
            lastCheckInDate: userState?.last_evaluated_day,
            checkInStatus: todayStatus,
            missedDays: userState?.lifecycle?.days_missed || 0,

            // Actions
            checkIn,
            isRusting,
            // Proof of Work stub (can remain local or move to engine later)
            initiateTrainingSession: checkIn,
            verifyProofOfWork: () => { }, // No-op for now in simplified V2

            // Debug Tools
            forceReconcile: () => { }
        }}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => useContext(RetentionContext);
