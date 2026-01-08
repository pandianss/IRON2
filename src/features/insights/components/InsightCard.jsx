import React from 'react';
import Card from '../../../components/UI/Card';
import { Anchor, AlertTriangle, Sun, Sparkles, Brain } from 'lucide-react';
import { useInsights } from '../hooks/useInsights';

const InsightCard = () => {
    const { insight } = useInsights();

    if (!insight) return null;

    const Icons = {
        Anchor: Anchor,
        AlertTriangle: AlertTriangle,
        Sun: Sun
    };

    const Icon = Icons[insight.icon] || Sparkles;
    const isWarning = insight.type === 'WARNING';

    return (
        <Card noPadding className="glass-panel mt-4" style={{
            border: isWarning ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)',
            background: isWarning ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)'
        }}>
            <div className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isWarning ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Icon size={18} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Brain size={12} className="text-zinc-500" />
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isWarning ? 'text-red-400' : 'text-emerald-400'}`}>
                            BEHAVIOR DETECTED
                        </span>
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{insight.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                        {insight.message}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default InsightCard;
