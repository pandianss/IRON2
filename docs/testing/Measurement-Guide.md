# Retention Measurement Guide

## Overview
Retention data is now **Server-Authoritative**, stored in Firestore. This guide explains how to query and measure core KPIs.

## Core Metrics
| Metric | Source Field | Query Strategy |
| :--- | :--- | :--- |
| **Active Users** | `users/{uid}.lastCheckInDate` | `where('lastCheckInDate', '==', TODAY)` |
| **Churn Risk** | `users/{uid}.currentStreak` | `where('currentStreak', '<', 3)` |
| **Power Users** | `users/{uid}.longestStreak` | `orderBy('longestStreak', 'desc').limit(10)` |

## Firestore Queries (Console or Admin SDK)

### 1. Daily Active Users (DAU)
```javascript
const today = new Date().toISOString().split('T')[0];
db.collection('users')
  .where('lastCheckInDate', '==', today)
  .get()
  .then(snap => console.log("DAU:", snap.size));
```

### 2. At-Risk Users (Streak Broken Yesterday)
```javascript
// Users who checked in day-before-yesterday but missed yesterday
// Requires more complex logic or a scheduled function to tag "at_risk"
```

### 3. Global Retention Rate
Analyze `users/{uid}/checkins` subcollection count vs. `joinedAt` date.

## Analytics Events
The app also logs key events to `feed_activities` which can be counted:
- `type: 'check_in'`
- `type: 'streak_milestone'`
