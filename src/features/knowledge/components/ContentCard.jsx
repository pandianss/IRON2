import React from 'react';
import { Clock, BarChart, Tag, Trash2, Eye, EyeOff, Edit, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button'; // Assuming Button component exists

const ContentCard = ({ item, isAdmin, isAuthor, onEdit, onDelete, onToggleStatus, onClick }) => {
    return (
        <Card onClick={onClick} className="glass-panel" noPadding style={{ overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', opacity: item.status === 'hidden' ? 0.6 : 1 }}>

            {/* Admin/Author Actions Overlay */}
            {(isAdmin || isAuthor) && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 20, display: 'flex', gap: '4px' }}>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(item); }} style={{ padding: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}>
                        <Edit size={14} color="#fff" />
                    </Button>

                    {isAdmin && (
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggleStatus(item.id); }} style={{ padding: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}>
                            {item.status === 'hidden' ? <EyeOff size={14} color="#aaa" /> : <Eye size={14} color="#fff" />}
                        </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} style={{ padding: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: '#ff4444' }}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            )}

            {/* Image Header */}
            <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: item.status === 'hidden' ? 'grayscale(100%)' : 'none' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {item.category}
                        {item.status === 'hidden' && <span style={{ marginLeft: '8px', color: '#ff4444' }}>(HIDDEN)</span>}
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
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border-glass)', paddingTop: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
                    </div>

                    {/* Metadata: Author & Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            by <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{item.authorName || 'Iron Team'}</span>
                        </div>
                        {item.status === 'pending' && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--accent-orange)', fontWeight: 'bold', border: '1px solid var(--accent-orange)', padding: '1px 4px', borderRadius: '4px', marginTop: '2px' }}>
                                PENDING REVIEW
                            </span>
                        )}
                        {item.approvedBy && item.approvedBy !== 'system' && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                                <CheckCircle2 size={10} /> Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ContentCard;
