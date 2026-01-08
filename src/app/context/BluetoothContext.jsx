import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import useHeartRateMonitor from '../../hooks/useHeartRateMonitor';

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
    const { heartRate, isConnected: isDeviceConnected, connect: connectDevice, disconnect: disconnectDevice, deviceName, error: deviceError } = useHeartRateMonitor();

    // Fallback Mock BPM if not connected
    const [mockBpm, setMockBpm] = useState(72);
    const bpm = isDeviceConnected && heartRate ? heartRate : mockBpm;

    return (
        <BluetoothContext.Provider value={{
            bpm,
            isDeviceConnected,
            connectDevice,
            disconnectDevice,
            deviceName,
            deviceError
        }}>
            {children}
        </BluetoothContext.Provider>
    );
};

export const useBluetooth = () => {
    const context = useContext(BluetoothContext);
    if (!context) throw new Error('useBluetooth must be used within a BluetoothProvider');
    return context;
};

BluetoothProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default BluetoothContext;
