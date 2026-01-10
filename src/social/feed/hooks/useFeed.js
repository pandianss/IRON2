import { useData } from '../../../app/context/DataContext';

export const useFeed = () => {
    const { feedActivities, hasMoreFeed, loadMoreFeed } = useData();

    // Map Firestore Data to Feed UI Structure
    const posts = (feedActivities || []).map(params => ({
        id: params.id,
        user: {
            name: params.userName || 'Unknown Agent',
            avatar: params.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.userId}`,
            badge: 'Iron Legion' // Default for now
        },
        content: params.description || `Logged ${params.activityType} @ ${params.location || 'Base'}`,
        type: params.activityType?.toLowerCase() || 'log',
        timestamp: new Date(params.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Simple format
        likes: params.likes || 0,
        comments: 0,
        isLiked: false, // Need user-specific like check in future
        image: params.mediaUrl
    }));

    const toggleLike = (postId) => {
        // TODO: Wire to Firestore
        console.log("Like toggled for", postId, "(Optimistic UI pending)");
    };

    return {
        posts,
        toggleLike,
        hasMore: hasMoreFeed,
        loadMore: loadMoreFeed
    };
};
