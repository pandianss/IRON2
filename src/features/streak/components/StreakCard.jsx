import React from 'react';
import { Flame, CheckCircle2, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStreaks } from '../hooks/useStreaks';

const StreakCard = () => {
    const { streak, performCheckIn, isCheckedInToday, checkInStatus, initiateTrainingSession } = useStreaks();
    const navigate = useNavigate(); // Need to navigate for proof? No, modal handles it? Wait, initiateTrainingSession sets state. Global modal should pick it up? 
    // Actually, initiateTraining just starts the timer. We need to trigger the LogWorkoutModal or just let them define it. 
    // For now, let's just trigger the session.

    const handleCheckIn = () => {
        if (!isCheckedInToday) {
            performCheckIn();
        }
    };

    const handleUpgrade = async () => {
        await initiateTrainingSession();
        // Trigger generic success toast? Context handles it.
    };

    const isRestDay = isCheckedInToday && checkInStatus === 'rest';

    return (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-0.5 mb-6 shadow-lg shadow-orange-900/20">
            <div className="bg-zinc-900/90 backdrop-blur-sm rounded-[14px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`absolute inset-0 bg-orange-500 blur-md rounded-full opacity-50 ${isCheckedInToday ? 'animate-pulse' : ''}`}></div>
                        <div className="relative bg-gradient-to-br from-orange-400 to-red-500 w-12 h-12 rounded-full flex items-center justify-center text-white border-2 border-orange-300/30">
                            <Flame size={24} fill="currentColor" className={isCheckedInToday ? "animate-bounce" : ""} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            {streak} Day Streak
                        </h3>
                        <p className="text-orange-200/70 text-xs font-medium">
                            {isCheckedInToday
                                ? (isRestDay ? "Recovery Logged. Up for more?" : "You're on fire! 🔥")
                                : "Keep the momentum going!"}
                        </p>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                {isRestDay ? (
                    <button
                        onClick={handleUpgrade}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
                    >
                        <ArrowUpCircle size={16} />
                        UPGRADE
                    </button>
                ) : (
                    <button
                        onClick={handleCheckIn}
                        disabled={isCheckedInToday}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isCheckedInToday
                            ? 'bg-green-500/20 text-green-400 cursor-default'
                            : 'bg-white text-orange-600 hover:bg-orange-50 active:scale-95 shadow-lg shadow-orange-900/50'
                            }`}
                    >
                        {isCheckedInToday ? (
                            <>
                                <CheckCircle2 size={16} />
                                COMPLETED
                            </>
                        ) : (
                            "Check In"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default StreakCard;
