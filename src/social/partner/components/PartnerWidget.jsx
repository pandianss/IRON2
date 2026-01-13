import React, { useState, useEffect } from 'react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import { UserPlus, ShieldCheck, Loader2, Flame } from 'lucide-react';
import { useAuth } from '../../../app/context/AuthContext';
import InvitePartnerModal from './InvitePartnerModal';
import { EngineService } from '../../../services/engine/EngineService';

const PartnerWidget = () => {
    const { currentUser } = useAuth();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [partnerState, setPartnerState] = useState(null);
    const [loadingState, setLoadingState] = useState(false);

    // Partner data comes directly from the user profile (denormalized)
    const partner = currentUser?.partner;

    useEffect(() => {
        if (!partner?.uid) return;

        const fetchPartnerState = async () => {
            setLoadingState(true);
            try {
                // Read projection
                const state = await EngineService.getUserState(partner.uid);
                if (state) setPartnerState(state);
            } catch (e) {
                console.error("Failed to fetch partner state", e);
            } finally {
                setLoadingState(false);
            }
        };

        fetchPartnerState();
    }, [partner]);

    if (!partner) {
        return (
            <>
                <Card className="glass-panel" style={{ border: '1px dashed var(--text-muted)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold text-sm">ACCOUNTABILITY PACT</h3>
                            <p className="text-zinc-500 text-xs">You are flying solo. Dangerous.</p>
                        </div>
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => setShowInviteModal(true)}
                            icon={UserPlus}
                        >
                            FIND PARTNER
                        </Button>
                    </div>
                </Card>

                {showInviteModal && (
                    <InvitePartnerModal
                        onClose={() => setShowInviteModal(false)}
                        onSuccess={() => setShowInviteModal(false)}
                    />
                )}
            </>
        );
    }

    const initials = partner.name ? partner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
    const streak = partnerState?.streak?.active ? partnerState.streak.count : 0;
    const isTodayDone = partnerState?.today?.status === 'COMPLETED';

    return (
        <Card className="glass-panel" style={{ border: '1px solid var(--accent-orange)' }}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span className="text-xs font-bold text-orange-500 tracking-wider">PACT ACTIVE</span>
                </div>
                {/* Stats Display */}
                <div className="text-zinc-500 text-xs font-mono flex items-center gap-2">
                    {loadingState ? (
                        <Loader2 size={12} className="animate-spin" />
                    ) : (
                        <>
                            {isTodayDone && <span className="text-green-500">READY</span>}
                            <span className="flex items-center text-orange-400">
                                <Flame size={12} className="mr-1" /> {streak}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="font-bold text-zinc-400">{initials}</span>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">{partner.name || 'Partner'}</h4>
                    <p className="text-xs font-bold text-zinc-500">
                        {partnerState ? (isTodayDone ? "Target Destroyed" : "Waiting for Check-in") : "Syncing..."}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default PartnerWidget;

