// StandingSystem.js
// The Central Authority Logic.
// Deterministically calculates a user's standing based on Time and Integrity.

export const STANDING = {
    STABLE: 'STABLE',       // All good. Compliance met.
    WARNING: 'WARNING',     // < 24h remaining.
    CRITICAL: 'CRITICAL',   // < 2h remaining OR Integrity low.
    BREACHED: 'BREACHED'    // Contract violated.
};

export const THRESHOLDS = {
    WARNING_HOURS: 20, // Warn after 20 hours (4 hours left)
    CRITICAL_HOURS: 22, // Critical after 22 hours (2 hours left)
    BREACH_HOURS: 24,   // Breach after 24 hours
    CRITICAL_INTEGRITY: 80, // Integrity below this is always CRITICAL
    BREACH_INTEGRITY: 0,    // Integrity 0 is always BREACHED
    DECAY_RATE_PER_HOUR: 5 // Points lost per hour after 24h
};

export const StandingSystem = {
    /**
     * Calculates the current standing of a user.
     * @param {Date} lastCheckIn - Timestamp of the last valid proof.
     * @param {number} integrity - Current stored integrity score (0-100).
     * @returns {string} - One of STANDING enums.
     */
    calculateStanding: (lastCheckIn, integrity) => {
        // 1. TIME CALCULATION
        if (!lastCheckIn) return STANDING.WARNING;

        const now = new Date();
        const diffMs = now - new Date(lastCheckIn);
        const diffHours = diffMs / (1000 * 60 * 60);

        // 2. EFFECTIVE INTEGRITY (The Buffer)
        // If we owe time (over 24h), we pay with Integrity.
        let effectiveIntegrity = integrity;

        if (diffHours > THRESHOLDS.BREACH_HOURS) {
            const overtimeHours = Math.ceil(diffHours - THRESHOLDS.BREACH_HOURS);
            const penalty = overtimeHours * THRESHOLDS.DECAY_RATE_PER_HOUR;
            effectiveIntegrity = Math.max(0, integrity - penalty);
        }

        // 3. STANDING LOGIC
        if (effectiveIntegrity <= THRESHOLDS.BREACH_INTEGRITY) return STANDING.BREACHED;

        // Critical if actual integrity is low OR if we are bleeding out (Overtime)
        if (effectiveIntegrity < THRESHOLDS.CRITICAL_INTEGRITY) return STANDING.CRITICAL;
        if (diffHours > THRESHOLDS.BREACH_HOURS) return STANDING.CRITICAL; // Bleeding state is always Critical

        if (diffHours >= THRESHOLDS.CRITICAL_HOURS) return STANDING.CRITICAL; // <2h left
        if (diffHours >= THRESHOLDS.WARNING_HOURS) return STANDING.WARNING;   // <4h left

        return STANDING.STABLE;
    }
};
