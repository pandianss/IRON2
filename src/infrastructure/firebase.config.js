import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validation
if (!firebaseConfig.apiKey) {
    console.error("CRITICAL: Firebase API Keys missing in .env");
}

let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

try {
    console.log("Attempting Firebase Initialization...");
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Modern Firestore Initialization with Persistence
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
        })
    });
    storage = getStorage(app);
    analytics = getAnalytics(app);

    console.log("Firebase Initialized Successfully");
} catch (error) {
    console.error("FATAL: Firebase Initialization Failed", error);
}

export { auth, db, storage, analytics };
export default app;
