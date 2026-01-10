import React from 'react';
import { useFeed } from '../hooks/useFeed';
import FeedPost from './FeedPost';
import { Sparkles } from 'lucide-react';

const FeedList = () => {
    const { posts, toggleLike } = useFeed();

    return (
        <div className="w-full max-w-md mx-auto pb-20">


            <div className="space-y-8">
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
                    <>
                        {/* Trending Section */}
                        <section>
                            <h3 style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '1rem', fontWeight: '800',
                                color: '#FF4D00', textTransform: 'uppercase', letterSpacing: '2px',
                                marginBottom: '16px', fontFamily: 'var(--font-display)'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>🔥</span> Trending Now
                            </h3>
                            <div className="space-y-4">
                                {[...posts]
                                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                                    .slice(0, 3)
                                    .map(post => (
                                        <FeedPost
                                            key={`trending-${post.id}`}
                                            post={post}
                                            onLike={toggleLike}
                                            variant="trending"
                                        />
                                    ))}
                            </div>
                        </section>

                        {/* Latest Section */}
                        <section>
                            <h3 style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '1rem', fontWeight: '800',
                                color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '2px',
                                marginBottom: '16px', marginTop: '40px',
                                paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)',
                                fontFamily: 'var(--font-display)'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>⚡</span> Realtime Updates
                            </h3>
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <FeedPost
                                        key={post.id}
                                        post={post}
                                        onLike={toggleLike}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedList;
