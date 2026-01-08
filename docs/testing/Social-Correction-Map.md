# Social-to-Retention Correction Map

## Overview
The Social Layer (`src/social/`) is currently operating on **Mock Data** or disconnected logic, while the Core Retention Layer (`src/services/retention`) is now Server-Authoritative (Firestore). This document maps the necessary connections to bridge this gap.

## 1. Social Feed (`src/social/feed`)
- **Current State**: Uses `MOCK_POSTS` in `useFeed.js`.
- **Target State**: Consume `ActivityContext.feedActivities` (which is already wired to Firestore `feed_activities`).
- **Required Changes**:
    - Refactor `useFeed.js` to `useContext(ActivityContext)`.
    - Map Firestore fields (`date`, `likes`) to UI props.

## 2. Squads (`src/social/squads`)
- **Current State**: Uses `MOCK_SQUAD` in `useSquad.js`.
- **Target State**:
    - New Firestore Collection: `squads/{squadId}`.
    - User Profile Field: `users/{uid}.squadId`.
- **Required Changes**:
    - Create `SquadService` (or `FirebaseRetentionService.getSquad()`).
    - Update `useSquad` to fetch real data.

## 3. Challenges (`src/social/challenges`)
- **Current State**: Hardcoded UI or Props (Verified via Audit).
- **Target State**:
    - Firestore Collection: `challenges/{challengeId}`.
    - Participation Subcollection: `challenges/{id}/participants`.
- **Required Changes**:
    - Implement `ChallengeService`.
    - Link Check-ins (`FirebaseRetentionService`) to Challenge Progress.

## Retention Dependencies
| Feature | Dependency | Action |
| :--- | :--- | :--- |
| **Feed** | `checkIn` event | Auto-post to Feed (Verified in Phase 2) |
| **Squads** | `currentStreak` | Squad Score = Sum(Member Streaks) |
| **Challenges** | `checkIn` event | Increment Challenge Progress |

## 4. Cognitive & Value Layers
### Insights (`src/features/insights`)
- **Current State**: 
    - `useSmartNudges`: **Connected**. Uses real `useStreaks` data. Logic is basic timer-based.
    - `useInsights`: **Connected**. Uses real `streak` count. Content is hardcoded (`INSIGHT_TYPES`).
- **Target State**:
    - Analyze `checkInHistory` timestamps for real patterns (e.g., "Weekend Warrior").
    - **Action**: No immediate wiring needed, but logic needs maturity.

### Knowledge & Studio
- **Knowledge**: Static (`src/features/knowledge/data/knowledgeData.js`). 
    - **Action**: None required for MVP.
- **Studio**: **Connected**.
    - Uses `DataContext` (`studioContent`, `studioExercises`).
    - Note: `DataContext` might essentially be a local state wrapper for V1 unless `DbService` is fully wired to these collections. (Verified `StudioPage.jsx` uses `useData`).

