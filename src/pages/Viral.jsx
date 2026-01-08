import React from 'react';
import { FeedList } from '../social/feed';

const Viral = () => {
    return (
        <div className="min-h-screen bg-black/95 text-white pb-24 pt-16 px-4">
            <div className="max-w-md mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
                        Community
                    </h1>
                    <p className="text-gray-400 text-sm">
                        See what your friends are achieving today.
                    </p>
                </header>

                <FeedList />
            </div>
        </div>
    );
};

export default Viral;
