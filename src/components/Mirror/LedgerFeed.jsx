import React, { useEffect, useState } from 'react';
import { InstitutionalLedger } from '../../core/ledger/LedgerService'; // Direct Import for now, ideally via Service

/**
 * LEDGER FEED
 * Visualizes the Sovereign Ledger History.
 * Answers: "What has happened to me?"
 */
export const LedgerFeed = ({ uid }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock Async Fetch (or real if connected)
        // Since we are in the browser, accessing InstitutionalLedger (which imports node 'crypto') might fail 
        // if build setup handles it. Assuming we have a way to get history.
        // For this Prototype, we'll try to fetch, catch error, and show mock if needed.

        async function fetchHistory() {
            try {
                // In a real app, this runs on client. 
                // InstitutionalLedger is part of Core (Logic), so it can run on Client if 'crypto' is polyfilled.
                // Or we fetch purely from Firestore via a helper.

                // For Prototype Stability: We'll imply the data is passed or fetched via a safe wrapper.
                // Assuming InstitutionalLedger.getHistory returns a Promise in the new Service version.

                const data = await InstitutionalLedger.getHistory(uid);
                setHistory(data.reverse()); // Newest first
            } catch (e) {
                console.error("Ledger Fetch Error", e);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        }

        if (uid) fetchHistory();
    }, [uid]);

    if (loading) return <div className="text-slate-600 text-xs text-center p-4">Syncing Ledger...</div>;

    if (history.length === 0) {
        return <div className="text-slate-600 text-xs text-center p-4">No behavioral records found.</div>;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Behavioral Ledger</h3>
            <div className="space-y-4 relative border-l border-slate-800 ml-3 pl-6">

                {history.map((block, idx) => {
                    const event = block.event;
                    const isSystem = ['GOVERNANCE_ACTION', 'SYSTEM_INTERVENTION', 'SYSTEM_EVENT'].includes(event.type);

                    return (
                        <div key={block.hash} className="relative group">
                            {/* Dot */}
                            <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${isSystem ? 'bg-red-500' : 'bg-slate-600 group-hover:bg-blue-500'} transition-colors`}></div>

                            {/* Card */}
                            <div className="bg-slate-900/50 rounded p-3 border border-slate-800/50 hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-bold ${isSystem ? 'text-red-400' : 'text-slate-300'}`}>
                                        {event.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-slate-600 font-mono">
                                        {new Date(block.timestamp).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="text-xs text-slate-500 mt-1">
                                    {event.payload.subtype || JSON.stringify(event.payload)}
                                </div>

                                {event.meta?.narrativeId && (
                                    <div className="mt-2 pt-2 border-t border-slate-800/50 text-xs text-slate-400 italic">
                                        "Narrative ID: {event.meta.narrativeId.substring(0, 8)}..."
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
