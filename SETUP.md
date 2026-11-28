# BetterInternet Final 1.2 — deployment and verification

## Update your existing final-preview project

1. Export your current schools as JSON backups. Keep Draft 3 untouched. Reuse the **same Vercel hostname**, Firebase project and `final-preview` branch so existing local data and account IDs are retained.
2. Keep the existing Vercel Production environment variable `FIREBASE_WEB_CONFIG` (strict JSON). Do not paste values into GitHub. `firebase-config.js` stays a placeholder. If you have not configured it yet, add the Firebase Web app configuration as JSON in Vercel → Settings → Environment Variables. Never use admin credentials. The configuration generated into the deployed browser bundle is public by design; restrict the API key to the Firebase APIs required. See https://firebase.google.com/docs/projects/api-keys.
3. Upload/replace the following 13 root website/build files in your GitHub `final-preview` branch. Do not upload `dist/`, private keys, service account files, or your actual Firebase configuration.

   - index.html
   - accounts.js
   - cloud-sdk.js
   - studio11.js
   - studio12.js
   - studio12.css
   - trace12.js
   - optimizer12.worker.js
   - auth-action.html
   - firebase-config.js (placeholder)
   - favicon.svg
   - build.mjs
   - vercel.json

   Vercel should run `node build.mjs` with output directory `dist` (Framework: Other). The existing Vercel setup should not need changes. If configuration is absent the build intentionally works in guest mode. Check the deployment log.
4. For the new private sharing and account deletion flows, publish the included `firestore.rules` to your **dedicated** BetterInternet Firestore database → Rules. Do not replace rules for unrelated applications. The previous owner-only rules continue to protect regular school documents; new shares are independent documents. If a rule publication error occurs, copy the exact console error instead of relaxing the rules. The rules have been reviewed but not compiled against a live Firestore instance in this environment. Test with fictional data before sharing anything sensitive.
5. Keep Google and Email/Password providers and the authorized Vercel hostname enabled. If already configured, leave the custom verification action URL unchanged (`https://YOUR-HOST/auth-action.html`). No new billing or API key is required for the core build.

## How to use the new workspace

