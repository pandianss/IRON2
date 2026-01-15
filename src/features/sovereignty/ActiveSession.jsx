import React, { useEffect, useState } from 'react';
import { useRetention } from '../../app/context/RetentionContext';
import { MapPin, Timer, Square } from 'lucide-react';
import { EvidenceCapture } from './EvidenceCapture';

export const ActiveSession = () => {
    const { sessionStartTime, endSession } = useRetention();
    const [elapsed, setElapsed] = useState(0);
    const [ending, setEnding] = useState(false); // UI State: Transition to Evidence

    // Timer Tick
    useEffect(() => {
        const interval = setInterval(() => {
            if (sessionStartTime) {
                const ms = Date.now() - sessionStartTime;
                setElapsed(Math.floor(ms / 1000));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionStartTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // SUB-PHASE: CAPTURE
    if (ending) {
        return (
            <EvidenceCapture
                onBack={() => setEnding(false)} // Abort end, return to timer
                onSubmit={async (file, tag) => {
                    await endSession(file, tag);
                    // DailyLoop will auto-switch to SystemState upon sessionActive becoming false
                }}
                isSubmitting={false} // Managed by EvidenceCapture internal or pass explicit
            />
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Background Pulse */}
            <div className="absolute inset-0 bg-emerald-900/10 animate-pulse"></div>

            <div className="z-10 flex flex-col items-center">
                <div className="text-xs font-mono text-emerald-500 tracking-[0.3em] mb-8 animate-pulse">
                    SESSION ACTIVE
                </div>

                {/* THE TIMER */}
                <div className="relative mb-8 flex items-center justify-center">
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-full animate-[spin_10s_linear_infinite]"></div>

                    <div className="font-mono text-8xl font-bold tracking-tighter tabular-nums z-10 p-12 relative text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        {formatTime(elapsed)}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-emerald-600/70 text-sm mb-16 uppercase tracking-widest">
                    <MapPin size={14} />
                    <span>Secure Zone Active</span>
                </div>

                {/* END BUTTON */}
                <button
                    onClick={() => setEnding(true)}
                    className="w-24 h-24 bg-red-900/20 border border-red-900 rounded-full flex items-center justify-center hover:bg-red-900/40 transition-all group"
                >
                    <Square size={24} className="text-red-500 fill-current" />
                </button>
                <div className="mt-4 text-[10px] text-red-900 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    TERMINATE
                </div>
            </div>
        </div>
    );
};
