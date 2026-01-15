import React from 'react';
import { useRetention } from '../../app/context/RetentionContext';
import { X, Shield, Scroll, Skull } from 'lucide-react';

export const SystemDossier = ({ onClose }) => {
    const { userState, integrity, scars, era } = useRetention();

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col p-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    Subject Dossier
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X />
                </button>
            </div>

            {/* Identity Block */}
            <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center text-xl font-bold text-slate-500">
                    {userState?.identity?.displayName?.charAt(0) || "U"}
                </div>
                <div>
                    <div className="text-xl font-bold text-white tracking-tight">
                        {userState?.identity?.displayName || "Unknown Subject"}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                        UID: {userState?.uid?.slice(0, 8)}...
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                        <Shield size={12} /> INTEGRITY
                    </div>
                    <div className="text-2xl font-mono text-white">
                        {Math.round(integrity)}%
                    </div>
                    <div className="h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${integrity}%` }} />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                        <Skull size={12} /> SCARS
                    </div>
                    <div className="text-2xl font-mono text-white">
                        {scars || 0}
                    </div>
                </div>
            </div>

            {/* Era Record */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded mb-8 flex-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-4">
                    <Scroll size={12} /> CURRENT ERA
                </div>
                {era ? (
                    <div>
                        <div className="text-lg font-bold text-white mb-1">
                            {era.title}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                            Started: {new Date(era.startDate?.seconds * 1000).toLocaleDateString()}
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-600 text-sm">No Active Era Records.</div>
                )}
            </div>

            <div className="text-center text-[10px] text-slate-700 font-mono">
                INSTITUTIONAL RECORD // DO NOT DISTRIBUTE
            </div>
        </div>
    );
};