- Quick Start: upload a PDF/image, choose one of six editable layouts, start blank, or explore a fictional demo. The floor tabs have a pencil on the active tab; the adjacent + adds a floor and the ellipsis opens existing floor actions. Click the school title to rename it. My schools lists local workspace copies directly, with cloud management available below.
- Add opens the room library only when needed. Wi-Fi AP and Ethernet jack are separate tools. An existing AP can be modeled with an assumed working Ethernet connection; separate jack documentation is optional. Select a room to edit it, or double-click an item label. Use Apply to similar rooms to copy counts and wall assumptions without geometry changes. More contains advanced settings, saved proposals, recovery and project actions.
- Upload PDF or image via Quick Start or the + floor menu. The source stays in the browser. PDF.js 6.5.438 is loaded from jsDelivr only when needed; network access to the CDN is required. Choose the page number, review detected rectangles and remove wrong candidates, set approximate full image width in metres (including margins) and accept. Detection works best with high-contrast axis-aligned enclosed walls; it cannot read all doors, OCR room names, wall types, APs, accurate scale or complex irregular spaces. The local JPEG underlay is not uploaded or included in exports. Accepting a drawing over an existing layout requires confirmation.
- Measure connection is a short, optional device-to-Cloudflare test (approximately 7 MB of transfer, 35-second timeout). It uses the public __down and __up endpoints, not a full certified speed test. It estimates download/upload throughput and HTTP response times, not ICMP ping or school-wide provisioned bandwidth. The provider sees your IP and test traffic; no school IDs, floor images or room names are sent. Choose a room/connection type and save the observation. Measurements are kept separately from the engineering model and included in the school payload if cloud saving is enabled. Do not run during exams. External endpoint and PDF.js availability must be checked on the actual deployment.
- Find improvements compares the existing additive AP search with a simpler optional-budget dialog. Worker offload keeps candidate evaluation away from the editor; if workers cannot start, the legacy yielding search is used. Results include optional everyday, heavy and 25% growth sensitivity checks and contextual advice about unknown WAN capacity, wired uplinks, aging equipment and channel congestion. These are model-based suggestions, not measured causes or authorization. Search still optimizes additions to four priced UniFi models; it does not automatically optimize all relocation, replacement, switching, or channel changes. Use advanced controls to explore those separately.
- Share → Email / PDF improvement proposal opens a branded report with existing and proposed floor diagrams, numbered APs, BOM, model links, expected effects, limitations, diagnostic and future upgrade suggestions. Turn maps or technical details off for wider sharing. This is browser Print / Save as PDF (not automatic email attachment). Saved proposal snapshots open their own report, not the current project's report. Reports are not official certifications.
- Share → Share proposal privately sends a text-only summary to one specified, verified account via a private link. Share a school copy creates a separate snapshot for a single recipient; optionally permit that recipient to publish revisions. Explicit permission confirmation is required. It does not expose the owner's original school document, raw floor image, saved plans, or recorded measurements. Revise by opening the link as a working copy, editing locally, then More → Publish shared revision. The original school is never overwritten. Owners can open and publish to their shared copies and revoke links under Manage shared copies. Links are tied to an exact verified email; the recipient must sign in and may need to reopen the link after signing in. Multiple independent shares do not synchronize with each other; this is not real-time Google Docs-style coediting. Revocation blocks future server access, not copies already downloaded. Share docs are deleted when an owner deletes their account. Do not share real floor plans until cross-account testing and organizational approval are complete.
- More → Version recovery contains up to five local checkpoints per school. Local checkpoints and imported images may use browser storage; periodically export projects and do not rely on localStorage as the only backup. Browser copies on other devices cannot be remotely erased.

## Live verification — use fictional accounts and fictional schools only

| Test | Expected |
|---|---|
| Sign in, create school, wait for Saved to cloud, open incognito | Same school restores after signing in |
| Existing local school | Save to cloud button works; local-only option remains |
| Two separate accounts | Uninvited account cannot get/list/write school documents or shares |
| Invite exact verified account to view a proposal | Recipient can get only that share, cannot modify it or list the owner's shares |
| Invite a verified account to edit a school copy | Recipient may publish a revision; cannot change invitee, kind, name, permissions, or owner school |
| Two editing sessions publish the same revision | First succeeds, second conflicts; no silent overwrite |
| Revoke a link | Subsequent recipient server read/write denied |
| Unverified or signed-out account | No private share access |
| Account deletion on disposable account | Reauthenticate, erase owned shares/schools, delete login; retry if partial failure; minimal UID deletion marker remains |
| Clean floor image, PDF and old scan | Review suggestions, confirm scale, fallback to image tracing when needed |
| Short connection test | Results save only when explicitly requested; no substitution into WAN allocation |
| Safari and mobile browsers | Layout, auth, PDF and touch behavior work |

These tests are necessary before storing real school infrastructure or distributing public links. App Check is still not enabled; configure and validate before a wider rollout. Rules are deny-by-default and owner/recipient restricted, but no live emulator or Firebase validation was possible here.

## Local validation performed

- 51 existing deterministic engineering/optimizer checks passed.
- Four synthetic raster detector checks and one worker-engine VM check passed.
- Browser DOM tests with an in-memory storage stand-in: Quick Start/layout selection, direct floor rename, scan of a synthetic 5-space image, acceptance into five editable rooms, optimizer-generated proposal, report with current/proposed maps, mocked speed test save and 390px narrow viewport (zero horizontal overflow). No page JS errors on those tested paths. Direct network/browser navigation is blocked in the development environment, so the deployed browser, live Firebase, CDN PDF loading, actual Cloudflare requests, cross-account sharing and real school drawing accuracy remain unverified.
