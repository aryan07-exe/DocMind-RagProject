import React, { useRef, useState } from 'react';
import gsap from 'gsap';

export default function RightPanel({
    username,
    userEmail,
    userId,
    userDocuments,
    fetchingDocs,
    uploadDoc,
    deleteDocument,
    file,
    setFile,
    uploading,
    onLogout,
    isOpen,
    setIsOpen
}) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <>
            {/* Mobile Toggle (Visible only on mobile when closed) */}
            <button
                onClick={() => setIsOpen(true)}
                className={`lg:hidden fixed top-4 right-4 z-40 p-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-lg text-slate-400 ${isOpen ? 'hidden' : 'block'}`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`
                fixed lg:static inset-y-0 right-0 w-[300px] bg-slate-950/50 backdrop-blur-xl border-l border-white/5 
                flex flex-col z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                {/* Header / Profile */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">System Status</h2>
                        <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                            DISCONNECT
                        </button>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
                            {username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-sm font-bold text-slate-200 truncate">{username}</h3>
                            <p className="text-[10px] text-slate-500 font-mono truncate">{userEmail}</p>
                        </div>
                    </div>
                </div>

                {/* Knowledge Base Section */}
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Knowledge Base
                        </h2>
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                            {userDocuments.length}
                        </span>
                    </div>

                    {/* Upload Area */}
                    <div
                        className={`
                            relative border-2 border-dashed rounded-xl p-6 mb-6 transition-all duration-300
                            flex flex-col items-center justify-center text-center gap-3 group cursor-pointer
                            ${isDragging
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50'
                            }
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        <div className={`
                            w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center transition-transform duration-300
                            ${isDragging ? 'scale-110 bg-cyan-500/20' : 'group-hover:scale-110'}
                        `}>
                            {uploading ? (
                                <svg className="animate-spin w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-300">
                                {file ? file.name : "Upload Document"}
                            </p>
                            <p className="text-[10px] text-slate-500">
                                {file ? "Ready to process" : "Drag & drop or click to browse"}
                            </p>
                        </div>

                        {file && !uploading && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    uploadDoc(e);
                                }}
                                className="absolute inset-x-4 bottom-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all animate-fade-in-up"
                            >
                                Process File
                            </button>
                        )}
                    </div>

                    {/* Documents List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                        {fetchingDocs ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                <div className="w-1 h-12 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse"></div>
                                <span className="text-[10px] text-slate-500 font-mono">SYNCING DATA...</span>
                            </div>
                        ) : userDocuments.length === 0 ? (
                            <div className="text-center py-8 opacity-50">
                                <p className="text-xs text-slate-500">No documents indexed</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {userDocuments.map((doc, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-3 bg-slate-900/50 border border-white/5 rounded-lg hover:border-cyan-500/30 transition-all">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-xs font-medium text-slate-300 truncate">{doc}</span>
                                                <span className="text-[10px] text-slate-600 font-mono">INDEXED</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteDocument(doc)}
                                            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-950/30 rounded transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
