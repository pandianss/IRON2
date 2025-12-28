import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useHeartRateMonitor from '../hooks/useHeartRateMonitor';
import { DbService, AuthService, StorageService } from '../services/firebase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isRusting, setIsRusting] = useState(false);

    // Web Bluetooth Hook
    const { heartRate, isConnected: isDeviceConnected, connect: connectDevice, disconnect: disconnectDevice, deviceName, error: deviceError } = useHeartRateMonitor();

    // Fallback Mock BPM if not connected
    const [mockBpm, setMockBpm] = useState(72);
    const bpm = isDeviceConnected && heartRate ? heartRate : mockBpm;

    const [toast, setToast] = useState(null);
    const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
        return localStorage.getItem('iron_onboarding_done') === 'true';
    });

    // Auth & User State
    const [currentUser, setCurrentUser] = useState(null);
    const [userType, setUserType] = useState('enthusiast'); // derived from currentUser.role

    // Data States (All from DB)
    const [gyms, setGyms] = useState([]);
    const [users, setUsers] = useState([]); // Members/Trainers
    const [partnerPlans, setPartnerPlans] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [storeProducts, setStoreProducts] = useState([]);
    const [feedActivities, setFeedActivities] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // Derived States
    const [selectedGymId, setSelectedGymId] = useState(null);
    const [revenueStats, setRevenueStats] = useState({ total: 0, mtd: 0 });

    // Loading State
    const [isLoading, setIsLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Fetch Core Collections
                const [
                    gymsData, usersData, plansData,
                    notifsData, enqData, achData,
                    productsData, feedData, liveData, transData
                ] = await Promise.all([
                    DbService.getDocs('gyms'),
                    DbService.getDocs('users'),
                    DbService.getDocs('partner_plans'),
                    DbService.getDocs('notifications'),
                    DbService.getDocs('enquiries'),
                    DbService.getDocs('achievements'),
                    DbService.getDocs('products'),
                    DbService.getDocs('feed_activities'),
                    DbService.getDocs('live_sessions'),
                    DbService.getDocs('transactions')
                ]);

                setGyms(gymsData);
                setUsers(usersData);
                setPartnerPlans(plansData);
                setNotifications(notifsData);
                setEnquiries(enqData);
                setAchievements(achData);
                setStoreProducts(productsData.length ? productsData : getMockProducts()); // Fallback for store if empty
                setFeedActivities(feedData);
                setLiveSessions(liveData);
                setTransactions(transData);

                // Initialize Revenue
                calculateRevenue(transData);

                // Set default gym if available
                if (gymsData.length > 0 && !selectedGymId) {
                    setSelectedGymId(gymsData[0].id);
                }

                // Check Auth
                const authUser = await AuthService.getCurrentUser();
                if (authUser) {
                    // Enrich with DB data
                    const dbUser = usersData.find(u => u.uid === authUser.uid);
                    setCurrentUser(dbUser || authUser);
                    setUserType(dbUser?.role || 'enthusiast');
                }

            } catch (error) {
                console.error("Failed to fetch data", error);
                showToast("Connection to Forge failed. Retrying...");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // --- Actions ---

    const calculateRevenue = (currentTransactions) => {
        const total = currentTransactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        // Simple MTD (Mock logic for now, or filter by date)
        const mtd = total * 0.4;
        setRevenueStats({ total, mtd });
    };

    // User/Auth Actions
    const login = async (email, password) => {
        try {
            const user = await AuthService.login(email, password);
            // Fetch full profile
            const dbUser = users.find(u => u.uid === user.uid);
            setCurrentUser(dbUser || user);
            setUserType(dbUser?.role || 'enthusiast');
            showToast(`Welcome back, ${dbUser?.displayName || 'User'}`);
            return true;
        } catch (error) {
            let msg = "Login failed.";
            if (error.code === 'auth/user-not-found') msg = "No user found with this email.";
            if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
            if (error.code === 'auth/too-many-requests') msg = "Too many attempts. Try again later.";
            showToast(msg);
            return false;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const user = await AuthService.loginWithGoogle();


            // Check DB reliably using getDoc to avoid race conditions
            let dbUser = await DbService.getDoc('users', user.uid);

            // If new user via Google, maybe auto-register?
            if (!dbUser) {
                const newUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role: 'user', // Default
                    joinedAt: new Date().toISOString(),
                    status: 'Active',
                    xp: 0,
                    level: 1,
                    rank: 'IRON IV'
                };
                await DbService.setDoc('users', user.uid, newUser);
                setUsers(prev => [...prev, newUser]);
                setCurrentUser(newUser);
            } else {
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

    // Simple wrappers for others, logic similar to above (finding/creating DB user) 
    // For brevity, exposing AuthService methods directly in context might be easier for detailed UI logic in AuthPage
    // but better to keep DB sync logic here.

    // We will expose AuthService directly for complex flows like Phone/Link requiring steps
    // and just provide a syncUser function? 
    // Let's stick to wrappers for consistency.

    const checkEmail = async (email) => {
        return await AuthService.checkEmailExists(email);
    };

    const syncUserFromAuth = async (authUser) => {
        if (!authUser) return;
        // Check DB reliably using getDoc
        let dbUser = await DbService.getDoc('users', authUser.uid);

        if (dbUser) {
            setCurrentUser(dbUser);
            setUserType(dbUser.role);
        } else {
            // New user from Provider
            const newUser = {
                uid: authUser.uid,
                email: authUser.email || authUser.phoneNumber, // Fallback
                displayName: authUser.displayName || 'User',
                role: 'user',
                joinedAt: new Date().toISOString(),
                status: 'Active',
                xp: 0,
                level: 1,
                rank: 'IRON IV'
            };
            // Note: For real app, check if we need to create it or waiting for onboarding?
            // For now, auto-create to reduce friction
            await DbService.setDoc('users', authUser.uid, newUser);
            setUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);
        }
    };

    const registerUser = async (email, password, userData) => {
        try {
            // 1. Auth Register
            const authUser = await AuthService.register(email, password);

            // 2. Create DB Doc (Idempotent: Use UID as Doc ID)
            const status = userData.role === 'gym_owner' ? 'Pending' : 'Active';
            const newUser = {
                uid: authUser.uid,
                email: authUser.email,
                ...userData,
                joinedAt: new Date().toISOString(),
                status,
                xp: 0,
                level: 1,
                rank: 'IRON IV'
            };

            // Use setDoc to enforce 1:1 mapping with Auth
            const userDoc = await DbService.setDoc('users', authUser.uid, newUser);
            setUsers(prev => [...prev.filter(u => u.id !== authUser.uid), userDoc]); // Prevent duplicates in local state
            setCurrentUser(newUser); // Auto login
            setUserType(userData.role || 'enthusiast');

            showToast("Welcome to IRON.");
            return { success: true };
        } catch (error) {
            let msg = "Registration failed.";
            if (error.code === 'auth/email-already-in-use') msg = "Email already linked to an account.";
            else if (error.code === 'auth/weak-password') msg = "Password is too weak.";
            else if (error.code === 'auth/invalid-email') msg = "Invalid email formatting.";
            else msg = `Registration failed: ${error.code || error.message}`;

            console.error("Registration Error Detail:", error);
            showToast(msg);
            return { success: false, code: error.code }; // Force specific return object
        }
    };

    const registerGym = async (gymData, ownerData) => {
        try {
            // 1. Create Auth User for Owner? (Skipped for now, assuming owner is current user or we just create DB records)
            // For Superadmin flow: we create a Gym Request
            const newGym = await DbService.addDoc('gyms', { ...gymData, status: 'Pending' });
            setGyms(prev => [...prev, newGym]);

            // Add Owner as User if new
            const newOwner = await DbService.addDoc('users', {
                ...ownerData,
                gymId: newGym.id,
                role: 'gym_owner',
                status: 'Pending'
            });
            setUsers(prev => [...prev, newOwner]);

            showToast("Gym application submitted for Superadmin approval.");
        } catch (error) {
            showToast("Failed to register gym.");
        }
    };

    const addMember = async (memberData) => {
        // Hierarchical Pending Status
        let status = 'Pending';
        // If current user is Admin (not implemented fully), maybe Active.
        // Default to Pending for Gym Approval.

        const newMember = await DbService.addDoc('users', { ...memberData, status, joinedAt: new Date().toISOString() });
        setUsers(prev => [...prev, newMember]);

        // Notify Gym Owner
        const notification = {
            type: 'alert',
            message: `New Request: ${memberData.name}`,
            time: 'Just now',
            read: false,
            gymId: memberData.gymId,
            payload: { memberId: newMember.id, name: memberData.name }
        };
        await DbService.addDoc('notifications', notification);
        setNotifications(prev => [notification, ...prev]); // Optimistic

        showToast("Member request submitted.");
    };

    const approveMember = async (memberId) => {
        try {
            await DbService.updateDoc('users', memberId, { status: 'Active', rank: 'IRON I' });
            setUsers(prev => prev.map(u => u.id === memberId ? { ...u, status: 'Active', rank: 'IRON I' } : u));
            showToast("Member Approved.");

            // Create Transaction or Revenue Event? (Subscription fee)
            const fee = 5000;
            const txn = await DbService.addDoc('transactions', {
                type: 'subscription',
                amount: fee,
                userId: memberId,
                date: new Date().toISOString()
            });
            setTransactions(prev => [...prev, txn]);
            calculateRevenue([...transactions, txn]);

        } catch (error) {
            showToast("Approval failed.");
        }
    };

    const rejectMember = async (memberId) => {
        try {
            await DbService.updateDoc('users', memberId, { status: 'Rejected' });
            setUsers(prev => prev.map(u => u.id === memberId ? { ...u, status: 'Rejected' } : u));
            showToast("Member Rejected.");
        } catch (error) {
            showToast("Rejection failed.");
        }
    };

    const toggleBanMember = async (memberId) => {
        const member = users.find(u => u.id === memberId);
        if (!member) return;

        const newStatus = member.status === 'Banned' ? 'Active' : 'Banned';
        await DbService.updateDoc('users', memberId, { status: newStatus });
        setUsers(prev => prev.map(u => u.id === memberId ? { ...u, status: newStatus } : u));
        showToast(`Member ${newStatus}`);
    };

    const logActivity = async (activityData) => {
        // Add to Feed
        const feedItem = { ...activityData, date: new Date().toISOString(), likes: 0 };
        const newFeed = await DbService.addDoc('feed_activities', feedItem);
        setFeedActivities(prev => [newFeed, ...prev]);

        // Update User XP
        if (currentUser) {
            const xpGain = activityData.xp || 50;
            const newXp = (currentUser.xp || 0) + xpGain;
            // Simple Level Logic: Level = sqrt(XP) * c
            const newLevel = Math.floor(Math.sqrt(newXp) * 0.5) || 1;

            await DbService.updateDoc('users', currentUser.id, { xp: newXp, level: newLevel });
            setCurrentUser(prev => ({ ...prev, xp: newXp, level: newLevel }));
        }

        showToast("Activity Logged! Shared to Feed.");
    };

    const sendEnquiry = async (userId, gymId, message) => {
        const enquiry = {
            userId,
            userName: currentUser?.displayName || 'Guest',
            gymId,
            message,
            date: new Date().toLocaleString(),
            replied: false
        };
        const newEnq = await DbService.addDoc('enquiries', enquiry);
        setEnquiries(prev => [...prev, newEnq]);
        showToast("Message Sent.");
    };

    const addPlan = async (plan) => {
        const newPlan = await DbService.addDoc('partner_plans', plan);
        setPartnerPlans(prev => [...prev, newPlan]);
        showToast("Plan Created.");
    };

    // UI Helpers
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const completeOnboarding = (type = 'enthusiast') => {
        localStorage.setItem('iron_onboarding_done', 'true');
        localStorage.setItem('iron_user_type', type);
        setUserType(type);
        setOnboardingCompleted(true);
    };

    const toggleRust = () => setIsRusting(prev => !prev);

    // Helpers for Bazaar
    const getMockProducts = () => [
        { title: "Pre-Forge X1", price: "3999", levelRequired: 1, isLocked: false, tag: "BESTSELLER" },
        { title: "Iron Core Belt", price: "7450", levelRequired: 10, isLocked: true },
        { title: "Molten Recovery", price: "2499", levelRequired: 5, isLocked: true },
        { title: "Carbon Goggles", price: "10999", levelRequired: 50, isLocked: true, tag: "ELITE" }
    ];

    // Preferences (kept local for now, could be migrated to 'users' doc settings)
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem('iron_preferences');
        return saved ? JSON.parse(saved) : { 'Notifications': true, 'Haptic Feedback': true, 'Sounds': true };
    });

    const togglePreference = (key) => {
        setPreferences(prev => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem('iron_preferences', JSON.stringify(next));
            return next;
        });
    };

    // Audio Context (Keep existing)
    const playAppSound = (type = 'click', forcePlay = false) => {
        if (!preferences['Sounds'] && !forcePlay) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.05);
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.05);
            }
        } catch (e) { console.warn("Audio play failed", e); }
    };

    // Biometrics and Medical (Existing logic adapted to DB)
    const [biometricHistory, setBiometricHistory] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [studioContent, setStudioContent] = useState([]);
    const [studioExercises, setStudioExercises] = useState([]);
    const [studioRoutineName, setStudioRoutineNameState] = useState("SQUAT PROTOCOL X");

    // Add Medical
    const addMedicalRecord = async (record) => {
        setMedicalRecords(prev => [record, ...prev]);
        await DbService.addDoc('medical_records', record);
    };

    // Add Content
    const addStudioContent = async (item) => {
        setStudioContent(prev => [item, ...prev]);
        await DbService.addDoc('studio_content', item);
    };

    const addStudioExercise = async (exercise) => {
        setStudioExercises(prev => [...prev, exercise]);
        await DbService.addDoc('studio_exercises', exercise);
    };

    const setStudioRoutineName = (name) => {
        setStudioRoutineNameState(name);
        localStorage.setItem('iron_studio_routine_name', name);
    };

    return (
        <AppContext.Provider value={{
            isRusting, setIsRusting, toggleRust, bpm, isLoading,
            onboardingCompleted, completeOnboarding,
            userType, currentUser, login, registerUser, loginWithGoogle, syncUserFromAuth, checkEmail,
            AuthService, // Expose service for granular Phone/Link steps
            gyms, selectedGymId, setSelectedGymId: (id) => setSelectedGymId(id), switchGym: (id) => setSelectedGymId(id),
            members: users, // Alias for legacy components
            users, addMember, approveMember, rejectMember, toggleBanMember, registerGym,
            partnerPlans, addPlan,
            notifications, markNotificationRead: (id) => DbService.updateDoc('notifications', id, { read: true }),
            enquiries, sendEnquiry,
            achievements, logActivity,
            storeProducts, transactions, revenueStats,
            feedActivities, liveSessions,
            connectDevice, disconnectDevice, isDeviceConnected, deviceName, deviceError,
            toast, showToast, preferences, togglePreference, playAppSound,
            biometricHistory, medicalRecords, addMedicalRecord,
            studioContent, addStudioContent,
            studioExercises, addStudioExercise,
            studioRoutineName, setStudioRoutineName
        }}>
            {children}
            {isRusting && <div className="rust-texture" />}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};
