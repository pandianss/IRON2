import React, { useState } from 'react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import { UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../../app/context/AuthContext';
import InvitePartnerModal from './InvitePartnerModal';

const PartnerWidget = () => {
    const { currentUser } = useAuth();
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Partner data comes directly from the user profile (denormalized)
    const partner = currentUser?.partner;

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

    // Determine partner status (Mock for now, eventually check partner's last check-in)
    // Since we don't have the partner's live status here without a query, 
    // we might need to rely on what was synced or just show generic "Active".
    // For Phase 1 MVP, we just show they are linked.

    const initials = partner.name ? partner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

    return (
        <Card className="glass-panel" style={{ border: '1px solid var(--accent-orange)' }}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span className="text-xs font-bold text-orange-500 tracking-wider">PACT ACTIVE</span>
                </div>
                {/* 
                  Phase 1: We don't have shared streak yet in the user doc. 
                  We can default to 0 or hide it until synced.
                */}
                <div className="text-zinc-500 text-xs font-mono">LINKED</div>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="font-bold text-zinc-400">{initials}</span>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">{partner.name || 'Partner'}</h4>
                    <p className="text-xs font-bold text-zinc-500">
                        ACCOUNTABILITY PARTNER
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default PartnerWidget;

