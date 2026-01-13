# The IRON Narrative System

**Layer: Legibility / Logic**
**Status: DRAFT**
**Concept: "What is happening to me?"**

The Narrative System translates `EngineState` into `HumanLanguage`.
It ensures that the machine never acts silently.

## I. The Narrative Feed (The Main Interface)

The primary interface is not a set of buttons. It is a **Chronological Feed** of the dialogue between the User and the Institution.

### 1. The Narrative Card
Every component in the feed follows this structure:
*   **Actor**: (System, User, Peer, Court).
*   **Action**: (Interveved, Logged, Witnessed, Ruled).
*   **Context**: (Rule ID, Reason).

### 2. Narrative Types

#### A. The Physics Narrative (Engine Actor)
*   *Scenario*: User checks in.
*   *Feed*: "System acknowledged check-in. Momentum extended. 4 hours until next window."

#### B. The Social Narrative (Peer Actor)
*   *Scenario*: User receives a Vouch.
*   *Feed*: "Witness 'Bob' validated your effort. +1 SC minted."

#### C. The Governance Narrative (System Actor)
*   *Scenario*: User enters `AT_RISK`.
*   *Feed*: "Warning: Continuity at risk. 48 hours without signal. Decay imminent. [Rule 4.1]"

#### D. The Justice Narrative (Court Actor)
*   *Scenario*: Appeal decision.
*   *Feed*: "The Court has reviewed Case #881. Judgment: PARDON. 'Reason: Service History proven.' State restored."

---

## II. The Intervention Dialogue

When the System must act against the User (e.g., Fracture, Decay), it triggers a **Modal Dialogue**.

### 1. The "Halt" State
The app locks. The background blurs.
*   *Headline*: "Institutional Intervention"

### 2. The Explanation
*   *Text*: "You have missed 3 consecutive windows. Your streak of 42 days has Fractured."
*   *Citation*: "Reference: Physics / Entropy / Rule 1.2"

### 3. The Path Forward
The system offers choices based on `Rights`:
*   [Acknowledge & Restart] (Accept Reality)
*   [Appeal Judgment] (Stakes 50 SC)
*   [Use Freeze Token] (If available)
