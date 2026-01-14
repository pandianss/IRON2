import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    AuthService, DbService
} from '../../infrastructure/firebase';
import { db, auth, googleProvider } from '../../infrastructure/firebase';
import { EngineService } from '../../services/engine/EngineService';
import { AuditService } from '../../infrastructure/audit/audit';
import { useUI } from './UIContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children, appMode }) => {
    // Session State
    const { showToast } = useUI();
    const [currentUser, setCurrentUser] = useState(null);
    const [userType, setUserType] = useState('enthusiast');
    const [isLoading, setIsLoading] = useState(true); // Default to loading on mount

    const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
        return localStorage.getItem('iron_onboarding_done') === 'true';
    });

    // 1. Global Auth Listener (Session Persistence)
    // 1. Global Auth Listener (Session Persistence)
    useEffect(() => {
        console.log("AuthProvider: Mounting...", { hasAuth: !!AuthService.auth });

        // Safety Timeout - if Firebase hangs, unlock the app after 3s
        const safetyTimer = setTimeout(() => {
            if (isLoading) {
                console.warn("AuthProvider: Auth check timed out. Forcing unlock.");
                setIsLoading(false);
            }
        }, 3000);

        if (!AuthService.auth) {
            console.error("AuthProvider: AuthService.auth is missing!");
            setIsLoading(false);
            return;
        }

        const unsubscribe = AuthService.auth.onAuthStateChanged(async (firebaseUser) => {
            console.log("AuthProvider: Auth State Changed", { user: firebaseUser?.email });
            clearTimeout(safetyTimer); // Clear timeout if we get a response

            if (firebaseUser) {
                try {
                    // Auth state exists, sync with DB
                    await syncUserFromAuth(firebaseUser);
                } catch (error) {
                    console.error("Session Sync Failed:", error);
                    showToast("Session restored with limited connectivity.");
                }
            } else {
                // No user
                setCurrentUser(null);
                setUserType('enthusiast'); // Default to guest role equivalent
            }
            setIsLoading(false); // Done loading regardless of result
        });

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, [appMode]);


    // Helper to sync user with DB (Sovereign Mode)
    const syncUserFromAuth = async (authUser) => {
        if (!authUser) return;

        // Read-only check for cache
        let dbUser = await DbService.getDoc('users', authUser.uid);

        if (dbUser) {
            // Auto-promote Super Admin on sync
            if (authUser.email === 'sspandian.here@gmail.com' && dbUser.role !== 'super_admin') {
                await EngineService.processAction(authUser.uid, {
                    type: 'USER_UPDATED',
                    role: 'super_admin'
                });
                dbUser.role = 'super_admin'; // Optimistic update
            }

            // Force onboarding complete for super admin
            if (dbUser.role === 'super_admin' && !onboardingCompleted) {
                localStorage.setItem('iron_onboarding_done', 'true');
                setOnboardingCompleted(true);
            }

            setCurrentUser(dbUser);
            setUserType(dbUser.role);
        } else {
            // GENESIS EVENT
            // Check for pre-existing member record (from Partner Onboarding)
            // This reads to find if we need to merge.
            let existingMember = null;
            if (authUser.email) {
                const results = await DbService.queryDocs('users', [where('email', '==', authUser.email)]);
                if (results.length > 0) existingMember = results.find(u => u.id !== authUser.uid) || results[0];
            }

            const role = (authUser.email === 'sspandian.here@gmail.com') ? 'super_admin' : 'user';

            const payload = {
                type: 'USER_CREATED',
                email: authUser.email || authUser.phoneNumber,
                displayName: authUser.displayName || existingMember?.name || 'User',
                role,
                status: existingMember?.status || 'Active',
                // Genesis Defaults handled by SnapshotGenerator/EngineSchema? 
                // We pass them to ensure Profile is rich.
                jimId: existingMember?.gymId || null, // Typo from original? gymId
                gymId: existingMember?.gymId || null,
                plan: existingMember?.plan || null,
                expiry: existingMember?.expiry || null,
                joinedVia: existingMember?.joinedVia || 'App',
                medical: existingMember?.medical || null
            };

            // SOVEREIGN GENESIS
            const newUserState = await EngineService.processAction(authUser.uid, payload);

            setCurrentUser(newUserState);
            setUserType(role);

            // Cleanup old partial doc - This is a SYSTEM interaction, maybe Engine should handle? 
            // For now, removing stale doc is okay here as it's legacy cleanup.
            if (existingMember && existingMember.id !== authUser.uid) {
                console.log("Merging pre-onboarded member doc:", existingMember.id);
                try {
                    await DbService.deleteDoc('users', existingMember.id);
                } catch (e) {
                    console.warn("Failed to delete stale member doc", e);
                }
            }
        }
    };

    // Actions
    const login = async (email, password) => {
        try {
            setIsLoading(true);
            await AuthService.login(email, password);
            // onAuthStateChanged will handle the rest
            showToast("Welcome back.");
            return true;
        } catch (error) {
            setIsLoading(false);
            console.error("Login Error Details:", error);
            let msg = "Login failed.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                try {
                    const exists = await AuthService.checkEmailExists(email);
                    if (!exists) msg = "Account currently not registered. Please Join.";
                    else msg = "Incorrect password.";
                } catch (e) { msg = "Invalid credentials. If you are new, please Join."; }
            } else if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
            else if (error.code === 'auth/too-many-requests') msg = "Too many attempts. Reset password?";
            else msg = `Login failed(${error.code || 'Unknown'}).`;
            showToast(msg);
            return false;
        }
    };

    const loginWithGoogle = async () => {
        try {
            setIsLoading(true);
            await AuthService.loginWithGoogle();
            return true;
        } catch (error) {
            setIsLoading(false);
            showToast("Google Login Failed: " + error.message);
            return false;
        }
    };

    const registerUser = async (email, password, userData) => {
        try {
            setIsLoading(true);
            const authUser = await AuthService.register(email, password);

            let role = userData.role || 'enthusiast';
            if (email === 'sspandian.here@gmail.com') role = 'super_admin';

            const payload = {
                type: 'USER_CREATED',
                email: authUser.email,
                ...userData,
                role,
                displayName: userData.displayName || 'User' // Ensure display name
            };

            // SOVEREIGN GENESIS
            const newUserState = await EngineService.processAction(authUser.uid, payload);

            setCurrentUser(newUserState);
            setUserType(role);

            AuditService.log('USER_REGISTER', newUserState, { id: newUserState.uid }, { role }); // Log optional? Engine logs it.
            showToast("Welcome to IRON.");
        } catch (error) {
            setIsLoading(false);
            console.error("Registration failed", error);
            showToast("Registration failed: " + (error.message || error.code));
            return { success: false, code: error.code };
        }
    }

    const logout = async () => {
        try {
            // CHECK FOR PENDING PROOF (Contract Breach)
            const pendingProof = localStorage.getItem('iron_pending_proof');
            if (pendingProof && currentUser) {
                console.log("Logout with pending proof - S applying penalty.");

                // SOVEREIGN PUNISHMENT
                // We submit a 'CONTRACT_BREACH' or 'LOG_ACTIVITY' with negative XP?
                // Let's use LOG_ACTIVITY for generic XP loss for now, or MISSED_DAY?
                // LOG_ACTIVITY is safer.
                await EngineService.processAction(currentUser.uid, {
                    type: 'LOG_ACTIVITY',
                    activityType: 'BREACH_PENALTY',
                    xp: -100
                });

                showToast(`CONTRACT BREACH: -100 XP`, 'hero');
                localStorage.removeItem('iron_pending_proof');
            }

            await AuthService.logout();
            setCurrentUser(null);
            setUserType('enthusiast');
            localStorage.removeItem('iron_onboarding_done');
            showToast("Logged out.");
        } catch (error) {
            console.error("Logout failed", error);
            showToast("Logout failed.");
        }
    };

    const updateUser = async (uid, data) => {
        try {
            // SOVEREIGN UPDATE
            const newState = await EngineService.processAction(uid, {
                type: 'USER_UPDATED',
                ...data
            });

            setCurrentUser(newState);
            if (data.role) setUserType(data.role);
            AuditService.log('USER_UPDATE', { uid, ...newState }, { id: uid }, { updates: data });
            return { success: true };
        } catch (error) {
            console.error("Update User Failed", error);
            showToast("Failed to update profile.");
            return { success: false };
        }
    };

    const completeOnboarding = (type = 'enthusiast') => {
        localStorage.setItem('iron_onboarding_done', 'true');
        localStorage.setItem('iron_user_type', type);
        setUserType(type);
        setOnboardingCompleted(true);
    };

    const checkEmail = async (email) => {
        return await AuthService.checkEmailExists(email);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            setCurrentUser, // Exposed for rare manual overrides
            userType,
            setUserType,
            isLoading, // Exposed for router guard
            onboardingCompleted,
            completeOnboarding,
            login,
            loginWithGoogle,
            registerUser,
            logout, // Exposed logout
            updateUser,
            syncUserFromAuth,
            checkEmail,
            AuthService
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthContext;
