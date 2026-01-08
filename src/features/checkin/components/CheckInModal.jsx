import React from 'react';
import { Dumbbell, Moon, Clock, Trophy } from 'lucide-react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';

const CheckInModal = ({ isOpen, onCheckIn, onDismiss, currentStreak }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
            <div className="animate-slide-up w-full max-w-sm">
                <Card className="glass-panel" style={{ border: '1px solid var(--accent-orange)' }}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4 border border-orange-500/20">
                            <Trophy size={32} className="text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-white mb-2 font-display">
                            DAILY PROTOCOL
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Did you show up for yourself today?
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => onCheckIn('trained')}
                            style={{ height: '56px', fontSize: '1.1rem' }}
                            icon={Dumbbell}
                        >
                            YES, I TRAINED
                        </Button>

                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => onCheckIn('rest')}
                            style={{ height: '56px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            icon={Moon}
                        >
                            REST DAY
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={onDismiss}
                            className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <Clock size={12} />
                            Not Yet (Ask me later)
                        </button>
                    </div>

                    {currentStreak > 0 && (
                        <div className="mt-6 pt-6 border-t border-white/5 text-center">
                            <span className="text-orange-500 font-black text-sm tracking-wider">
                                {currentStreak} DAY STREAK AT RISK
                            </span>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CheckInModal;
