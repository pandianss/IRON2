import React from 'react';
import { useRetention } from '../../app/context/RetentionContext';
import { STANDING } from '../../core/governance/StandingSystem';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Toast from '../../components/UI/Toast';
import { ActiveSession } from './ActiveSession';

// Phased Components
import { SystemState } from './SystemState';
import { ObligationCorridor } from './ObligationCorridor';
import { ConsequenceHall } from './ConsequenceHall';

export const DailyLoop = () => {
    const { userState, standing, loading, checkInStatus, sessionActive } = useRetention();

    if (loading || !userState) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-slate-600">
                <Loader2 className="animate-spin mr-2" />
                <span className="font-mono text-xs uppercase">Initializing Authority...</span>
            </div>
        );
    }

    // --- PHASE LOGIC ENGINE ---

    // 0. PRE-INDUCTION (Redirect to Onboarding)
    if (standing === STANDING.PRE_INDUCTION) {
        return <Navigate to="/onboarding" replace />;
    }

    // 1. VIOLATION (Overrides everything)
    if (standing === STANDING.VIOLATED) {
        return (
            <>
                <ConsequenceHall mode="VIOLATED" />
                <Toast />
            </>
        );
    }

    // 1.5. ACTIVE SESSION (The Watcher)
    if (sessionActive) {
        return <ActiveSession />;
    }

    // 2. OBLIGATION (If day is open and not completed)
    // "checkInStatus" is 'trained' if done. Null or other if not.
    // If we are active (INDUCTED+) and haven't checked in...
    if (standing >= STANDING.INDUCTED && checkInStatus !== 'trained') {
        // ...and we are in a valid window (implied by not being VIOLATED/BREACHED yet)

        // CHECK: Is the user clearly indicating intent to act? 
        // For V1 of the Loop, we might separate "Viewing State" (Phase A) from "Doing" (Phase B).
        // Standard Iron Constitution says: "System State" is the entry. 
        // "From System State, the user can only proceed into what the system requires."

        // So default is SYSTEM STATE (Phase A).
        // Phase B is triggered by user interaction OR if time is critical (Breach Risk).

        if (standing === STANDING.BREACH_RISK) {
            // CRITICAL: Force Obligation
            return <ObligationCorridor />;
        }

        // standard: return SystemState, which LINKs to ObligationCorridor
    }

    // Default View: SYSTEM STATE (Phase A)
    return (
        <>
            <SystemState />
            <Toast />
        </>
    );
};
