# Social Failure Modes & Collapse Scenarios

**Layer: Civil / Safety**
**Status: DRAFT**
**Purpose: Resilience Engineering**

This document defines how the Roles & Rituals system can fail, and the fail-safes required to prevent institutional collapse.

## I. Governance Failure Modes

### 1. The Oligarchy Problem
*Scenario*: A small group of Stewards entrench themselves and reject all appeals from "out-group" users.
- **Symptom**: `AppealRejectionRate` > 80% for specific cohorts.
- **Fail-Safe**: "The General Assembly". If Rejection Rate stems from a specific Steward Cadre, the System triggers a "Vote of No Confidence" (All Socialites vote).
- **Correction**: Stewards cycled out forcibly.

### 2. The Absentee Sentinel
*Scenario*: Sentinels stop flagging risks, leading to unmitigated Fractures.
- **Symptom**: `InterventionRate` drops while `FractureRate` rises.
- **Fail-Safe**: "The Watcher's Decay". Sentinels must perform X actions/week. If missed, `Sentinel` status is stripped automatically.

### 3. The Witness Ring (Collusion)
*Scenario*: Users A, B, and C mutually witness each other instantly to farm Social Capital.
- **Symptom**: Circular graph topology with unrealistically low latency.
- **Fail-Safe**: "The Trust Dampener". Repeated circular witnessing yields diminishing returns (100% -> 50% -> 10% -> 0%).

## II. Cultural Failure Modes

### 4. The Inflation Crisis
*Scenario*: Everyone is a "Socialite". SC is abundant and worthless. Appeals are free.
- **Symptom**: `AvgSocialWealth` > `AppealCost` * 50.
- **Fail-Safe**: "The Hardening". System automatically raises `AppealCost` and `DecayRate` based on Global Inflation Index.

### 5. The Apathy Spiral
*Scenario*: High failure rates lead to low morale. No one Witnesses. No one Welcomes Back.
- **Symptom**: `WitnessRate` < 10%.
- **Fail-Safe**: "The Rally". System introduces "Super-Witness Incentives" (2x SC for supporting at-risk users) to jumpstart the social engine.

### 6. The Tyranny of the Algorithm
*Scenario*: The System becomes too strict (Physics > Morale), causing mass exodus.
- **Symptom**: `ChurnRate` spikes. Sentiment (if measured) is hostile.
- **Fail-Safe**: "The Kill Switch" (from Authority Charter). If `SocialLoad` > 80%, Strictness relaxes. Probation becomes default.

---

## III. System Invariants (The Unbreakables)
No matter the social failure, these invariants hold:
1.  **Immutability**: The Ledger is never rewritten without an Appeal Log.
2.  **Solvency**: The System never "prints" SC without effort.
3.  **Identity**: A User never loses their History.
