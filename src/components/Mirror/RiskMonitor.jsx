import React from 'react';
import { RETENTION_STATES } from '../../core/governance/RetentionPolicy';

/**
 * RISK MONITOR
 * Visualizes Entropy and Recovery.
 * Answers: "What is about to happen?"
 */
export const RiskMonitor = ({ userState }) => {
    // Safety Check
    if (!userState || !userState.engagement_state) return null;

    const { engagement_state, recovery, retention, current_day, last_evaluated_day, streak } = userState;

    // Logic: Calculate Time Remaining (Simulated)
    // In a real app, we'd diff timestamps. Here we use state flags.

    // 1. AT_RISK: The 24h Countdown
    if (engagement_state === RETENTION_STATES.AT_RISK) {
        return (
            <div className="mt-4 bg-orange-900/20 border border-orange-900/50 rounded-lg p-4 flex items-center gap-4">
                <div className="bg-orange-500 text-black font-bold text-xl w-12 h-12 rounded flex items-center justify-center animate-pulse">
                    !
                </div>
                <div>
                    <h3 className="text-orange-400 font-bold uppercase text-sm tracking-wider">Risk Event Imminent</h3>
                    <p className="text-slate-400 text-sm mt-1">
                        High Entropy detected. Complete an action within <span className="text-white font-mono">24h</span> to secure state.
                    </p>
                </div>
            </div>
        );
    }

    // 2. RECOVERING: The Probation Progress
    if (engagement_state === RETENTION_STATES.RECOVERING) {
        const progress = Math.min(100, ((userState.streak.count || 0) / 3) * 100);

        return (
            <div className="mt-4 bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-4">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-yellow-400 font-bold uppercase text-sm tracking-wider">Probation Active</h3>
                    <span className="text-xs text-yellow-500 font-mono">{(userState.streak.count || 0)} / 3 Days</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                    Maintain consistency to restore Full Standing. Missed days will cause immediate Fracture.
                </p>
            </div>
        );
    }

    // 3. FRACTURED: The Decay
    if (engagement_state === RETENTION_STATES.STREAK_FRACTURED) {
        return (
            <div className="mt-4 bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                    <h3 className="text-red-400 font-bold uppercase text-sm tracking-wider">Entropy Active</h3>
                </div>
                <p className="text-slate-400 text-sm">
                    State is degrading.
                    <span className="block mt-1 font-mono text-red-300">
                        Inactivity Days: {retention?.decay?.inactivity_days || 0} / 7 (Device Death)
                    </span>
                </p>
            </div>
        );
    }

    // 4. Default: Smooth Sailing (Hidden or Passive)
    return (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-600 font-mono px-2">
            <span>ENTROPY: NOMINAL</span>
            <span>NEXT EVALUATION: {current_day} (EOKD)</span>
        </div>
    );
};
