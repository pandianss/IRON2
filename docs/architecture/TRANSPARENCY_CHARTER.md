# The Transparency & Ledger Charter

Authority: Institutional Layer
Status: IMMUTABLE

## 1. The Right of Inspection
Every user has the absolute right to inspect the complete causal history of their account.
- **Access**: The system must provide a `getCaseFile(userId)` API.
- **Completeness**: The Case File must include every Action, Intervention, and State Change.

## 2. The Law of Causality
Every System Intervention must be causally linked to a specific User Event.
- **Traceability**: A `LOCK_OUT` event must link to the `STREAK_FRACTURED` transaction, which must link to the `MISSED_DAY` event.
- **Restriction**: The system cannot intervene "out of nowhere".

## 3. The Law of Institutional Memory
The Ledger is independent of the Engine.
- **Immutability**: Once written, a Log Entry cannot be deleted.
- **Replayability**: The Current State must always be derivable from the Ledger History.

## 4. The Appeal Process
Users have the right to challenge the System's judgment via the Court of Appeals.
- **Cost**: Appeals are paid for with Social Capital (Service), not Momentum (Sweat).
- **Finality**: A Pardon granted by the Institution is absolute and overrides the Engine's logic.
