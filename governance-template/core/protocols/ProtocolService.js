/**
 * Protocol Service
 * Defines the active Governance Protocols available to the Citizen.
 * Currently hardcoded to 'IRON' (Fitness), but extensible for others.
 */

export const ProtocolService = {
    activeProtocol: 'IRON',

    // The Definition of the "Iron" Protocol
    IRON: {
        name: 'IRON PROTOCOL',
        id: 'iron_001',
        description: 'Daily Physical Proof of Work',

        // Actions available in this contract
        actions: [
            {
                type: 'proof',
                label: 'SUBMIT PROOF',
                description: 'Validating evidence on Ledger',
                icon: 'Dumbbell',
                xp: 100
            },
            {
                type: 'defer',
                label: 'TAKE REST',
                description: 'Authorized Recovery Period',
                icon: 'Moon',
                xp: 10
            }
        ],

        // Validation Rules (Client Side Stub)
        validate: (type, payload) => {
            if (type === 'proof' && !payload) return { valid: true };
            return { valid: true };
        }
    },

    // Get the currently active protocol details
    getActiveProtocol: () => {
        return ProtocolService.IRON;
    }
};
