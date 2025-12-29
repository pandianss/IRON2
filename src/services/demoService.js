import {
    mockGyms, mockUsers, mockNotifications, mockPlans,
    mockFeedActivities, mockProducts, mockBpm, mockChallenges
} from './mockData';

// --- DEMO AUTH SERVICE ---
export const DemoAuthService = {
    checkEmailExists: async (email) => false,

    register: async (email, password) => ({
        uid: 'demo_new_' + Date.now(),
        email,
        displayName: 'Demo New User',
        role: 'user'
    }),

    login: async (email, password) => {
        // Simple mock login
        const user = mockUsers.find(u => u.email === email) || mockUsers[0];
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: user.role
        };
    },

    loginWithGoogle: async () => mockUsers[0],

    logout: async () => { },

    getCurrentUser: () => Promise.resolve(mockUsers[0]) // Default to first mock user
};

// --- DEMO DB SERVICE ---
export const DemoDbService = {
    getDocs: async (collectionName) => {
        switch (collectionName) {
            case 'gyms': return mockGyms;
            case 'users': return mockUsers;
            case 'notifications': return mockNotifications;
            case 'partner_plans': return mockPlans;
            case 'feed_activities': return mockFeedActivities;
            case 'products': return mockProducts;
            case 'challenges': return mockChallenges;
            default: return [];
        }
    },

    subscribeToCollection: (collectionName, callback) => {
        // Initial call
        DemoDbService.getDocs(collectionName).then(data => callback(data));
        return () => { }; // No-op unsubscribe
    },

    getPaginatedDocs: async (collectionName) => {
        const data = await DemoDbService.getDocs(collectionName);
        return { data, lastVisible: null };
    },

    getDoc: async (collectionName, docId) => {
        const docs = await DemoDbService.getDocs(collectionName);
        return docs.find(d => d.id === docId) || null;
    },

    setDoc: async (collectionName, docId, data) => ({ id: docId, ...data }),

    addDoc: async (collectionName, data) => ({ id: 'mock_' + Date.now(), ...data }),

    updateDoc: async (collectionName, docId, data) => ({ id: docId, ...data })
};

export const DemoStorageService = {
    uploadFile: async (file) => "https://via.placeholder.com/150"
};
