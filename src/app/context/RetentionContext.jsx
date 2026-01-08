import React, { createContext } from 'react';
import { useStreaks } from '../../features/streak';
// We import useStreaks directly because it wasn't in AppContext

const RetentionContext = createContext(null);

export const RetentionProvider = ({ children }) => {
    return (
        <RetentionContext.Provider value={{}}>
            {children}
        </RetentionContext.Provider>
    );
};

export const useRetention = () => {
    // PROXY: In Phase 1, we just unite the separate retention hooks

    // 1. Streak Data
    const streakData = useStreaks();

    return {
        ...streakData
        // Future: Nudges, CheckIn State
    };
};
