import React from 'react';
import { Flame, CheckCircle2, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStreaks } from '../hooks/useStreaks';

const StreakCard = () => {
    const { streak, performCheckIn, isCheckedInToday, checkInStatus, initiateTrainingSession, history } = useStreaks();
    const navigate = useNavigate();

    const handleCheckIn = () => {
        if (!isCheckedInToday) {
            performCheckIn();
        }
    };

    const handleUpgrade = async () => {
        await initiateTrainingSession();
    };

    const isRestDay = isCheckedInToday && checkInStatus === 'rest';

    // --- CALENDAR LOGIC ---
    // Generate last 30 days
    const days = React.useMemo(() => {
        const dates = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }, []);

    return (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-0.5 mb-6 shadow-lg shadow-orange-900/20">
            <div className="bg-zinc-900/90 backdrop-blur-sm rounded-[14px] p-4">
                <div className="flex items-center justify-between mb-4">
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
                    {isRestDay && (
                        <button
                            onClick={handleUpgrade}
                            className="px-4 py-2 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
                        >
                            <ArrowUpCircle size={16} />
                            UPGRADE
                        </button>
                    )}
                    {/* If checked in and not rest day, show NOTHING as requested */}
                    {!isCheckedInToday && !isRestDay && (
                        <button
                            onClick={handleCheckIn}
                            className="px-4 py-2 rounded-full text-sm font-bold bg-white text-orange-600 hover:bg-orange-50 active:scale-95 shadow-lg shadow-orange-900/50 transition-all duration-300 flex items-center gap-2"
                        >
                            Check In
                        </button>
                    )}
                </div>

                {/* 30 DAY HISTORY GRID - Debug Visibility */}
                <div className="border-t border-white/20 pt-3 px-4 pb-3 w-full">
                    <div className="text-[10px] items-center gap-1 font-bold text-zinc-500 mb-2 tracking-wider flex">
                        ACTIVITY HISTORY (DEBUG V2: {days.length} DAYS)
                    </div>
                    {/* CONTAINER: CSS Grid for robustness */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${days.length}, 1fr)`,
                        gap: '2px',
                        height: '40px',
                        width: '100%',
                        background: '#27272a', // zinc-800
                        padding: '4px',
                        borderRadius: '8px',
                        marginBottom: '16px' // Visual Gap
                    }}>
                        {days.map((date, index) => {
                            const status = history ? history[date] : null; // 'trained' | 'rest' | undefined

                            // Colors (Inline styles to guarantee render)
                            let bg = '#ef4444'; // red-500 (Inactive)
                            if (status === 'trained') bg = '#22c55e'; // green-500
                            else if (status === 'rest') bg = '#fb923c'; // orange-400

                            return (
                                <div
                                    key={date}
                                    title={`${date}: ${status || 'No Activity'}`}
                                    style={{
                                        backgroundColor: bg,
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '2px',
                                        opacity: 0.8
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreakCard;
