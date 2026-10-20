/**
 * scripts/set-admin-claim.js
 *
 * Usage (local machine):
 * 1. Create a service account JSON in the Firebase Console (Project Settings -> Service accounts -> Generate new private key).
 * 2. Save the JSON file locally (do NOT commit it to the repo).
 * 3. Install dependencies: `npm install firebase-admin`.
 * 4. Run the script with the environment variable pointing to the JSON:
 *    GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json" node scripts/set-admin-claim.js
 *
 * The script will look up the user by email and, if found, set the custom claim { admin: true }.
 * It never embeds the service account in source. It uses Application Default Credentials
 * (the recommended secure pattern) via the GOOGLE_APPLICATION_CREDENTIALS env var.
 */

const admin = require("firebase-admin");

const ADMIN_EMAIL = "Tarighitblh@email.com"; // change here if needed

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("ERROR: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    console.error("Set it to the path of your service account JSON file and re-run the script.");
    process.exit(1);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });

    console.log("Looking up user by email:", ADMIN_EMAIL);
    const userRecord = await admin.auth().getUserByEmail(ADMIN_EMAIL);

    if (!userRecord || !userRecord.uid) {
      console.error("User not found:", ADMIN_EMAIL);
      process.exit(2);
    }

    console.log("User found. UID:", userRecord.uid);

    // Set custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log(`Successfully set custom claim 'admin: true' for ${ADMIN_EMAIL}`);

    console.log("Note: the user should sign out and sign back in to refresh their ID token.");
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.error("User not found. Make sure the email is registered in Firebase Authentication.");
    } else {
      console.error("Error:", err);
    }
    process.exit(3);
  }
}

main();
