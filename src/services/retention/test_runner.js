import { retentionService } from './RetentionService.js';

// ---- MOCK SETUP ----
const mockLocalStorage = {
    getItem: () => null,
    setItem: () => { }
};
global.localStorage = mockLocalStorage;

// ---- TEST HELPERS ----
const assert = (condition, message) => {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ ${message}`);
    }
};

const runTests = () => {
    console.log("🧪 Starting Retention Domain Tests...");

    const initialData = retentionService.getDefaultData();

    // TEST 1: First Check-in
    console.log("\nTest 1: First Check-in");
    const t1Dates = { today: '2024-01-01', yesterday: '2023-12-31' };
    const res1 = retentionService.calculateCheckIn(initialData, 'trained', t1Dates);
    assert(res1.result.streak === 1, "Streak should be 1");
    assert(res1.newData.lastCheckInDate === '2024-01-01', "Date should be recorded");

    // TEST 2: Consecutive Check-in (Streak Increment)
    console.log("\nTest 2: Consecutive Check-in");
    const t2Dates = { today: '2024-01-02', yesterday: '2024-01-01' };
    const res2 = retentionService.calculateCheckIn(res1.newData, 'rest', t2Dates);
    assert(res2.result.streak === 2, "Streak should be 2");
    assert(res2.result.isNewRecord === true, "Should be record (2 > 0)");

    // TEST 3: Idempotency (Same Day)
    console.log("\nTest 3: Same Day Check-in");
    const res3 = retentionService.calculateCheckIn(res2.newData, 'trained', t2Dates);
    assert(res3.result.alreadyCheckedIn === true, "Should detect duplicate");
    assert(res3.result.streak === 2, "Streak should not change");

    // TEST 4: Missed Day (Reset)
    console.log("\nTest 4: Missed Day Reset");
    // Skip Jan 3rd, check in Jan 4th
    const t4Dates = { today: '2024-01-04', yesterday: '2024-01-03' };
    // Last checkin was Jan 2nd. Jan 2nd is strictly before yesterday (Jan 3rd).
    const res4 = retentionService.calculateCheckIn(res2.newData, 'trained', t4Dates);
    assert(res4.result.streak === 1, "Streak should reset to 1");

    // TEST 5: Longest Streak Persistence
    console.log("\nTest 5: Longest Streak Persistence");
    assert(res4.newData.longestStreak === 2, `Longest streak should persist as 2 (Actual: ${res4.newData.longestStreak})`);

    // TEST 6: Missed Day Resolution (Multi-Day)
    console.log("\nTest 6: Missed Day Resolution (Multi-Day)");
    const t6Dates = { today: '2024-01-08', yesterday: '2024-01-07' };
    const res6 = retentionService.calculateCheckIn(res2.newData, 'trained', t6Dates);
    // res2 was Jan 2. Streak 2.
    // Gap: Jan 3, Jan 4, Jan 5, Jan 6, Jan 7.
    // Check-in Jan 8.
    // New Streak should be 1.
    // History should track missed days.

    assert(res6.newData.history['2024-01-03'] === 'missed', "Jan 3 should be missed");
    assert(res6.result.streak === 1, `Streak should be 1 after gap (Actual: ${res6.result.streak})`);

    // TEST 7: Self-Repair (Deterministic Integrity)
    console.log("\nTest 7: Self-Repair (Corruption Proof)");
    const corruptData = {
        ...res6.newData,
        currentStreak: 999, // FAKE HIGH NUMBER
        // But history says: Jan 8 (Trained), Gap, Jan 2 (Trained)...
        // Actually res6 history: Jan 8 is trained.
    };
    // Let's create a clean scenario for clarity.
    // History: Today (Trained), Yesterday (Trained). Streak should be 2.
    // Corrupt State: Streak 50.
    const repairDates = { today: '2025-01-02', yesterday: '2025-01-01' };
    const repairData = {
        currentStreak: 50, // LIES
        lastCheckInDate: '2025-01-01',
        history: {
            '2025-01-01': 'trained'
        }
    };

    // Check-in for today (Jan 2). Should result in Streak 2.
    const resRepair = retentionService.calculateCheckIn(repairData, 'trained', repairDates);

    assert(resRepair.result.streak === 2, `Streak should be 2 (Derived), ignoring corrupt 50. (Actual: ${resRepair.result.streak})`);

    // TEST 8: Sync History (Day Close)
    console.log("\nTest 8: Sync History (Day Close)");
    const syncStartData = {
        ...resRepair.newData,
        lastCheckInDate: '2025-01-02',
        anchorTimezone: 'UTC'
    };
    // Jump forward to Jan 5.
    const syncDates = { today: '2025-01-05', yesterday: '2025-01-04' };

    // Calling resolveDay directly (imitating syncHistory behavior with override)
    const synced = retentionService.resolveDay(syncStartData, syncDates);

    assert(synced.history['2025-01-03'] === 'missed', "Sync should mark Jan 3 missed");
    assert(synced.history['2025-01-04'] === 'missed', "Sync should mark Jan 4 missed");
    assert(!synced.history['2025-01-05'], "Sync should NOT touch Today (Jan 5)");

    // TEST 9: Sync History / Timezone Migration
    console.log("\nTest 9: Sync History / Timezone Migration");
    const mockData9 = {
        currentStreak: 5,
        longestStreak: 10,
        lastCheckInDate: '2023-12-31',
        lastCheckInTime: '2023-12-31T10:00:00.000Z',
        anchorTimezone: 'UTC', // Explicit Timezone for tests
        history: {
            '2023-12-31': 'trained',
            '2023-12-30': 'trained',
            '2023-12-29': 'trained',
            '2023-12-28': 'trained',
            '2023-12-27': 'trained'
        }
    };

    // Test 9.1: loadData adds timezone if missing
    const dataWithoutTimezone = { ...mockData9 };
    delete dataWithoutTimezone.anchorTimezone;
    const loadedData = retentionService.loadData(dataWithoutTimezone);
    assert(loadedData.anchorTimezone === 'UTC', "loadData should add default timezone if missing");

    // Test 9.2: syncHistory resolves gaps without check-in
    // Scenario: Data ends Dec 31. Today is Jan 5. No check-in today.
    // We expect Jan 1, 2, 3, 4 to be marked as 'missed'.
    const syncDates9 = { today: '2024-01-05', yesterday: '2024-01-04' };
    const syncedData = retentionService.syncHistory(mockData9, syncDates9);

    assert(syncedData.history['2024-01-01'] === 'missed', "Jan 1 should be marked missed by syncHistory");
    assert(syncedData.history['2024-01-02'] === 'missed', "Jan 2 should be marked missed by syncHistory");
    assert(syncedData.history['2024-01-03'] === 'missed', "Jan 3 should be marked missed by syncHistory");
    assert(syncedData.history['2024-01-04'] === 'missed', "Jan 4 should be marked missed by syncHistory");
    assert(syncedData.currentStreak === 0, "Streak should be 0 after syncHistory resolves a gap");
    assert(syncedData.lastCheckInDate === '2023-12-31', "Last check-in date should remain Dec 31");


    console.log("\n🎉 ALL TESTS PASSED");
};

runTests();
