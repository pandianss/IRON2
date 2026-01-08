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

    console.log("\n🎉 ALL TESTS PASSED");
};

runTests();
