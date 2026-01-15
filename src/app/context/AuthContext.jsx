import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    AuthService, DbService
} from '../../infrastructure/firebase';
import { db, auth } from '../../infrastructure/firebase';
import { EngineService } from '../../infrastructure/engine/EngineService';
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
                    // Safe Fallback for Offline/Error Mode
                    setCurrentUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        profile: { name: firebaseUser.displayName || 'Offline User' },
                        role: 'enthusiast'
                    });
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
        // We fetch the 'user_state' (The Truth Cache) instead of 'users' (Identity)
        // Wait, EngineService writes to 'user_state' (Cache) AND 'users' (Identity Side Effect).
        // For Auth, we usually read 'users' for profile info, but 'user_state' for Logic.
        // Let's rely on 'user_state' as the primary source for Session.
        let dbState = await DbService.getDoc('user_state', authUser.uid);

        // Fallback to 'users' if state doesn't exist but identity does (Migration edge case)
        if (!dbState) {
            const userIdentity = await DbService.getDoc('users', authUser.uid);
            if (userIdentity) {
                // We have identity but no state? Should trigger REPLAY or GENESIS check.
                // For now, treat as new/missing.
            }
        }

        if (dbState) {
            // Auto-promote Super Admin on sync (Sovereign Upgrade)
            if (authUser.email === 'sspandian.here@gmail.com' && dbState.profile?.role !== 'super_admin') {
                dbState = await EngineService.processAction(authUser.uid, {
                    type: 'USER_UPDATED',
                    role: 'super_admin'
                });
            }

            // Force onboarding complete for super admin
            if (dbState.profile?.role === 'super_admin' && !onboardingCompleted) {
                localStorage.setItem('iron_onboarding_done', 'true');
                setOnboardingCompleted(true);
            }

            setCurrentUser(dbState);
            setUserType(dbState.profile?.role || 'enthusiast');
        } else {
            // GENESIS EVENT (Sovereignty: Only Engine creates State)
            // Check for pre-existing member record (Invite) to merge?
            // To be strictly Sovereign, we treat this as a pure new user or "Claiming" an invite via Engine.
            // For MVP: We just create the user. Merging logic should be handled by Engine in future.

            const role = (authUser.email === 'sspandian.here@gmail.com') ? 'super_admin' : 'user';

            const payload = {
                type: 'USER_CREATED',
                email: authUser.email || authUser.phoneNumber,
                displayName: authUser.displayName || 'User',
                role,
                status: 'Active',
                // Genesis Defaults
                joinedVia: 'App'
            };

            // SOVEREIGN GENESIS
            const newUserState = await EngineService.processAction(authUser.uid, payload);

            setCurrentUser(newUserState);
            setUserType(role);
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
                displayName: userData.displayName || 'User',
                role,
                ...userData // Caution: spreading provided data. Schema should sanitize.
                // Engineside side-effect will overwrite 'users' doc with this.
            };

            // SOVEREIGN GENESIS
            const newUserState = await EngineService.processAction(authUser.uid, payload);

            setCurrentUser(newUserState);
            setUserType(role);

            // AuditService.log removed. Ledger is the Audit.
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
