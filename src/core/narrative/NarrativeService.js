/**
 * NARRATIVE SERVICE
 * Authority: Legibility Layer
 * 
 * Ensures every System Action has a Voice.
 * Translates Data -> Story.
 */

export const NARRATIVE_TEMPLATES = {
    // Physics
    'MOMENTUM_EXTENDED': {
        text: "Continuity validated. Momentum extended for 24 hours.",
        rule: "Physics.1.1"
    },
    'MOMENTUM_LOST': {
        text: "Signal lost. Momentum has degraded to At-Risk.",
        rule: "Physics.1.2"
    },
    'FRACTURE': {
        text: "No signal received despite warning. Streak Fractured.",
        rule: "Physics.1.3"
    },

    // Social
    'WITNESS_VOUCH': {
        text: "{peer} witnessed your effort. +1 Social Capital.",
        rule: "Social.2.1"
    },

    // Justice
    'APPEAL_GRANTED': {
        text: "The Court has accepted your petition. State restored.",
        rule: "Justice.4.1"
    }
};

export class NarrativeService {

    /**
     * Generates a Narrative Object for a given Event.
     * @param {String} type - Event Type
     * @param {Object} context - { peer: "Bob", cost: 10 }
     */
    generate(type, context = {}) {
        const template = NARRATIVE_TEMPLATES[type] || { text: "System State Updated", rule: "System.0" };

        let finalText = template.text;

        // Simple interpolation
        Object.keys(context).forEach(key => {
            finalText = finalText.replace(`{${key}}`, context[key]);
        });

        return {
            text: finalText,
            rule_id: template.rule,
            timestamp: new Date().toISOString(),
            tone: "AUTHORITATIVE" // Default tone
        };
    }
}

export const StoryEngine = new NarrativeService();
