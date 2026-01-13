import { RETENTION_STATES } from '../governance/RetentionPolicy.js';

/**
 * NARRATIVE ENGINE
 * Authority: Transparency Layer
 * 
 * Translates System State & Physics into Human Language.
 * Ensures the "Right to Explanability".
 */

export const generateNarrative = (user, previousState) => {
    const state = user.engagement_state;
    const streak = user.streak.count;

    let narrative = {
        headline: "",
        explanation: "",
        action: "",
        tone: "NEUTRAL"
    };

    switch (state) {
        case RETENTION_STATES.ONBOARDING:
            narrative.headline = "Welcome to IRON.";
            narrative.explanation = "Your journey begins with a single action.";
            narrative.action = "Complete your first check-in.";
            narrative.tone = "WELCOMING";
            break;

        case RETENTION_STATES.ENGAGED:
            narrative.headline = "System Active.";
            narrative.explanation = `You are consistent. Streak: ${streak} days.`;
            narrative.action = "Keep the momentum.";
            narrative.tone = "POSITIVE";
            break;

        case RETENTION_STATES.MOMENTUM:
            narrative.headline = "Velocity High.";
            narrative.explanation = "You have achieved self-sustaining momentum.";
            narrative.action = "Do not break the chain. The cost is high.";
            narrative.tone = "INTENSE";
            break;

        case RETENTION_STATES.AT_RISK:
            narrative.headline = "Warning: Fracture Imminent.";
            narrative.explanation = previousState.engagement_state === RETENTION_STATES.MOMENTUM
                ? "You are slipping from peak performance."
                : "You missed yesterday.";
            narrative.action = "Check in within 24h to save your streak.";
            narrative.tone = "URGENT";
            break;

        case RETENTION_STATES.STREAK_FRACTURED:
            narrative.headline = "System Lockout.";
            narrative.explanation = "Entropy has set in. Your streak is frozen.";
            narrative.action = "Begin Recovery Protocol (3 Days Required).";
            narrative.tone = "CRITICAL";
            break;

        case RETENTION_STATES.RECOVERING:
            narrative.headline = "Rebuilding Trust.";
            narrative.explanation = "System is verifying your consistency.";
            narrative.action = "Complete your daily actions to restore full access.";
            narrative.tone = "SERIOUS";
            break;

        case RETENTION_STATES.DORMANT:
            narrative.headline = "Signal Lost.";
            narrative.explanation = "You have decayed out of the active system.";
            narrative.action = "Pay Identity Debt to Resurrect.";
            narrative.tone = "FINAL";
            break;
    }

    return narrative;
};
