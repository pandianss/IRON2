import { StorageService } from '../../infrastructure/firebase'; // Keep Storage
import { EngineService } from '../engine/EngineService';

export const FeedService = {
    /**
     * Create a new post in the feed.
     * SOVEREIGN: Routes through Engine.
     */
    createPost: async (user, content, type = 'status', imageFile = null) => {
        if (!user) throw new Error("User required to post.");
        if (!content && !imageFile) throw new Error("Content or Image required.");

        let mediaUrl = null;

        // 1. Upload Image (Side Effect allowed here as it's Storage, not State)
        if (imageFile) {
            try {
                mediaUrl = await StorageService.uploadFile(imageFile);
            } catch (err) {
                console.error("Image upload failed", err);
                throw new Error("Failed to upload image.");
            }
        }

        // 2. Submit Event to Engine
        return await EngineService.processAction(user.uid, {
            type: 'POST_CREATED',
            content,
            postType: type, // differentiate from Action Type
            mediaUrl
        });
    },

    /**
     * Toggle like on a post.
     * SOVEREIGN: Routes through Engine.
     */
    toggleLike: async (postId, userId, currentLikeStatus) => {
        return await EngineService.processAction(userId, {
            type: 'POST_LIKED',
            postId,
            action: currentLikeStatus ? 'UNLIKE' : 'LIKE'
        });
    }
};
