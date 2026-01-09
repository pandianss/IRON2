import { auth, db, storage } from './firebase.config';
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
    where,
    limit,
    startAfter,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";


// --- REAL AUTH SERVICE ---
const RealAuthService = {
    checkEmailExists: async (email) => {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            return methods.length > 0;
        } catch (error) {
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
                role: 'user'
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
            return confirmationResult;
        } catch (error) {
            throw error;
        }
    },

    sendLoginLink: async (email) => {
        const actionCodeSettings = {
            url: window.location.origin + '/auth?finish=true',
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
            const user = userCredential.user;
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'User',
                role: 'user'
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
    },

    // Expose raw auth for listeners
    auth: auth
};

// --- REAL STORAGE SERVICE ---
const RealStorageService = {
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

// --- REAL DATABASE SERVICE (Firestore) ---
const RealDbService = {
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

    // Real-time Subscription
    subscribeToCollection: (collectionName, callback, queryConstraints = []) => {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, ...queryConstraints);

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(data);
            }, (error) => {
                console.error(`Error subscribing to ${collectionName}:`, error);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Subscription failed:", error);
            return () => { };
        }
    },

    // Get Paginated Docs
    getPaginatedDocs: async (collectionName, pageSize = 10, lastDoc = null, orderByField = 'date') => {
        try {
            const colRef = collection(db, collectionName);
            let q;

            if (lastDoc) {
                q = query(colRef, orderBy(orderByField, 'desc'), startAfter(lastDoc), limit(pageSize));
            } else {
                q = query(colRef, orderBy(orderByField, 'desc'), limit(pageSize));
            }

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            return { data, lastVisible };
        } catch (error) {
            console.error(`Error getting paginated docs from ${collectionName}:`, error);
            return { data: [], lastVisible: null };
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
            }, { merge: true });
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

export const AuthService = RealAuthService;
export const DbService = RealDbService;
export const StorageService = RealStorageService;

export {
    auth, db, storage,
    RealAuthService, RealDbService, RealStorageService
};
