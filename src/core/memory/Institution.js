import { createBehaviorEvent } from '../behavior/LogSchema.js';

/**
 * THE INSTITUTION
 * Authority: Institutional Layer
 * 
 * The Singleton Guardian of History.
 * Wraps the Ledger to ensure Causality and Immutability.
 */

class InstitutionService {
    constructor() {
        this.ledger = []; // In-memory for simulation, DB in production
    }

    /**
     * Record an event into the Institution's Memory.
     * Enforces Causality: System actions must have a causal_link_id.
     */
    record(event) {
        // Validation: If it's an Intervention, it SHOULD have a causal link
        if (event.type === 'INTERVENTION' && !event.causal_link_id) {
            console.warn(`[INSTITUTION] Warning: Intervention ${event.subtype} recorded without Causal Link.`);
        }

        // Timestamping
        const archivedEvent = {
            ...event,
            archived_at: new Date().toISOString()
        };

        this.ledger.push(archivedEvent);
        return archivedEvent;
    }

    /**
     * Retrieve the complete Case File for a user.
     * Returns the chronological history.
     */
    getCaseFile(userId) {
        return this.ledger
            .filter(e => e.uid === userId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    /**
     * Retrieve a specific event by ID.
     */
    getEvent(eventId) {
        return this.ledger.find(e => e.id === eventId);
    }
}

export const Institution = new InstitutionService();
