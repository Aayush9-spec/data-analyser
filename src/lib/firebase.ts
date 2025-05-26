
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;

const criticalConfigPresent = apiKey && authDomain && projectId;

if (!criticalConfigPresent) {
  console.error(
    'CRITICAL: Firebase initialization skipped due to missing essential configuration. ' +
    'Ensure the following environment variables are set:' // Add the missing part of the message
  ); // Add the closing parenthesis here
  if (!apiKey) console.error(" - NEXT_PUBLIC_FIREBASE_API_KEY is missing or empty.");
  if (!authDomain) console.error(" - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing or empty.");
  if (!projectId) console.error(" - NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing or empty.");
} else {
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
  };

  if (!getApps().length) {
    try {
      console.log("Attempting to initialize Firebase app with config:", firebaseConfig);
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized successfully.");
    } catch (error) {
      console.error("Firebase app initialization error:", error);
      app = undefined;
    }
  } else {
    app = getApp();
    console.log("Firebase app already initialized, getting instance.");
  }

  if (app) {
    try {
      console.log("Attempting to initialize Firebase auth...");
      auth = getAuth(app);
      console.log("Firebase auth initialized successfully.");
    } catch (error) {
      // This is often where auth/invalid-api-key error surfaces if app initialized with bad key
      console.error("Firebase auth initialization error (e.g., auth/invalid-api-key):", error);
      auth = undefined;
    }
  } else {
     // Logged above if criticalConfigPresent was true but app init failed
  }
}

if (!app) {
  console.error(
    "EXPORT_ERROR: Firebase App object (app) is not available. Firebase-dependent features will NOT work. Please check your configuration and environment variables, then restart your server."
  );
}
// Check auth only if app initialization was attempted (criticalConfigPresent was true)
if (criticalConfigPresent && app && !auth) {
  console.warn(
    "EXPORT_WARN: Firebase Auth object (auth) is not available, though the App object (app) was initialized. Authentication features will NOT work. This could be due to an invalid API key or other auth-specific configuration issues. Please check your Firebase project's auth settings and config, then restart your server."
  );
}


export { app, auth };
