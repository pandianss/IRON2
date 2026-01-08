import React from 'react';
import Card from '../../../components/UI/Card';
import { Trophy, Clock } from 'lucide-react';

const ChallengeCard = () => {
    // Mock Data
    const challenge = {
        title: "HELL WEEK PROTOCOL",
        description: "7 Days. Zero Excuses.",
        daysTotal: 7,
        daysComplete: 5,
        status: "ACTIVE",
        timeLeft: "2 Days"
    };

    const progress = (challenge.daysComplete / challenge.daysTotal) * 100;

    return (
        <Card noPadding className="glass-panel mt-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500 tracking-wider">ACTIVE CHALLENGE</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase">
                        <Clock size={10} />
                        {challenge.timeLeft} LEFT
                    </div>
                </div>

                <div className="mb-3">
                    <h3 className="text-white font-bold italic tracking-wide">{challenge.title}</h3>
                    <p className="text-zinc-500 text-xs">{challenge.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-zinc-500 font-mono">DAY {challenge.daysComplete}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">GOAL: {challenge.daysTotal}</span>
                </div>
            </div>
        </Card>
    );
};

export default ChallengeCard;
