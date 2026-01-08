# Behavior Contract

This document lists the critical behaviors that must be preserved exactly during the refactor.
**Regression in any of these areas is a failure.**

## 1. Daily Check-in Modal
*   **Trigger**: Must appear ONLY if:
    *   User is logged in.
    *   App Mode is 'live' (not onboarding/welcome).
    *   `lastCheckInDate` is NOT today.
    *   `isLoading` is false.
*   **Actions**:
    *   "Yes, I Trained" -> Logs `trained`, increments streak, updates specific day history.
    *   "Rest Day" -> Logs `rest`, increments streak (if logic allows) or maintains, logs specific rest day.
    *   "Not Yet" -> Dismisses modal, does NOT log, does NOT warn again immediately (until session reload or timeout).

## 2. Streak Logic
*   **Increment**: On valid check-in (Trained or Rest).
*   **Reset**: If `lastCheckInDate` > 1 day ago (yesterday missed).
*   **Display**: `StreakCard` and `PassportCard` must show the *calculated* streak immediately after check-in.

## 3. Smart Nudges (New)
*   **Trigger**: App Launch.
*   **Condition**: If `!checkedInToday` AND (Time > X or Logic triggers).
*   **Frequency**: Max 1 per day (per session/logic constraints).
*   **Message**: "Risk Alert" if streak > 3, "Gentle Nudge" otherwise.

## 4. Feed Entries
*   **Creation**: When `performCheckIn` completes.
*   **Content**: Must contain `status` (Trained/Rest) and `newStreak`.
*   **Visibility**: Must appear in `CommandCenter` feed immediately (or on refresh).

## 5. Auth Guards (AppShell)
*   **Redirects**:
    *   `!appMode` -> `/welcome`
    *   `live` & `!currentUser` -> `/auth`
    *   `live` & `!onboardingCompleted` -> `/onboarding`
    *   `partner` path access -> Restricted to `gym/owner`.
