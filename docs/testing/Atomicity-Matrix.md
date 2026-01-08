# Atomicity & Side-Effects Matrix

## Philosophy
Core actions must be atomic. Either all side effects happen, or the action fails entirely. Partial states lead to corruption.

## Action Matrix
| Action | Core State Change | Required Side Effects | Atomicity Requirement |
| :--- | :--- | :--- | :--- |
| **Check-In** | `CheckIn` record created | 1. Update `Streak` count <br> 2. Fire `checkin_completed` event <br> 3. Update `Insights` aggregation <br> 4. Push to `Feed` (if public) | **Strict**. If Feed fails, Check-in can succeed, BUT Streak update must be transactional with Check-in. |
| **Challenge Join** | `Participant` record created | 1. Fire `challenge_joined` event <br> 2. Initialize `Goal` tracking | **High**. |
| **Profile Update** | `User` doc updated | 1. Re-index for search (if name changed) | **Medium**. Eventual consistency acceptable for search. |

## Failure Modes & Recovery
- **Network Death during Check-in**:
    - **Plan**: Optimistically update UI, queue request in `OfflineQueue` (Redux/Context), retry on connection.
    - **Risk**: User closes app before retry.
    - **Mitigation**: Persist queue to LocalStorage.
