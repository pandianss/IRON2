
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    DbService, AuthService
} from '../../infrastructure/firebase';
import { useUI } from './UIContext';
import { useAuth } from './AuthContext';
import { orderBy } from 'firebase/firestore';
import {
    mockGyms,
    mockMembers,
    mockEnquiries,
    mockPlans,
    mockStudioContent,
    mockStudioExercises,
    mockProducts,
    mockUsers,
    mockChallenges,
    mockSquads
} from '../../infrastructure/data/mockData';

console.log("DataContext Module Loaded. DbService type:", typeof DbService);
if (typeof DbService === 'undefined') console.error("CRITICAL: DbService is undefined in DataContext!");


export const DataContext = createContext();

export const DataProvider = ({ children, appMode }) => {
    console.log("DEBUG: DataProvider Rendering");
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

    const refreshData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Public Data (Always Allow)
            const [gymsData, plansData, productsData] = await Promise.all([
                DbService.getDocs('gyms'),
                DbService.getDocs('partner_plans'),
                DbService.getDocs('products'),
            ]);

            setGyms(gymsData);
            setPartnerPlans(plansData);
            setStoreProducts(productsData.length ? productsData : []);

            if (gymsData.length > 0 && !selectedGymId) {
                setSelectedGymId(gymsData[0].id);
            }

            // 2. Fetch Protected Data (Only if Authenticated)
            const authUser = await AuthService.getCurrentUser();

            if (authUser) {
                await syncUserFromAuth(authUser);

                const [
                    usersData, notifsData, enqData, achData,
                    liveData, transData, challengesData,
                    ratingsData, studioContentData, studioExercisesData
                ] = await Promise.all([
                    DbService.getDocs('users'),
                    DbService.getDocs('notifications'),
                    DbService.getDocs('enquiries'),
                    DbService.getDocs('achievements'),
                    DbService.getDocs('live_sessions'),
                    DbService.getDocs('transactions'),
                    DbService.getDocs('challenges'),
                    DbService.getDocs('ratings'),
                    DbService.getDocs('studio_content'),
                    DbService.getDocs('studio_exercises')
                ]);

                // Separate Pagination Fetch for Feed
                const { data: paginatedFeed, lastVisible } = await DbService.getPaginatedDocs('feed_activities', 5);

                setUsers(usersData);
                setNotifications(notifsData);
                setEnquiries(enqData);
                setAchievements(achData);

                setFeedActivities(paginatedFeed);
                setLastFeedDoc(lastVisible);
                setHasMoreFeed(!!lastVisible);

                setLiveSessions(liveData);
                setTransactions(transData);
                setChallenges(challengesData);
                setRatings(ratingsData);
                setStudioContent(studioContentData);
                setStudioExercises(studioExercisesData);

                calculateRevenue(transData);
            } else {
                console.log("Guest Mode: Skipping protected data fetch");
            }

        } catch (error) {
            console.error("Failed to fetch data", error);
            showToast("Connection to Forge failed.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch Data on Mount
    useEffect(() => {
        refreshData();
        return () => {
            // Cleanup if needed
        };
    }, [appMode]);

    // Separate Effect for Real-time Notifications (Dependent on Auth)
    useEffect(() => {
        if (!currentUser || appMode === 'demo') return;

        const unsubscribeNotifs = DbService.subscribeToCollection('notifications', (data) => {
            setNotifications(data);
        }, [orderBy('time', 'desc')]);

        return () => {
            if (unsubscribeNotifs) unsubscribeNotifs();
        };
    }, [currentUser, appMode]);

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

    const toggleGymStatus = async (gymId) => {
        const gym = gyms.find(g => g.id === gymId);
        if (!gym) return;

        const newStatus = gym.status === 'Active' ? 'Suspended' : 'Active';
        try {
            await DbService.updateDoc('gyms', gymId, { status: newStatus });
            setGyms(prev => prev.map(g => g.id === gymId ? { ...g, status: newStatus } : g));
            showToast(`Gym ${newStatus === 'Active' ? 'Activated' : 'Suspended'}`);
        } catch (error) {
            console.error(error);
            showToast("Status update failed");
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

        // Destructure robust data
        // Destructure robust data with absolute defaults
        const {
            activityType = "Log",
            location = "Unknown",
            coordinates = null,
            mediaUrl = null,
            mediaType = null,
            description = null,
            privacy = 'public',
            audioMode = null
        } = activityData;

        const feedItem = {
            activityType,
            location,
            coordinates,
            mediaUrl,
            mediaType,
            description,
            visibility: privacy,
            audioMode,
            userId: currentUser?.uid,
            userName: currentUser?.displayName || 'Unknown',
            userPhoto: currentUser?.photoURL || null,
            date: new Date().toISOString(),
            likes: 0,
            isVerified: false,
            verifications: 0
        };

        const newFeed = await DbService.addDoc('feed_activities', feedItem);

        // Only add to local feed state if public or if we implement a 'my feed' filter
        // For now, adding it. UI should filter if needed.
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

    const submitContent = async (item) => {
        const isAutoApproved = ['expert', 'gym_owner', 'admin'].includes(currentUser?.role);
        const newContent = {
            ...item,
            status: isAutoApproved ? 'active' : 'pending',
            authorId: currentUser?.uid || 'guest',
            authorName: currentUser?.displayName || 'Unknown',
            timestamp: new Date().toISOString(),
            popularity: 0,
            approvedBy: isAutoApproved ? 'system' : null
        };
        const docRef = await DbService.addDoc('studio_content', newContent);
        // Only add to local if active, or if I am the author (maybe?)
        // For simplicity, add to local, Hub will filter.
        setStudioContent(prev => [docRef, ...prev]);
        showToast(isAutoApproved ? "Content Published!" : "Submitted for Approval");
    };

    const approveContent = async (contentId) => {
        try {
            await DbService.updateDoc('studio_content', contentId, {
                status: 'active',
                approvedBy: currentUser?.uid
            });
            setStudioContent(prev => prev.map(c => c.id === contentId ? { ...c, status: 'active', approvedBy: currentUser?.uid } : c));
            showToast("Content Approved");
        } catch (error) {
            console.error(error);
            showToast("Approval Failed");
        }
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

    const deleteContent = async (contentId) => {
        try {
            await DbService.deleteDoc('studio_content', contentId);
            setStudioContent(prev => prev.filter(c => c.id !== contentId));
            showToast("Content Deleted");
        } catch (error) {
            console.error(error);
            showToast("Delete Failed");
        }
    };

    const toggleContentStatus = async (contentId) => {
        const item = studioContent.find(c => c.id === contentId);
        if (!item) return;
        const newStatus = item.status === 'hidden' ? 'active' : 'hidden'; // active <-> hidden
        try {
            await DbService.updateDoc('studio_content', contentId, { status: newStatus });
            setStudioContent(prev => prev.map(c => c.id === contentId ? { ...c, status: newStatus } : c));
            showToast(`Content ${newStatus === 'hidden' ? 'Hidden' : 'Visible'}`);
        } catch (error) {
            showToast("Status Update Failed");
        }
    };

    const updateContent = async (contentId, data) => {
        try {
            await DbService.updateDoc('studio_content', contentId, data);
            setStudioContent(prev => prev.map(c => c.id === contentId ? { ...c, ...data } : c));
            showToast("Content Updated");
        } catch (error) {
            showToast("Update Failed");
        }
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

    const verifyActivity = async (activityId) => {
        try {
            await DbService.updateDoc('feed_activities', activityId, { isVerified: true });

            // Update local state
            setFeedActivities(prev => prev.map(act =>
                act.id === activityId
                    ? { ...act, isVerified: true, verifications: (act.verifications || 0) + 1 }
                    : act
            ));

            showToast("Activity Verified!");
        } catch (error) {
            console.error("Verification failed", error);
            showToast("Verification failed");
        }
    };

    const promoteToHub = async (activityId, category = 'Workout') => {
        try {
            const activity = feedActivities.find(a => a.id === activityId);
            if (!activity) return;

            // Map Activity to Hub Content
            const newContent = {
                title: activity.activityType || 'Community Post',
                type: category === 'workout' ? 'workout' : 'nutrition', // Normalize
                category: category === 'workout' ? 'Community Workouts' : 'Community Nutrition',
                image: activity.mediaUrl || 'https://via.placeholder.com/400x300?text=No+Image',
                difficulty: 'Intermediate', // Default or could check stats
                duration: 'N/A',
                rating: 5.0,
                authorId: activity.userId || 'guest',
                authorName: activity.userName || 'Unknown',
                description: activity.description || 'No description provided.',
                status: 'active', // Live immediately
                timestamp: new Date().toISOString(),
                promotedFrom: activityId,
                approvedBy: currentUser?.uid
            };

            // Add to Studio Content
            const docRef = await DbService.addDoc('studio_content', newContent);
            setStudioContent(prev => [docRef, ...prev]);

            // Mark Activity as Promoted
            await DbService.updateDoc('feed_activities', activityId, { promoted: true });
            setFeedActivities(prev => prev.map(a => a.id === activityId ? { ...a, promoted: true } : a));

            showToast("Promoted to Library!");
        } catch (error) {
            console.error("Promotion failed", error);
            showToast("Promotion Failed");
        }
    };

    const reportActivity = async (activityId, reason) => {
        try {
            const activity = feedActivities.find(a => a.id === activityId);
            if (!activity) return;

            const newReportCount = (activity.reportCount || 0) + 1;
            const newStatus = newReportCount >= 3 ? 'hidden' : (activity.visibility || 'public');

            const updates = {
                reportCount: newReportCount,
                visibility: newStatus
            };

            await DbService.updateDoc('feed_activities', activityId, updates);

            // Update Local State
            setFeedActivities(prev => prev.map(a =>
                a.id === activityId
                    ? { ...a, ...updates }
                    : a
            ));

            // If hidden, maybe filter it out immediately? 
            // setFeedActivities(prev => prev.filter(a => a.id !== activityId)); 
            // ^ decided to keep it in state but let UI handle hidden logic or just filter it out here.
            // If we filter it out, it disappears instantly, which is good.
            if (newStatus === 'hidden') {
                setFeedActivities(prev => prev.filter(a => a.id !== activityId));
            }

            showToast("Report Submitted. Thank you.");
        } catch (error) {
            console.error("Report failed", error);
            showToast("Report failed");
        }
    };

    return (
        <DataContext.Provider value={{
            // Global Data
            gyms, selectedGymId, setSelectedGymId, switchGym: setSelectedGymId,
            refreshData,

            // Users & Partners
            users, members: users,
            partnerPlans, addPlan,
            notifications, markNotificationRead: (id) => DbService.updateDoc('notifications', id, { read: true }),
            enquiries, sendEnquiries: sendEnquiry, sendEnquiry,
            achievements,
            transactions, revenueStats,

            // Feed & Activity
            feedActivities, liveSessions, loadMoreFeed, hasMoreFeed, logActivity,
            verifyActivity, promoteToHub, reportActivity,

            // Gym Management Actions
            registerGym, approveGym, rejectGym, toggleGymStatus,
            addMember, approveMember, rejectMember, toggleBanMember,

            // Health & Studio
            biometricHistory, medicalRecords, addMedicalRecord,
            studioContent, submitContent, approveContent, deleteContent, toggleContentStatus, updateContent,
            studioExercises, addStudioExercise,
            studioRoutineName, setStudioRoutineName,

            // Social & Marketplace
            storeProducts,
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
