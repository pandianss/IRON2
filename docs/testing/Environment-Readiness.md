# Environment Readiness Checklist

## Infrastructure Integrity
- [x] **Filesystem**: `src/infrastructure` exists.
- [x] **Configuration**: `firebase.config.js` and `firebase.js` are present.
- [ ] **Secrets**: `firebase.config.js` audit (Manual check required to ensure no hardcoded secrets if public).

## Firebase Configuration
- [x] **Hosting**: Configured for `dist`, rewrites to `index.html`.
- [x] **Firestore**: Rules file linked correctly.

## Security Audit (Firestore Rules)
- [ ] **Users Collection**: ⚠️ `allow read: if isAuthenticated();` (Low Risk: Exposes all user IDs/Profiles).
- [x] **Gyms**: Secure (Write restricted to SuperAdmin).
- [ ] **Enquiries**: ⚠️ `allow read: if isAuthenticated();` (High Risk: Any user can read ANY enquiry).
- [x] **Transactions**: Secure (Owner only).

## Service Architecture
- [ ] **Retention**: ⚠️ Currently Client-Side Only (`localStorage`). violates "Server Authority" principle.
- [x] **Events**: Basic `EventBus` implemented.

## Recommendations
1.  **Restrict Enquiries Read**: Change to `resource.data.userId == request.auth.uid`.
2.  **Migrate Retention**: Plan migration of Streak logic to Cloud Functions or Firestore triggers for server authority.
