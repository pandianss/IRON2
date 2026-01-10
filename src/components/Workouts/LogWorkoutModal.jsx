import React, { useState, useRef } from 'react';
import { X, Upload, Mic, Music, Lock, Globe, Camera } from 'lucide-react';
import Button from '../UI/Button';
import StorageService from '../../infrastructure/StorageService';
import { useSession } from '../../app/context';
import { mockAudioTracks } from '../../services/mockData';
import { useUIFeedback } from '../../app/context';

const LogWorkoutModal = ({ onClose, onLog }) => {
    const { currentUser } = useSession();
    const { showToast } = useUIFeedback();
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [privacy, setPrivacy] = useState('public'); // 'public', 'private'
    const [audioMode, setAudioMode] = useState('none'); // 'none', 'mic', 'music'
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!description && !file) {
            showToast("Please add a description or upload proof", "error");
            return;
        }

        setIsUploading(true);
        let mediaUrl = null;

        try {
            if (file && currentUser) {
                // Determine storage path
                const userId = currentUser.id || currentUser.uid || 'unknown_user';
                const path = `workouts/${userId}/${Date.now()}_${file.name}`;
                mediaUrl = await StorageService.uploadFile(file, path, (progress) => {
                    setUploadProgress(progress);
                });
            }

            const workoutData = {
                description,
                mediaUrl,
                mediaType: file?.type.startsWith('video') ? 'video' : 'image',
                privacy,
                audioMode,
                audioTrack: audioMode === 'music' ? selectedTrack : null,
                timestamp: new Date().toISOString()
            };

            await onLog(workoutData);
            onClose();
        } catch (error) {
            console.error("Failed to log workout:", error);
            showToast(error.message || "Failed to upload log", "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                padding: '24px', position: 'relative', border: '1px solid var(--accent-orange)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>LOG WORKOUT</h2>

                {/* Media Upload Section */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '100%', aspectRatio: '16/9',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px dashed var(--border-glass)',
                        borderRadius: '12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '20px', cursor: 'pointer', overflow: 'hidden', position: 'relative'
                    }}
                >
                    {preview ? (
                        file?.type.startsWith('video') ? (
                            <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay loop muted />
                        ) : (
                            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )
                    ) : (
                        <>
                            <Camera size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Upload Proof of Work</span>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Description Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>DESCRIPTION</label>
                    <textarea
                        className="iron-input-border"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What did you conquer today?"
                        style={{
                            width: '100%', minHeight: '100px',
                            background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '12px',
                            borderRadius: '8px', fontSize: '1rem'
                        }}
                    />
                </div>


                {/* Audio Options */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <Button
                            variant={audioMode === 'mic' ? 'accent' : 'secondary'}
                            onClick={() => setAudioMode(audioMode === 'mic' ? 'none' : 'mic')}
                            style={{ flex: 1, fontSize: '0.8rem' }}
                            icon={Mic}
                        >
                            Voice Note
                        </Button>
                        <Button
                            variant={audioMode === 'music' ? 'accent' : 'secondary'}
                            onClick={() => setAudioMode(audioMode === 'music' ? 'none' : 'music')}
                            style={{ flex: 1, fontSize: '0.8rem' }}
                            icon={Music}
                        >
                            Add Music
                        </Button>
                    </div>

                    {/* Music Selection Panel */}
                    {audioMode === 'music' && (
                        <div className="fade-in" style={{
                            background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px',
                            maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border-glass)'
                        }}>
                            {mockAudioTracks.map(track => (
                                <div
                                    key={track.id}
                                    onClick={() => setSelectedTrack(track)}
                                    style={{
                                        padding: '10px', borderRadius: '8px', marginBottom: '4px', cursor: 'pointer',
                                        background: selectedTrack?.id === track.id ? 'var(--accent-orange)' : 'transparent',
                                        color: selectedTrack?.id === track.id ? '#000' : '#fff',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        fontSize: '0.85rem', fontWeight: selectedTrack?.id === track.id ? '700' : '400'
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Music size={14} /> {track.title}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{track.duration}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Privacy Toggle */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {privacy === 'public' ? <Globe size={20} color="var(--accent-blue)" /> : <Lock size={20} color="var(--rust-primary)" />}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{privacy === 'public' ? 'Public Feed' : 'Private Diary'}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {privacy === 'public' ? 'Visible to the arena' : 'Only visible to you'}
                            </span>
                        </div>
                    </div>
                    <div
                        onClick={() => setPrivacy(privacy === 'public' ? 'private' : 'public')}
                        style={{
                            width: '40px', height: '24px',
                            background: privacy === 'public' ? 'var(--accent-blue)' : 'var(--rust-primary)',
                            borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
                        }}
                    >
                        <div style={{
                            width: '18px', height: '18px', background: '#fff', borderRadius: '50%',
                            position: 'absolute', top: '3px', left: privacy === 'public' ? '19px' : '3px', transition: 'left 0.3s'
                        }} />
                    </div>
                </div>

                {/* Actions */}
                <Button
                    fullWidth
                    variant="accent"
                    onClick={handleSubmit}
                    disabled={isUploading}
                    style={{ height: '56px' }}
                >
                    {isUploading ? `UPLOADING... ${Math.round(uploadProgress)}%` : 'CONFIRM LOG (+50 XP)'}
                </Button>

            </div>
        </div>
    );
};

export default LogWorkoutModal;
