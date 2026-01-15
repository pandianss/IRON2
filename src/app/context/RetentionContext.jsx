import React, { createContext, useContext, useEffect, useState } from 'react';
import { EngineService } from '../../services/engine/EngineService';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase';
import { INITIAL_USER_STATE } from '../../core/behavior/EngineSchema';
import { ScarService } from '../../core/governance/ScarService';

import { EraService } from '../../core/governance/EraService';
import { EvidenceService } from '../../core/governance/EvidenceService';
import { ProtocolService } from '../../core/protocols/ProtocolService';
import { StandingSystem, STANDING } from '../../core/governance/StandingSystem';

export const RetentionContext = createContext(null);

export const RetentionProvider = ({ children }) => {
    const { currentUser: user } = useAuth();
    const [userState, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Governance State
    const [integrity, setIntegrity] = useState(100);
    const [scars, setScars] = useState([]);
    const [standing, setStanding] = useState(STANDING.STABLE);
    const [era, setEra] = useState(null);

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
                setUserState(INITIAL_USER_STATE(user.uid));
            }
            setLoading(false);
        });

        // Load Integrity Data AND Era Data
        Promise.all([
            ScarService.calculateIntegrity(user.uid),
            EraService.getCurrentEra(user.uid)
        ]).then(([integrityData, eraData]) => {
            setIntegrity(integrityData.integrity);
            setScars(integrityData.scarCount);
            if (eraData) setEra(eraData);
        });

        return () => unsub();
    }, [user]);

    // Calculate Standing on State Change
    useEffect(() => {
        const lastCheckIn = userState?.last_evaluated_day ? userState.last_evaluated_day.toDate() : null;
        const newStanding = StandingSystem.calculateStanding(lastCheckIn, integrity);
        setStanding(newStanding);
    }, [userState, integrity]);

    import { EvidenceService } from '../../core/governance/EvidenceService';
    // ...

    // Action: Check-in
    const checkIn = async (status = 'trained', proofFile = null) => {
        if (!user) {
            console.error("RetentionContext: No user found during check-in.");
            return { status: 'error', error: "User not authenticated." };
        }
        try {
            let proofUrl = null;
            if (proofFile) {
                // UPLOAD EVIDENCE
                proofUrl = await EvidenceService.uploadProof(user.uid, proofFile);
            }

            const actionType = status === 'rest' ? 'REST' : 'CHECK_IN';

            await EngineService.processAction(user.uid, {
                type: actionType,
                status,
                evidence: proofUrl // Attach Proof URL
            });

            return { status: 'success', proofUrl };
        } catch (err) {
            console.error("Engine check-in failed", err);
            return { status: 'error', error: err.message };
        }
    };

    // Derived UI Props (Projections)
    const streak = userState?.streak?.active ? userState.streak.count : 0;
    const isRusting = (userState?.engagement?.tier === 'DORMANT');
    const todayStatus = userState?.today?.status === 'COMPLETED' ? 'trained' : null;

    // New Retention Projections
    const isAtRisk = userState?.engagement_state === 'AT_RISK';
    const isRecovering = userState?.engagement_state === 'RECOVERING';
    const isDormant = userState?.engagement_state === 'DORMANT';
    const recoveryProgress = isRecovering ? userState?.streak?.count : 0;

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

            // Retention Logic
            isAtRisk,
            isRecovering,
            isDormant,
            recoveryProgress,
            socialStats: userState?.social || { pact_saves: 0, witness_count: 0 },

            // GOVERNANCE STATE
            integrity,
            scars,
            standing,
            era,
            statusColor: standing === STANDING.STABLE ? 'var(--accent-success)' : 'var(--accent-orange)',

            // Actions
            checkIn,
            isRusting,
            // Proof of Work stub (can remain local or move to engine later)
            initiateTrainingSession: checkIn,
            verifyProofOfWork: () => { }, // No-op for now in simplified V2

            // Debug Tools
            forceReconcile: () => { },

            // ACTIVE PROTOCOL
            activeProtocol: ProtocolService.getActiveProtocol()
        }}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => useContext(RetentionContext);
