import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function ProfileModal({
    isOpen,
    onClose,
    username,
    userEmail,
    userId,
    userDocuments,
    fetchingDocs,
    uploadDoc,
    deleteDocument,
    file,
    setFile,
    uploading
}) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.95, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div
                ref={modalRef}
                className="glass-panel rounded-2xl w-full max-w-2xl relative overflow-hidden border border-white/10 shadow-2xl"
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 font-display tracking-tight">User Profile</h2>
                            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Identity & Assets</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-8">
                    {/* User Details */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">User Identity</h3>
                        <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/20">
                                {username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-100 font-display">{username}</p>
                                <p className="text-sm text-slate-400 font-mono mb-2">{userEmail}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">ID:</span>
                                    <code className="text-xs font-mono text-cyan-400/90 bg-cyan-950/30 px-2 py-1 rounded-md border border-cyan-500/20">{userId}</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document Management */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Knowledge Base</h3>

                        {/* Upload Section */}
                        <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-300">Add New Document</span>
                                <span className="text-[10px] text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded-full border border-cyan-500/20 font-bold tracking-wide">PDF / TXT</span>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative flex-1 group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                    <input
                                        type="file"
                                        className="relative w-full text-xs text-slate-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer border border-slate-700/50 rounded-xl bg-slate-900/90 focus:outline-none focus:border-cyan-500/50 transition-all font-mono py-2 px-3"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                                <button
                                    onClick={uploadDoc}
                                    disabled={uploading || !file}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                    title="Upload"
                                >
                                    {uploading ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 px-1">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Managed Documents</h3>
                            <span className="text-xs text-slate-500 font-mono bg-slate-800/50 px-2 py-0.5 rounded">{userDocuments.length} FILES</span>
                        </div>

                        <div className="bg-slate-950/40 rounded-2xl border border-white/5 overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar">
                            {fetchingDocs ? (
                                <div className="p-8 flex flex-col items-center justify-center text-slate-500 gap-3">
                                    <svg className="animate-spin h-6 w-6 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-xs font-mono">Retrieving Index...</span>
                                </div>
                            ) : userDocuments.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No documents found in your knowledge base.
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {userDocuments.map((doc, idx) => (
                                        <div key={idx} className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors border border-white/5 group-hover:border-cyan-500/30">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-slate-300 truncate font-mono">{doc}</span>
                                            </div>
                                            <button
                                                onClick={() => deleteDocument(doc)}
                                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Document"
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

                {/* Modal Footer */}
                <div className="p-4 bg-white/5 border-t border-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
