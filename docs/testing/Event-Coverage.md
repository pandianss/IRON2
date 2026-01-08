# Event Coverage & Instrumentation Matrix

## Current Implementation (`src/services/events/EventBus.js`)
- **Type**: Simple In-Memory Pub/Sub.
- **Persistence**: None (Events lost on reload).
- **Deduplication**: None.

## Defined Events
| Event Constant | Usage | Trigger Location | Payload | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| `RETENTION.CHECK_IN` | Streak updates | `components/CheckInModal` (Assumed) | Unknown | ❓ Untested |
| `RETENTION.STREAK_PENDING` | Gap detection | `RetentionService` | Unknown | ❓ Untested |

## Missing Critical Events
- `account_created`
- `streak_extended`
- `streak_broken`
- `social_interaction`

## Risk Assessment
- **High Risk**: Analytics and Retention insights will be unreliable due to lack of event persistence and server-side tracking.
- **Recommendation**: Integrate with a persistent analytics provider (Firebase Analytics / Mixpanel) or log critical events to Firestore.
