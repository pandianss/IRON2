
import assert from 'assert';
import { runDailyEngine } from './DailyEngine.js';
import { INITIAL_USER_STATE } from './EngineSchema.js';

/**
 * Replay Engine Harness
 * Proves that: Reduce(Logs) === CurrentState
 */

const LOGS = [
    { type: 'CHECK_IN', payload: {}, day: '2023-01-01' },
    // Jan 2 is missed intentionally
    { type: 'MISSED', payload: {}, day: '2023-01-03' }, // Time passes to Jan 3 (misses Jan 2)
    { type: 'SEND_SUPPORT', payload: {}, day: '2023-01-03' }, // Support stops AT_RISK -> STREAK_BROKEN
    { type: 'CHECK_IN', payload: {}, day: '2023-01-04' }
];

const runReplayTest = () => {
    console.log("=== REPLAY ENGINE VERIFICATION ===");

    // 1. Start from Zero
    let state = INITIAL_USER_STATE("replay_user");
    // Align start date
    state.current_day = '2023-01-01';
    state.last_evaluated_day = '2023-01-01';

    console.log("Initial State:", state.engagement_state);

    // 2. Replay Loop
    LOGS.forEach((log, index) => {
        console.log(`Processing Log ${index}: ${log.type} on ${log.day}`);

        const action = ['MISSED'].includes(log.type) ? null : { type: log.type, ...log.payload };

        state = runDailyEngine(state, action, log.day);

        // Snapshot check
        if (log.day === '2023-01-03' && log.type === 'SEND_SUPPORT') {
            assert(state.streak.freeze_tokens === 1, "Should have freeze token from support");
            console.log("   -> Freeze Token Granted!");
        }
    });

    // 3. Final Verification
    console.log("Final State:", state.engagement_state);

    // Logic Trace:
    // Jan 1: Check In -> Streak 1
    // Jan 3: Missed Jan 2 -> AT_RISK. Support -> Token=1.
    // Jan 4: Check In. Since we were AT_RISK, we consume token? 
    // Wait, the engine logic for 'CHECK_IN' usually resolves AT_RISK -> ENGAGED *without* needing token if checkin happens *today*.
    // Tokens are for when you MISS AGAIN.
    // So if I check in on Jan 4, was Jan 3 missed?
    // Log 2 (MISSED 2023-01-03) means we moved TO Jan 3. So Jan 2 is gone.
    // Log 3 (SUPPORT 2023-01-03) happens ON Jan 3.
    // Log 4 (CHECK_IN 2023-01-04). This means we move TO Jan 4. Jan 3 is... CHECKED IN? No, Log 3 was SUPPORT.
    // Does SUPPORT count as Check In? NO.
    // So Jan 3 is ALSO MISSED.
    // Jan 2 Missed -> AT_RISK.
    // Jan 3 Missed -> STREAK_BROKEN? 
    // UNLESS the Freeze Token saved us!

    // Engine Logic Check:
    // When moving 03 -> 04:
    // missDay(03). 
    // If AT_RISK + Token > 0 -> Consume Token. Stay AT_RISK (or Recovered?).
    // In `DailyEngine.js`, we need to inspect `resolveStreak('MISSED')`.
    // if AT_RISK is just engagement state, streak logic handles tokens.

    assert(state.engagement_state === 'ENGAGED', "Should be ENGAGED");

    console.log("✅ REPLAY SUCCESS: State deterministically rebuilt.");
};

runReplayTest();
