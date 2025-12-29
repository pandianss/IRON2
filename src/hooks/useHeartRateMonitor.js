import { useState, useRef, useCallback, useEffect } from 'react';

const useHeartRateMonitor = () => {
    const [device, setDevice] = useState(null);
    const [heartRate, setHeartRate] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const parseHeartRate = (value) => {
        // Heart Rate Measurement Characteristic (0x2A37)
        // Flag byte: index 0
        //   Bit 0: 0 -> UINT8 format, 1 -> UINT16 format
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        let hr;
        if (rate16Bits) {
            hr = value.getUint16(1, true); // Little Endian
        } else {
            hr = value.getUint8(1);
        }
        return hr;
    };

    const handleCharacteristicValueChanged = (event) => {
        if (!isMounted.current) return;
        const value = event.target.value;
        const hr = parseHeartRate(value);
        setHeartRate(hr);
    };

    const onDisconnected = useCallback(() => {
        if (!isMounted.current) return;
        console.log('Device Disconnected');
        setIsConnected(false);
        setHeartRate(null);
        setDevice(null);
    }, []);

    const connect = useCallback(async () => {
        try {
            setError(null);
            console.log('Requesting Bluetooth Device...');
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            });

            if (!isMounted.current) return;
            setDevice(device);

            console.log('Connecting to GATT Server...');
            const server = await device.gatt.connect();

            device.addEventListener('gattserverdisconnected', onDisconnected);

            console.log('Getting Heart Rate Service...');
            const service = await server.getPrimaryService('heart_rate');

            console.log('Getting Heart Rate Measurement Characteristic...');
            const characteristic = await service.getCharacteristic('heart_rate_measurement');
            characteristicRef.current = characteristic;

            console.log('Starting Notifications...');
            await characteristic.startNotifications();

            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

            if (!isMounted.current) return;
            setIsConnected(true);
            console.log('Connected!');
        } catch (err) {
            console.error('Bluetooth Connection Error:', err);
            if (isMounted.current) {
                setError(err.message);
                setIsConnected(false);
            }
        }
    }, [onDisconnected]);

    const disconnect = useCallback(() => {
        if (device && device.gatt.connected) {
            device.gatt.disconnect();
        }
    }, [device]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (device) {
                device.removeEventListener('gattserverdisconnected', onDisconnected);
                if (characteristicRef.current) {
                    try {
                        characteristicRef.current.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
                    } catch (e) {
                        console.warn("Could not remove characteristic listener", e);
                    }
                }
                if (device.gatt.connected) {
                    device.gatt.disconnect();
                }
            }
        };
    }, [device, onDisconnected]); // Re-run if device changes to bind new cleanup

    return {
        heartRate,
        isConnected,
        connect,
        disconnect,
        error,
        deviceName: device?.name
    };
};

export default useHeartRateMonitor;
