/**
 * VIOLATION REGISTRY
 * Authority: Governance Layer (Audit)
 * 
 * Logs every attempt to violate the System Rights.
 * This is the separate "Constitutional Audit Log" required by Workstream 2.
 */

export class ViolationRegistry {
    constructor() {
        this.log = [];
    }

    /**
     * Record a failed transition attempt.
     * @param {Object} violation
     * @param {String} violation.type - VIOLATION_TYPE
     * @param {String} violation.actorId - Who attempted it
     * @param {String} violation.targetId - Who was the victim
     * @param {String} violation.rule - Rule ID cited
     * @param {Object} violation.details - Context
     */
    record({ type, actorId, targetId, rule, details }) {
        const entry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            type,
            actorId,
            targetId,
            rule,
            details
        };

        console.error(`[RIGHTS VIOLATION] ${type}: ${JSON.stringify(details)}`);
        this.log.push(entry);

        return entry;
    }

    getViolations(targetId) {
        return this.log.filter(entry => entry.targetId === targetId);
    }
}

export const ConstitutionalAudit = new ViolationRegistry();
