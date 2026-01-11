import React, { useState } from 'react';
import { X, Upload, Activity, Apple, Clock, BarChart, Plus, Trash2, Video, List } from 'lucide-react';
import Button from '../../../components/UI/Button';
import { optimizeImage, validateVideo } from '../../../utils/mediaOptimizer';

const ContentSubmissionModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState(initialData?.category === 'Nutrition' ? 'nutrition' : 'workout');
    const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Beginner');
    const [duration, setDuration] = useState(initialData?.duration || '');
    const [description, setDescription] = useState(initialData?.summary || '');
    const [image, setImage] = useState(initialData?.image || '');
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
    const [instructions, setInstructions] = useState(initialData?.instructions || []);
    const [benefits, setBenefits] = useState(initialData?.benefits || []);
    const [newBenefit, setNewBenefit] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [videoMode, setVideoMode] = useState('embed'); // 'embed' | 'upload'

    // Reset when modal opens with new data or no data
    React.useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || '');
            setCategory(initialData?.category === 'Nutrition' ? 'nutrition' : 'workout');
            setDifficulty(initialData?.difficulty || 'Beginner');
            setDuration(initialData?.duration || '');
            setDescription(initialData?.summary || '');
            setImage(initialData?.image || '');
            setVideoUrl(initialData?.videoUrl || '');
            setInstructions(initialData?.instructions || []);
            setBenefits(initialData?.benefits || []);
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        if (!title || !description) return;

        // Handle Video URL (might be object if uploaded)
        let finalVideoUrl = videoUrl;
        if (typeof videoUrl === 'object' && videoUrl.preview) {
            finalVideoUrl = videoUrl.preview; // Use blob URL for session prototype
        }

        onSubmit({
            ...(initialData || {}), // Keep ID if exists
            title,
            category: category === 'workout' ? 'Workouts' : 'Nutrition',
            difficulty,
            duration,
            summary: description,
            image: image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop',
            videoUrl: finalVideoUrl,
            instructions: instructions.filter(i => i.title || i.description),
            benefits: benefits.filter(b => b.trim())
        });
        onClose();
        setTitle('');
        setDescription('');
        setDuration('');
        setInstructions([]);
        setVideoUrl('');
        setBenefits([]);
    };

    const addStep = () => {
        setInstructions([...instructions, { step: instructions.length + 1, title: '', description: '' }]);
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...instructions];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setInstructions(newSteps);
    };

    const removeStep = (index) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const handleAddBenefit = () => {
        if (newBenefit.trim()) {
            setBenefits([...benefits, newBenefit.trim()]);
            setNewBenefit('');
        }
    };

    const removeBenefit = (index) => {
        setBenefits(benefits.filter((_, i) => i !== index));
    };


    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto',
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

                <h2 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>CONTRIBUTE KNOWLEDGE</h2>

                {/* Category Selection */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <Button
                        variant={category === 'workout' ? 'accent' : 'secondary'}
                        onClick={() => setCategory('workout')}
                        style={{ flex: 1 }}
                        icon={Activity}
                    >
                        Workout
                    </Button>
                    <Button
                        variant={category === 'nutrition' ? 'accent' : 'secondary'}
                        onClick={() => setCategory('nutrition')}
                        style={{ flex: 1 }}
                        icon={Apple}
                    >
                        Nutrition
                    </Button>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label className="text-secondary text-sm mb-2 block">TITLE</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 5x5 Power Routine"
                            className="iron-input-border w-full p-3 rounded-lg bg-black/20 text-white"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-secondary text-sm mb-2 block">DIFFICULTY</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="iron-input-border w-full p-3 rounded-lg bg-black/20 text-white"
                            >
                                <option value="Beginner" style={{ background: '#111', color: '#fff' }}>Beginner</option>
                                <option value="Intermediate" style={{ background: '#111', color: '#fff' }}>Intermediate</option>
                                <option value="Advanced" style={{ background: '#111', color: '#fff' }}>Advanced</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-secondary text-sm mb-2 block">DURATION (MIN)</label>
                            <input
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="e.g. 45-60"
                                className="iron-input-border w-full p-3 rounded-lg bg-black/20 text-white"
                            />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                        <label className="text-secondary text-sm mb-3 block flex items-center gap-2">
                            <Upload size={14} /> COVER IMAGE
                        </label>

                        {image ? (
                            <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden', height: '200px' }}>
                                <img src={image} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    onClick={() => setImage('')}
                                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-red-500/80 transition-colors"
                                >
                                    <Trash2 size={16} color="white" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => document.getElementById('cover-upload').click()}
                                style={{
                                    border: '2px dashed var(--border-glass)', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)'
                                }}
                            >
                                <Upload size={24} />
                                <span className="text-sm font-bold">Click to Upload Cover</span>
                                <span className="text-xs text-muted">Auto-optimized for mobile (Max 1080p)</span>
                            </div>
                        )}
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setIsUploading(true);
                                try {
                                    const optimized = await optimizeImage(file);
                                    setImage(optimized);
                                } catch (err) {
                                    alert("Image Error: " + err.message);
                                }
                                setIsUploading(false);
                            }}
                        />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <label className="text-secondary text-sm block flex items-center gap-2">
                                <Video size={14} /> VIDEO CONTENT
                            </label>
                            <div className="flex gap-2 text-xs bg-black/30 p-1 rounded-lg">
                                <button
                                    onClick={() => setVideoMode('embed')}
                                    className={`px-3 py-1 rounded ${videoMode === 'embed' ? 'bg-white/10 text-accent' : 'text-muted'}`}
                                >
                                    Embed
                                </button>
                                <button
                                    onClick={() => setVideoMode('upload')}
                                    className={`px-3 py-1 rounded ${videoMode === 'upload' ? 'bg-white/10 text-accent' : 'text-muted'}`}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>

                        {videoMode === 'embed' ? (
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="Paste YouTube/Vimeo Embed URL"
                                className="iron-input-border w-full p-3 rounded-lg bg-black/20 text-white"
                            />
                        ) : (
                            <div
                                onClick={() => !videoUrl && document.getElementById('video-upload').click()}
                                style={{
                                    border: '2px dashed var(--border-glass)', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: videoUrl ? 'default' : 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)'
                                }}
                            >
                                {videoUrl ? (
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="bg-accent/20 p-3 rounded-full"><Video size={20} className="text-accent" /></div>
                                        <div className="flex-1 text-left">
                                            <div className="text-sm text-white font-mono break-all">{videoUrl.name || 'Video File'}</div>
                                            <div className="text-xs text-green-400">Ready for upload</div>
                                        </div>
                                        <button onClick={() => setVideoUrl('')}><Trash2 size={16} className="text-muted hover:text-red-500" /></button>
                                    </div>
                                ) : (
                                    <>
                                        <Video size={24} />
                                        <span className="text-sm font-bold">Click to Select Video</span>
                                        <span className="text-xs text-muted">Max 100MB • MP4/MOV</span>
                                    </>
                                )}
                                <input
                                    id="video-upload"
                                    type="file"
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        try {
                                            const validFile = await validateVideo(file);
                                            // Since we can't upload in this mock env, we store the File object 
                                            // which might break if state expects string.
                                            // We'll store a pseudo-object or ObjectURL.
                                            setVideoUrl({ name: validFile.name, size: validFile.size, preview: URL.createObjectURL(validFile) });
                                        } catch (err) {
                                            alert(err.message);
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-secondary text-sm mb-2 block">OVERVIEW / DESCRIPTION</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the plan..."
                            className="iron-input-border w-full p-3 rounded-lg bg-black/20 text-white h-24"
                        />
                    </div>

                    {/* Benefits Builder */}
                    <div>
                        <label className="text-secondary text-sm mb-2 block">KEY BENEFITS</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={newBenefit}
                                onChange={(e) => setNewBenefit(e.target.value)}
                                placeholder="e.g. Improves Grip Strength"
                                className="iron-input-border w-full p-2 rounded bg-black/40 text-white text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddBenefit()}
                            />
                            <Button size="sm" variant="secondary" onClick={handleAddBenefit} icon={Plus}>Add</Button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                            {benefits.map((b, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', border: '1px solid var(--border-glass)' }}>
                                    {b}
                                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeBenefit(i)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Builder */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <label className="text-secondary text-sm block" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <List size={16} /> INSTRUCTIONS / STEPS
                            </label>
                            <Button size="sm" variant="ghost" onClick={addStep} icon={Plus} style={{ border: '1px solid var(--border-glass)' }}>Add Step</Button>
                        </div>

                        <div style={{ display: 'grid', gap: '8px' }}>
                            {instructions.map((step, idx) => (
                                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: 'var(--accent-orange)', color: '#000', fontWeight: 'bold', fontSize: '0.8rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '10px'
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <div style={{ flex: 1, display: 'grid', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={step.title}
                                            onChange={(e) => updateStep(idx, 'title', e.target.value)}
                                            placeholder="Step Title (e.g. Warm Up)"
                                            className="iron-input-border w-full p-2 rounded bg-black/40 text-white text-sm"
                                        />
                                        <textarea
                                            value={step.description}
                                            onChange={(e) => updateStep(idx, 'description', e.target.value)}
                                            placeholder="Detailed instructions..."
                                            className="iron-input-border w-full p-2 rounded bg-black/40 text-white text-sm"
                                            rows={2}
                                        />
                                    </div>
                                    <button onClick={() => removeStep(idx)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '8px' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {instructions.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px dashed var(--border-glass)', borderRadius: '8px' }}>
                                    No instructions added yet. Click "Add Step" to build your guide.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Button fullWidth variant="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
                    SUBMIT TO LIBRARY
                </Button>

            </div>
        </div>
    );
};

export default ContentSubmissionModal;
