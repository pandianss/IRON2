import React from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';

const FeedPost = ({ post, onLike }) => {
    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 mb-4 hover:border-white/20 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <img
                        src={post.user.avatar}
                        alt={post.user.name}
                        className="w-10 h-10 rounded-full bg-indigo-500/20"
                    />
                    <div>
                        <h3 className="text-white font-medium text-sm flex items-center gap-2">
                            {post.user.name}
                            {post.user.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                    {post.user.badge}
                                </span>
                            )}
                        </h3>
                        <p className="text-gray-400 text-xs">{post.timestamp}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-gray-200 text-sm leading-relaxed">
                    {post.content}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                        }`}
                >
                    <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                    <span>{post.likes}</span>
                </button>

                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                    <MessageSquare size={18} />
                    <span>{post.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors ml-auto">
                    <Share2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default FeedPost;
