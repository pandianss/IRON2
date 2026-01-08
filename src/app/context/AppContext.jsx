import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Import sub-providers
import { UIProvider, useUI } from './UIContext';
import { AuthProvider, useAuth } from './AuthContext';
import { BluetoothProvider, useBluetooth } from './BluetoothContext';
import { DataProvider, useData } from './DataContext';

// Re-export specific contexts if needed directly
export { UIContext } from './UIContext';
export { AuthContext } from './AuthContext';
export { BluetoothContext } from './BluetoothContext';
export { DataContext } from './DataContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [appMode, setAppMode] = useState(() => {
        return localStorage.getItem('iron_app_mode') || null;
    });

    const setMode = (mode) => {
        setAppMode(mode);
        localStorage.setItem('iron_app_mode', mode);
    };

    return (
        <AppContext.Provider value={{ appMode, setAppMode: setMode }}>
            <UIProvider>
                <BluetoothProvider>
                    <AuthProvider appMode={appMode}>
                        <DataProvider appMode={appMode}>
                            {children}
                        </DataProvider>
                    </AuthProvider>
                </BluetoothProvider>
            </UIProvider>
        </AppContext.Provider>
    );
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};

// Unified Hook for Backward Compatibility
// This ensures we don't need to refactor 50+ components that import useAppContext
export const useAppContext = () => {
    const ui = useUI();
    const auth = useAuth();
    const bluetooth = useBluetooth();
    const data = useData();
    const appState = useContext(AppContext);

    return {
        ...ui,
        ...auth,
        ...bluetooth,
        ...data,
        ...appState
        // Manual override if any name collisions (none expected based on my review)
    };
};

export default AppProvider;
