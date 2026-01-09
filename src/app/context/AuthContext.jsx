import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    AuthService, DbService
} from '../../infrastructure/firebase';
import { AuditService } from '../../services/audit';
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
    useEffect(() => {
        // Skip if not in live mode (though good to have unify logic later)
        if (appMode !== 'live') {
            setIsLoading(false);
            return;
        }

        const unsubscribe = AuthService.auth.onAuthStateChanged(async (firebaseUser) => {
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
                setUserType('enthusiast');
            }
            setIsLoading(false); // Done loading regardless of result
        });

        return () => unsubscribe();
    }, [appMode]);


    // Helper to sync user with DB
    const syncUserFromAuth = async (authUser) => {
        if (!authUser) return;
        let dbUser = await DbService.getDoc('users', authUser.uid);

        if (dbUser) {
            // Auto-promote Super Admin on sync
            if (authUser.email === 'sspandian.here@gmail.com' && dbUser.role !== 'super_admin') {
                dbUser.role = 'super_admin';
                await DbService.updateDoc('users', authUser.uid, { role: 'super_admin' });
            }

            // Force onboarding complete for super admin
            if (dbUser.role === 'super_admin' && !onboardingCompleted) {
                localStorage.setItem('iron_onboarding_done', 'true');
                setOnboardingCompleted(true);
            }

            setCurrentUser(dbUser);
            setUserType(dbUser.role);
        } else {
            // Handle case where auth exists but no DB doc (rare, but possible if registration failed partial)
            // Or just a fresh social login that hasn't registered yet? 
            // For now, we assume if they are in Firebase Auth, we treat them as at least 'User'
            // We will create the doc if missing, similar to loginWithGoogle logic
            const role = (authUser.email === 'sspandian.here@gmail.com') ? 'super_admin' : 'user';
            const newUser = {
                uid: authUser.uid,
                email: authUser.email || authUser.phoneNumber,
                displayName: authUser.displayName || 'User',
                role,
                joinedAt: new Date().toISOString(),
                status: 'Active',
                xp: 0,
                level: 1,
                rank: 'IRON IV'
            };
            await DbService.setDoc('users', authUser.uid, newUser);
            setCurrentUser(newUser);
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
            let msg = "Login failed.";
            if (error.code === 'auth/user-not-found') msg = "No user found.";
            if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
            showToast(msg);
            return false;
        }
    };

    const loginWithGoogle = async () => {
        try {
            setIsLoading(true);
            await AuthService.loginWithGoogle();
            // onAuthStateChanged will handle the rest
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

            const status = role === 'gym_owner' ? 'Pending' : 'Active';
            // We set the doc HERE before the listener fires ideally, but listener might fire fast.
            // Actually listener fires on creation.
            // To ensure data consistency, we can rely on syncUserFromAuth dealing with "missing doc" 
            // OR we set it here. 
            // Let's set it here to be sure we have the custom fields (userData)

            const newUser = {
                uid: authUser.uid,
                email: authUser.email,
                ...userData,
                role,
                joinedAt: new Date().toISOString(),
                status,
                xp: 0,
                level: 1,
                rank: 'IRON IV'
            };

            await DbService.setDoc('users', authUser.uid, newUser);
            // The listener will pick this up or we set explicit
            setCurrentUser(newUser);
            setUserType(role);

            AuditService.log('USER_REGISTER', newUser, { id: newUser.uid }, { role });
            showToast("Welcome to IRON.");
            return { success: true };
        } catch (error) {
            setIsLoading(false);
            showToast("Registration failed: " + error.message);
            return { success: false, code: error.code };
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
            setCurrentUser(null);
            setUserType('enthusiast');
            localStorage.removeItem('iron_onboarding_done'); // Optional depending on requirement
            showToast("Logged out successfully.");
        } catch (error) {
            console.error("Logout failed", error);
            showToast("Logout failed.");
        }
    }

    const updateUser = async (uid, data) => {
        try {
            await DbService.updateDoc('users', uid, data);
            setCurrentUser(prev => ({ ...prev, ...data }));
            if (data.role) setUserType(data.role);
            AuditService.log('USER_UPDATE', { uid, ...currentUser }, { id: uid }, { updates: data });
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
