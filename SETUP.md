# BetterInternet — Final 1.0 preview

This milestone adds accounts and per-school cloud saving to Draft 3.7. The network editor, recommendation model, and exam workflows are retained. It is not the complete Final release.

## Configure in your browser

1. In your dedicated BetterInternet Firebase project, enable Google and Email/Password Authentication. Create the default Standard Firestore database in production mode. Use the Spark plan if you want to avoid paid usage.
2. Open `firebase-config.js` in a text editor. Replace the empty values with your Firebase web app configuration. Keep `export const firebaseConfig = { ... };` intact. Do not include admin credentials or a service account key.
3. In Firebase Console → Firestore Database → Rules, replace the rules for this dedicated database with the contents of `firestore.rules` and click Publish. Do not use open/test-mode rules. The application uses `users/{uid}/schools/{schoolId}`. Verified email and matching account UID are required for reads and writes. No other paths are allowed. If you have other apps using this database, do not replace their rules without reviewing the impact.
4. In GitHub, create a separate `final-preview` branch from `draft-3`. Upload the root website files: `index.html`, `favicon.svg`, `vercel.json`, `firebase-config.js`, `accounts.js`, and `cloud-sdk.js`. README, SETUP.md, firestore.rules and tests are optional for GitHub documentation; Firestore rules must still be published in the Firebase console. Keep the JS files in the same folder as index.html. Do not upload the ZIP itself or nest its contents in a folder.
5. Create a separate Vercel project pointing to `final-preview` as the production branch; leave Draft 3 alone. No framework build is needed. The included rewrite preserves `/studio`.
6. In Firebase Authentication → Settings → Authorized domains, add the exact new Vercel hostname (without `https://` or a path). Do not enable arbitrary domains. Test Google sign-in from the deployed HTTPS site. Email accounts require verification before cloud access; verify the email and sign in again.

## Before using real school data

- Export your existing school JSON from Draft 3, then import it on the new site. Browser storage is tied to origin; it will not automatically move between Vercel domains.
- Use fictional data for the initial test. Sign in; optionally copy the last guest school into the account workspace. Click **Save this school to my account** to opt in. Ordinary edits then autosave after 2.5 seconds of inactivity. Wait for **Saved to cloud** before switching devices.
- Open the same school on a second browser/device. Edit and verify it appears after reopening the cloud copy. The app does not continuously listen for remote edits. Conflicting revisions stop automatic overwrites; export local changes or keep a separate copy before opening the newer cloud version.
- Sign out, confirm guest projects are separate. Sign in as a second verified user; ensure no first-account schools appear. In Firestore Rules Playground or the emulator, check reads/writes for owner versus another UID, unauthenticated access, unverified email, and invalid document fields. The client UI test is not a substitute for testing the actual deployed rules.
- Local backups remain on the same browser even after sign-out. They are not encrypted and are not a security boundary. Use a private device/browser profile; clear site data when appropriate after ensuring backups exist. Do not enter student identities, passwords, credentials, or sensitive campus details unless your organization permits that use. Cloud deletion keeps the local copy. Account deletion and collaboration are not implemented in this milestone.
- If using actual school information, confirm organizational approval and data-handling requirements. Review Firebase API restrictions and configure App Check before wider public use. App Check is not enabled in this preview.

## Implementation notes

- Firebase web SDK v11.10.0 is dynamically loaded only when configured. The site still works locally without a configuration; cloud features require a deployed HTTPS site and internet access.
- Firestore stores one versioned JSON payload per school, at most 800,000 UTF-8 bytes client-side, below the Firestore 1 MiB document limit. Future floor plan images/PDFs require a separate storage design; no upload support yet.
- Authenticated workspaces use separate browser storage keys per UID. Initial cloud saving is explicit for each school. There is no automatic upload of guest schools on sign-in. The account manager supports opening local and cloud copies, exporting and deleting cloud copies.
- The existing 51 engineering checks passed. In Chromium with injected HTML, mock storage and mock Firebase adapter, eight account interaction checks passed (guest, no automatic upload, explicit save, autosave, open cloud school, conflict, sign-out, separate second account). Real network navigation was blocked in this environment; live Firebase authentication, actual rules enforcement, refresh persistence, Safari and deployment remain unverified.
- Next milestones: editor modernization, approximate/image/PDF floor plans, connections and installation guidance, robust optimization, saved plans/reports, and end-to-end validation.

Official setup references: https://firebase.google.com/docs/web/setup ; https://firebase.google.com/docs/auth/web/google-signin ; https://firebase.google.com/docs/firestore/security/get-started ; https://firebase.google.com/docs/firestore/quotas
