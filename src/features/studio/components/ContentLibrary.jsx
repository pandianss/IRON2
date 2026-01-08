import React from 'react';
import { Plus, Video, FileText, Eye } from 'lucide-react';
import Button from '../../../components/UI/Button';

const ContentLibrary = ({ contentList, onUpload }) => (
    <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="section-label">MY LIBRARY</h3>
            <Button variant="ghost" icon={Plus} onClick={onUpload} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>New</Button>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
            {contentList.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            width: '48px', height: '48px',
                            background: item.type === 'video' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 77, 0, 0.1)',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {item.type === 'video' ? <Video size={20} color="var(--accent-blue)" /> : <FileText size={20} color="var(--accent-orange)" />}
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h4>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {item.views}</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '4px',
                        background: item.status === 'Published' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        color: (item.status === 'Published' || item.status === 'Processing') ? 'var(--accent-green)' : 'var(--text-muted)'
                    }}>
                        {item.status.toUpperCase()}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

export default ContentLibrary;
