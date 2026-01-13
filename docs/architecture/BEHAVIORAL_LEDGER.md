# Behavioral Ledger & Transparency Specification

Authority: Governance Layer (Transparency)
Status: DRAFT

## 1. The Right to Inspection
Every user has the right to inspect their "Behavioral Case History". The system is not a black box.

## 2. The Behavioral Service Record (BSR)
The `BSR` is a user-facing data object exposed via `useTransparency()`.

### Structure
```json
{
  "standing": "GOOD_STANDING", // GOOD_STANDING | PROBATION | DORMANT
  "score": 985,                // Current Engagement Score
  "social_capital": 45,        // Current Social Capital
  "ledger": [
    {
       "date": "2024-03-12",
       "type": "INTERVENTION",
       "subtype": "NOTIFY_URGENT",
       "narrative": "System warned of imminent fracture.",
       "impact": "NEUTRAL"
    },
    {
       "date": "2024-03-13",
       "type": "ACTION",
       "subtype": "CHECK_IN",
       "narrative": "User responded to warning. Streak saved.",
       "impact": "+10 SC"
    },
    {
       "date": "2024-05-01",
       "type": "FRACTURE",
       "subtype": "LOCK_OUT",
       "narrative": "Consecutive misses led to lockout.",
       "impact": "STREAK_FROZEN"
    }
  ]
}
```

## 3. Explanability Requirements
- **Debt Clarity**: If a user is `DORMANT`, the UI must clearly state the "Identity Debt" required to return (e.g., "Complete 3 Check-ins to restore rank").
- **Action Causality**: Users must see *why* an intervention happened. "You were warned because your consistency dropped below 20%."

## 4. Implementation Strategy
- **Source**: `audit_logs` collection.
- **Filter**: All events where `target_uid` == `current_user`.
- **Presentation**: A timeline view in the User Profile named "Service Record".
