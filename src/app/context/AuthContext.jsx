import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    AuthService, DbService
} from '../../infrastructure/firebase';
import { AuditService } from '../../services/audit';
import { useUI } from './UIContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children, appMode }) => {


    const { showToast } = useUI(); // Consume UI Context
    const [currentUser, setCurrentUser] = useState(null);
    const [userType, setUserType] = useState('enthusiast');

    const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
        return localStorage.getItem('iron_onboarding_done') === 'true';
    });

    // Helper to sync user with DB
    const syncUserFromAuth = async (authUser) => {
        if (!authUser) return;
        let dbUser = await DbService.getDoc('users', authUser.uid);

        if (dbUser) {
            // Auto-promote Super Admin on sync
            if (authUser.email === 'sspandian.here@gmail.com' && dbUser.role !== 'super_admin') {
                console.log("Auto-promoting user to Super Admin");
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
            // New user from Provider
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
            AuditService.log('USER_SYNC_CREATE', newUser, { id: newUser.uid }, { method: 'provider_sync' });
        }
    };

    // Actions
    const login = async (email, password) => {
        try {
            const user = await AuthService.login(email, password);
            // Fetch full profile (Assume DataContext loads users, or just fetch directly here for safety)
            // Ideally we re-fetch from DB to be fresh
            const dbUser = await DbService.getDoc('users', user.uid);

            setCurrentUser(dbUser || user);
            setUserType(dbUser?.role || 'enthusiast');
            showToast(`Welcome back, ${dbUser?.displayName || 'User'}`);
            AuditService.log('USER_LOGIN', dbUser || user, {}, { method: 'password' });
            return true;
        } catch (error) {
            let msg = "Login failed.";
            if (error.code === 'auth/user-not-found') msg = "No user found.";
            if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
            showToast(msg);
            return false;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const user = await AuthService.loginWithGoogle();
            let dbUser = await DbService.getDoc('users', user.uid);

            if (!dbUser) {
                const role = user.email === 'sspandian.here@gmail.com' ? 'super_admin' : 'user';
                const newUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role,
                    joinedAt: new Date().toISOString(),
                    status: 'Active',
                    xp: 0,
                    level: 1,
                    rank: 'IRON IV'
                };
                await DbService.setDoc('users', user.uid, newUser);
                setCurrentUser(newUser);
                setUserType(role);
            } else {
                if (user.email === 'sspandian.here@gmail.com' && dbUser.role !== 'super_admin') {
                    dbUser.role = 'super_admin';
                    await DbService.updateDoc('users', user.uid, { role: 'super_admin' });
                }
                setCurrentUser(dbUser);
                setUserType(dbUser.role);
            }
            showToast(`Welcome ${user.displayName || 'User'}`);
            return true;
        } catch (error) {
            showToast("Google Login Failed: " + error.message);
            return false;
        }
    };

    const registerUser = async (email, password, userData) => {
        try {
            const authUser = await AuthService.register(email, password);

            let role = userData.role || 'enthusiast';
            if (email === 'sspandian.here@gmail.com') role = 'super_admin';

            const status = role === 'gym_owner' ? 'Pending' : 'Active';
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
            setCurrentUser(newUser);
            setUserType(role);

            AuditService.log('USER_REGISTER', newUser, { id: newUser.uid }, { role });
            showToast("Welcome to IRON.");
            return { success: true };
        } catch (error) {
            showToast("Registration failed: " + error.message);
            return { success: false, code: error.code };
        }
    };

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
            currentUser, setCurrentUser,
            userType, setUserType,
            onboardingCompleted, completeOnboarding,
            login, loginWithGoogle, registerUser,
            updateUser, syncUserFromAuth, checkEmail,
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
