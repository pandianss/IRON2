
import { runDailyEngine } from './DailyEngine.js';
import { INITIAL_USER_STATE } from './EngineSchema.js';

/**
 * Behavior Test Harness
 * Simulates user journeys to verify deterministic engine logic.
 * Run this with a test runner or manually via Node for now.
 */

const runTest = (name, fn) => {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
    } catch (e) {
        console.error(`❌ FAIL: ${name}`, e.message);
    }
};

const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};

console.log("=== DAILY ENGINE BEHAVIOR HARNESS ===");

runTest("Initial State Creation", () => {
    const state = INITIAL_USER_STATE("test_uid");
    assert(state.streak.count === 0, "Streak should handle 0");
    assert(state.timezone, "Timezone should be set");
});

runTest("Check-in Enhances Streak", () => {
    const startState = INITIAL_USER_STATE("test_uid");
    const today = startState.current_day;

    // ACTION: CHECK_IN
    const action = { type: 'CHECK_IN', id: '123' };
    const newState = runDailyEngine(startState, action, today);

    assert(newState.streak.count === 1, "Streak should be 1");
    assert(newState.streak.active === true, "Streak should be active");
    assert(newState.today.status === 'COMPLETED', "Day status should be COMPLETED");
});

runTest("Double Check-in Prevention", () => {
    const startState = INITIAL_USER_STATE("test_uid");
    const today = startState.current_day;

    // First Check-in
    const s1 = runDailyEngine(startState, { type: 'CHECK_IN' }, today);
    // Second Check-in
    const s2 = runDailyEngine(s1, { type: 'CHECK_IN' }, today);

    assert(s2.lifecycle.total_actions === 1, "Total actions should not increment twice");
    assert(s2 === s1, "State object should be identical (optimization)");
});

runTest("Rest Day Maintains Streak (Simulated)", () => {
    // Note: Current logic actually increments streak for REST to keep momentum
    const startState = INITIAL_USER_STATE("test_uid");
    const today = startState.current_day;

    const newState = runDailyEngine(startState, { type: 'REST' }, today);

    assert(newState.today.status === 'RESTED', "Status should be RESTED");
    assert(newState.streak.count === 1, "Streak count should increment (per current logic)");
});

runTest("Missed Day Breaks Streak", () => {
    // 1. Setup active streak on Day 1
    let state = INITIAL_USER_STATE("test_uid");
    const day1 = "2023-01-01";
    state.current_day = day1;
    state.last_evaluated_day = day1;

    // Check in Day 1
    state = runDailyEngine(state, { type: 'CHECK_IN' }, day1);
    assert(state.streak.count === 1, "Streak 1");

    // 2. Advance to Day 3 (Skipping Day 2)
    const day3 = "2023-01-03";
    state = runDailyEngine(state, null, day3);

    // Day 2 should be MISSED
    assert(state.current_day === day3, "Current day updated");
    assert(state.lifecycle.days_missed >= 1, "Days missed should increment");
    assert(state.streak.active === false, "Streak should be broken");
    assert(state.streak.count === 0, "Streak count reset");
    assert(state.streak.recovery_mode === true, "Recovery mode active");
});

console.log("=== HARNESS COMPLETE ===");
