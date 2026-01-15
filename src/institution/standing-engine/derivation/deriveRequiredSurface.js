import { SURFACE } from '../types';

/**
 * @param {import('../types').InstitutionalState} state 
 * @returns {import('../types').SystemSurface}
 */
export function deriveRequiredSurface(state) {
    if (state.standing === 'PRE_INDUCTION') return SURFACE.INDUCTION;
    return SURFACE.SYSTEM_STATE;
}
