
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    DbService, AuthService
} from '../../infrastructure/firebase';
import { useUI } from './UIContext';
import { useAuth } from './AuthContext';
import { orderBy } from 'firebase/firestore';
import {
    mockProducts, mockGyms, mockUsers, mockPlans,
    mockNotifications, mockFeedActivities,
    mockRatings
} from '../../services/mockData';

console.log("DataContext Module Loaded. DbService type:", typeof DbService);
if (typeof DbService === 'undefined') console.error("CRITICAL: DbService is undefined in DataContext!");


export const DataContext = createContext();

export const DataProvider = ({ children, appMode }) => {
    const { showToast, setIsLoading } = useUI();
    const { currentUser, setCurrentUser, setUserType, syncUserFromAuth } = useAuth();
    // Removed useContext(AppContext) for appMode as it is passed as prop

    // Data States
    const [gyms, setGyms] = useState([]);
    const [users, setUsers] = useState([]);
    const [partnerPlans, setPartnerPlans] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [storeProducts, setStoreProducts] = useState([]);
    const [feedActivities, setFeedActivities] = useState([]);
    const [lastFeedDoc, setLastFeedDoc] = useState(null);
    const [hasMoreFeed, setHasMoreFeed] = useState(true);

    const [liveSessions, setLiveSessions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [ratings, setRatings] = useState([]);

    // Derived States
    const [selectedGymId, setSelectedGymId] = useState(null);
    const [revenueStats, setRevenueStats] = useState({ total: 0, mtd: 0 });

    // Local Data (could be DB)
    const [biometricHistory, setBiometricHistory] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [studioContent, setStudioContent] = useState([]);
    const [studioExercises, setStudioExercises] = useState([]);
    const [studioRoutineName, setStudioRoutineNameState] = useState("SQUAT PROTOCOL X");

    // Certifications State
    const [certifications, setCertifications] = useState([]);

    // Fetch Data on Mount
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                if (!appMode) {
                    setIsLoading(false);
                    return;
                }

                if (appMode === 'demo') {
                    // Load Mock Data
                    setGyms(mockGyms);
                    setUsers(mockUsers);
                    setPartnerPlans(mockPlans);
                    setNotifications(mockNotifications);
                    setEnquiries([]); // Mock empty
                    setAchievements([]); // Mock empty 
                    setStoreProducts(mockProducts);
                    setFeedActivities(mockFeedActivities);
                    setHasMoreFeed(false);
                    setLiveSessions([]); // Mock empty
                    setTransactions([]); // Mock empty
                    setChallenges([]); // Mock empty
                    setRatings(mockRatings);

                    if (mockGyms.length > 0) setSelectedGymId(mockGyms[0].id);

                    // Set Mock Current User
                    // We need to simulate a logged in user for Demo
                    const demoUser = mockUsers[0];
                    setCurrentUser(demoUser);
                    setUserType('user'); // Or demoUser.role

                } else {
                    // LIVE MODE - Fetch from Firebase
                    const [
                        gymsData, usersData, plansData,
                        notifsData, enqData, achData,
                        productsData, liveData, transData, challengesData,
                        ratingsData, studioContentData, studioExercisesData
                    ] = await Promise.all([
                        DbService.getDocs('gyms'),
                        DbService.getDocs('users'),
                        DbService.getDocs('partner_plans'),
                        DbService.getDocs('notifications'),
                        DbService.getDocs('enquiries'),
                        DbService.getDocs('achievements'),
                        DbService.getDocs('products'),
                        DbService.getDocs('live_sessions'),
                        DbService.getDocs('transactions'),
                        DbService.getDocs('challenges'),
                        DbService.getDocs('ratings'),
                        DbService.getDocs('studio_content'),
                        DbService.getDocs('studio_exercises')
                    ]);

                    // Separate Pagination Fetch for Feed
                    const { data: paginatedFeed, lastVisible } = await DbService.getPaginatedDocs('feed_activities', 5);

                    setGyms(gymsData);
                    setUsers(usersData);
                    setPartnerPlans(plansData);

                    setAchievements(achData);
                    setStoreProducts(productsData.length ? productsData : mockProducts);

                    setFeedActivities(paginatedFeed);
                    setLastFeedDoc(lastVisible);
                    setHasMoreFeed(!!lastVisible);

                    setLiveSessions(liveData);
                    setTransactions(transData);
                    setTransactions(transData);
                    setChallenges(challengesData);
                    setRatings(ratingsData);
                    setStudioContent(studioContentData);
                    setStudioExercises(studioExercisesData);

                    calculateRevenue(transData);

                    if (gymsData.length > 0 && !selectedGymId) {
                        setSelectedGymId(gymsData[0].id);
                    }

                    // Check Auth Persistence
                    const authUser = await AuthService.getCurrentUser();
                    if (authUser) {
                        await syncUserFromAuth(authUser);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data", error);
                showToast("Connection to Forge failed.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();


        // Real-time Notifications Listener
        const unsubscribeNotifs = DbService.subscribeToCollection('notifications', (data) => {
            // Filter client-side or use constraints. For now, taking all, but ideally filter by user/gym
            setNotifications(data);
        }, [orderBy('time', 'desc')]);

        // "RUST" Gamification Check
        const checkRust = async () => {
            // Mock logic: If no activity in 3 days, trigger Rust
            // In real app, check currentUser.lastActivityDate
            const lastActivity = localStorage.getItem('iron_last_activity');
            if (lastActivity) {
                const daysDiff = (new Date() - new Date(lastActivity)) / (1000 * 60 * 60 * 24);
                if (daysDiff > 3) {
                    // Apply Penalty
                    showToast("RUST DETECTED. -100 XP.");
                    // Logic to update DB would go here
                }
            }
        };
        checkRust();

        return () => {
            if (unsubscribeNotifs) unsubscribeNotifs();
        };
    }, [appMode]);

    // Actions
    const calculateRevenue = (currentTransactions) => {
        const total = currentTransactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const mtd = total * 0.4;
        setRevenueStats({ total, mtd });
    };

    const registerGym = async (gymData, ownerData) => {
        try {
            const newGym = await DbService.addDoc('gyms', { ...gymData, status: 'Pending' });
            setGyms(prev => [...prev, newGym]);

            const newOwner = await DbService.addDoc('users', {
                ...ownerData,
                gymId: newGym.id,
                role: 'gym_owner',
                status: 'Pending'
            });
            setUsers(prev => [...prev, newOwner]);

            // If current user is the requester, update them
            if (currentUser && (currentUser.email === ownerData.email || currentUser.uid === ownerData.uid)) {
                setCurrentUser(newOwner);
                setUserType('gym_owner');
            }

            showToast("Gym application submitted.");
        } catch (error) {
            console.error(error);
            showToast("Failed to register gym.");
        }
    };

    const approveGym = async (gymId) => {
        try {
            await DbService.updateDoc('gyms', gymId, { status: 'Active' });
            const owner = users.find(u => u.gymId === gymId && u.role === 'gym_owner');
            if (owner) {
                await DbService.updateDoc('users', owner.id, { status: 'Active' });
                setUsers(prev => prev.map(u => u.id === owner.id ? { ...u, status: 'Active' } : u));
            }
            setGyms(prev => prev.map(g => g.id === gymId ? { ...g, status: 'Active' } : g));
            showToast("Gym Approved & Activated.");
        } catch (error) {
            showToast("Approval failed.");
        }
    };

    const rejectGym = async (gymId) => {
        try {
            await DbService.updateDoc('gyms', gymId, { status: 'Rejected' });
            const owner = users.find(u => u.gymId === gymId && u.role === 'gym_owner');
            if (owner) {
                await DbService.updateDoc('users', owner.id, { status: 'Rejected' });
                setUsers(prev => prev.map(u => u.id === owner.id ? { ...u, status: 'Rejected' } : u));
            }
            setGyms(prev => prev.map(g => g.id === gymId ? { ...g, status: 'Rejected' } : g));
            showToast("Gym Rejected.");
        } catch (error) {
            showToast("Rejection failed.");
        }
    };

    const addMember = async (memberData) => {
        let status = 'Pending';
        const newMember = await DbService.addDoc('users', { ...memberData, status, joinedAt: new Date().toISOString() });
        setUsers(prev => [...prev, newMember]);

        const notification = {
            type: 'alert',
            message: 'New Request: ' + memberData.name,
            time: 'Just now',
            read: false,
            gymId: memberData.gymId,
            payload: { memberId: newMember.id, name: memberData.name }
        };
        await DbService.addDoc('notifications', notification);
        setNotifications(prev => [notification, ...prev]);
        showToast("Member request submitted.");
    };

    const approveMember = async (memberId) => {
        try {
            await DbService.updateDoc('users', memberId, { status: 'Active', rank: 'IRON I' });
            setUsers(prev => prev.map(u => u.id === memberId ? { ...u, status: 'Active', rank: 'IRON I' } : u));
            showToast("Member Approved.");

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
        showToast('Member ' + newStatus);
    };

    const logActivity = async (activityData) => {
        if (!DbService) {
            console.error("logActivity aborted: DbService is undefined");
            showToast("Error: Service unavailable");
            return;
        }
        const feedItem = { ...activityData, date: new Date().toISOString(), likes: 0 };
        const newFeed = await DbService.addDoc('feed_activities', feedItem);
        setFeedActivities(prev => [newFeed, ...prev]);

        if (currentUser) {
            const xpGain = activityData.xp || 50;
            const newXp = (currentUser.xp || 0) + xpGain;
            const newLevel = Math.floor(Math.sqrt(newXp) * 0.5) || 1;
            await DbService.updateDoc('users', currentUser.id, { xp: newXp, level: newLevel, lastActivityDate: new Date().toISOString() });
            setCurrentUser(prev => ({ ...prev, xp: newXp, level: newLevel }));

            // Clear Rust
            localStorage.setItem('iron_last_activity', new Date().toISOString());
        }
        showToast("Activity Logged!");
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

    const loadMoreFeed = async () => {
        if (!hasMoreFeed || isLoading) return;

        // Don't set global isLoading, maybe a local loading state?
        // keeping it simple for now
        try {
            const { data, lastVisible } = await DbService.getPaginatedDocs('feed_activities', 5, lastFeedDoc);

            if (data.length > 0) {
                setFeedActivities(prev => [...prev, ...data]);
                setLastFeedDoc(lastVisible);
                if (data.length < 5) setHasMoreFeed(false);
            } else {
                setHasMoreFeed(false);
            }
        } catch (e) {
            console.error(e);
            showToast("Failed to load more.");
        }
    };



    // Sub-State Setters
    const addMedicalRecord = async (record) => {
        setMedicalRecords(prev => [record, ...prev]);
        await DbService.addDoc('medical_records', record);
    };

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

    const addCertification = async (cert) => {
        const newCert = { ...cert, id: Date.now(), verified: false, dateAdded: new Date().toISOString() };
        setCertifications(prev => [newCert, ...prev]);
        await DbService.addDoc('certifications', newCert);
        showToast("Credential Uploaded.");
    };

    const createChallenge = async (challengeData) => {
        const newChallenge = await DbService.addDoc('challenges', {
            ...challengeData,
            status: 'pending',
            timestamp: new Date().toISOString()
        });
        setChallenges(prev => [newChallenge, ...prev]);
        showToast("Challenge Issued!");

        // Notify Target
        const notification = {
            type: 'alert',
            message: challengeData.challenger.name + ' challenged you: ' + challengeData.title,
            time: 'Just now',
            read: false,
            userId: challengeData.target.id
        };
        await DbService.addDoc('notifications', notification);
    };

    const addRating = async (targetId, currentRating, comment) => {
        const ratingData = {
            targetId,
            raterId: currentUser?.id || 'guest',
            rating: currentRating,
            comment,
            timestamp: new Date().toISOString()
        };
        const newRating = await DbService.addDoc('ratings', ratingData);
        setRatings(prev => [newRating, ...prev]);
        showToast("Review Submitted!");
    };

    const getRatingStats = (targetId) => {
        const targetRatings = ratings.filter(r => r.targetId === targetId);
        if (targetRatings.length === 0) return { average: 0, count: 0, reviews: [] };

        const sum = targetRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return {
            average: (sum / targetRatings.length).toFixed(1),
            count: targetRatings.length,
            reviews: targetRatings
        };
    };

    return (
        <DataContext.Provider value={{
            gyms, selectedGymId, setSelectedGymId, switchGym: setSelectedGymId,
            users, members: users,
            partnerPlans, addPlan,
            notifications, markNotificationRead: (id) => DbService.updateDoc('notifications', id, { read: true }),
            enquiries, sendEnquiries: sendEnquiry, sendEnquiry,
            achievements, logActivity,
            storeProducts, transactions, revenueStats,
            feedActivities, liveSessions, loadMoreFeed, hasMoreFeed,
            registerGym, approveGym, rejectGym,
            addMember, approveMember, rejectMember, toggleBanMember,
            biometricHistory, medicalRecords, addMedicalRecord,
            studioContent, addStudioContent,
            studioExercises, addStudioExercise,
            studioRoutineName, setStudioRoutineName,

            challenges, createChallenge,
            ratings, addRating, getRatingStats,
            certifications, addCertification
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};

DataProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default DataContext;
