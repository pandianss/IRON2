# Retention State Machine

This document defines the **Psychological States** of a user within the IRON system.
The engine transitions users between these states deterministically based on Time and Events.

**Status**: [LOCKED]
**Authority**: `src/core/behavior/DailyEngine.js`

---

## The States (`engagement_state`)

### 1. `ENGAGED` (The Flow State)
- **Definition**: The user is consistent. Streak is Active.
- **Entry**: 
  - Maintaining consistency for > 3 days.
  - Completing Recovery.
- **Exit**:
  - Miss 1 Day -> `AT_RISK`

### 2. `AT_RISK` (The Grace Period)
- **Definition**: The user missed *Yesterday*. The habit is threatened.
- **UI Implication**: "Crisis Banner" (Yellow/Red). Urgent Call to Action.
- **Mechanics**:
  - **Grace Window**: 24 Hours.
  - **Save Condition**: Complete `CHECK_IN` or `REST` Today.
  - **Social Save**: Receive `SEND_SUPPORT` (Grants Freeze Token).
- **Exit**:
  - Action Today -> `ENGAGED`
  - Miss Today -> `STREAK_BROKEN`

### 3. `STREAK_BROKEN` (The Failure)
- **Definition**: The user missed 2+ consecutive days (or 1 day with no grace).
- **Mechanics**:
  - Streak Count reset to 0.
  - Freeze Tokens lost (if policy dictates).
- **Exit**:
  - Action Today -> `RECOVERING`

### 4. `RECOVERING` (The Climb)
- **Definition**: User successfully returned after a break, but trust is not yet established.
- **UI Implication**: "Recovery Mode" (Blue). Progress Bar (Days 1/3).
- **Mechanics**:
  - Streak counts up from 1.
  - **Requirement**: Must complete 3 consecutive days to exit.
- **Exit**:
  - 3 Consecutive Actions -> `ENGAGED`
  - Miss Day -> `AT_RISK` (or straight to `STREAK_BROKEN`)

### 5. `DORMANT` (The Void)
- **Definition**: No activity for > 7 days.
- **Mechanics**:
  - Tier drops to `DORMANT`.
  - Engagement Score decays significantly.

---

## State Transition Graph

```mermaid
graph TD
    ENGAGED -- Miss 1 Day --> AT_RISK
    AT_RISK -- Action Today --> ENGAGED
    AT_RISK -- Miss Today --> STREAK_BROKEN
    STREAK_BROKEN -- Action --> RECOVERING
    RECOVERING -- 3 Days Consistency --> ENGAGED
    RECOVERING -- Miss Day --> AT_RISK
    ANY -- > 7 Days Inactive --> DORMANT
```
