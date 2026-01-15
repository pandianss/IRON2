import React, { createContext, useContext, useEffect, useState } from 'react';
import { EngineService } from '../../infrastructure/engine/EngineService';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase';
import { INITIAL_USER_STATE } from '../../core/behavior/EngineSchema';
import { ScarService } from '../../core/governance/ScarService';

import { EraService } from '../../core/governance/EraService';
import { EvidenceService } from '../../core/governance/EvidenceService';
import { ProtocolService } from '../../core/protocols/ProtocolService';
import { StandingSystem, STANDING as LEGACY_STANDING } from '../../core/governance/StandingSystem';
import { LocationService } from '../../core/governance/LocationService';
import { evaluateInstitution, STANDING as SOVEREIGN_STANDING, EVENT_TYPE } from '../../institution/standing-engine';

// Alias for compatibility during migration
const STANDING = SOVEREIGN_STANDING;

export const RetentionContext = createContext(null);

export const RetentionProvider = ({ children }) => {
    const { currentUser: user } = useAuth();
    const [userState, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Governance State
    const [integrity, setIntegrity] = useState(100);
    const [scars, setScars] = useState([]);
    const [standing, setStanding] = useState(STANDING.INDUCTED);
    const [era, setEra] = useState(null);

    // Session State (The Watcher)
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [sessionZone, setSessionZone] = useState(null);

    const [institutionalState, setInstitutionalState] = useState(null);

    // ... (useEffect for Canonical State - UNCHANGED)

    // Calculate Standing using the SOVEREIGN ENGINE
    useEffect(() => {
        if (!userState) return;

        // 1. Construct SYNTHETIC LEDGER (Adapter Layer)
        // Converting Snapshot State -> Event Stream for the pure engine
        const syntheticLedger = [];

        // Genesis
        if (userState.created_at) {
            syntheticLedger.push({
                type: EVENT_TYPE.CONTRACT_CREATED,
                timestamp: userState.created_at.toMillis ? userState.created_at.toMillis() : Date.now(),
                payload: {}
            });
        }

        // Violations (Scars)
        // We assume scars are historical strings in current userState, mapping them to generic violation events
        if (scars && scars > 0) {
            // Mocking historical scars
            for (let i = 0; i < scars; i++) {
                syntheticLedger.push({ type: EVENT_TYPE.VIOLATION_RECORDED, timestamp: 0, payload: { type: 'Legacy Scar' } });
            }
        }

        // Current Day State
        const lastCheckIn = userState?.last_evaluated_day ? userState.last_evaluated_day.toDate() : null;
        let dayOpen = false;

        if (lastCheckIn) {
            // If check-in exists for "today", we treat it as OBLIGATION_MET
            // But how do we know if today is NEW?
            // Simple logic for V1 Adapter: If lastCheckIn is Recent (< 24h), we push OBLIGATION_MET.
            // If it is older, we assume missed day?
            // Wait, standard IRON logic is "Day Opens at 4AM".
            // For now, if lastCheckIn is recent, we say OBLIGATION_MET.
            // We need to inject DAY_OPENED too, otherwise deriveDayState won't see an open day!
            // But if obligation is met, Day is closed.
            // So we push DAY_OPENED (past) then OBLIGATION_MET (recent).

            const now = Date.now();
            const elapsed = now - lastCheckIn.getTime();

            // Assume Day was opened 1 hour before checkin?
            syntheticLedger.push({ type: EVENT_TYPE.DAY_OPENED, timestamp: lastCheckIn.getTime() - 3600000, payload: { dayIndex: 1 } });
            syntheticLedger.push({ type: EVENT_TYPE.OBLIGATION_MET, timestamp: lastCheckIn.getTime(), payload: {} });

            // If time has passed significantly since then (24h+), maybe a NEW day opens?
            // This adapter logic is tricky without a real event history.
            // We act as if "Today" hasn't opened yet unless user initiates.
        } else {
            // No check-in ever? Inducted but day not opened?
        }

        // WATCHER: Check for Timeouts
        // Use userState.last_evaluated_day vs Date.now().
        // If last checkin was > 28h ago (24h + buffer), we might be in Breach Risk if we opened a day?
        // But if day is closed (OBLIGATION_MET), we are fine until next Open.
        // Who opens the day? 
        // In this V1, user "Initiates Protocol". That should be a DAY_OPENED event.
        // But we don't store that in `userState` snapshot yet.
        // We only store `last_evaluated_day` (Completion).
        // So we can assume Day is CLOSED unless we are in `sessionActive`?

        if (sessionActive) {
            // If session is active, implicit DAY_OPENED?
            syntheticLedger.push({ type: EVENT_TYPE.DAY_OPENED, timestamp: sessionStartTime || Date.now(), payload: { dayIndex: 99 } });
        }

        // 2. RUN ENGINE
        const now = Date.now();
        const newState = evaluateInstitution(syntheticLedger, now);

        // 3. APPLY STATE
        console.log("ENGINE OUTPUT:", newState);
        setInstitutionalState(newState);
        setStanding(newState.standing); // Keep legacy Standing sync for now

    }, [userState, integrity, scars]);

    // Action: Start Session (The Anchor)
    const startSession = async () => {
        if (!user) return { error: "No user" };
        try {
            // 1. Get Location
            const coords = await LocationService.getCurrentPosition();
            // 2. Verify Zone
            const zoneCheck = LocationService.verifyZone(coords.latitude, coords.longitude);

            if (!zoneCheck.valid) {
                return { status: 'error', error: "INVALID ZONE. Move to an approved facility." };
            }

            // 3. Lock State
            setSessionActive(true);
            setSessionStartTime(Date.now());
            setSessionZone(zoneCheck.zone);

            return { status: 'success', zone: zoneCheck.zone };
        } catch (e) {
            console.error("Session Start Failed", e);
            return { status: 'error', error: e.message || "Location Unavailable" };
        }
    };

    // Action: End Session / Check-in (The Seal)
    const endSession = async (proofFile, tag = "General") => {
        if (!sessionActive) {
            return { status: 'error', error: "No active session to end." };
        }
        if (!proofFile) {
            return { status: 'error', error: "Proof required to seal session." };
        }

        try {
            // 1. Calculate Duration
            const durationMinutes = LocationService.calculateDuration(sessionStartTime);

            // 2. Upload Evidence
            const proofUrl = await EvidenceService.uploadProof(user.uid, proofFile);

            // 3. Commit to Ledger
            await EngineService.processAction(user.uid, {
                type: 'SESSION_COMPLETE', // New Event Type
                status: 'trained',
                evidence: proofUrl,
                meta: {
                    duration: durationMinutes,
                    zone: sessionZone,
                    startTime: sessionStartTime,
                    endTime: Date.now(),
                    tag: tag
                }
            });

            // 4. Reset
            setSessionActive(false);
            setSessionStartTime(null);
            setSessionZone(null);

            return { status: 'success', proofUrl };
        } catch (err) {
            console.error("Session End Failed", err);
            return { status: 'error', error: err.message };
        }
    };

    // Legacy Support (for direct calls if any exist, effectively wraps start/end instantly or errors)
    // We strictly deprecate "Instant Check-in". 
    const checkIn = async (status, file) => {
        // V2.1: CheckIn is now EndSession.
        // If we want to support 'Rest', we handle it separately.
        if (status === 'rest') {
            await EngineService.processAction(user.uid, { type: 'REST', status: 'rest' });
            return { status: 'success' };
        }
        // Force session flow
        return { status: 'error', error: "Use Session Protocol." };
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
            statusColor: standing === STANDING.COMPLIANT ? 'var(--accent-success)' : 'var(--accent-orange)',

            // Actions
            checkIn, // Deprecated but kept for Rest
            startSession,
            endSession,
            sessionActive,
            sessionStartTime,

            isRusting,
            // Proof of Work stub (can remain local or move to engine later)
            initiateTrainingSession: checkIn,
            verifyProofOfWork: () => { }, // No-op for now in simplified V2

            // Debug Tools
            forceReconcile: () => { },

            // ACTIVE PROTOCOL
            activeProtocol: ProtocolService.getActiveProtocol(),

            // SOVEREIGN STATE (New)
            institutionalState
        }}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => useContext(RetentionContext);
