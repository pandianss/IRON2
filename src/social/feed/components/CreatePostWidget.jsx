
import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import { useAuth } from '../../../app/context/AuthContext';
import { useFeed } from '../hooks/useFeed';

const CreatePostWidget = () => {
    const { currentUser } = useAuth();
    const { createPost, isPosting } = useFeed();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async () => {
        if (!content.trim() && !image) return;

        const success = await createPost(content, 'status', image);
        if (success) {
            setContent('');
            setImage(null);
            setPreview(null);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!currentUser) return null;

    return (
        <Card className="glass-panel" style={{ border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div
                        className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-500 overflow-hidden"
                    >
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            currentUser.displayName ? currentUser.displayName[0] : 'U'
                        )}
                    </div>
                </div>
                <div className="flex-grow">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your progress..."
                        className="w-full bg-transparent border-none text-white placeholder-zinc-600 resize-none focus:outline-none text-sm mb-2"
                        rows={2}
                    />

                    {preview && (
                        <div className="relative mb-4 rounded-lg overflow-hidden border border-zinc-700 inline-block">
                            <img src={preview} alt="Upload Preview" className="max-h-48 object-cover" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="small"
                                onClick={() => fileInputRef.current?.click()}
                                icon={ImageIcon}
                                style={{ color: 'var(--accent-blue)' }}
                            >
                                Media
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="small"
                            onClick={handleSubmit}
                            disabled={isPosting || (!content && !image)}
                            icon={isPosting ? Loader2 : Send}
                            style={{
                                opacity: (!content && !image) ? 0.5 : 1,
                                backgroundColor: isPosting ? 'var(--text-muted)' : 'var(--accent-orange)'
                            }}
                        >
                            {isPosting ? 'POSTING...' : 'POST'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CreatePostWidget;
