# Governance Core Template

This is a standalone extraction of the **Behavior Governance System** from Project Iron. Use this template to integrate "Proof of Work" protocols into any application.

## 📦 Contents

### 1. Core Logic (`core/protocols/ProtocolService.js`)
- Defines the active protocol (e.g., IRON, SOFT, VAJRA).
- Handles rules, validation logic, and XP rewards.
- **Usage**: Import `ProtocolService` to get the current protocol definition.

### 2. User Interface (`ui/`)
- **`GovernanceConsole.jsx`**: The main dashboard. Displays User Identity, Active Protocol, and Ledger Status.
- **`ContractInitiation.jsx`**: The daily check-in flow. Validates user "vow" and handles proof submission.

### 3. State Management (`context/RetentionContext.jsx`)
- The "Engine" of the system.
- Tracks:
    - `streak`: Current chain of compliance.
    - `tier`: User status level.
    - `checkInStatus`: Daily completion flag.
    - `activeProtocol`: The ruleset currently in play.
- **Dependency**: Requires a parent `AuthProvider` or similar to provide `currentUser`.

## 🚀 Quick Start in a New App

1.  **Copy Files**: Drop this folder into your `src` directory.
2.  **Install Icons**: Ensure `lucide-react` is installed (`npm i lucide-react`).
3.  **Wrap App**:
    ```jsx
    import { RetentionProvider } from './governance-template/context/RetentionContext';
    
    <RetentionProvider>
      <App />
    </RetentionProvider>
    ```
4.  **Add Routes**:
    ```jsx
    <Route path="/" element={<GovernanceConsole />} />
    <Route path="/checkin/initial" element={<ContractInitiation />} />
    ```

## 🛠 Customization

- **Change Protocol**: Edit `ProtocolService.js` to rename "IRON" to your app's specific protocol (e.g., "CODING", "MEDITATION", "RUNNING").
- **Styling**: The UI uses standard CSS variables (`--accent-orange`, `--text-primary`). Define these in your root CSS to theming.
