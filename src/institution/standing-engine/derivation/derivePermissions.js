import { STANDING } from '../types';

/**
 * @param {Object} context
 * @param {import('../types').Standing} context.standing
 * @returns {import('../types').SystemPermissions}
 */
export function derivePermissions({ standing }) {
    const isViolated = standing === STANDING.VIOLATED;
    const isPreInduction = standing === STANDING.PRE_INDUCTION;

    return {
        mayOpenDay: !isViolated && !isPreInduction,
        mayCloseDay: !isViolated,
        maySubmitEvidence: !isViolated && !isPreInduction,
        mayEnterRecovery: isViolated,
        mayExitInstitution: true,
        mayViewHistory: true
    };
}
