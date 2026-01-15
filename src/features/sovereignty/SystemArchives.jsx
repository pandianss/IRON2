import React from 'react';
import { X, Database } from 'lucide-react';
import LedgerFeed from '../../components/Mirror/LedgerFeed'; // Repurposing existing component

export const SystemArchives = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col p-6 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Database size={14} /> Global Ledger
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X />
                </button>
            </div>

            {/* Feed Container */}
            <div className="flex-1 overflow-y-auto pr-2">
                <LedgerFeed />
            </div>
        </div>
    );
};
