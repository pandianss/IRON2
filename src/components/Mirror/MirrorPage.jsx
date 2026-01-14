import React, { useEffect, useState } from 'react';
import { IdentityCard } from './IdentityCard';
import { RiskMonitor } from './RiskMonitor';
import { LedgerFeed } from './LedgerFeed';
import { EngineService } from '../../services/engine/EngineService'; // Data Source
import { AuthService } from '../../infrastructure/firebase';

/**
 * THE MIRROR PAGE
 * Route: /mirror
 * 
 * The Single Source of Truth for the User.
 */
export const MirrorPage = () => {
    const [userState, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const user = await AuthService.getCurrentUser();
            if (user) {
                const state = await EngineService.getUserState(user.uid);
                setUserState(state);
            }
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div className="min-h-screen bg-black text-slate-500 flex items-center justify-center">Authenticating...</div>;
    if (!userState) return <div className="min-h-screen bg-black text-slate-500 flex items-center justify-center">No Identity Found.</div>;

    return (
        <div className="min-h-screen bg-black text-slate-200 font-sans p-4 md:p-8 max-w-2xl mx-auto">

            {/* Header / Nav Shim */}
            <div className="mb-8 flex justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
                <a href="/" className="text-xs font-mono text-slate-500 hover:text-white">&larr; BACK TO OPERATIONS</a>
                <span className="text-xs font-mono text-slate-600">IRON INSTITUTION v13</span>
            </div>

            <h1 className="text-3xl font-bold mb-6 tracking-tight text-white">State Mirror</h1>

            {/* 1. Identity & Standing */}
            <IdentityCard userState={userState} />

            {/* 2. The Future (Risk) */}
            <RiskMonitor userState={userState} />

            {/* 3. The History (Ledger) */}
            <LedgerFeed uid={userState.uid} />

        </div>
    );
};
