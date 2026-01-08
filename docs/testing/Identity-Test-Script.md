# Identity System: Manual Test Script

## Prerequisites
- App running locally (`npm run dev`)
- Firestore Emulator running OR connected to Dev project.

## Test Cases

### 1. Functional: Signup & Profile Creation
- **Action**: Click "Get Started" -> "Sign up with Email".
- **Input**: proper email format, password > 6 chars.
- **Expected**:
    - Redirected to Onboarding.
    - `users/{uid}` document created in Firestore.
    - `users/{uid}/role` defaults to 'user' (or 'enthusiast').
- **Verify**: Check Firestore Console for document existence.

### 2. Functional: Logout & Session
- **Action**: Click Profile -> Logout.
- **Expected**:
    - Redirect to Auth Page.
    - LocalStorage cleared (except non-sensitive keys).
    - Session checks (protected routes) now fail.

### 3. Data Integrity: Orphan Check
- **Setup**: Create user, then manually delete `users/{uid}` doc in Firestore Console.
- **Action**: Refresh App / Relogin.
- **Expected**:
    - App detects missing profile.
    - **Self-Healing**: `syncUserFromAuth` (in `AuthContext`) rec-creates the skeleton profile.
    - **Notification**: UI might show "Profile restored" (if implemented) or just work silently.
    - **CRITICAL**: App must NOT crash (White Screen).

### 4. Security: Rule Enforcement
- **Action**: Open Console, try to read another user's doc.
- **Code**: `await db.collection('users').doc('OTHER_UID').get()`
- **Expected**: "Missing or insufficient permissions" error.
