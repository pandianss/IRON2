# Go / No-Go Criteria

## Release Blockers (Absolute)
- [ ] **Data Loss Risk**: Any known bug that causes user data (streaks, check-ins) to disappear.
- [ ] **Auth Failure**: Inability to login/signup or maintain session.
- [ ] **Security Breach**: Open Firestore rules or exposed secrets.
- [ ] **Critical Crash**: App white-screen on core flows (Home, Check-in).

## Quality Gates (Target)
- [ ] **Retention Service**: 100% test coverage on scoring logic.
- [ ] **Startup Time**: under 2 seconds to interactive.
- [ ] **Payload Size**: Initial bundle < 500KB (gzip).

## Procedure
1. Run full test suite: `npm test`
2. Manual verification of "Red Zone" features.
3. Review `monitor` dashboards for anomalies (if staging exists).
4. Sign-off from Lead Developer.
