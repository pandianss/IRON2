# Engine Authority Contract

This document defines the **Architectural Laws** that ensure the IRON system remains trustworthy, deterministic, and cheat-proof.

**Status**: [LOCKED]
**Authority**: `src/services/engine/EngineService.js`

---

## 1. Single Writer Principle
**Law**: `EngineService.processAction` is the **ONLY** code path permitted to write to the `user_state` collection.

- **Forbidden**:
  - UI Clients writing to `user_state`.
  - Cloud Functions writing to `user_state` (except via Engine).
  - Admin dashboards writing to `user_state` directly.
- **Enforcement**:
  - Firestore Security Rules must block all `write/update` to `user_state` from client SDKs.
  - Writes must occur via Trusted Server Environment (Cloud Functions / Backend).

## 2. Immutable History (Log-First)
**Law**: State is a derivative of History. History is immutable.

- **The Flow**:
  1. **Event** (`CHECK_IN`) is received.
  2. **Log** (`behavior_logs`) is written *synchronously* in a transaction.
  3. **State** (`user_state`) is calculated by the `DailyEngine` (Pure Function).
  4. **State** is updated in the same transaction.
- **Implication**: If `user_state` is corrupted/deleted, it can be perfectly rebuilt by replaying `behavior_logs`.

## 3. Deterministic Evolution
**Law**: `DailyEngine.js` must be a **Pure Function**.

- `f(PreviousState, Action, Date) -> NewState`
- **No Side Effects**: The engine cannot read DB, call APIs, or check Random numbers.
- **Time Authority**: The engine relies on the `serverDate` passed to it, never `new Date()` internally (except for defaults).

## 4. UI as View-Only
**Law**: The UI is a "Dumb Terminal" for the Engine.

- **Role**:
  - Display `user_state` (Streak, Tier, Status).
  - Submit `Intent` (Check-in Request).
- **Prohibited**:
  - Calculating streaks locally.
  - Deciding if a check-in is valid.
  - "Optimistic Updates" that persist longer than the transaction time.

---

## System Boundaries

| Component | Responsibility | Authority |
|-----------|----------------|-----------|
| **UI** | Display & Intent | None |
| **EngineService** | Transaction Orchestration | Write Access |
| **DailyEngine** | Logic & Rules | Truth Definition |
| **Firestore** | Persistence | Storage |
