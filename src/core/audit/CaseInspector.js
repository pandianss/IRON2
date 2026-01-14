/**
 * CASE INSPECTOR (Forensics)
 * Authority: Institutional Layer
 * 
 * Capability: Explains "Why".
 * Traces the causal chain of an event.
 */

import { InstitutionalLedger } from '../ledger/LedgerService.js';

export class CaseInspector {

    /**
     * Trace an Event's DNA.
     * @param {String} eventHash 
     */
    inspect(eventHash) {
        const chain = InstitutionalLedger.chain;
        const block = chain.find(b => b.hash === eventHash);

        if (!block) return { error: "Event Not Found in Ledger" };

        const event = block.data;

        return {
            summary: `Event ${event.type} by ${event.actor.type}`,
            timestamp: block.timestamp,
            cause: {
                previous_state_hash: block.prevHash,
                rule_cited: event.meta.ruleIds.join(', ') || "None",
            },
            narrative_id: event.meta.narrativeId,
            rights_checked: event.meta.rightsChecked.length > 0
        };
    }

    /**
     * Get all interventions for a user.
     */
    getCriminalRecord(uid) {
        const history = InstitutionalLedger.getHistory(uid);
        return history
            .filter(h => h.event.type === 'GOVERNANCE_ACTION' || h.event.type === 'SYSTEM_INTERVENTION')
            .map(h => ({
                date: h.timestamp,
                action: h.event.payload.subtype || h.event.type,
                reason: h.event.meta.ruleIds
            }));
    }
}

export const Inspector = new CaseInspector();
