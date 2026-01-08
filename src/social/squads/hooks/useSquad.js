import { useState, useEffect } from 'react';

// Mock Squad Data
const MOCK_SQUAD = {
    id: 'squad_alpha',
    name: 'IRON VANGUARD',
    motto: 'Strength in Unity',
    collectiveStreak: 142, // Total days verified
    members: [
        { id: 'u1', name: 'Marcus V.', status: 'TRAINED', role: 'Captain' },
        { id: 'u2', name: 'Sarah C.', status: 'TRAINED', role: 'Member' },
        { id: 'u3', name: 'Alex R.', status: 'RESTING', role: 'Member' },
        { id: 'u4', name: 'David G.', status: 'PENDING', role: 'Member' }
    ],
    mission: 'Complete 500 Check-ins this month'
};

export const useSquad = () => {
    // In real app, fetch from Firestore based on currentUser.squadId
    const [squad, setSquad] = useState(MOCK_SQUAD);
    const [isLoading, setIsLoading] = useState(false);

    // Mock "Join" or "Create"
    const createSquad = (name) => {
        console.log("Creating squad:", name);
    };

    return {
        squad,
        isLoading,
        createSquad
    };
};
