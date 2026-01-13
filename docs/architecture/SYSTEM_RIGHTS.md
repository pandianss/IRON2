# System Rights (The IRON Magna Carta)

Authority: Governance Layer
Status: IMMUTABLE

This document defines the automated rights of every user within the IRON system. The Engine is architecturally forbidden from violating these rights.

## 1. Right to Explanability
The System must never change a User's State without providing a human-readable explanation of *Why*.
- **Implementation**: `NarrativeEngine` is mandatory for all state changes.
- **Violation**: A UI state change without a narrative is a bug.

## 2. Right to Redemption
A User in `DORMANT` state must always be offered a path to `RECOVERING`.
- **Constraint**: The "Resurrection Cost" (Identity Debt) must be finite and calculable.
- **Violation**: A system logic that prevents a user from ever returning is forbidden.

## 3. Right to Due Process (Lockout)
The System cannot transition a user to `STREAK_FRACTURED` (Lockout) unless:
1. The user was previously in `AT_RISK`.
2. A Warning (`NOTIFY_URGENT`) was generated at least 4 hours prior to the fracture.
- **Implementation**: `RightsLayer.canFracture(user)` checks audit logs for the warning.

## 4. Right to Momentum
Once earned, `MOMENTUM` status cannot be revoked by a single day's inaction.
- **Protection**: `MOMENTUM` users fall to `AT_RISK` first, never directly to `STREAK_FRACTURED`.

## 5. Right to Witness
The System determines when to intervene, but if a User has sufficient Social Capital, the System *must* prefer Social Intervention over System Intervention.
- **Logic**: "Friends before Algorithms."
