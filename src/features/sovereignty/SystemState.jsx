import React, { useState } from 'react';
import { useRetention } from '../../app/context/RetentionContext';
import { StandingSystem } from '../../core/governance/StandingSystem';
import { Shield, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ObligationCorridor } from './ObligationCorridor';

export const SystemState = () => {
    const { standing, streak, checkInStatus, integrity } = useRetention();
    const [actionIntent, setActionIntent] = useState(false);

    // Get UI Data derived from Authority
    const { label, color } = StandingSystem.getLabel(standing);

    // If user clicked "Proceed", we lift them to Phase B (Obligation)
    // purely as a local UI state for now, managed by DailyLoop in future.
    if (actionIntent) {
        return <ObligationCorridor onCancel={() => setActionIntent(false)} />;
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans">

            {/* 1. AUTHORITY HEADER */}
            <div className="mb-12 text-center">
                <div className="text-xs font-mono text-slate-500 tracking-[0.2em] mb-4">
                    IRON AUTHORITY SYSTEM
                </div>
                <div
                    className="text-5xl font-black tracking-tighter"
                    style={{ color: color, textShadow: `0 0 30px ${color}40` }}
                >
                    {label}
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-slate-400 text-sm">
                    <Shield size={14} />
                    <span>INTEGRITY: {Math.round(integrity)}%</span>
                </div>
            </div>

            {/* 2. REALITY BLOCK */}
            <div className="w-full max-w-sm bg-slate-900/50 border border-slate-800 rounded-lg p-8 mb-12 text-center">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">
                    Current Timeline
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                    Day {streak}
                </div>
                <div className="text-slate-400 text-sm">
                    {checkInStatus === 'trained' ? "Protocol Complete" : "Obligation Active"}
                </div>
            </div>

            {/* 3. PRIMARY ACTION (The Gate to Phase B) */}
            {checkInStatus === 'trained' ? (
                <div className="p-6 border border-emerald-900/30 bg-emerald-900/10 rounded-lg flex items-center gap-4">
                    <CheckCircle2 color="var(--accent-success)" />
                    <span className="text-emerald-500 font-medium tracking-wide">
                        DAY CLOSED
                    </span>
                </div>
            ) : (
                <button
                    onClick={() => setActionIntent(true)}
                    className="group relative w-full max-w-sm h-20 bg-white text-black font-bold text-lg tracking-wider rounded flex items-center justify-between px-8 hover:bg-slate-200 transition-all"
                >
                    <span>INITIATE PROTOCOL</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            )}

            {/* 4. FOOTER */}
            <div className="mt-auto pt-12 text-center">
                <p className="text-[10px] text-slate-700 font-mono">
                    ID: {label} /// REF: {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};
