import React, { createContext, useContext } from 'react';
import { useAppContext } from './AppContext';

// Phase 1: Alias Context
// Eventually this will hold the actual state logic for User Session (Auth, Mode, Onboarding)

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
    // In Phase 1, we don't hold state here yet. 
    // We strictly rely on the existing AppProvider stack.
    return (
        <SessionContext.Provider value={{}}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    return useAppContext();
};
