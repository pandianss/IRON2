import React from 'react';
import { Award, CheckCircle2, Calendar, Building2 } from 'lucide-react';

const CertificateCard = ({ title, issuer, issueDate, id, verified }) => {
    return (
        <div className="relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-lg transition-transform hover:scale-[1.02]">
            {/* Decorative Metallic Sheen */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-transparent blur-2xl"></div>

            <div className="relative z-10 flex items-start gap-4">
                {/* Icon Box */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                    <Award className="text-yellow-500" size={24} />
                </div>

                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-white text-lg leading-tight tracking-wide mb-1">
                                {title}
                            </h3>
                            <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-semibold tracking-wider uppercase">
                                <Building2 size={12} />
                                <span>{issuer}</span>
                            </div>
                        </div>
                        {verified && (
                            <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-bold text-green-400 border border-green-500/20">
                                <CheckCircle2 size={12} />
                                VERIFIED
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="my-4 h-px w-full bg-gradient-to-r from-yellow-500/20 to-transparent"></div>

                    {/* details */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-xs text-zinc-500 font-medium">CREDENTIAL ID</p>
                            <p className="text-xs text-zinc-300 font-mono tracking-wider">{id}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Calendar size={14} />
                            <span>Issued: {issueDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateCard;
