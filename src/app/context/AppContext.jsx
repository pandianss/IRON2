import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Import sub-providers
import { UIProvider, useUI } from './UIContext';
import { AuthProvider, useAuth } from './AuthContext';
import { BluetoothProvider, useBluetooth } from './BluetoothContext';
import { DataProvider, useData } from './DataContext';
import { RetentionProvider, useRetention } from './RetentionContext';

// Re-export specific contexts if needed directly
export { UIContext } from './UIContext';
export { AuthContext } from './AuthContext';
export { BluetoothContext } from './BluetoothContext';
export { DataContext } from './DataContext';
export { RetentionContext } from './RetentionContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [appMode] = useState('live');

    // Legacy support if anything calls setAppMode, though it should be removed.
    const setMode = () => console.warn("App Mode is locked to LIVE");

    console.log("DEBUG: AppProvider Rendering");

    return (
        <AppContext.Provider value={{ appMode, setAppMode: setMode }}>
            <UIProvider>
                <BluetoothProvider>
                    <AuthProvider appMode={appMode}>
                        <RetentionProvider>
                            <DataProvider appMode={appMode}>
                                {children}
                            </DataProvider>
                        </RetentionProvider>
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
    const retention = useRetention();
    const appState = useContext(AppContext);

    return {
        ...ui,
        ...auth,
        ...bluetooth,
        ...data,
        ...retention,
        ...appState
        // Manual override if any name collisions (none expected based on my review)
    };
};

export default AppProvider;
