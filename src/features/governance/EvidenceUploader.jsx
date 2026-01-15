import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import { Upload, X } from 'lucide-react';
import { EngineService } from '../../services/engine/EngineService';
import { useSession, useUI } from '../../app/context';

const EvidenceUploader = ({ appealId, plaintiffId }) => {
    const { currentUser } = useSession();
    const { showToast } = useUI();
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!text && !file) return;
        setIsSubmitting(true);

        try {
            // 1. Upload file if exists (Mock for now, or use StorageService if available)
            let mediaUrl = null;
            if (file) {
                // mediaUrl = await StorageService.upload(file);
                mediaUrl = 'https://via.placeholder.com/150'; // Mock
            }

            // 2. Submit Event to Engine
            // Target is the Plaintiff (Owner of the Appeal)
            await EngineService.processAction(plaintiffId, {
                type: 'EVIDENCE_SUBMITTED',
                // Actor is Me (start with currentUser, could be witness too)
                actor: { type: 'USER', id: currentUser.uid },
                payload: {
                    appealId,
                    evidenceId: globalThis.crypto.randomUUID(),
                    type: file ? 'IMAGE' : 'TEXT_NARRATIVE',
                    url: mediaUrl,
                    text: text,
                    fileName: file ? file.name : null
                }
            });

            setText('');
            setFile(null);
            showToast("Evidence Submitted.");

        } catch (error) {
            console.error(error);
            showToast("Submission Failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="evidence-uploader" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '12px' }}>Submit Evidence</h4>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Explain this piece of evidence..."
                style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-glass)',
                    padding: '12px',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    minHeight: '80px',
                    marginBottom: '12px'
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button variant="ghost" icon={Upload} style={{ fontSize: '0.9rem' }}>
                        Attach File
                    </Button>
                    {file && (
                        <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                            {file.name} <X size={12} onClick={() => setFile(null)} style={{ cursor: 'pointer' }} />
                        </span>
                    )}
                </div>
                <Button variant="accent" onClick={handleSubmit} disabled={(!text && !file) || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
                </Button>
            </div>
        </div>
    );
};

export default EvidenceUploader;
