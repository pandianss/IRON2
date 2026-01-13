/**
 * SOCIAL CAPITAL ENGINE
 * Authority: Governance Layer
 * 
 * Manages the minting, burning, and decay of Social Capital.
 */

export const SC_RATES = {
    MINT: {
        WITNESS: 1,
        PACT_SAVE: 5,
        MILESTONE_30: 10
    },
    BURN: {
        FRACTURE_PERCENT: 0.50, // Lose 50%
        DORMANCY_PERCENT: 1.00  // Lose 100%
    },
    DECAY: {
        INACTIVITY_DAILY: 1
    }
};

export const SocialCapitalEngine = {

    /**
     * Calculate SC change for an action
     */
    evaluateAction: (actionType) => {
        switch (actionType) {
            case 'WITNESS_WORKOUT': return SC_RATES.MINT.WITNESS;
            case 'SEND_SUPPORT': return SC_RATES.MINT.PACT_SAVE; // Approximation for sim
            default: return 0;
        }
    },

    /**
     * Apply State-Based Penalties
     */
    applyStatePenalties: (currentSC, previousState, newState) => {
        let sc = currentSC;

        // Fracture Penalty
        if (newState.engagement_state === 'STREAK_FRACTURED' && previousState.engagement_state !== 'STREAK_FRACTURED') {
            sc = Math.floor(sc * (1 - SC_RATES.BURN.FRACTURE_PERCENT));
        }

        // Dormancy Penalty
        if (newState.engagement_state === 'DORMANT') {
            sc = 0;
        }

        return sc;
    },

    /**
     * Apply Decay (Entropy of Trust)
     */
    applyDecay: (user) => {
        let sc = user.social.social_capital || 0;
        // Simple linear decay if no social actions today (handled by caller logic usually)
        if (sc > 0) {
            sc = Math.max(0, sc - SC_RATES.DECAY.INACTIVITY_DAILY);
        }
        return sc;
    }
};
