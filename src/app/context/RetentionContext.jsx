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
import { StandingSystem, STANDING as LEGACY_STANDING } from '../../core/governance/StandingSystem';
import { LocationService } from '../../core/governance/LocationService';
import { evaluateInstitution, STANDING as SOVEREIGN_STANDING } from '../../core/governance/StandingEngine';

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

    // ... (useEffect for Canonical State - UNCHANGED)

    // ... (useEffect for Calculate Standing - UNCHANGED)

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
            activeProtocol: ProtocolService.getActiveProtocol()
        }}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => useContext(RetentionContext);
