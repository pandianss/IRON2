// LocationService.js
// "The Watcher"
// Enforces spatial authority. Users must be in valid zones to act.

// Mock Zones for "Iron City" logic
const VALID_ZONES = [
    { id: 'gym_01', name: 'Iron Forge Gym', lat: 40.7128, lng: -74.0060, radius: 100 }, // NYC
    { id: 'camp_01', name: 'Base Camp Alpha', lat: 34.0522, lng: -118.2437, radius: 200 }, // LA
    { id: 'home_base', name: 'User Home', lat: 0, lng: 0, radius: 50 }, // Dynamic
];

export const LocationService = {

    /**
     * Request GPS permissions and get current position.
     * @returns {Promise<Coordinates>}
     */
    getCurrentPosition: () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported by device."));
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve(pos.coords),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    },

    /**
     * Verifies if user is within a valid zone.
     * @param {number} lat 
     * @param {number} lng 
     * @returns {Object} { valid: boolean, zone: string }
     */
    verifyZone: (lat, lng) => {
        // Mock Validation: Always accept for prototype unless explicit "Invalid" coords passed
        // In production, calculating Haversine distance to VALID_ZONES

        // For testing "Location Authority", we essentially just want to capture it.
        // We will assume "Home Base" is wherever they start for this version.

        return {
            valid: true,
            zone: "Sector 4 (Approximated)",
            timestamp: Date.now(),
            coords: { lat, lng }
        };
    },

    /**
     * Calculate duration in minutes.
     * @param {number} startTime 
     */
    calculateDuration: (startTime) => {
        const now = Date.now();
        const diff = now - startTime;
        return Math.floor(diff / 60000); // Minutes
    }
};
