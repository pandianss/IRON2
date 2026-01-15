// --- CONFIGURATION ---
const SIM_DAYS = 730; // 2 Years
const USER_COUNT = 500;

// --- USER ARCHETYPES ---
const ARCHETYPES = [
    { name: 'THE SOVEREIGN', count: 50, baseDiscipline: 0.98, volatility: 0.01, recoveryRate: 0.9 },
    { name: 'THE ASPIRANT', count: 300, baseDiscipline: 0.85, volatility: 0.05, recoveryRate: 0.6 },
    { name: 'THE TOURIST', count: 150, baseDiscipline: 0.40, volatility: 0.10, recoveryRate: 0.2 }
];

// --- SYSTEM LOGIC ---
class IronSystem {
    // With Integrity Buffer (~20 hours extra), users can miss 1 day but not 2.
    // 24h = Warning. 44h = Breach.
    // In daily steps: Day 1 Miss (24h) = OK (Warning). Day 2 Miss (48h) = DEATH (Breach).
    constructor() {
        this.BREACH_THRESHOLD_DAYS = 2;
    }

    assess(user, day) {
        // Did user do the work?
        const didWork = Math.random() < user.discipline;

        if (didWork) {
            user.streak++;
            user.daysSinceLastCheckIn = 0;
            user.discipline = Math.min(0.99, user.discipline + 0.001);
            return 'SUCCESS';
        } else {
            user.daysSinceLastCheckIn++;
            // Decay
            user.discipline = Math.max(0.1, user.discipline - 0.01);

            if (user.daysSinceLastCheckIn >= this.BREACH_THRESHOLD_DAYS) {
                return 'BREACH';
            }
            return 'MISS';
        }
    }
}

// --- USER MODEL ---
class SimulatedUser {
    constructor(id, archetype) {
        this.id = id;
        this.type = archetype.name;
        this.discipline = archetype.baseDiscipline;
        this.recoveryRate = archetype.recoveryRate;

        // State
        this.streak = 0;
        this.daysSinceLastCheckIn = 0;
        this.eras = 1;
        this.scars = 0;
        this.isChurned = false;
        this.maxEraLength = 0;
    }

    processBreach() {
        const willRecover = Math.random() < this.recoveryRate;

        if (willRecover) {
            this.eras++;
            this.streak = 0;
            this.daysSinceLastCheckIn = 0;
            this.scars++;
            this.recoveryRate *= 0.95;
            return 'RECOVERED';
        } else {
            this.isChurned = true;
            return 'CHURNED';
        }
    }
}

// --- EXECUTION ---
console.log(`Starting Simulation: ${USER_COUNT} Users for ${SIM_DAYS} Days...`);
const users = [];
let idCounter = 1;

ARCHETYPES.forEach(arch => {
    for (let i = 0; i < arch.count; i++) {
        users.push(new SimulatedUser(idCounter++, arch));
    }
});

const system = new IronSystem();
let churningStats = [];

for (let day = 1; day <= SIM_DAYS; day++) {
    users.forEach(user => {
        if (user.isChurned) return;

        const result = system.assess(user, day);

        if (result === 'BREACH') {
            if (user.streak > user.maxEraLength) user.maxEraLength = user.streak;
            const outcome = user.processBreach();
        }
    });

    if (day % 30 === 0) {
        const activeUsers = users.filter(u => !u.isChurned).length;
        churningStats.push({ day, active: activeUsers });
    }
}

// --- REPORTING ---
const report = {
    totalUsers: USER_COUNT,
    activeUsers: users.filter(u => !u.isChurned).length,
    survivors: {
        sovereign: users.filter(u => !u.isChurned && u.type === 'THE SOVEREIGN').length,
        aspirant: users.filter(u => !u.isChurned && u.type === 'THE ASPIRANT').length,
        tourist: users.filter(u => !u.isChurned && u.type === 'THE TOURIST').length
    },
    churned: users.filter(u => u.isChurned).length,
    avgEras: (users.reduce((acc, u) => acc + u.eras, 0) / USER_COUNT).toFixed(2),
    avgMaxStreak: (users.reduce((acc, u) => acc + u.maxEraLength, 0) / USER_COUNT).toFixed(1),
    churnCurve: churningStats
};

console.log(JSON.stringify(report, null, 2));
