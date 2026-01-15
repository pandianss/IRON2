import React, { useState } from 'react';
import { useRetention } from '../../app/context/RetentionContext';
import { EvidenceCapture } from './EvidenceCapture';
import { X, FileText } from 'lucide-react';

export const ObligationCorridor = ({ onCancel }) => {
    const [mode, setMode] = useState('REQUIREMENT'); // REQUIREMENT | EVIDENCE
    const { checkIn, startSession } = useRetention();
    const [submitting, setSubmitting] = useState(false);

    // PHASE C: EVIDENCE CAPTURE
    if (mode === 'EVIDENCE') {
        return (
            <EvidenceCapture
                onBack={() => setMode('REQUIREMENT')}
                onSubmit={async (file) => {
                    setSubmitting(true);
                    await checkIn('trained', file);
                    setSubmitting(false);
                    // System will auto-refresh to SystemState (Compliant)
                }}
                isSubmitting={submitting}
            />
        );
    }

    // PHASE B: OBLIGATION CORRIDOR
    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div className="text-xs font-mono text-slate-500">OBLIGATION CORRIDOR</div>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-900 rounded-full transition-colors"
                >
                    <X size={20} className="text-slate-500" />
                </button>
            </div>

            {/* The Requirement */}
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-6">
                    Proof Required.
                </h2>
                <div className="bg-slate-900 p-6 rounded border border-slate-800 mb-8">
                    <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                        <FileText size={16} /> STANDARD PROTOCOL
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Submit photographic evidence of your completed session.
                        The artifact will be permanently hashed to the ledger.
                    </p>
                </div>

                <button
                    onClick={async () => {
                        // PHASE 11: START SESSION (Temporal Authority)
                        await checkIn('start_session_intent'); // Optional: Log intent
                        const result = await startSession();
                        if (result.status === 'error') {
                            alert("Protocol Failure: " + result.error);
                        }
                        // If success, RetentionContext.sessionActive becomes true.
                        // DailyLoop re-renders and shows ActiveSession.
                    }}
                    className="w-full h-16 bg-white text-black font-bold tracking-wide rounded hover:bg-slate-200 transition-colors"
                >
                    INITIATE SESSION
                </button>
            </div>
        </div>
    );
};
