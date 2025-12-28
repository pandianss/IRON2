import { auth, db, storage } from '../firebase.config';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    PhoneAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    fetchSignInMethodsForEmail
} from "firebase/auth";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    setDoc,
    getDoc,
    query,
    where
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";

// --- AUTH SERVICE ---
export const AuthService = {
    checkEmailExists: async (email) => {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            return methods.length > 0;
        } catch (error) {
            // If enumeration protection is on, we can't truly know without trying to login/register.
            // But we can catch specific errors if needed.
            console.warn("Email check skipped:", error.code);
            return false;
        }
    },

    register: async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            return {
                uid: user.uid,
                email: user.email,
                displayName: 'New User',
                role: 'user'
            };
        } catch (error) {
            throw error;
        }
    },

    loginWithGoogle: async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: 'user' // Default, will be merged with DB
            };
        } catch (error) {
            throw error;
        }
    },

    setupRecaptcha: (elementId) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved
                }
            });
        }
        return window.recaptchaVerifier;
    },

    loginWithPhone: async (phoneNumber, appVerifier) => {
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            return confirmationResult; // Return this to UI to call .confirm(otp)
        } catch (error) {
            throw error;
        }
    },

    sendLoginLink: async (email) => {
        const actionCodeSettings = {
            url: window.location.origin + '/auth?finish=true', // Redirect back to finish
            handleCodeInApp: true
        };
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
        } catch (error) {
            throw error;
        }
    },

    completeLoginLink: async (url) => {
        try {
            if (isSignInWithEmailLink(auth, url)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    // User opened link on different device, verify email if needs be
                    return { error: 'Please provide email again' };
                }
                const result = await signInWithEmailLink(auth, email, url);
                window.localStorage.removeItem('emailForSignIn');
                const user = result.user;
                return {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || 'User',
                    role: 'user'
                };
            }
        } catch (error) {
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Basic transformation to match previous structure if needed, or just return user
            const user = userCredential.user;
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'User',
                role: 'user' // You might want to fetch this from Firestore 'users' collection
            };
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        return signOut(auth);
    },

    getCurrentUser: () => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) {
                    resolve({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || 'User',
                        role: 'user'
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }
};

// --- STORAGE SERVICE ---
export const StorageService = {
    uploadFile: async (file) => {
        try {
            const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Upload failed", error);
            throw error;
        }
    }
};

// --- DATABASE SERVICE (Firestore) ---
export const DbService = {
    // Get Collection
    getDocs: async (collectionName) => {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error getting docs from ${collectionName}:`, error);
            return [];
        }
    },

    // Get Single Document by ID
    getDoc: async (collectionName, docId) => {
        try {
            const docRef = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error getting doc ${docId} from ${collectionName}:`, error);
            throw error;
        }
    },

    // Set Document (Overwrite/Create with specific ID)
    setDoc: async (collectionName, docId, data) => {
        try {
            const docRef = doc(db, collectionName, docId);
            await setDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            }, { merge: true }); // Merge by default to prevent data loss
            return { id: docId, ...data };
        } catch (error) {
            console.error(`Error setting doc ${docId} in ${collectionName}:`, error);
            throw error;
        }
    },

    // Add Document (Auto-ID)
    addDoc: async (collectionName, data) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date().toISOString()
            });
            return {
                id: docRef.id,
                ...data
            };
        } catch (error) {
            console.error(`Error adding doc to ${collectionName}:`, error);
            throw error;
        }
    },

    // Update Document
    updateDoc: async (collectionName, docId, data) => {
        try {
            const docRef = doc(db, collectionName, docId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
            return { id: docId, ...data };
        } catch (error) {
            console.error(`Error updating doc in ${collectionName}:`, error);
            throw error;
        }
    }
};
