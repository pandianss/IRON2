// StandingSystem.js
// The Central Authority Logic.
// Implements the "IRON Standing State Machine" (9 States).

// --- THE 9 SOVEREIGN STATES ---
export const STANDING = {
    PRE_INDUCTION: 0,   // Outside institution
    INDUCTED: 1,        // Contract signed, no proof
    COMPLIANT: 2,       // Active, good standing
    STRAINED: 3,        // Degrading, integrity lost (<100)
    BREACH_RISK: 4,     // Critical (<80 Integrity)
    VIOLATED: 5,        // Breach (0 Integrity)
    RECOVERY: 6,        // Under repair (Post-breach)
    RECONSTITUTED: 7,   // Returned with scars
    INSTITUTIONAL: 8    // Deep continuity (>100 Days)
};

export const THRESHOLDS = {
    WARNING_HOURS: 20, // Warn after 20 hours
    CRITICAL_HOURS: 22, // Critical after 22 hours
    BREACH_HOURS: 24,   // Default "Day" window

    // Integrity Logic
    BUFFER_DECAY_RATE: 5, // Points lost per hour after 24h
    CRITICAL_INTEGRITY: 80,
    BREACH_INTEGRITY: 0,

    // Progression
    INSTITUTIONAL_STREAK: 100
};

export const StandingSystem = {
    /**
     * Calculates the Sovereign Standing.
     * @param {Date} lastCheckIn - Timestamp of last proof.
     * @param {number} integrity - Current Integrity score (0-100).
     * @param {number} streak - Current active streak.
     * @param {number} scars - Count of permanent scars.
     * @returns {number} - One of STANDING enums (0-8).
     */
    calculateStanding: (lastCheckIn, integrity, streak = 0, scars = 0) => {
        // 1. VIOLATED (The Floor)
        if (integrity <= THRESHOLDS.BREACH_INTEGRITY) return STANDING.VIOLATED;

        // 2. INDUCTED (New User)
        if (!lastCheckIn && streak === 0) return STANDING.INDUCTED;

        // 3. TIME & INTEGRITY CALCULATION
        const now = new Date();
        const diffMs = now - new Date(lastCheckIn);
        const diffHours = diffMs / (1000 * 60 * 60);

        // Effective Integrity (Buffer Logic)
        // Note: In a real Event Sourcing system, this decay would be "applied" by a cron tick.
        // Here, we project it live.
        let projectedIntegrity = integrity;
        if (diffHours > THRESHOLDS.BREACH_HOURS) {
            const overtime = Math.ceil(diffHours - THRESHOLDS.BREACH_HOURS);
            projectedIntegrity -= (overtime * THRESHOLDS.BUFFER_DECAY_RATE);
        }

        // Re-check Violation after projection
        if (projectedIntegrity <= THRESHOLDS.BREACH_INTEGRITY) return STANDING.VIOLATED;

        // 4. BREACH RISK (Critical State)
        if (projectedIntegrity < THRESHOLDS.CRITICAL_INTEGRITY) return STANDING.BREACH_RISK;

        // 5. STRAINED (Degraded State)
        // If integrity is imperfect (<100) OR we are technically late (>24h) but buffered.
        if (projectedIntegrity < 100 || diffHours > THRESHOLDS.BREACH_HOURS) return STANDING.STRAINED;

        // 6. INSTITUTIONAL (High Level)
        if (streak >= THRESHOLDS.INSTITUTIONAL_STREAK) return STANDING.INSTITUTIONAL;

        // 7. RECONSTITUTED (Marked)
        // Good standing, but has history of failure.
        if (scars > 0) return STANDING.RECONSTITUTED;

        // 8. COMPLIANT (Standard)
        return STANDING.COMPLIANT;
    },

    // UI Helper to get human-readable labels/colors
    getLabel: (standingCode) => {
        const MAP = {
            0: { label: 'PRE-INDUCTION', color: 'var(--text-muted)' },
            1: { label: 'INDUCTED', color: 'var(--accent-blue)' },
            2: { label: 'COMPLIANT', color: 'var(--accent-success)' },
            3: { label: 'STRAINED', color: 'var(--accent-orange)' },
            4: { label: 'BREACH RISK', color: 'var(--accent-red)' },
            5: { label: 'VIOLATED', color: '#ff0000' },
            6: { label: 'RECOVERY', color: 'var(--accent-purple)' },
            7: { label: 'RECONSTITUTED', color: 'var(--text-primary)' },
            8: { label: 'INSTITUTIONAL', color: 'gold' }
        };
        return MAP[standingCode] || MAP[0];
    }
};
