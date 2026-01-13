import { useData } from '../../../app/context/DataContext';
import { useAuth } from '../../../app/context/AuthContext';
import { FeedService } from '../../../services/social/FeedService';
import { useUI } from '../../../app/context/UIContext';
import { useState } from 'react';

export const useFeed = () => {
    const { feedActivities, hasMoreFeed, loadMoreFeed } = useData();
    const { currentUser } = useAuth();
    const { showToast } = useUI();
    const [isPosting, setIsPosting] = useState(false);

    // Map Firestore Data to Feed UI Structure
    const posts = (feedActivities || []).map(params => {
        const isLiked = params.likedBy?.includes(currentUser?.uid);
        return {
            id: params.id,
            user: {
                name: params.userName || 'Unknown Agent',
                avatar: params.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.userId}`,
                badge: 'Iron Legion' // Default for now
            },
            content: params.content || params.description || '',
            type: params.type || params.activityType?.toLowerCase() || 'log',
            timestamp: new Date(params.date || params.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            likes: params.likes || 0,
            comments: params.commentsCount || 0,
            isLiked: !!isLiked,
            image: params.mediaUrl
        };
    });

    const toggleLike = async (postId) => {
        if (!currentUser) {
            showToast("Please login to interact.");
            return;
        }

        // Optimistic check is tricky without local state copy, 
        // usually we rely on Firestore fast snapshot, but let's assume UI handles it.
        // We find the post to know current state
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        try {
            await FeedService.toggleLike(postId, currentUser.uid, post.isLiked);
        } catch (error) {
            console.error("Like failed", error);
            showToast("Action failed");
        }
    };

    const createPost = async (content, type, imageFile) => {
        if (!currentUser) return;
        setIsPosting(true);
        try {
            await FeedService.createPost(currentUser, content, type, imageFile);
            showToast("Post created!");
            return true;
        } catch (error) {
            console.error("Post failed", error);
            showToast("Failed to post: " + error.message);
            return false;
        } finally {
            setIsPosting(false);
        }
    };

    return {
        posts,
        toggleLike,
        createPost,
        isPosting,
        hasMore: hasMoreFeed,
        loadMore: loadMoreFeed
    };
};

