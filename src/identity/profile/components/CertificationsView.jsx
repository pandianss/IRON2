import React, { useState } from 'react';
import { ArrowLeft, Plus, Award, Upload } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import CertificateCard from '../../../components/UI/CertificateCard';
import { useAppContext } from '../../../app/context/AppContext';
import StorageService from '../../../infrastructure/StorageService';

const CertificationsView = ({ onBack }) => {
    const { certifications, addCertification, currentUser, showToast } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        id: '',
        issueDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file && !formData.id) {
            // If no ID and no file, strictly require one? Let's require file for now as per user request "Upload"
            showToast("Please upload a document proof.", "error");
            return;
        }

        setIsUploading(true);
        try {
            let fileUrl = null;
            if (file) {
                const userId = currentUser?.uid || 'unknown';
                const path = `credentials/${userId}/${Date.now()}_${file.name}`;
                fileUrl = await StorageService.uploadFile(file, path);
            }

            await addCertification({ ...formData, fileUrl });

            setIsAdding(false);
            setFormData({ title: '', issuer: '', id: '', issueDate: '' });
            setFile(null);
        } catch (error) {
            console.error("Upload failed", error);
            showToast("Failed to save credential.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="page-container fade-in">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" onClick={onBack} style={{ padding: '8px' }}>
                        <ArrowLeft size={24} />
                    </Button>
                    <h2 className="title-display" style={{ fontSize: '1.5rem', margin: 0 }}>CREDENTIALS</h2>
                </div>
                {!isAdding && (
                    <Button variant="ghost" size="sm" icon={Plus} onClick={() => setIsAdding(true)} style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        Add
                    </Button>
                )}
            </header>

            {isAdding ? (
                <div className="fade-in mt-6">
                    <Card className="glass-panel" style={{ padding: '24px' }}>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Upload size={20} className="text-yellow-500" />
                            Upload Credential
                        </h3>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>CERTIFICATION TITLE</label>
                                <input
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)',
                                        color: '#fff', fontSize: '1rem', outline: 'none'
                                    }}
                                    placeholder="e.g. CSCS, NASM-CPT"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>ISSUING ORGANIZATION</label>
                                <input
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)',
                                        color: '#fff', fontSize: '1rem', outline: 'none'
                                    }}
                                    placeholder="e.g. NSCA"
                                    value={formData.issuer}
                                    onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>CREDENTIAL ID</label>
                                    <input
                                        style={{
                                            width: '100%', padding: '14px', borderRadius: '12px',
                                            background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)',
                                            color: '#fff', fontSize: '1rem', outline: 'none'
                                        }}
                                        placeholder="Optional"
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>ISSUE YEAR</label>
                                    <input
                                        style={{
                                            width: '100%', padding: '14px', borderRadius: '12px',
                                            background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)',
                                            color: '#fff', fontSize: '1rem', outline: 'none'
                                        }}
                                        placeholder="YYYY"
                                        value={formData.issueDate}
                                        onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>DOCUMENT PROOF</label>
                                <div style={{
                                    position: 'relative', overflow: 'hidden',
                                    borderRadius: '12px',
                                    border: '1px dashed var(--border-glass)',
                                    background: 'rgba(255,255,255,0.03)',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            opacity: 0, cursor: 'pointer', zIndex: 2
                                        }}
                                    />
                                    <div style={{ padding: '20px', pointerEvents: 'none' }}>
                                        {file ? (
                                            <div style={{ color: 'var(--accent-green)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <Upload size={16} />
                                                {file.name}
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--text-muted)' }}>
                                                <div style={{ marginBottom: '4px' }}><Upload size={24} style={{ opacity: 0.5 }} /></div>
                                                <span style={{ fontSize: '0.9rem' }}>Click to upload certificate</span>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>PDF, JPG, PNG</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <Button type="button" variant="secondary" onClick={() => setIsAdding(false)} style={{ flex: 1 }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="accent" disabled={isUploading} style={{ flex: 1, opacity: isUploading ? 0.7 : 1 }}>
                                    {isUploading ? 'Uploading...' : 'Save Credential'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    {certifications.length === 0 ? (
                        <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-2xl">
                            <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center mx-auto mb-4">
                                <Award size={32} className="text-zinc-600" />
                            </div>
                            <h4 className="text-zinc-300 font-medium mb-1">No Credentials Yet</h4>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                                Upload your professional certifications to build trust with clients.
                            </p>
                        </div>
                    ) : (
                        certifications.map(cert => (
                            <CertificateCard
                                key={cert.id}
                                {...cert}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CertificationsView;
