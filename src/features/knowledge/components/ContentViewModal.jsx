import React from 'react';
import { X, Clock, BarChart, Calendar, Play } from 'lucide-react';
import Button from '../../../components/UI/Button';

const ContentViewModal = ({ isOpen, onClose, item, onStart }) => {
    if (!isOpen || !item) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
                padding: '0', position: 'relative', border: '1px solid var(--accent-orange)',
                borderRadius: '24px', overflow: 'hidden'
            }}>
                {/* Hero Image */}
                <div style={{ height: '250px', position: 'relative' }}>
                    <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, transparent)' }}></div>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '16px', right: '16px',
                            background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                            cursor: 'pointer', borderRadius: '50%', padding: '8px'
                        }}
                    >
                        <X size={20} />
                    </button>

                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                        <span style={{
                            color: 'var(--accent-orange)', fontWeight: 'bold', textTransform: 'uppercase',
                            letterSpacing: '1px', fontSize: '0.8rem', marginBottom: '8px', display: 'block'
                        }}>
                            {item.category}
                        </span>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            {item.title}
                        </h2>
                    </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '24px' }}>
                    {/* Metadata Row */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} color="var(--text-muted)" />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>DURATION</span>
                                <span style={{ fontWeight: '600' }}>{item.duration || 'N/A'}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart size={16} color="var(--text-muted)" />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>DIFFICULTY</span>
                                <span style={{ fontWeight: '600' }}>{item.difficulty || 'All Levels'}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} color="var(--text-muted)" />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>FREQUENCY</span>
                                <span style={{ fontWeight: '600' }}>{item.frequency || 'Flexible'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 className="section-label">OVERVIEW</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            {item.summary || item.description || "No description available."}
                        </p>
                    </div>

                    {/* Benefits Section */}
                    {item.benefits && item.benefits.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 className="section-label">KEY BENEFITS</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {item.benefits.map((benefit, idx) => (
                                    <div key={idx} style={{
                                        padding: '6px 16px', borderRadius: '20px',
                                        background: 'rgba(255,165,0,0.1)', border: '1px solid var(--accent-orange)',
                                        color: 'var(--accent-orange)', fontSize: '0.85rem', fontWeight: 'bold'
                                    }}>
                                        {benefit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Section */}
                    {item.videoUrl && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 className="section-label">VIDEO GUIDE</h3>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                                <iframe
                                    src={item.videoUrl}
                                    title="Video"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* Instructions / Steps */}
                    {item.instructions && item.instructions.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 className="section-label">INSTRUCTIONS</h3>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {item.instructions.map((step, idx) => (
                                    <div key={idx} style={{
                                        padding: '16px', borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                                        display: 'flex', gap: '16px'
                                    }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: 'var(--accent-orange)', color: '#000', fontWeight: 'bold',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {step.step || idx + 1}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{step.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentViewModal;
