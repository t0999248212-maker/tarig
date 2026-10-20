
# scripts/README.md

This document explains how to securely run the `set-admin-claim.js` script, verify the admin custom claim, and deploy Firestore rules for the Tariq Portfolio project.

IMPORTANT: Do not commit service-account JSON files or any secrets to GitHub.

Contents
- Prerequisites
- Configure Firebase Admin SDK credentials (secure)
- Install dependencies
- Run `set-admin-claim.js` (exact command)
- Verify the custom claim was assigned
- Deploy `firestore.rules` using Firebase CLI
- Test admin access and verify unauthorized users are denied
- Security reminders

---

Prerequisites
- Node.js (v14+ recommended) and `npm` installed locally.
- A Firebase project with Authentication enabled and a user registered with the email:
  - `Tarighitblh@email.com`
- The repository already contains: `scripts/set-admin-claim.js` and `firestore.rules`.

Configure Firebase Admin SDK credentials (secure)
1. In the Firebase Console, go to Project Settings → Service accounts.
2. Click "Generate new private key" and download the JSON file.
3. Save the JSON file somewhere safe on your machine (for example `~/.firebase/service-account.json`).
4. NEVER add this JSON file to your repository or commit it to source control.

The script uses Application Default Credentials. Set the environment variable pointing to the JSON file when running the script.

Install dependencies
1. From the project root, install the required Node package for the script:

```bash
npm install firebase-admin
```

Run `scripts/set-admin-claim.js` (exact command)
1. Replace `/path/to/serviceAccountKey.json` with the real path where you saved the downloaded service account JSON.

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
node scripts/set-admin-claim.js
```

Notes:
- The script will look up the user with the email `Tarighitblh@email.com` and set the custom claim `{ admin: true }`.
- If the user does not exist in Authentication, the script exits with an error. Create the user first via the signup page or Firebase Console.

How to verify the admin custom claim was assigned
Option A — In browser (recommended quick check):
1. Sign in to the site as the admin user.
2. Open the browser console and run:

```javascript
firebase.auth().currentUser.getIdTokenResult().then(r => console.log(r.claims));
```

3. Verify the logged object contains `admin: true`.
4. If you recently set the claim, sign out and sign back in first (the script forces a token refresh when opening the admin panel but explicit re-login is simple).

Option B — Using Admin SDK (server-side verification):
1. Using the same service account credentials (but NOT committing them), run a small Node script or REPL:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
node -e "const admin=require('firebase-admin');admin.initializeApp({credential:admin.credential.applicationDefault()});admin.auth().getUserByEmail('Tarighitblh@email.com').then(u=>console.log(u.customClaims)).catch(console.error)"
```

Deploy `firestore.rules` using Firebase CLI
1. Install Firebase CLI if not already installed:

```bash
npm install -g firebase-tools
```

2. Authenticate the CLI and select your project (follow prompts):

```bash
firebase login
firebase use --add
```

3. Deploy only Firestore rules from the project root (the repo contains `firestore.rules`):

```bash
firebase deploy --only firestore:rules
```

Make sure your `firebase.json` (if present) points to the correct `firestore.rules` path. If you don't have `firebase.json`, the CLI will still apply the rules if you specify them in the console or create a minimal `firebase.json`.

Test admin access and confirm unauthorized users are denied
1. After running the script and deploying `firestore.rules`, sign in with the admin account.
   - Open the admin dashboard; it should allow access.
2. Attempt an admin action (create a project or blog post) and verify it succeeds.
3. Sign in as a different, non-admin user and try to access the admin panel — you should be redirected and denied.
4. Try performing a privileged write from a non-admin user (for example, creating a project from the dashboard) — the browser console should show a Firestore permission error and the write should fail server-side.

Security reminders
- Never commit `serviceAccountKey.json` or any secret to GitHub.
- Use environment variables and Application Default Credentials for running administrative scripts locally or in CI.
- Prefer custom claims (`admin: true`) to email-based allow-lists in security rules.
- After setting custom claims, the user must re-authenticate to get updated ID token claims.

If you want, I can add a small non-invasive admin-debug helper in the dashboard to display `idTokenResult.claims` for the signed-in user to make verification easier.

---

If anything in these instructions doesn't match your local setup (file locations or filenames), tell me and I will update the README accordingly.
