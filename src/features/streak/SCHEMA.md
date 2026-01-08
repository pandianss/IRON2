# RETENTION SCHEMA & DATA AUTHORITY

## 1. The Single Source of Truth
The user's consistency identity (Streak) is authoritative in **Local Storage** (primary) and mirrored to Firestore (backup).
It is NOT derived from activity logs. It is explicitly tracked state.

**Key Definition**: `iron_streak_data_v2`

```json
{
  "currentStreak": 5,
  "longestStreak": 14,
  "lastCheckInDate": "2026-01-08",
  "history": {
    "2026-01-07": "trained",
    "2026-01-08": "rest"
  }
}
```

## 2. The Day Boundary
All dates use **Local Client Time** (YYYY-MM-DD).
- We do NOT use UTC.
- We do NOT use server time.
- If it is "Today" for the user, it is "Today" for the app.

Logic Reference: `src/utils/dateHelpers.js`

## 3. Check-In Rules (Non-Negotiable)
1. **One Action Per Day**: User can check in once.
2. **Rest Counts**: "Rest" keeps the streak alive (Increment +1).
3. **Missed Day**: If `lastCheckInDate` < `yesterday`: Streak resets to 1 (on next check-in).
4. **No Zero Days**: A streak of 0 is impossible after a check-in. It starts at 1.

## 4. Feed Injection
A Check-In event triggers a `feed_activity` document:
- Type: `check_in`
- Status: `trained` | `rest`
- Streak: (Integer) - The *new* streak value.
