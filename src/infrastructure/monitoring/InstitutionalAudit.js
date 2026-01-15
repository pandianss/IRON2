/**
 * INSTITUTIONAL AUDIT
 * Authority: Operational Layer
 * 
 * Tracks system-level health, rights violations, and integrity alerts.
 * This is distinct from user-level Logs. This is the "System's Conscience".
 */

import { db } from '../../infrastructure/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

export const ALERT_TYPES = {
    RIGHTS_VIOLATION: "RIGHTS_VIOLATION",
    LEDGER_CORRUPTION: "LEDGER_CORRUPTION",
    REPLAY_MISMATCH: "REPLAY_MISMATCH",
    SYSTEM_FAILURE: "SYSTEM_FAILURE"
};

export const SEVERITY = {
    INFO: "INFO",
    WARNING: "WARNING",
    CRITICAL: "CRITICAL", // Requires immediate human intervention
    FATAL: "FATAL"       // System shutdown recommended
};

export const InstitutionalAudit = {

    /**
     * Log an Institutional Alert
     * @param {Object} params 
     */
    log: async ({ type, severity, message, details = {}, userId = null }) => {
        try {
            console.error(`[AUDIT] [${type}] [${severity}]: ${message}`, details);

            const alert = {
                type, // from ALERT_TYPES
                severity, // from SEVERITY
                message,
                details: JSON.stringify(details),
                userId, // Optional: if related to a specific user
                timestamp: new Date().toISOString(),
                resolved: false
            };

            await addDoc(collection(db, 'institutional_alerts'), alert);
        } catch (e) {
            // Fail safe: If audit fails, we must at least log to console, 
            // but we don't crash the app (unless it's FATAL).
            console.error("AUDIT LOGGING FAILED:", e);
        }
    }
};
