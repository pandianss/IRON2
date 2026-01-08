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

// PROXY: Phase 1
const streakData = useStreaks();
return { ...streakData };
};
