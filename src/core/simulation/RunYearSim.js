import { runDailyEngine } from '../behavior/DailyEngine.js';
import { INITIAL_USER_STATE, TIERS } from '../behavior/EngineSchema.js';
import { RETENTION_STATES } from '../governance/RetentionPolicy.js';
import { evaluateInterventions, INTERVENTION_TYPES } from '../governance/InterventionEngine.js';
import { SocialCapitalEngine } from '../social/SocialCapitalEngine.js'; // Import New Engine

/**
 * LARGE SCALE SIMULATION: THE CRUCIBLE v5.0 (Social Capital)
 */

const START_DATE = '2024-01-01';
const SIM_DAYS = 365;

// Helper: Add days
const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

// ARCHETYPES
const ARCHETYPES = {
    SOLDIER: {
        count: 4000,
        behavior: (dayIdx) => Math.random() < 0.95 ? { type: 'CHECK_IN' } : null
    },
    CASUAL: {
        count: 8000,
        behavior: (dayIdx) => Math.random() < 0.50 ? { type: 'CHECK_IN' } : null
    },
    FLAKY: {
        count: 4000,
        behavior: (dayIdx) => {
            const cycle = Math.floor(dayIdx / 5);
            return cycle % 2 === 0 ? { type: 'CHECK_IN' } : null;
        }
    },
    SOCIALITE: {
        count: 2000,
        pSocial: 0.5,
        behavior: (dayIdx) => {
            return Math.random() < 0.40 ? { type: 'CHECK_IN' } : null;
        },
        receiveSupportProb: 0.8
    },
    QUITTER: {
        count: 2000,
        behavior: (dayIdx) => dayIdx < 14 ? { type: 'CHECK_IN' } : null
    }
};

const runSimulation = () => {
    console.log(`🚀 STARTING CRUCIBLE SIMULATION: ${SIM_DAYS} Days (Social Capital Edition)`);
    const startTime = Date.now();

    // 1. Initialize Population
    let population = [];
    Object.keys(ARCHETYPES).forEach(typeKey => {
        const config = ARCHETYPES[typeKey];
        for (let i = 0; i < config.count; i++) {
            let u = INITIAL_USER_STATE(`${typeKey}_${i}`);
            u.current_day = START_DATE;
            u.last_evaluated_day = START_DATE;
            u.archetype = typeKey;
            u.history = { actions: 0, freezes_used: 0 };

            // SEED SOCIAL CAPITAL
            if (typeKey === 'SOCIALITE') u.social.social_capital = 10;
            if (typeKey === 'SOCIALITE') u.social.witness_count = 15; // High Witness Count
            if (typeKey === 'SOLDIER') u.social.witness_count = 2;   // Lone Wolf

            u.metrics = { interventions: {} };
            population.push(u);
        }
    });

    console.log(`Population Created: ${population.length} Users.`);

    // 2. Run Time Loop
    for (let d = 0; d < SIM_DAYS; d++) {
        const currentDate = addDays(START_DATE, d);
        if (d % 90 === 0) console.log(`  Processing Day ${d} (${currentDate})...`);

        for (let i = 0; i < population.length; i++) {
            let user = population[i];
            const config = ARCHETYPES[user.archetype];
            let action = config.behavior(d);

            // Social Action Logic for Sim
            if (config.pSocial && Math.random() < config.pSocial) {
                if (!action) {
                    action = { type: 'SEND_SUPPORT' };
                }
            }

            if (user.engagement_state === RETENTION_STATES.AT_RISK && !action && config.receiveSupportProb) {
                if (Math.random() < config.receiveSupportProb) {
                    action = { type: 'SEND_SUPPORT' };
                }
            }

            // Run Engine
            const nextState = runDailyEngine(user, action, currentDate);

            // ---------------------------------------------------------
            // SOCIAL CAPITAL ENGINE
            // ---------------------------------------------------------
            let scDelta = 0;
            if (action) {
                scDelta += SocialCapitalEngine.evaluateAction(action.type);
            }

            // Penalty Checks
            let newSC = (user.social.social_capital || 0) + scDelta;
            // CORRECT SIGNATURE: (currentSC, previousState, nextState)
            newSC = SocialCapitalEngine.applyStatePenalties(newSC, user, nextState);

            // Decay (if no social action)
            if (!action || (action.type !== 'SEND_SUPPORT' && action.type !== 'WITNESS_WORKOUT')) {
                // GENTLE DECAY: 0.1 per day instead of 1.0
                if (newSC > 0) newSC = Math.max(0, newSC - 0.1);
            }

            nextState.social.social_capital = newSC;
            // ---------------------------------------------------------

            // LOGGING MINTING for Verification
            if (d === 0 && i === 16000) {
                // console.error(`Debug SC: User ${i} (${nextState.archetype}) Action: ${action ? action.type : 'None'} | Delta: ${scDelta} | OldSC: ${user.social.social_capital} | NewSC: ${newSC}`);
            }

            // Run Governance
            const interventions = evaluateInterventions(user, nextState, nextState.social);
            if (interventions.length > 0) {
                if (!nextState.metrics) nextState.metrics = { interventions: {} };
                interventions.forEach(iv => {
                    nextState.metrics.interventions[iv.type] = (nextState.metrics.interventions[iv.type] || 0) + 1;
                });
            }

            population[i] = nextState;
        }
    }

    // ... report generation ...
    generateReport(population);
};

const generateReport = (population) => {
    const report = {
        total: population.length,
        socialWealth: 0, // Total SC
        avgSC: 0,
        byType: {},
        states: {},
        interventions: {},
        health: { dormantCount: 0 }
    };

    population.forEach(u => {
        const sc = u.social.social_capital || 0;
        report.socialWealth += sc;

        // Stats by Type
        if (!report.byType[u.archetype]) report.byType[u.archetype] = { count: 0, avgSC: 0 };
        report.byType[u.archetype].count++;
        report.byType[u.archetype].avgSC += sc;

        // States
        const state = u.engagement_state;
        report.states[state] = (report.states[state] || 0) + 1;
        if (state === RETENTION_STATES.DORMANT) report.health.dormantCount++;
    });

    // Averages (Flooring might hide small decimal gains, use toFixed for logging?)
    report.avgSC = Math.floor(report.socialWealth / population.length);
    Object.keys(report.byType).forEach(k => {
        report.byType[k].avgSC = (report.byType[k].avgSC / report.byType[k].count).toFixed(1); // Use float
    });

    console.log("\n=== 📊 SIMULATION REPORT (Social Capital Edition) ===");
    console.log(JSON.stringify(report, null, 2));
};

runSimulation();
