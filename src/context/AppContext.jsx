import React, { useContext } from 'react';
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

export const AppProvider = ({ children }) => {
    return (
        <UIProvider>
            <BluetoothProvider>
                <AuthProvider>
                    <DataProvider>
                        {children}
                    </DataProvider>
                </AuthProvider>
            </BluetoothProvider>
        </UIProvider>
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

    return {
        ...ui,
        ...auth,
        ...bluetooth,
        ...data,
        // Manual override if any name collisions (none expected based on my review)
    };
};

export default AppProvider;
