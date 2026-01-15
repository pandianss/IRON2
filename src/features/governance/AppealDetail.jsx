import React from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Clock, Shield, AlertTriangle, FileText } from 'lucide-react';
import EvidenceUploader from './EvidenceUploader';

const AppealDetail = ({ appeal, onBack }) => {
    if (!appeal) return null;

    return (
        <div className="appeal-detail fade-in">
            <Button variant="ghost" onClick={onBack} style={{ marginBottom: '16px' }}>
                ← Back to List
            </Button>

            <Card className="mb-4" style={{ border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Shield color="var(--accent-blue)" />
                            Case #{appeal.id.substring(0, 8)}
                        </h2>
                        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <span>Plaintiff: ALLY-{appeal.plaintiffId.substring(0, 6)}</span>
                            <span>Defendant: SYSTEM</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={14} /> {new Date(appeal.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className={`status-badge ${appeal.status}`}>
                        {appeal.status}
                    </div>
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Narrative
                    </h4>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        "{appeal.narrative}"
                    </p>
                </div>
            </Card>

            <h3 style={{ margin: '32px 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} /> Evidence Timeline
            </h3>

            <div className="timeline" style={{ paddingLeft: '20px', borderLeft: '2px solid var(--border-glass)' }}>
                {/* Placeholder for evidence items */}
                <div style={{ position: 'relative', paddingBottom: '24px' }}>
                    <div style={{ position: 'absolute', left: '-25px', width: '10px', height: '10px', background: 'var(--text-muted)', borderRadius: '50%', top: '6px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Case opened by Plaintiff
                    </p>
                </div>
            </div>

            {appeal.status === 'OPEN' && (
                <div style={{ marginTop: '32px' }}>
                    <EvidenceUploader appealId={appeal.id} plaintiffId={appeal.plaintiffId} />
                </div>
            )}
        </div>
    );
};

export default AppealDetail;
