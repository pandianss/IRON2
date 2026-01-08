import React, { useState } from 'react';
import { BookOpen, Dumbbell, Apple, ArrowLeft } from 'lucide-react';
import Button from '../../../components/UI/Button';
import ContentCard from '../components/ContentCard';
import { WORKOUTS, DIETS } from '../data/knowledgeData';
import { useNavigate } from 'react-router-dom';

const KnowledgePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('workouts');

    const content = activeTab === 'workouts' ? WORKOUTS : DIETS;

    return (
        <div className="page-container fade-in" style={{ paddingBottom: '100px' }}>
            <header className="page-header" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <Button variant="ghost" onClick={() => navigate('/hub')} style={{ padding: '8px' }}>
                        <ArrowLeft size={24} />
                    </Button>
                    <div className="header-title-group">
                        <h1 className="title-display" style={{ fontSize: '2rem', marginBottom: '4px' }}>KNOWLEDGE</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            OFFICIAL IRON PROTOCOLS
                        </p>
                    </div>
                </div>

                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: '12px' }}>
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
            </header>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {content.map(item => (
                    <ContentCard key={item.id} item={item} />
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <BookOpen size={24} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.5 }} />
                <p>New protocols added monthly.<br />Verify with your expert before starting.</p>
            </div>
        </div>
    );
};

export default KnowledgePage;
