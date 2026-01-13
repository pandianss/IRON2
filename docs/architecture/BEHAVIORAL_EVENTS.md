# Behavior Event Specification

This document defines the **Canonical Event Set** for the IRON Retention Engine.
These events are the *only* valid inputs that can mutate the User State.

**Status**: [LOCKED]
**Authority**: `src/core/behavior/LogSchema.js`

---

## 1. Primary Actions

### `CHECK_IN`
**Description**: The standard daily action confirming the user is active/trained.
- **Payload**:
  - `status`: "trained" (Canonical)
  - `workoutId`: (Optional) UUID if linked to specific log
- **Effect**:
  - Sets `today.status` = `COMPLETED`
  - Increments Streak (if active) or Restarts Streak (if broken)
  - Awards XP / Engagement Score
  - Clears Risk State (`AT_RISK` -> `ENGAGED`)

### `REST`
**Description**: A valid, intentional rest day.
- **Payload**:
  - `status`: "rest"
- **Effect**:
  - Sets `today.status` = `RESTED`
  - Maintains Streak (Does NOT break it)
  - Awards partial Engagement Score

---

## 2. Social Actions (Mechanics)

### `SEND_SUPPORT` (Pact Save)
**Description**: A partner signals support to a user who is struggling.
- **Trigger**: User is `AT_RISK` (Missed yesterday).
- **Payload**:
  - `fromUid`: UUID of the partner
- **Effect**:
  - If Target is `AT_RISK`: Grants 1 `freeze_token` (Max 1).
  - This effectively "Saves" the streak if the user misses today as well.
  - Transitions `AT_RISK` -> `RECOVERING` (soft transition, pending verify).

### `WITNESS_WORKOUT`
**Description**: A partner validates a check-in.
- **Trigger**: User has `COMPLETED` today.
- **Payload**:
  - `witnessUid`: UUID of the partner
- **Effect**:
  - Increases `engagement.score` (Multiplier/Bonus).
  - Increments `social.witness_count`.
  - Reinforces "Official History".

### `GROUP_CHECKIN`
**Description**: Collective workout session (Synergy).
- **Trigger**: Multiple users training together.
- **Payload**:
  - `participantCount`: Integer (Number of people)
  - `partnerUids`: Array of UUIDs
- **Effect**:
  - Acts as a `CHECK_IN` (Completes Day).
  - Awards **Synergy Bonus** (+10 Score).
  - Increments `social.witness_count` by `participantCount`.

---

## 3. System Events

### `SYSTEM_ADJUSTMENT`
**Description**: Administrative correction.
- **Payload**:
  - `reason`: String
  - `adjustment`: Object (e.g. `{ streak: +5 }`)
- **Effect**:
  - Arbitrary state mutation (Audited).

---

## Event Payload Structure
All events MUST adhere to:
```json
{
  "uid": "user_123",
  "type": "CHECK_IN",
  "payload": { ... },
  "server_ts": "2024-01-01T12:00:00Z",
  "context": {
    "timezone": "America/New_York",
    "app_version": "1.0.0"
  }
}
```
