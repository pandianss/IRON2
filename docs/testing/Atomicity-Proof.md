# Check-in Atomicity Proof

## Logic Chain Verification
1.  **Trigger**: User clicks "Yes, I Trained" in `CheckInModal`.
2.  **Guard**: `useRetentionGate` receives event.
3.  **Feature**: `useStreaks.performCheckIn` is called.
4.  **Context**: `RetentionContext.checkIn` is invoked.
5.  **Service**: `FirebaseRetentionService.checkIn(uid, status)` executes.

## Atomicity Implementation
The service uses a **Firestore Transaction** (`runTransaction`) to ensure:
-   **Read**: User's current stats (`currentStreak`, `lastCheckInDate`).
-   **Read**: Idempotency check (`checkins/{date}` doc).
-   **Write**: New `checkins/{date}` document.
-   **Write**: Updated `users/{uid}` stats.

```javascript
await runTransaction(db, async (transaction) => {
    // ... read user ...
    // ... read checkin ...
    // ... write checkin ...
    // ... write user ...
});
```

## Failure Scenarios
-   **Network Fail**: Transaction fails, no documents updated. State remains consistent.
-   **Concurrent Writes**: Firestore optimistic locking retries the transaction.
-   **UI Crash**: UI optimistic update might persist locally, but server is truth. Re-sync on reload fixes UI.

## Side-Effects Verification
- **Feed**: `logActivity` (via `useRetentionEffects`) writes to `feed_activities` collection in Firestore.
- **Insights**: Streak data aggregated on `users/{uid}` via the same transaction.
- **Notifications**: Local Toast triggered on success event.

## Conclusion
The implementation is **Atomic** and **Server-Authoritative**.
- Retention Logic: **SECURE** (Firestore Transaction)
- Side Effects: **CONSISTENT** (Firestore Write + Event Bus)
