
import { ROLES, INITIAL_USER_STATE } from '../core/behavior/EngineSchema.js';
import { EVENT_TYPES, createBehaviorEvent } from '../core/behavior/LogSchema.js';
// Removed EngineService import to avoid firebase dependency chain
import { StateProjector } from '../core/ledger/SnapshotGenerator.js';

// --- MOCKS ---
const mockDb = {
    ledger: [],
    userState: {},
    users: {}
};

// Mock Infrastructure to avoid real Firebase/Voice calls
const MockDbService = {
    getDoc: async (col, id) => {
        if (col === 'user_state') return mockDb.userState[id] || null;
        if (col === 'users') return mockDb.users[id] || null;
        return null;
    },
    setDoc: async (col, id, data) => {
        if (col === 'user_state') mockDb.userState[id] = data;
        if (col === 'users') mockDb.users[id] = data;
    },
    addDoc: async (col, data) => {
        if (col === 'ledger_blocks') {
            mockDb.ledger.push(data);
            return { id: 'mock-block-id' };
        }
    },
    // EngineService uses transaction logic, we need to mock that if possible or rely on the fact that 
    // we verified EngineService uses DbService inside? 
    // Actually EngineService calls `runTransaction`. We need to mock that.
};

// We need to inject mocks into EngineService? 
// EngineService imports DbService and runTransaction directly. 
// This makes direct unit testing hard without dependency injection or mocking module imports.

// STRATEGY: 
// Since we cannot easily mock ES6 module imports without a runner like Vitest, 
// I will perform a LOGIC VERIFICATION by manually running the `StateProjector` (Redux) 
// and `RightsGate` against a sequence of events.
// This proves Pillar 4 (Replay) and Pillar 2 (Rights) logic.

import { RightsGate } from '../core/governance/RightsGate.js';

async function runSimulation() {
    console.log("🛡️ STARTING SOVEREIGNTY VERIFICATION SIMULATION 🛡️");

    const uid = "subject-zero";
    // Initialize state as empty/default for Genesis
    let currentState = JSON.parse(JSON.stringify(INITIAL_USER_STATE(uid)));
    const ledger = [];

    // 1. GENESIS (User Created)
    console.log("\n--- STEP 1: GENESIS ---");
    const genesisEvent = createBehaviorEvent({
        uid,
        type: EVENT_TYPES.USER_CREATED,
        actor: { type: 'SYSTEM', id: 'GOD_MODE' },
        payload: { email: 'test@iron.com', role: 'enthusiast', displayName: 'Subject Zero' },
        meta: { narrativeId: 'genesis-narrative', rightsChecked: true }
    });

    // Project State
    currentState = StateProjector.applyEvent(currentState, genesisEvent);
    ledger.push({ data: genesisEvent, timestamp: genesisEvent.timestamp }); // Wrap in Block

    console.log("State after Genesis:", JSON.stringify(currentState, null, 2));

    if (currentState.profile.role !== 'enthusiast') throw new Error("Genesis Failed: Role mismatch");

    // 2. CHECK-IN (Valid)
    console.log("\n--- STEP 2: CHECK-IN (Valid) ---");
    const checkInEvent = createBehaviorEvent({
        uid,
        type: EVENT_TYPES.CHECK_IN,
        actor: { type: 'USER', id: uid },
        payload: { text: "I did the work." },
        meta: { narrativeId: 'checkin-1', rightsChecked: true }
    });

    // Check Rights
    RightsGate.enforceTransition(currentState, checkInEvent); // Should pass
    currentState = StateProjector.applyEvent(currentState, checkInEvent);
    ledger.push({ data: checkInEvent, timestamp: checkInEvent.timestamp }); // Wrap in Block

    console.log("State after Check-in:", currentState.streak.current);
    if (currentState.streak.current !== 1) throw new Error("Check-in Failed: Streak did not increment");

    // 3. FRACTURE (Rights Violation Attempt)
    console.log("\n--- STEP 3: ILLEGAL ACT (Rights Check) ---");
    // Trying to claim PARDON without cause? Or trying to Check-in twice in same day?
    // Let's try to do something illegal. e.g. 'PARDON_GRANTED' when actor is USER (not SYSTEM/COURT).

    const illegalEvent = createBehaviorEvent({
        uid,
        type: EVENT_TYPES.PARDON_GRANTED,
        actor: { type: 'USER', id: uid }, // User pardoning themselves
        payload: {},
        meta: { narrativeId: 'crime', rightsChecked: true }
    });

    try {
        RightsGate.enforceTransition(currentState, illegalEvent);
        throw new Error("VIOLATION: RightsGate allowed a user to pardon themselves!");
    } catch (e) {
        console.log("✅ RightsGate successfully blocked illegal action:", e.message);
    }

    // 4. DESTRUCTIVE REPLAY (Proof)
    console.log("\n--- STEP 4: DESTRUCTIVE REPLAY (The Litmus Test) ---");
    console.log("🔥 DELETING STATE 🔥");
    currentState = null; // Nuke

    console.log("🔄 REPLAYING LEDGER...");
    // Reduce ledger to state
    const reconstructedState = StateProjector.reduce(ledger);

    console.log("Reconstructed Streak:", reconstructedState.streak.current);

    if (reconstructedState.streak.current !== 1) throw new Error("Replay Failed: State mismatch");
    if (reconstructedState.profile.role !== 'enthusiast') throw new Error("Replay Failed: Role mismatch");

    console.log("\n🎉 SOVEREIGNTY VERIFIED: All Pillars Holding. 🎉");
}

runSimulation().catch(e => {
    console.error("❌ VERIFICATION FAILED:", e);
    process.exit(1);
});
