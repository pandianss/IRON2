# Retention Risks & Churn Triggers

## Critical Risks
1. **Streak Corruption**: If a user loses a streak due to a bug, they are 95% likely to churn.
2. **Sync Failures**: Thinking a check-in is saved when it isn't.
3. **Notification Fatigue**: Irrelevant or too frequent pings.
4. **Cold Start Barriers**: High friction in the first 3 days.

## Risk Register
| Risk ID | Description | Severity | Mitigation |
| :--- | :--- | :--- | :--- |
| R-001 | False negative on check-in (app says saved, server says no) | Critical | Local storage fallback + explicit "Synced" UI state |
| R-002 | Timezone boundary confusion (User thinks they have time) | High | Countdown timer to end of day; clear timezone display |
| R-003 | "Empty Feed" on Day 1 | Medium | Seed content; "Welcome" challenges |
| R-004 | Loss of progress during update/migration | Critical | Database backups; strict migration testing |

## Monitoring
- Track `streak_broken` events correlated with `app_error` logs.
- Monitor `uninstall` rates relative to `streak_loss`.
