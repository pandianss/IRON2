/**
 * IRON Application Mock Data
 * Centralized store for testing and demo purposes.
 */

export const mockFeedActivities = [
    {
        userName: "Sarah C.",
        activityType: "Live Class",
        location: "Iron Studio",
        timeAgo: "NOW",
        isLive: true,
        mediaUrl: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800",
        mediaType: 'video',
        stats: []
    },
    {
        userName: "Marcus V.",
        activityType: "Deadlift PR",
        location: "Metro Flex",
        timeAgo: "2h ago",
        isPR: true,
        stats: [
            { label: "WEIGHT", value: "405 LBS", accent: true },
            { label: "RPE", value: "9.5" }
        ]
    },
    {
        userName: "Elena R.",
        activityType: "Post-Run Check",
        location: "Central Park",
        timeAgo: "4h ago",
        mediaUrl: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800",
        mediaType: 'image',
        stats: [
            { label: "DIST", value: "10K" },
            { label: "PACE", value: "4:30" }
        ]
    },
    {
        userName: "Iron System",
        activityType: "Achievement Unlocked",
        location: "The Forge",
        timeAgo: "6h ago",
        stats: [
            { label: "RANK", value: "IRON III", accent: true }
        ]
    }
];

export const mockProducts = [
    {
        id: 1,
        name: "IRON Whey Isolate",
        price: 2499,
        category: "Supplements",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800",
        rating: 4.8
    },
    {
        id: 2,
        name: "Vanquish Stringer",
        price: 899,
        category: "Apparel",
        image: "https://images.unsplash.com/photo-1581655701322-95b60269f8c6?auto=format&fit=crop&q=80&w=800",
        rating: 4.5
    },
    {
        id: 3,
        name: "Pro Lifting Straps",
        price: 499,
        category: "Gear",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
        rating: 4.9
    },
    {
        id: 4,
        name: "Pre-Workout Ignition",
        price: 1899,
        category: "Supplements",
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=800",
        rating: 4.7
    }
];

export const mockGyms = [
    { id: 'gym1', name: "Iron Forge Main", location: "Downtown", status: "Active" },
    { id: 'gym2', name: "Metro Flex", location: "Westside", status: "Active" }
];

export const mockUsers = [
    { id: 'user1', uid: 'demo_user', email: 'demo@iron.com', displayName: 'Demo User', role: 'user', xp: 1200, level: 5, rank: 'IRON II' },
    { id: 'owner1', uid: 'demo_owner', email: 'owner@iron.com', displayName: 'Gym Owner', role: 'gym_owner', gymId: 'gym1', xp: 5000, level: 12, rank: 'TITAN' },
    { id: 'trainer1', uid: 'demo_trainer', email: 'trainer@iron.com', displayName: 'Apex Trainer', role: 'expert', xp: 3500, level: 8, rank: 'ELITE' },
    { id: 'admin1', uid: 'demo_admin', email: 'admin@iron.com', displayName: 'Commander', role: 'super_admin' }
];

export const mockNotifications = [
    { id: 'n1', type: 'system', message: "Welcome to Demo Mode", time: "Just now", read: false },
    { id: 'n2', type: 'alert', message: "RUST Check passed", time: "1h ago", read: true }
];

export const mockPlans = [
    { id: 'p1', name: 'Standard Access', price: 5000, duration: 30, description: 'Full gym access' }
];



export const mockChallenges = [
    {
        id: 'c1',
        challenger: { id: 'user1', name: 'Demo User', image: null },
        target: { id: 'user2', name: 'Marcus V.', image: null },
        title: '20 Pushup Burst',
        status: 'active',
        stake: 100,
        videoUrl: 'https://via.placeholder.com/150',
        timestamp: '2h ago'
    },
    {
        id: 'c2',
        challenger: { id: 'user3', name: 'Sarah C.', image: null },
        target: { id: 'user1', name: 'Demo User', image: null },
        title: 'Max Plank Hold',
        status: 'pending',
        stake: 250,
        videoUrl: null,
        timestamp: 'Just now'
    }
];


export const mockRatings = [
    { id: 'r1', targetId: 'gym1', raterId: 'user1', rating: 5, comment: "Incredible equipment, pure iron heaven.", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'r2', targetId: 'gym1', raterId: 'user2', rating: 4, comment: "Great vibe, but AC was down.", timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: 'r3', targetId: 'trainer1', raterId: 'user1', rating: 5, comment: "Best lifting coach in the city.", timestamp: new Date(Date.now() - 43200000).toISOString() }
];

export const mockBpm = 72;
