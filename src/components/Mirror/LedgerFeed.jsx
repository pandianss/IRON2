import React, { useEffect, useState } from 'react';
import { InstitutionalLedger } from '../../core/ledger/LedgerService';
import Button from '../../components/UI/Button';

/**
 * LEDGER FEED
 * Visualizes the Sovereign Ledger History.
 * Answers: "What has happened to me?"
 */
export const LedgerFeed = ({ uid }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [verifiedCount, setVerifiedCount] = useState(0);

    useEffect(() => {
        async function fetchHistory() {
            try {
                // Fetch LIVE from Infrastructure Hardened Service
                const data = await InstitutionalLedger.getHistory(uid);
                // Reverse to show newest first, limit to 50 for performance
                setHistory(data.reverse().slice(0, 50));
            } catch (e) {
                console.error("Ledger Fetch Error", e);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        }

        if (uid) fetchHistory();
    }, [uid]);

    const runClientVerification = async () => {
        setVerifying(true);
        // Client-Side Crypto Check
        // We re-import the same logic or call the service helper if it's pure logic.
        // For visual theatre, we'll verify the chain via the service (which runs locally)
        try {
            const isValid = await InstitutionalLedger.verifyChain(uid);
            if (isValid) {
                setVerifiedCount(history.length);
                // Show success toast?
            } else {
                console.error("Verification Mismatch");
            }
        } catch (e) {
            console.error("Verification Failed", e);
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return <div className="text-slate-600 text-xs text-center p-4 animate-pulse">Establishing Secure Uplink...</div>;

    if (history.length === 0) {
        return <div className="text-slate-600 text-xs text-center p-4">Genesis Block Pending. No records found.</div>;
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Behavioral Ledger</h3>
                <button
                    onClick={runClientVerification}
                    disabled={verifying || verifiedCount > 0}
                    className="text-[10px] uppercase font-mono text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                >
                    {verifying ? "Verifying Hash Chain..." : verifiedCount > 0 ? `Chain Verified (${verifiedCount})` : "Verify Integrity"}
                </button>
            </div>

            <div className="space-y-4 relative border-l border-slate-800 ml-3 pl-6">
                {history.map((block, idx) => {
                    const event = block.event || block.data; // Handle potential schema drift (event vs data)
                    const isSystem = ['GOVERNANCE_ACTION', 'SYSTEM_INTERVENTION', 'SYSTEM_EVENT', 'USER_CREATED'].includes(event.type);

                    return (
                        <div key={block.hash} className="relative group">
                            {/* Dot */}
                            <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${isSystem ? 'bg-red-500' : verifiedCount > 0 ? 'bg-emerald-500' : 'bg-slate-600 group-hover:bg-blue-500'} transition-colors`}></div>

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
                                    {event.payload.subtype || event.payload.activityType || "State Transition"}
                                </div>

                                <div className="mt-2 pt-2 border-t border-slate-800/50 flex justify-between items-center">
                                    {event.payload.evidence && (
                                        <div className="mt-3 mb-2">
                                            <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider">Evidence Locker</div>
                                            <a href={event.payload.evidence} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={event.payload.evidence}
                                                    alt="Proof of Work"
                                                    className="w-full h-32 object-cover rounded border border-slate-700 opacity-80 hover:opacity-100 transition-opacity"
                                                />
                                            </a>
                                        </div>
                                    )}

                                    {event.meta?.narrativeId ? (
                                        <span className="text-[10px] text-slate-400 italic">
                                            "{event.meta.narrativeId.substring(0, 8)}..."
                                        </span>
                                    ) : <span className="text-[10px] text-red-900">No Narrative</span>}

                                    <span className="text-[9px] font-mono text-slate-700" title={block.hash}>
                                        HASH: {block.hash.substring(0, 8)}...
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
