
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


runTest("Missed Day Triggers AT_RISK (Grace Period)", () => {
    // 1. Setup active streak on Day 1
    let state = INITIAL_USER_STATE("test_uid");
    // Force state to ENGAGED
    state.engagement_state = "ENGAGED";
    state.streak.active = true;
    state.streak.count = 10;

    const day1 = "2023-01-01";
    state.current_day = day1;
    state.last_evaluated_day = day1;

    // 2. Advance to Day 3 (Skipping Day 2)
    const day3 = "2023-01-03";
    state = runDailyEngine(state, null, day3);

    // Day 2 was missed. 
    // Expectation: 1 Miss from ENGAGED -> AT_RISK
    assert(state.engagement_state === 'AT_RISK', `Expected AT_RISK, got ${state.engagement_state}`);
    assert(state.streak.active === false, "Streak technically broken (inactive) but salvageable");
    assert(state.recovery.is_salvageable === true, "Should be salvageable");
});

runTest("Second Miss Triggers STREAK_BROKEN", () => {
    let state = INITIAL_USER_STATE("test_uid");
    state.engagement_state = "AT_RISK"; // Already risky
    const day1 = "2023-01-01";
    state.current_day = day1;
    state.last_evaluated_day = day1;

    // Advance 2 days (Miss another one)
    const day3 = "2023-01-03";
    state = runDailyEngine(state, null, day3);

    assert(state.engagement_state === 'STREAK_BROKEN', `Expected STREAK_BROKEN, got ${state.engagement_state}`);
    assert(state.recovery.is_salvageable === false, "No longer salvageable");
});

runTest("Check-in Saves AT_RISK User", () => {
    let state = INITIAL_USER_STATE("test_uid");
    state.engagement_state = "AT_RISK";
    const day1 = "2023-01-01";
    state.current_day = day1;
    state.last_evaluated_day = day1;

    // Action Today (Day 2)
    const day2 = "2023-01-02";
    state = runDailyEngine(state, { type: 'CHECK_IN' }, day2);

    assert(state.engagement_state === 'ENGAGED', `Expected ENGAGED, got ${state.engagement_state}`);
    assert(state.streak.active === true, "Streak Restored");
});

runTest("Broken Streak Starts RECOVERING", () => {
    let state = INITIAL_USER_STATE("test_uid");
    state.engagement_state = "STREAK_BROKEN";
    const day1 = "2023-01-01";
    state.current_day = day1;
    state.last_evaluated_day = day1;

    // Action Today
    const day2 = "2023-01-02";
    state = runDailyEngine(state, { type: 'CHECK_IN' }, day2);

    assert(state.engagement_state === 'RECOVERING', `Expected RECOVERING, got ${state.engagement_state}`);
    assert(state.streak.count === 1, "Streak restarted at 1");
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


runTest("Recovering User Becomes Engaged After 3 Days", () => {
    let state = INITIAL_USER_STATE("test_uid");
    state.engagement_state = "RECOVERING";
    state.streak.count = 0;
    const day0 = "2023-01-01";
    state.current_day = day0;
    state.last_evaluated_day = day0;

    // Day 1: Check In -> Streak 1 (Still Recovering)
    const day1 = "2023-01-02";
    state = runDailyEngine(state, { type: 'CHECK_IN' }, day1);
    assert(state.engagement_state === 'RECOVERING', "Day 1: Still recovering");
    assert(state.streak.count === 1, "Streak 1");

    // Day 2: Check In -> Streak 2 (Still Recovering)
    const day2 = "2023-01-03";
    state = runDailyEngine(state, { type: 'CHECK_IN' }, day2);
    assert(state.engagement_state === 'RECOVERING', "Day 2: Still recovering");

    // Day 3: Check In -> Streak 3 (Completes Recovery!)
    const day3 = "2023-01-04";
    state = runDailyEngine(state, { type: 'CHECK_IN' }, day3);
    assert(state.engagement_state === 'ENGAGED', `Day 3: Expected ENGAGED, got ${state.engagement_state}`);
});


runTest("Support Grants Freeze Token to AT_RISK User", () => {
    let state = INITIAL_USER_STATE("test_uid");

    // Fix dates to match test scenario
    const day0 = "2023-01-01";
    state.current_day = day0;
    state.last_evaluated_day = day0;

    state.engagement_state = "AT_RISK";
    state.streak.freeze_tokens = 0;

    // Receive Support
    state = runDailyEngine(state, { type: 'SEND_SUPPORT' }, day0);

    assert(state.streak.freeze_tokens === 1, "Should grant 1 freeze token");
    assert(state.social.pact_saves === 1, "Should increment pact saves");
});

runTest("Witness Boosts Score", () => {
    let state = INITIAL_USER_STATE("test_uid");
    const day0 = "2023-01-01";
    state.current_day = day0;
    state.last_evaluated_day = day0;

    // Check In first
    state = runDailyEngine(state, { type: 'CHECK_IN' }, day0);
    const initialScore = state.engagement.score;

    // Witness
    state = runDailyEngine(state, { type: 'WITNESS_WORKOUT' }, day0);

    assert(state.engagement.score > initialScore, "Score should increase");
    assert(state.social.witness_count === 1, "Witness count should increment");
});

console.log("=== HARNESS COMPLETE ===");
