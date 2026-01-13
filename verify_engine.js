
import { runDailyEngine } from './src/engine/DailyEngine.js';
import { INITIAL_USER_STATE } from './src/engine/EngineSchema.js';

// Helper to simulate time passing and actions
const simulate = (startState, scenario) => {
    let state = JSON.parse(JSON.stringify(startState));
    console.log(`\n--- Scenario: ${scenario.name} ---`);

    scenario.step.forEach((op, index) => {
        const { date, action } = op;
        state = runDailyEngine(state, action, date);
        console.log(`[${date}] Activ: ${state.streak.active}, Count: ${state.streak.count}, Status: ${state.today.status}`);
    });
    return state;
};

const runTests = () => {
    const today = new Date().toISOString().split('T')[0];
    const uid = 'TEST_USER';

    // 1. Perfect 5-Day Streak
    const startState = INITIAL_USER_STATE(uid);
    startState.current_day = '2025-01-01';
    startState.last_evaluated_day = '2025-01-01';

    simulate(startState, {
        name: "Perfect 5-Day Streak",
        step: [
            { date: '2025-01-01', action: { type: 'CHECK_IN', id: '1' } },
            { date: '2025-01-02', action: { type: 'CHECK_IN', id: '2' } },
            { date: '2025-01-03', action: { type: 'CHECK_IN', id: '3' } },
            { date: '2025-01-04', action: { type: 'CHECK_IN', id: '4' } },
            { date: '2025-01-05', action: { type: 'CHECK_IN', id: '5' } },
        ]
    });

    // 2. 1 Missed Day (Streak Loss)
    const missedState = INITIAL_USER_STATE(uid);
    missedState.current_day = '2025-01-01';
    missedState.last_evaluated_day = '2025-01-01';

    simulate(missedState, {
        name: "1 Missed Day (Streak Break)",
        step: [
            { date: '2025-01-01', action: { type: 'CHECK_IN', id: '1' } },
            { date: '2025-01-02', action: { type: 'CHECK_IN', id: '2' } },
            // Missed 03
            { date: '2025-01-04', action: { type: 'CHECK_IN', id: '4' } }, // Re-entry
        ]
    });

    // 3. Freeze Consumption
    const frozenState = INITIAL_USER_STATE(uid);
    frozenState.current_day = '2025-01-01';
    frozenState.last_evaluated_day = '2025-01-01';
    frozenState.streak.freeze_tokens = 1;

    simulate(frozenState, {
        name: "Freeze Consumption",
        step: [
            { date: '2025-01-01', action: { type: 'CHECK_IN', id: '1' } }, // Streak 1
            // Missed 02 -> Should consume freeze
            { date: '2025-01-03', action: { type: 'CHECK_IN', id: '3' } }, // Streak 1 (maintained)
        ]
    });
};

runTests();
