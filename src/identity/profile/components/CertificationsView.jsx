import React, { useState } from 'react';
import { ArrowLeft, Plus, Award, Upload } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import CertificateCard from '../../../components/UI/CertificateCard';
import { useAppContext } from '../../../app/context/AppContext';

const CertificationsView = ({ onBack }) => {
    const { certifications, addCertification } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        id: '',
        issueDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addCertification(formData);
        setIsAdding(false);
        setFormData({ title: '', issuer: '', id: '', issueDate: '' });
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

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">CERTIFICATION TITLE</label>
                                <input
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                    placeholder="e.g. CSCS, NASM-CPT"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ISSUING ORGANIZATION</label>
                                <input
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                    placeholder="e.g. NSCA"
                                    value={formData.issuer}
                                    onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">CREDENTIAL ID</label>
                                    <input
                                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                        placeholder="Optional"
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">ISSUE YEAR</label>
                                    <input
                                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                        placeholder="YYYY"
                                        value={formData.issueDate}
                                        onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="secondary" onClick={() => setIsAdding(false)} style={{ flex: 1 }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" style={{ flex: 1, background: 'var(--accent-orange)', color: 'black' }}>
                                    Save Credential
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
