/**
 * NARRATIVE ENGINE
 * Authority: Legibility Layer
 * 
 * Replaces simple strings with Evidence Objects.
 * No State Change is valid without a generated Narrative Object.
 */

// Narrative Object Schema
// {
//    id: "uuid",
//    eventId: "uuid",  // Link to the Physics Event
//    text: "Review complete. Momentum extended.",
//    tone: "AUTHORITATIVE", 
//    ruleId: "Physics.1.1",
//    forwardPath: "/dashboard/streak" // UI Hint
// }

export const NARRATIVE_TEMPLATES = {
    'CHECK_IN': {
        template: "Review logged. Momentum verified for 24 hours.",
        rule: "Physics.CheckIn",
        tone: "NEUTRAL"
    },
    'MOMENTUM_LOST': {
        template: "Silence detected. Momentum State degraded to {newState}.",
        rule: "Physics.Entropy.1",
        tone: "WARNING"
    },
    'FRACTURE': {
        template: "Critical failure. Continuity broken after {days} days.",
        rule: "Physics.Fracture",
        tone: "CRITICAL",
        path: "/intervention/fracture"
    },
    'WITNESS_VOUCH': {
        template: "{actor} witnessed your effort. +1 Social Capital minted.",
        rule: "Social.Vouch",
        tone: "POSITIVE"
    }
};

export class NarrativeEngine {

    /**
     * Generate a Formal Narrative Object for an Event.
     * @param {Object} event - Canonical BehavioralEvent
     * @param {Object} context - { newState: "AT_RISK", days: 12 }
     */
    generate(event, context = {}) {
        const templateData = NARRATIVE_TEMPLATES[event.type] || {
            template: "System Event Recorded.",
            rule: "System.General",
            tone: "NEUTRAL"
        };

        // Interpolate Text
        let text = templateData.template;
        Object.keys(context).forEach(key => {
            text = text.replace(`{${key}}`, context[key]);
        });

        // Use Actor Name if available in context, else generic
        if (context.actorName) {
            text = text.replace(`{actor}`, context.actorName);
        }

        return {
            id: crypto.randomUUID(),
            eventId: event.eventId, // Link to the Physics Truth
            text: text,
            ruleId: templateData.rule,
            tone: templateData.tone,
            forwardPath: templateData.path || null,
            timestamp: new Date().toISOString()
        };
    }
}

export const Voice = new NarrativeEngine();
