import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import { ThumbsUp, ThumbsDown, Gavel } from 'lucide-react';
import { EngineService } from '../../services/engine/EngineService';
import { useSession } from '../../app/context';
import { useUI } from '../../app/context';

const JuryBox = ({ appealId, plaintiffId }) => {
    const { currentUser } = useSession();
    const { showToast } = useUI();
    const [vote, setVote] = useState(null); // 'SUSTAIN' | 'OVERRULE'
    const [isSubmitting, setIsSubmitting] = useState(false);

    const castVote = async (decision) => {
        if (!currentUser) return;
        setIsSubmitting(true);
        try {
            await EngineService.processAction(plaintiffId, {
                type: 'WITNESS_VOTE',
                actor: { type: 'WITNESS', id: currentUser.uid },
                payload: {
                    appealId,
                    vote: decision === 'SUSTAIN' ? 'VOUCH' : 'REJECT', // Map UI to Schema
                    commentary: `Voted ${decision}`
                }
            });
            setVote(decision);
            showToast("Verdict recorded.");
        } catch (error) {
            console.error(error);
            showToast("Failed to cast vote: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="jury-box" style={{
            marginTop: '32px',
            padding: '24px',
            background: 'linear-gradient(180deg, rgba(20,20,30,0) 0%, rgba(20,20,30,0.8) 100%)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px'
        }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)' }}>
                <Gavel size={20} /> Jury Box
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                You have been summoned as a witness. Review the evidence and cast your vote.
            </p>

            {!vote ? (
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        variant="accent"
                        style={{ flex: 1, background: 'rgba(0,255,0,0.2)', borderColor: 'var(--accent-green)' }}
                        onClick={() => castVote('SUSTAIN')}
                        disabled={isSubmitting}
                    >
                        <ThumbsUp size={18} style={{ marginRight: '8px' }} />
                        Sustain Objection (Support User)
                    </Button>
                    <Button
                        variant="outline"
                        style={{ flex: 1, borderColor: 'var(--rust-primary)', color: 'var(--rust-primary)' }}
                        onClick={() => castVote('OVERRULE')}
                        disabled={isSubmitting}
                    >
                        <ThumbsDown size={18} style={{ marginRight: '8px' }} />
                        Overrule (Support System)
                    </Button>
                </div>
            ) : (
                <div style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <p style={{ fontWeight: 600 }}>You voted to {vote === 'SUSTAIN' ? 'SUSTAIN' : 'OVERRULE'}.</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Waiting for other witnesses...</p>
                </div>
            )}
        </div>
    );
};

export default JuryBox;
