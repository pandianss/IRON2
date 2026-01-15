import React from 'react';
import { useRetention } from '../../app/context/RetentionContext';
import { SURFACE } from '../../domain/standing/constants';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Toast from '../../interface/components/Toast'; // Assuming moved or aliased, wait - Toast is in components/UI

// Visual Surfaces (Legacy Components mapped to Architecture)
import { SystemState } from '../system-state/SystemState';
import { ObligationCorridor } from '../obligation-corridor/ObligationCorridor';
import { ConsequenceHall } from '../consequence-hall/ConsequenceHall';
import { ActiveSession } from '../obligation-corridor/ActiveSession'; // Moved to obligation-corridor
import Toast from '../../interface/components/Toast';

export const InstitutionShell = () => {
    const { institutionalState, sessionActive, loading } = useRetention();

    if (loading || !institutionalState) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-slate-600">
                <Loader2 className="animate-spin mr-2" />
                <span className="font-mono text-xs uppercase">Initializing Authority...</span>
            </div>
        );
    }

    const { requiredSurface } = institutionalState;

    // 1. SESSION OVERRIDE (Local UI State pending Engine integration)
    // If we are locally tracking a session, we must show it.
    if (sessionActive) {
        return <ActiveSession />;
    }

    // 2. SOVEREIGN SURFACE ROUTING
    switch (requiredSurface) {
        case SURFACE.INDUCTION:
            return <Navigate to="/onboarding" replace />;

        case SURFACE.CONSEQUENCE:
            return <ConsequenceHall mode="VIOLATED" />;

        case SURFACE.OBLIGATION:
            // If the Engine strictly demands Obligation (e.g. Breach Risk), we force the corridor.
            return <ObligationCorridor />;

        case SURFACE.SYSTEM_STATE:
            // Standard Dashboard
            return (
                <>
                    <SystemState />
                    <Toast />
                </>
            );

        case SURFACE.EVIDENCE:
            // Engine might route here directly if we have an open day but no session?
            // For now, SystemState handles the "Initiate" button.
            return <SystemState />;

        default:
            return (
                <div className="flex h-screen w-full items-center justify-center bg-black text-red-500 font-mono">
                    AUTHORITY ERROR: UNKNOWN SURFACE {requiredSurface}
                </div>
            );
    }
};
