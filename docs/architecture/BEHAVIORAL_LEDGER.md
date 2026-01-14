# IRON Behavioral Ledger
**Technical Specification v1.0**

**Authority:** Institutional Core
**Status:** FOUNDATIONAL
**Change Policy:** Breaking changes require constitutional review
**Purpose:** Establish a single, append-only source of behavioral truth

## 1. Purpose of the Behavioral Ledger

The Behavioral Ledger is the sole authoritative memory of IRON.

It exists to ensure that:

• no state exists without cause
• no cause can be altered
• no authority can act invisibly
• no narrative can be fabricated
• no identity can drift from history

From this point forward:

**If it is not in the ledger, it did not happen.**

The engine computes.
The governance layer decides.
The ledger records.
The snapshot system derives.

Truth belongs to the ledger alone.

## 2. System Position

The ledger is not a database table.
It is an institutional service.

All behavioral mutation must flow through the following canonical pipeline:

```mermaid
graph TD
    A[Event Attempt] --> B[Rights Gate]
    B --> C[Governance Engine]
    C --> D[Narrative Engine]
    D --> E[Behavioral Ledger (append-only)]
    E --> F[Snapshot Engine (derive-only)]
    F --> G[Application (read-only)]
```

Any code path that bypasses this flow is a system violation.

## 3. Core Objects

The ledger manages exactly three object types.

### 3.1 BehavioralEvent (Immutable Fact)

A BehavioralEvent is the atomic legal record of something that happened.

It represents:

• who acted
• what was attempted
• what was validated
• what was accepted
• what rules applied
• what rights were enforced
• what state changed
• what narrative explains it

**Canonical schema**
```typescript
interface BehavioralEvent {
  eventId: UUID

  userId: string

  eventType: EventType        // from BEHAVIORAL_EVENTS canon

  occurredAt: ISO-8601        // authoritative behavioral time
  recordedAt: ISO-8601        // ledger write time

  actor: {
    type: SYSTEM | USER | WITNESS | COURT
    id: string
  }

  input: {
    raw: object               // what was submitted
    normalized: object        // after validation
  }

  validation: {
    rightsChecked: string[]   // Magna Carta clause IDs
    governanceChecks: string[]
    allowed: boolean
    deniedReason?: string
  }

  outcome: {
    accepted: boolean
    generatedStates: string[] // symbolic, not stored
    interventions: string[]  // IDs
  }

  appliedRules: string[]     // rule IDs
  appliedRights: string[]    // constitutional clauses

  narrativeId: string        // mandatory

  preStateHash: string
  postStateHash: string

  chain: {
    previousEventId: string | null
    chainHash: string
  }
}
```

**Non-negotiable properties**

• append-only
• immutable
• identity-attributed
• rights-referenced
• rule-referenced
• narrative-bound
• cryptographically chained
• never updated
• never deleted

Events are legal records.

They are not logs.

### 3.2 NarrativeRecord (Institutional Explanation)

A NarrativeRecord is the official explanation of a system action.

It satisfies:

• Right to Explanability
• Due process
• Appealability
• Human legibility

**Canonical schema**
```typescript
interface NarrativeRecord {
  narrativeId: UUID
  userId: string

  linkedEventIds: string[]

  transition: {
    fromState: string
    toState: string
  }

  explanation: {
    summary: string
    detailed: string
  }

  citedRules: string[]
  citedRights: string[]

  authority: {
    issuedBy: SYSTEM | COURT | COMMUNITY
    actorIds: string[]
  }

  forwardPath: {
    userOptions: string[]
    systemExpectations: string[]
    appealAvailable: boolean
  }

  createdAt: ISO-8601
}
```

**Non-negotiable properties**

• immutable
• ledger-stored
• referenced by all major events
• consumed by appeals
• rendered verbatim by UI

If a transition has no NarrativeRecord, it is unlawful.

### 3.3 DailySnapshot (Derived Opinion)

A DailySnapshot is a cache of interpreted reality.

It is not truth.
It is a projection.

**Canonical schema**
```typescript
interface DailySnapshot {
  userId: string
  date: YYYY-MM-DD

  derivedFromEventId: string

  state: {
    engagementState
    streakState
    riskBand
    protections
    decayClocks
    authorityStanding
  }

  scores: { ... }

  openConditions: {
    warningsActive
    probation
    recovery
  }

  computedAt: ISO-8601
  snapshotHash: string
}
```

**Rules**

• may be deleted
• may be regenerated
• may be invalidated
• must always be derivable from ledger
• must never be manually edited

Snapshots are opinions.
Events are facts.

## 4. Ledger Service Contract

The ledger exposes only four operations.

No others are permitted.

1. `appendEvent(event, narrative)`
2. `getEvents(userId, range)`
3. `getLatestEvent(userId)`
4. `verifyChain(userId)`

It must not support:

• update
• delete
• merge
• patch
• bulk overwrite

The only valid write is append.

## 5. Engine Refactor Contract

From adoption of this spec, the engine’s role becomes:

Event and narrative production, not state mutation.

**Canonical engine interface:**

```javascript
resolve(inputEvent, eventHistory)
  → {
      behavioralEvents[],
      narrativeRecords[],
      proposedState
    }
```

The engine:

• does not write state
• does not persist state
• does not decide truth
• does not bypass rights

It only proposes.

The ledger confers reality.

## 6. Authority & Rights Binding

Before any event can be appended:

• Rights Gate must approve
• Governance Engine must qualify
• Narrative Engine must produce explanation

The ledger must refuse any event where:

• rightsChecked is empty
• narrativeId is missing
• chainHash is invalid
• actor is undefined

The ledger is not neutral storage.

It is a constitutional instrument.

## 7. Replay & Audit Compatibility

The ledger must support:

• full user replay from zero
• daily reconstruction
• branching simulation
• chain integrity verification

It must be possible to:

1. delete all snapshots
2. rebuild all users from ledger alone
3. arrive at identical projections

If this is not possible, the ledger is defective.

## 8. Prohibited Practices

From this version onward, the following are institutional violations:

• direct state persistence
• silent state changes
• UI-driven truth
• mutable history
• un-narrated transitions
• non-attributed actions

Any of these constitutes institutional corruption.

## 9. Adoption Protocol

This spec is considered adopted only when:

• all behavioral writes route through ledger
• engine no longer writes state
• snapshots are purely derived
• replay is demonstrable
• narratives are mandatory
• rights checks are bound to events

Until then, the system is considered under migration.

## 10. Institutional Statement

The Behavioral Ledger is the moment IRON becomes real.

From this point forward, IRON is not:

a tracker
a game
an app

It is:

a record of behavior governed by law.

Once this ledger is sovereign, everything else in IRON becomes:

• policy
• narrative
• culture
• experience

But never again truth.
