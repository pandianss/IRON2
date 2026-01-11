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
        missedDays: 0,
        checkInStatus: null, // 'trained' | 'rest' | null
        pendingProofTimestamp: parseInt(localStorage.getItem('iron_pending_proof') || '0', 10)
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

                    // Fetch Today's Specific Status (Rest vs Trained)
                    let todayStatus = null;
                    if (contract.streakState === 'completed') {
                        try {
                            const today = getLocalToday();
                            // We access the service directly or add a method. 
                            // For now, let's assume valid data leads to valid check-in.
                            // Ideally we extend syncHistory or call a getTodayStatus method.
                            // Let's do a direct read or a lightweight service call.
                            // Actually, let's add `getTodayStatus` to retention service or just blindly trust for now?
                            // No, we need to know REST vs TRAINED.
                            // Fetch 30 days history for Calendar
                            const historyData = await firebaseRetentionService.getHistory(user.uid, 30);

                            // Check today's status
                            if (historyData && historyData[today]) {
                                todayStatus = historyData[today];
                            }

                            setRetentionState(prev => ({
                                ...prev,
                                currentStreak: data.currentStreak || 0,
                                longestStreak: data.longestStreak || 0,
                                lastCheckInDate: data.lastCheckInDate || null,
                                checkInStatus: todayStatus,
                                history: historyData || {}, // Store history
                                ...contract,
                                loading: false
                            }));
                        } catch (e) {
                            console.warn("Failed to fetch history", e);
                        }
                    }

                    // Fallback if not completed but we still want history?
                    // Ideally we fetch history regardless of 'completed' status to show misses.
                    // But for now, let's keep it inside the if(data) block.
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
        if (!user) return { status: 'ignored' };
        try {
            const result = await firebaseRetentionService.checkIn(user.uid, status);

            // ALWAYS Sync to ensure local state matches DB
            const data = await firebaseRetentionService.syncHistory(user.uid);
            // Also refresh history to show the new check mark immediately
            const historyData = await firebaseRetentionService.getHistory(user.uid, 30);

            if (data) {
                setRetentionState(prev => ({
                    ...prev,
                    currentStreak: data.currentStreak || 0,
                    longestStreak: data.longestStreak || 0,
                    lastCheckInDate: data.lastCheckInDate || null,
                    streakState: 'completed',
                    missedDays: 0,
                    checkInStatus: status,
                    history: historyData || {}, // Update history
                }));
                // We access the service directly or add a method. 
                // For now, let's assume valid data leads to valid check-in.
                // Ideally we extend syncHistory or call a getTodayStatus method.
                // Let's do a direct read or a lightweight service call.
                // Actually, let's add `getTodayStatus` to retention service or just blindly trust for now?
                // Only fire events if it was a new action
                if (result.status !== 'ignored') {
                    console.log("Loading EventBus...");
                    const { eventBus, EVENTS } = await import('../../services/events/index');
                    console.log("EventBus Loaded", eventBus);
                    eventBus.emit(EVENTS.RETENTION.CHECK_IN, {
                        status,
                        streak: data.currentStreak || 0
                    });
                }
            }
            return result;
        } catch (error) {
            console.error("Check-in failed", error);
            // Don't throw, return error status so UI can handle it gracefully
            return { status: 'error' };
        }
    };

    // --- PROOF OF WORK SYSTEM ---
    const initiateTrainingSession = async () => {
        // We attempt the check-in FIRST to see if it's allowed/upgradeable
        // This returns { status: 'success' | 'upgraded' | 'ignored' }
        const result = await checkIn('trained');

        // Only start the proof timer if we actually "trained" (or upgraded to trained)
        if (result && (result.status === 'success' || result.status === 'upgraded')) {
            const timestamp = Date.now();
            localStorage.setItem('iron_pending_proof', timestamp.toString());
            setRetentionState(prev => ({
                ...prev,
                pendingProofTimestamp: timestamp,
                streakState: 'completed', // Optimistic 
                missedDays: 0
            }));

            // Optimistically set Rust to false (Iron Slab)
            setDebugRust(false);
        }

        return result;
    };

    const verifyProofOfWork = () => {
        localStorage.removeItem('iron_pending_proof');
        setRetentionState(prev => ({ ...prev, pendingProofTimestamp: 0 }));

        // Fully verified.
        // Could trigger a "Verified" toast here or let the caller do it.
    };

    // Monitor for 10-minute warning
    useEffect(() => {
        const interval = setInterval(() => {
            const { pendingProofTimestamp } = retentionState;
            if (pendingProofTimestamp > 0) {
                const elapsed = Date.now() - pendingProofTimestamp;
                const TEN_MINUTES = 10 * 60 * 1000;

                if (elapsed > TEN_MINUTES) {
                    // Emit Warning Event
                    import('../../services/events/index').then(({ eventBus, EVENTS }) => {
                        eventBus.emit(EVENTS.SYSTEM.TOAST, {
                            message: "⚠️ WARNING: Proof of Work required to secure XP!",
                            type: 'error'
                        });
                    });
                    // Optionally re-enable rust visual to show decay risk?
                    // setDebugRust(true); // Maybe too harsh? Let's keep it as a warning for now.
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [retentionState.pendingProofTimestamp]);

    const recoverSession = async () => {
        console.warn("Recovery Mode Implementation Pending");
        // Future: specific service call to pay 'freeze' and repair streak
    };

    // --- RUST SIMULATION / LOGIC ---
    // If we have missed days, or if explicit 'rust' state is active
    // For V1, let's say Rust sets in if missedDays > 2
    const [debugRust, setDebugRust] = useState(false);

    const isRusting = (retentionState.missedDays > 2) || debugRust;

    const toggleRust = () => setDebugRust(prev => !prev);

    return (
        <RetentionContext.Provider value={{
            ...retentionState,
            checkIn,
            recoverSession,
            isRusting,
            toggleRust,
            initiateTrainingSession,
            verifyProofOfWork,
            pendingProofTimestamp: retentionState.pendingProofTimestamp,
            history: retentionState.history // Expose history
        }}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => useContext(RetentionContext);
