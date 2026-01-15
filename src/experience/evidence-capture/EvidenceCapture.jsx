import React, { useRef, useState } from 'react';
import { Camera, Upload, ArrowLeft, Loader2 } from 'lucide-react';

export const EvidenceCapture = ({ onBack, onSubmit, isSubmitting }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    if (isSubmitting) {
        return (
            <div className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-white mb-4" size={48} />
                <div className="text-sm font-mono text-slate-400 tracking-widest uppercase">
                    Hashing to Ledger...
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="p-6 flex items-center gap-4">
                <button onClick={onBack} className="text-slate-500 hover:text-white">
                    <ArrowLeft />
                </button>
                <div className="text-xs font-mono text-slate-500 uppercase">
                    Evidence Protocol
                </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 bg-slate-900 m-4 rounded-lg overflow-hidden relative flex items-center justify-center border border-slate-800">
                {preview ? (
                    <img src={preview} alt="Evidence" className="w-full h-full object-contain" />
                ) : (
                    <div className="text-slate-600 flex flex-col items-center gap-2">
                        <Camera size={48} />
                        <span className="text-xs">NO ARTIFACT</span>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-6 pb-12">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFile}
                    accept="image/*"
                    className="hidden"
                />

                {preview ? (
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Activity Label (e.g. Leg Day, Run, Cardio)"
                            className="bg-slate-800 text-white p-4 rounded border border-slate-700 focus:border-emerald-500 outline-none font-mono text-sm"
                            onChange={(e) => fileInputRef.current.tagValue = e.target.value} // HACK: Storing on ref to avoid re-render loop if using state carelessly, or just use state.
                        />
                        <button
                            onClick={() => onSubmit(selectedFile, fileInputRef.current.tagValue || "General")}
                            className="w-full h-16 bg-emerald-500 text-black font-black tracking-widest rounded hover:bg-emerald-400 transition-colors"
                        >
                            COMMIT EVIDENCE
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="h-16 bg-slate-800 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                        >
                            <Upload size={20} />
                            UPLOAD
                        </button>
                        <button
                            onClick={() => fileInputRef.current.click()} // Mobile will trigger cam choice
                            className="h-16 bg-white text-black font-bold rounded flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                        >
                            <Camera size={20} />
                            CAMERA
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
