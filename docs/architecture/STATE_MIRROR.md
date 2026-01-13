# The IRON State Mirror

**Layer: Legibility / UI**
**Status: DRAFT**
**Concept: "How am I Standing?"**

The State Mirror is not a dashboard. It is a reflection of the user's institutional standing. It answers: "Am I safe? Am I growing? Am I legitimate?"

## I. The Identity Surface (The Header)

The header does not show "Streaks". It shows **Standing**.

### 1. The Core Descriptor
A dynamic text label derived from `engagement_state` and `Tier`.
*   *Examples*: "Soldier (Momentum)", "Witness (Recovering)", "Participant (At Risk)".

### 2. The Shield Status (Momentum Protection)
Visualizes the "Armor" protecting the streak.
*   **Active**: "Shielded. Next miss absorbed by Mentor."
*   **Cracked**: "Shield Down. Next miss Fractures."
*   **None**: "Exposed."

### 3. The Social Wallet
*   **Capital**: `150 SC` ( purchasing power).
*   **Authority**: `Level 2 (Mentor)` (voting power).

---

## II. The Behavioral Ledger View (The History)

This is not a list of logins. It is a **Case File**.
It answers: "What has happened to me?"

### 1. The Event Stream
Every major event is logged with its *System Justification*.

| Date | Event | Type | Narrative |
| :--- | :--- | :--- | :--- |
| Oct 12 | **Fracture** | `JUDGMENT` | Missed 2nd consecutive day. No freeze tokens remaining. |
| Oct 14 | **Appeal Filed** | `LEGAL` | User staked 50 SC. Citing "Illness". |
| Oct 15 | **Pardon Granted** | `MERCY` | Steward 'Alice' accepted appeal. |
| Oct 15 | **Restoration** | `PHYSICS` | Streak restored. State -> RECOVERING. |

### 2. The Causality Link
Clicking any "System Event" (e.g., fracture) highlights the "User Action" (e.g., missed day) that caused it.
*   *UI Interaction*: Hovering `Fracture` draws a line to the `Missed Day`.

---

## III. The Risk Monitor (The Future)

This answers: "What is about to happen?"

### 1. The Decay Clock
If inactive, shows precise time until next degradation.
*   *Display*: "Decay Event in 14h 20m."
*   *Consequence*: "Will lose 'Active' Tier."

### 2. The Recovery Path
If `RECOVERING`, shows requirements to exit.
*   *Display*: "Probation: 2/7 Days verified."
