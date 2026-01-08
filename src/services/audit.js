import { db } from '../infrastructure/firebase.config';

export const AuditService = {
    /**
     * Logs an audit event to Firestore.
     * @param {string} action - The action performed (e.g., 'USER_LOGIN', 'GYM_APPROVED').
     * @param {object} performedBy - User object of who performed the action ({uid, email, role}).
     * @param {object} target - Target object affected ({id, name, type}).
     * @param {object} details - Additional details about the event.
     */
    log: async (action, performedBy, target = {}, details = {}) => {
        try {
            const logEntry = {
                action,
                performedBy: {
                    uid: performedBy?.uid || 'system',
                    email: performedBy?.email || 'system',
                    role: performedBy?.role || 'system',
                },
                target,
                details,
                metadata: {
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                }
            };

            await DbService.addDoc('audit_logs', logEntry);
            console.log(`[Audit] ${action} logged.`);
        } catch (error) {
            console.error("[Audit] Failed to log event:", error);
            // We don't throw here to avoid blocking the main flow if logging fails
        }
    },

    /**
     * Fetches audit logs from Firestore.
     * @param {number} limitCount - Number of logs to fetch.
     */
    getLogs: async (limitCount = 50) => {
        try {
            // Note: This relies on DbService.getPaginatedDocs or similar if we want true pagination.
            // For now, we'll use a simple fetch or assuming DbService has a way to get sorted docs.
            // Since DbService.getPaginatedDocs supports ordering, we use it.
            const { data } = await DbService.getPaginatedDocs('audit_logs', limitCount, null, 'metadata.timestamp');
            return data;
        } catch (error) {
            console.error("[Audit] Failed to fetch logs:", error);
            return [];
        }
    }
};
