import React from 'react';
import { Clock, BarChart, Tag } from 'lucide-react';
import Card from '../../../components/UI/Card';

const ContentCard = ({ item }) => {
    return (
        <Card className="glass-panel" noPadding style={{ overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Image Header */}
            <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {item.category}
                    </span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {item.title}
                    </h3>
                </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4', flex: 1 }}>
                    {item.summary}
                </p>

                {/* Footer Details */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                    {item.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <Clock size={12} /> {item.duration}
                        </div>
                    )}
                    {item.difficulty && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <BarChart size={12} /> {item.difficulty}
                        </div>
                    )}
                    {item.tags && item.tags.map(tag => (
                        <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <Tag size={12} /> {tag}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default ContentCard;
