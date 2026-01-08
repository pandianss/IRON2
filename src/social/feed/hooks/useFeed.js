import { useState } from 'react';

const MOCK_POSTS = [
    {
        id: '1',
        user: {
            name: 'Sarah Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            badge: 'Early Riser'
        },
        content: 'Just crushed the Morning Grind routine! 💪 The cardio intervals are no joke.',
        type: 'workout',
        timestamp: '15 mins ago',
        likes: 12,
        comments: 3,
        isLiked: false,
        image: null
    },
    {
        id: '2',
        user: {
            name: 'Mike Ross',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            badge: 'Streak Master'
        },
        content: 'Hit a 7-day streak today! Consistency is key. 🗝️',
        type: 'milestone',
        timestamp: '2 hours ago',
        likes: 45,
        comments: 8,
        isLiked: true,
        image: null
    },
    {
        id: '3',
        user: {
            name: 'Elena Rodriguez',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
            badge: 'Yogi'
        },
        content: 'Recovery day. Stretching it out 🧘‍♀️',
        type: 'status',
        timestamp: '5 hours ago',
        likes: 24,
        comments: 1,
        isLiked: false,
        image: null
    }
];

export const useFeed = () => {
    const [posts, setPosts] = useState(MOCK_POSTS);

    const toggleLike = (postId) => {
        setPosts(currentPosts =>
            currentPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                        isLiked: !post.isLiked
                    };
                }
                return post;
            })
        );
    };

    return {
        posts,
        toggleLike
    };
};
