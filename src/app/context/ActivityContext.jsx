import React, { createContext } from 'react';
import { useAppContext } from './AppContext';

const ActivityContext = createContext(null);

export const ActivityProvider = ({ children }) => {
    return (
        <ActivityContext.Provider value={{}}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivity = () => {
    // PROXY: Read from legacy AppContext (which gets it from DataContext)
    const {
        feedActivities,
        logActivity,
        loadMoreFeed,
        hasMoreFeed,
        refreshFeed
    } = useAppContext();

    return {
        feedActivities,
        logActivity,
        loadMoreFeed,
        hasMoreFeed,
        refreshFeed
    };
};
