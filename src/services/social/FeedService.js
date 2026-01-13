
import { DbService, db, StorageService } from '../../infrastructure/firebase';
import { runTransaction, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';

export const FeedService = {
    /**
     * Create a new post in the feed.
     * @param {object} user - The user creating the post.
     * @param {string} content - The text content.
     * @param {string} type - 'check_in', 'workout', 'status', etc.
     * @param {File} imageFile - Optional image file to upload.
     */
    createPost: async (user, content, type = 'status', imageFile = null) => {
        if (!user) throw new Error("User required to post.");
        if (!content && !imageFile) throw new Error("Content or Image required.");

        let mediaUrl = null;

        // 1. Upload Image if present
        if (imageFile) {
            try {
                mediaUrl = await StorageService.uploadFile(imageFile);
            } catch (err) {
                console.error("Image upload failed", err);
                throw new Error("Failed to upload image.");
            }
        }

        // 2. Create Post Document
        const postData = {
            userId: user.uid,
            userName: user.displayName,
            userPhoto: user.photoURL || null,
            type,
            content,
            mediaUrl,
            likes: 0,
            likedBy: [],
            commentsCount: 0,
            location: 'Iron Gym', // Default for now
            date: new Date().toISOString() // This maps to 'date' in the schema used by useFeed
        };

        return await DbService.addDoc('feed', postData);
    },

    /**
     * Toggle like on a post.
     * @param {string} postId 
     * @param {string} userId 
     * @param {boolean} currentLikeStatus - If true, we unlike. If false, we like.
     */
    toggleLike: async (postId, userId, currentLikeStatus) => {
        const postRef = doc(db, 'feed', postId);

        if (currentLikeStatus) {
            // Unlike
            await updateDoc(postRef, {
                likes: increment(-1),
                likedBy: arrayRemove(userId)
            });
        } else {
            // Like
            await updateDoc(postRef, {
                likes: increment(1),
                likedBy: arrayUnion(userId)
            });
        }
    }
};
