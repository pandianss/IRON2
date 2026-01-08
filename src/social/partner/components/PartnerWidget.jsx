import React, { useState } from 'react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';

const PartnerWidget = () => {
    // Mock State for now. 
    // In real implementation, this would come from DataContext or specific hook
    const [partner, setPartner] = useState(null); // { name: 'Sarah Connor', status: 'TRAINED', streak: 12 }

    // Simple mock add
    const handleAdd = () => {
        setPartner({
            name: "Sarah Connor",
            status: "TRAINED",
            streak: 12,
            lastSeen: "Today, 08:30 AM"
        });
    };

    if (!partner) {
        return (
            <Card className="glass-panel" style={{ border: '1px dashed var(--text-muted)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-sm">ACCOUNTABILITY PACT</h3>
                        <p className="text-zinc-500 text-xs">You are flying solo. Dangerous.</p>
                    </div>
                    <Button
                        size="small"
                        variant="secondary"
                        onClick={handleAdd}
                        icon={UserPlus}
                    >
                        FIND PARTNER
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="glass-panel" style={{ border: '1px solid var(--accent-orange)' }}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span className="text-xs font-bold text-orange-500 tracking-wider">PACT ACTIVE</span>
                </div>
                <div className="text-zinc-500 text-xs font-mono">STREAK: {partner.streak}</div>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="font-bold text-zinc-400">SC</span>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">{partner.name}</h4>
                    <p className={`text-xs font-bold ${partner.status === 'TRAINED' ? 'text-green-500' : 'text-zinc-500'}`}>
                        {partner.status === 'TRAINED' ? 'TRAINED TODAY' : 'PENDING'}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default PartnerWidget;
