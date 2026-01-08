# Streak Invariants

## Core Principles
1. **Determinism**: Same inputs (check-in history) must ALWAYS result in the same streak state.
2. **Server Authority**: The server's calculation is the only source of truth. Local optimistic updates must eventually reconcile.
3. **Immutability**: Past streak states cannot be altered retroactively unless by specific admin action (and even then, with audit logs).

## Invariants Checklist
- [ ] **Daily Anchor**: A "day" is defined by the server's timezone configuration (or user's fixed timezone), not the device's current clock.
- [ ] **Continuity**: Streak(N) = Streak(N-1) + 1 IF CheckIn(Today) exists AND CheckIn(Yesterday) exists.
- [ ] **Breakage**: Streak resets to 0 IF CheckIn(Yesterday) is missing AND no "Freeze" or "Shield" was active.
- [ ] **Idempotency**: Multiple check-ins on the same day do not increase the streak count beyond +1.
- [ ] **No Future Check-ins**: Check-ins cannot be accepted for future server dates.

## Testing Scenarios
| Scenario | Expected Result |
| :--- | :--- |
| User checks in at 23:59 and 00:01 | Streak increases by 1, then another 1 (2 distinct days) |
| User changes device time to tomorrow | Check-in rejected or queued until server time matches |
| detailed log of check-ins vs streak count | Must match `count(consecutive_days)` exactly |
