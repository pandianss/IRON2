
import { INITIAL_USER_STATE, ROLES, APPEAL_STATUS } from '../core/behavior/EngineSchema.js';
import { EVENT_TYPES, createBehaviorEvent } from '../core/behavior/LogSchema.js';
import { StateProjector } from '../core/ledger/SnapshotGenerator.js';
import { RightsGate } from '../core/governance/RightsGate.js';

async function runTest() {
    console.log("⚖️  RIGHTS & APPEALS VERIFICATION ⚖️");

    const uid = "subject-alpha";
    const witnessUid = "witness-one";
    // Initialize State
    let state = JSON.parse(JSON.stringify(INITIAL_USER_STATE(uid)));
    state.social.social_capital = 50; // Give capital to allow appeal

    console.log("\n--- STEP 1: APPEAL SUBMISSION ---");
    const appealEvent = createBehaviorEvent({
        uid,
        type: EVENT_TYPES.APPEAL_SUBMITTED,
        actor: { type: 'USER', id: uid },
        payload: { appealId: 'appeal-1', type: 'STREAK_RESTORE', reason: 'System Glitch' },
        meta: { narrativeId: 'story-1' }
    });

    // Check Rights
    RightsGate.enforceAction(EVENT_TYPES.APPEAL_SUBMITTED, state);
    state = StateProjector.applyEvent(state, appealEvent);

    if (!state.civil.active_appeals['appeal-1']) throw new Error("Appeal not created in state");
    console.log("✅ Appeal Created:", state.civil.active_appeals['appeal-1'].status);

    console.log("\n--- STEP 2: EVIDENCE SUBMISSION ---");
    const evidenceEvent = createBehaviorEvent({
        uid,
        type: EVENT_TYPES.EVIDENCE_SUBMITTED,
        actor: { type: 'USER', id: uid },
        payload: { appealId: 'appeal-1', evidenceId: 'ev-1', type: 'IMAGE', url: 'http://proof.jpg' }
    });

    state = StateProjector.applyEvent(state, evidenceEvent);
    if (!state.civil.active_appeals['appeal-1'].evidence_ids.includes('ev-1')) throw new Error("Evidence not linked");
    console.log("✅ Evidence Linked");

    console.log("\n--- STEP 3: SELF-VOUCH ATTEMPT (Illegal) ---");
    // User tries to act as witness for themselves
    try {
        RightsGate.canVote(state, { id: uid, type: 'WITNESS' }, 'appeal-1');
        throw new Error("VIOLATION: RightsGate allowed Self-Vouching!");
    } catch (e) {
        if (e.code === 'CONFLICT_OF_INTEREST') {
            console.log("✅ Blocked Self-Vouching:", e.message);
        } else {
            throw e;
        }
    }

    console.log("\n--- STEP 4: WITNESS VOTE (Valid) ---");
    // Valid Witness
    const witnessActor = { id: witnessUid, type: 'WITNESS' };
    RightsGate.canVote(state, witnessActor, 'appeal-1');

    const voteEvent = createBehaviorEvent({
        uid, // The subject of the event is the USER
        type: EVENT_TYPES.WITNESS_VOTE,
        actor: witnessActor, // The ACTOR is the witness
        payload: { appealId: 'appeal-1', vote: 'VOUCH', commentary: 'I saw it.' }
    });

    state = StateProjector.applyEvent(state, voteEvent);

    if (!state.civil.active_appeals['appeal-1'].witnesses[witnessUid]) throw new Error("Witness vote not recorded");
    console.log("✅ Witness Vote Recorded");

    console.log("\n--- STEP 5: EVIDENCE REQUIREMENT CHECK ---");
    // Create a dummy appeal with NO evidence
    state.civil.active_appeals['appeal-empty'] = { id: 'appeal-empty', evidence_ids: [] };
    try {
        RightsGate.canDecide(state, 'appeal-empty');
        throw new Error("VIOLATION: Allowed decision on empty appeal");
    } catch (e) {
        if (e.code === 'INCOMPLETE_CASE') {
            console.log("✅ Blocked Incomplete Case:", e.message);
        } else {
            throw e;
        }
    }

    console.log("\n--- STEP 6: JUDGMENT DAY ---");
    const judgmentEvent = createBehaviorEvent({
        uid,
        type: EVENT_TYPES.APPEAL_DECIDED,
        actor: { type: 'COURT', id: 'SYSTEM_JUDGE' },
        payload: { appealId: 'appeal-1', verdict: 'APPROVED', narrative: 'Justice Served.' }
    });

    state = StateProjector.applyEvent(state, judgmentEvent);

    if (state.civil.active_appeals['appeal-1']) throw new Error("Appeal should be removed from active");
    const archived = state.civil.appeal_history.find(a => a.id === 'appeal-1');
    if (!archived || archived.status !== 'APPROVED') throw new Error("Appeal not properly archived");

    if (state.civil.ritual_history.pardons_received !== 1) throw new Error("Pardon count not incremented");

    console.log("✅ Appeal Approved & Archived. System is Just.");
}

runTest().catch(e => {
    console.error("❌ TEST FAILED:", e);
    process.exit(1);
});
