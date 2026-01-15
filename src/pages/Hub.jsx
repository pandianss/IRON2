import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Users, PenTool, Dumbbell, Apple, BookOpen, Plus, CheckCircle2 } from 'lucide-react';
import { useData, useUIFeedback, useSession, useRetention } from '../app/context';
import StarRating from '../components/UI/StarRating';
import ReviewModal from '../components/UI/ReviewModal';
import { useNavigate } from 'react-router-dom';
import ContentCard from '../features/knowledge/components/ContentCard';
import ContentSubmissionModal from '../features/knowledge/components/ContentSubmissionModal';
import ContentViewModal from '../features/knowledge/components/ContentViewModal';
import { WORKOUTS, DIETS } from '../features/knowledge/data/knowledgeData';

const Hub = () => {
    const navigate = useNavigate();
    const { showToast } = useUIFeedback();
    const { currentUser } = useSession();
    const {
        users, getRatingStats, addRating, studioContent, submitContent, approveContent, deleteContent, toggleContentStatus, updateContent
    } = useData();
    const { isAtRisk, isRecovering, recoveryProgress } = useRetention();
    const [reviewTarget, setReviewTarget] = React.useState(null);
    const [activeTab, setActiveTab] = useState('workouts');
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [localDeletions, setLocalDeletions] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [viewItem, setViewItem] = useState(null);

    const experts = users.filter(u => u.role === 'expert');

    // Merge Static and Dynamic Content for now, or just use Dynamic if enough data.
    // Let's seed static data into the view if dynamic is empty, or just merge.
    // Normalized Static Data
    const normalizedStatic = (activeTab === 'workouts' ? WORKOUTS : DIETS).map(i => ({
        ...i,
        category: activeTab === 'workouts' ? 'Workouts' : 'Nutrition',
        status: 'active',
        popularity: 100, // Static content is popular
        authorName: 'Iron Team'
    }));

    const dynamicContent = studioContent
        .filter(c => c.category === (activeTab === 'workouts' ? 'Workouts' : 'Nutrition'))
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    const isAdmin = ['gym_owner', 'admin', 'expert', 'super_admin'].includes(currentUser?.role);

    // Show hidden items to Admin
    const visibleDynamic = isAdmin
        ? dynamicContent
        : dynamicContent.filter(c => c.status !== 'hidden');

    const displayContent = [...visibleDynamic.filter(c => c.status === 'active' || (isAdmin && c.status === 'hidden')), ...normalizedStatic]
        .filter(c => !localDeletions.includes(c.id));

    // Approval Queue
    const pendingContent = dynamicContent.filter(c => c.status === 'pending');
    const isApprover = isAdmin;

    const handleDelete = async (contentId) => {
        if (window.confirm("Are you sure you want to delete this content?")) {
            // 1. Try DB Delete (Safe to fail for static)
            await deleteContent(contentId);
            // 2. Local Hide (For Static & Immediate Feedback)
            setLocalDeletions(prev => [...prev, contentId]);
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setShowSubmissionModal(true);
    };

    const handleModalSubmit = (data) => {
        if (data.id) {
            updateContent(data.id, data);
        } else {
            submitContent(data);
        }
        setEditItem(null);
    };

    const handleModalClose = () => {
        setShowSubmissionModal(false);
        setEditItem(null);
    };

    const handleSubmitReview = async (rating, comment) => {
        if (reviewTarget) {
            await addRating(reviewTarget.id, rating, comment);
            setReviewTarget(null);
        }
    };

    const handleStartProgram = (item) => {
        showToast(`Started "${item.title}"!`);
        setViewItem(null);
    };

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>LIBRARY</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        OFFICIAL IRON PROTOCOLS
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        variant="accent"
                        size="sm"
                        icon={Plus}
                        onClick={() => setShowSubmissionModal(true)}
                    >
                        SUBMIT
                    </Button>
                    <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                        <BookOpen size={20} />
                    </div>
                </div>
            </header>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <Button
                    variant={activeTab === 'workouts' ? 'primary' : 'ghost'}
                    icon={Dumbbell}
                    onClick={() => setActiveTab('workouts')}
                    style={{ flex: 1, justifyContent: 'center', border: activeTab !== 'workouts' ? '1px solid var(--border-glass)' : 'none' }}
                >
                    Workouts
                </Button>
                <Button
                    variant={activeTab === 'nutrition' ? 'primary' : 'ghost'}
                    icon={Apple}
                    onClick={() => setActiveTab('nutrition')}
                    style={{ flex: 1, justifyContent: 'center', border: activeTab !== 'nutrition' ? '1px solid var(--border-glass)' : 'none' }}
                >
                    Nutrition
                </Button>
            </div>

            {/* Approval Queue (If Expert) */}
            {isApprover && pendingContent.length > 0 && (
                <section style={{ marginBottom: '32px' }}>
                    <h3 className="section-label" style={{ color: 'var(--accent-orange)' }}>PENDING APPROVAL ({pendingContent.length})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {pendingContent.map(item => (
                            <div key={item.id} style={{ position: 'relative' }}>
                                <ContentCard item={item} onClick={() => setViewItem(item)} />
                                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                                    <Button
                                        variant="accent"
                                        size="sm"
                                        onClick={() => approveContent(item.id)}
                                        icon={CheckCircle2}
                                    >
                                        APPROVE
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="divider" style={{ margin: '24px 0' }} />
                </section>
            )}

            {/* Retention Risk Banners */}
            {isAtRisk && (
                <div style={{
                    backgroundColor: 'rgba(255, 60, 0, 0.1)',
                    border: '1px solid var(--accent-danger)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ color: 'var(--accent-danger)' }}>⚠️</div>
                    <div>
                        <h3 style={{ color: 'var(--accent-danger)', margin: 0, fontSize: '1rem' }}>STREAK AT RISK</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                            You missed yesterday. Complete an action TODAY to save your streak!
                        </p>
                    </div>
                </div>
            )}

            {isRecovering && (
                <div style={{
                    backgroundColor: 'rgba(0, 150, 255, 0.1)',
                    border: '1px solid var(--accent-info)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ color: 'var(--accent-info)', margin: '0 0 8px 0', fontSize: '1rem' }}>RECOVERY MODE</h3>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3].map(day => (
                            <div key={day} style={{
                                flex: 1,
                                height: '4px',
                                background: day <= recoveryProgress ? 'var(--accent-info)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '2px'
                            }} />
                        ))}
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                        {recoveryProgress}/3 Days to restore full engagement
                    </p>
                </div>
            )}

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                {displayContent.map((item, idx) => (
                    <ContentCard
                        key={item.id || idx}
                        item={item}
                        isAdmin={isAdmin}
                        isAuthor={currentUser?.uid === item.authorId}
                        onEdit={handleEdit}
                        onDelete={deleteContent}
                        onToggleStatus={toggleContentStatus}
                        onClick={() => setViewItem(item)}
                    />
                ))}
            </div>

            {/* Verified Experts Section */}
            <section>
                <h3 className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    VERIFIED EXPERTS
                    <span onClick={() => navigate('/studio')} style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', cursor: 'pointer' }}>
                        I AM A TRAINER
                    </span>
                </h3>
            </section>

            <div style={{ display: 'grid', gap: '12px' }}>
                {experts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                        No verified experts in your network yet.
                    </div>
                ) : (
                    experts.map((expert) => (
                        <Card key={expert.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'linear-gradient(45deg, #111, #333)',
                                border: '1px solid var(--border-glass)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', color: '#555'
                            }}>
                                {expert.displayName.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: '700' }}>{expert.displayName}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                    <StarRating rating={getRatingStats(expert.id).average} size={10} />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {getRatingStats(expert.id).count} reviews
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Button variant="ghost" size="sm" onClick={() => setReviewTarget(expert)} style={{ padding: '8px' }}>
                                    <PenTool size={16} color="var(--accent-orange)" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <ReviewModal
                isOpen={!!reviewTarget}
                onClose={() => setReviewTarget(null)}
                targetName={reviewTarget?.displayName}
                onSubmit={handleSubmitReview}
            />

            <ContentSubmissionModal
                isOpen={showSubmissionModal}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialData={editItem}
            />

            <ContentViewModal
                isOpen={!!viewItem}
                onClose={() => setViewItem(null)}
                item={viewItem}
                onStart={handleStartProgram}
            />
        </div>
    );
};

export default Hub;
