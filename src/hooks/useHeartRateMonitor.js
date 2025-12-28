import { useState, useRef, useCallback } from 'react';

const useHeartRateMonitor = () => {
    const [device, setDevice] = useState(null);
    const [heartRate, setHeartRate] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const characteristicRef = useRef(null);

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
        const value = event.target.value;
        const hr = parseHeartRate(value);
        setHeartRate(hr);
    };

    const connect = useCallback(async () => {
        try {
            setError(null);
            console.log('Requesting Bluetooth Device...');
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            });

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

            setIsConnected(true);
            console.log('Connected!');
        } catch (err) {
            console.error('Bluetooth Connection Error:', err);
            setError(err.message);
            setIsConnected(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        if (device && device.gatt.connected) {
            device.gatt.disconnect();
        }
    }, [device]);

    const onDisconnected = () => {
        console.log('Device Disconnected');
        setIsConnected(false);
        setHeartRate(null);
        setDevice(null);
    };

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
