
import React, { useState } from 'react';
import { X, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';
import { PartnerService } from '../../../services/social/PartnerService';
import { useAuth } from '../../../app/context/AuthContext';
import { useUI } from '../../../app/context/UIContext';
import Button from '../../../components/UI/Button';

const InvitePartnerModal = ({ onClose, onSuccess }) => {
    const { currentUser } = useAuth();
    const { showToast } = useUI();

    const [mode, setMode] = useState('menu'); // 'menu', 'invite', 'join'
    const [inviteCode, setInviteCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerateCode = async () => {
        setIsLoading(true);
        try {
            const code = await PartnerService.generateInviteCode(currentUser);
            setInviteCode(code);
            setMode('invite');
        } catch (error) {
            console.error(error);
            showToast("Failed to generate code.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!inputCode || inputCode.length !== 6) {
            showToast("Please enter a valid 6-digit code.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await PartnerService.acceptInvite(inputCode, currentUser);
            showToast(`Pact formed with ${result.partnerName}!`);
            onSuccess(); // Close and Refresh
        } catch (error) {
            console.error(error);
            showToast(error.message || "Failed to join.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!inviteCode) return;
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast("Code copied to clipboard");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">

                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="text-white font-bold">Accountability Pact</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {mode === 'menu' && (
                        <div className="space-y-4">
                            <p className="text-zinc-400 text-sm text-center mb-6">
                                Find a partner to keep you honest. <br />
                                <span className="text-zinc-500 text-xs">Only 1 partner allowed. Choose wisely.</span>
                            </p>

                            <Button
                                fullWidth
                                variant="primary"
                                onClick={handleGenerateCode}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'GENERATE INVITE CODE'}
                            </Button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-zinc-800"></div>
                                <span className="flex-shrink mx-4 text-zinc-600 text-xs">OR</span>
                                <div className="flex-grow border-t border-zinc-800"></div>
                            </div>

                            <Button
                                fullWidth
                                variant="secondary"
                                onClick={() => setMode('join')}
                            >
                                ENTER FRIEND'S CODE
                            </Button>
                        </div>
                    )}

                    {mode === 'invite' && (
                        <div className="text-center">
                            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Share this code</p>

                            <div
                                onClick={copyToClipboard}
                                className="bg-black border border-zinc-700 rounded-xl p-6 mb-6 cursor-pointer hover:border-orange-500/50 transition-colors group relative"
                            >
                                <div className="text-4xl font-mono font-bold text-orange-500 tracking-[0.2em] pl-1">
                                    {inviteCode}
                                </div>
                                <div className="absolute top-2 right-2 text-zinc-600 group-hover:text-zinc-400">
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </div>
                            </div>

                            <p className="text-zinc-500 text-xs mb-6">
                                Provide this code to your partner.<br />
                                Once they enter it, your pact begins.
                            </p>

                            <Button variant="ghost" size="small" onClick={() => setMode('menu')}>
                                Back
                            </Button>
                        </div>
                    )}

                    {mode === 'join' && (
                        <div>
                            <p className="text-zinc-400 text-sm mb-4">Enter the code from your partner:</p>

                            <input
                                type="text"
                                placeholder="XXXXXX"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-center font-mono text-2xl text-white focus:border-orange-500 outline-none mb-6 placeholder-zinc-800"
                            />

                            <Button
                                fullWidth
                                variant="primary"
                                onClick={handleJoin}
                                disabled={isLoading || inputCode.length < 6}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin" /> JOINING...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        CONFIRM PACT <ArrowRight size={16} />
                                    </span>
                                )}
                            </Button>

                            <div className="mt-4 text-center">
                                <button onClick={() => setMode('menu')} className="text-zinc-600 text-xs hover:text-white">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvitePartnerModal;
