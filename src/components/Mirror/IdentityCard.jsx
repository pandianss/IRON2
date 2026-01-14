import React from 'react';
import { TIERS } from '../../core/behavior/EngineSchema';
import { RETENTION_STATES } from '../../core/governance/RetentionPolicy';

/**
 * IDENTITY CARD
 * Visualizes the User's Institutional Standing.
 * - Role/Tier
 * - Standing (Retention State)
 * - Shield Status
 * - Social Capital
 */
export const IdentityCard = ({ userState }) => {
    const { civil, engagement_state, streak, social, tier } = userState;

    // Derived Logic
    const tierData = TIERS[tier] || TIERS.DORMANT;
    const isShielded = streak.freeze_tokens > 0;

    // Color Mapping
    const stateColors = {
        [RETENTION_STATES.MOMENTUM]: 'text-purple-400',
        [RETENTION_STATES.ENGAGED]: 'text-green-400',
        [RETENTION_STATES.AT_RISK]: 'text-orange-400',
        [RETENTION_STATES.RECOVERING]: 'text-yellow-400',
        [RETENTION_STATES.STREAK_FRACTURED]: 'text-red-500',
        [RETENTION_STATES.DORMANT]: 'text-gray-500',
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex justify-between items-start relative z-10">

                {/* LEFT: Identity & Standing */}
                <div>
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Institutional Identity</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                        {tierData.label}
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">LVL {civil?.authority_level || 1}</span>
                    </div>
                    <div className={`text-sm font-medium mt-1 ${stateColors[engagement_state] || 'text-white'}`}>
                        {engagement_state.replace('_', ' ')}
                    </div>
                </div>

                {/* RIGHT: The Shield */}
                <div className="text-right">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Momentum Shield</div>
                    <div className={`text-xl font-bold ${isShielded ? 'text-blue-400' : 'text-slate-600'}`}>
                        {isShielded ? "ACTIVE" : "EXPOSED"}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                        {streak.freeze_tokens} Freeze Token{streak.freeze_tokens !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* FOOTER: Social Wallet */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <span className="text-sm text-slate-300 font-mono">
                        <span className="text-white font-bold">{social?.social_capital || 0}</span> SC
                    </span>
                </div>
                <div className="text-xs text-slate-600 font-mono">
                    VOTING POWER: {Math.floor((social?.social_capital || 0) / 10)}
                </div>
            </div>
        </div>
    );
};
