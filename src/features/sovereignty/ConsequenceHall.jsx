import React from 'react';
import { EraService } from '../../core/governance/EraService';
import { useAuth } from '../../app/context/AuthContext';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export const ConsequenceHall = ({ mode }) => {
    const { currentUser } = useAuth();

    const handlePenance = async () => {
        if (!currentUser) return;
        if (window.confirm("CONFIRM PENANCE: This will terminate the current Era. It cannot be undone.")) {
            // Ideally should wrap in a loader, simplified for now
            await EraService.failCurrentEra(currentUser.uid, 'PENANCE_RITUAL');
            await EraService.startNewEra(currentUser.uid);
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-black text-red-600 p-8 flex flex-col items-center justify-center font-mono">
            <div className="w-24 h-24 border-2 border-red-600 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <AlertOctagon size={48} />
            </div>

            <h1 className="text-4xl font-black mb-4 tracking-tighter text-center">
                STANDING VIOLATED
            </h1>

            <p className="text-center text-red-800 max-w-sm mb-12 leading-relaxed">
                The Ledger records a breach of contract.
                <br />
                Authority has been suspended.
            </p>

            <button
                onClick={handlePenance}
                className="w-full max-w-sm h-16 border border-red-900 text-red-600 hover:bg-red-900/20 transition-colors rounded flex items-center justify-center gap-3"
            >
                <RefreshCw size={20} />
                <span>INITIATE PENANCE</span>
            </button>

            <div className="mt-12 text-[10px] text-red-900">
                ERR_CONTRACT_NULL
            </div>
        </div>
    );
};
