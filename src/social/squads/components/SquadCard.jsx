import React from 'react';
import Card from '../../../components/UI/Card';
import { Users, Shield, Zap } from 'lucide-react';
import { useSquad } from '../hooks/useSquad';

const SquadCard = () => {
    const { squad } = useSquad();

    if (!squad) return null;

    // Calculate active count
    const trainedCount = squad.members.filter(m => m.status === 'TRAINED').length;
    const totalMembers = squad.members.length;

    return (
        <Card noPadding className="glass-panel" style={{
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(135deg, rgba(20,20,20,0.95), rgba(0,0,0,0.95))'
        }}>
            <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-900/20 border border-orange-500/30 flex items-center justify-center">
                            <Shield className="text-orange-500" size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold font-display italic tracking-wider text-lg">
                                {squad.name}
                            </h3>
                            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                                {squad.motto}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-orange-400">
                            <Zap size={14} fill="currentColor" />
                            <span className="font-mono font-bold text-lg leading-none">{squad.collectiveStreak}</span>
                        </div>
                        <span className="text-[10px] text-zinc-600 uppercase font-bold">Empire Streak</span>
                    </div>
                </div>

                {/* Member Status Dots */}
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex -space-x-2">
                        {squad.members.map((member, i) => (
                            <div
                                key={member.id}
                                className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white
                                    ${member.status === 'TRAINED' ? 'bg-green-600' : member.status === 'RESTING' ? 'bg-blue-600' : 'bg-zinc-700'}
                                `}
                                title={`${member.name}: ${member.status}`}
                            >
                                {member.name.charAt(0)}
                            </div>
                        ))}
                    </div>
                    <div className="text-xs font-bold text-zinc-400">
                        <span className="text-white">{trainedCount}</span>/{totalMembers} DEPLOYED
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default SquadCard;
