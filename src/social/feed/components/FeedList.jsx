import React from 'react';
import { useFeed } from '../hooks/useFeed';
import FeedPost from './FeedPost';
import { Sparkles } from 'lucide-react';

const FeedList = () => {
    const { posts, toggleLike } = useFeed();

    return (
        <div className="w-full max-w-md mx-auto pb-20">
            {/* Header for the Feed Section */}
            <div className="flex items-center gap-2 mb-6 px-1">
                <Sparkles className="text-yellow-400" size={20} />
                <h2 className="text-lg font-semibold text-white">Community Activity</h2>
            </div>

            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/50">
                        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Sparkles className="text-orange-500" size={32} />
                        </div>
                        <h4 className="text-white font-bold mb-2">The Arena is Silent</h4>
                        <p className="text-zinc-500 text-sm">
                            Ignite the feed with your first rep. Be the spark.
                        </p>
                    </div>
                ) : (
                    posts.map(post => (
                        <FeedPost
                            key={post.id}
                            post={post}
                            onLike={toggleLike}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedList;
