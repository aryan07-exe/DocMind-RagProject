import React from 'react';

export default function Sidebar({
    chats,
    currentChatId,
    loadingChats,
    createNewChat,
    loadChat,
    deleteChat,
    startRenaming,
    renameChat,
    editingChatId,
    newChatTitle,
    setNewChatTitle,
    setEditingChatId,
    username,
    userEmail,
    onOpenProfile,
    onLogout,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarRef
}) {
    return (
        <>
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div
                ref={sidebarRef}
                className={`fixed lg:static inset-y-0 left-0 w-[280px] glass-panel border-r border-white/5 transform transition-transform duration-300 ease-in-out z-50 lg:transform-none lg:z-0 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Sidebar Header / Logo Area */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3 group cursor-pointer mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center font-bold text-white border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold gradient-text tracking-tight font-display">
                                NeuralGate
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">AI Interface v2.0</span>
                        </div>
                    </div>

                    <button
                        onClick={createNewChat}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all shadow-lg shadow-cyan-500/20 group border border-white/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="font-bold text-sm tracking-wide">New Chat</span>
                    </button>
                </div>

                {/* Chat History List */}
                <div className="flex-1 overflow-hidden flex flex-col p-4 pt-2">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        History
                    </h2>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                        {loadingChats ? (
                            <div className="flex justify-center py-8">
                                <svg className="animate-spin h-5 w-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : chats.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <p className="text-xs text-slate-500 font-mono">No chat history</p>
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat.chat_id}
                                    onClick={() => {
                                        loadChat(chat.chat_id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${currentChatId === chat.chat_id
                                        ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                        : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                        }`}
                                >
                                    {currentChatId === chat.chat_id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-full"></div>
                                    )}

                                    <div className="flex items-center gap-3 overflow-hidden pl-2 flex-1">
                                        {editingChatId === chat.chat_id ? (
                                            <form onSubmit={(e) => renameChat(e, chat.chat_id)} className="flex-1 mr-2">
                                                <input
                                                    type="text"
                                                    value={newChatTitle}
                                                    onChange={(e) => setNewChatTitle(e.target.value)}
                                                    onBlur={() => setEditingChatId(null)}
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                                />
                                            </form>
                                        ) : (
                                            <div className="truncate text-xs font-medium">
                                                {chat.title || "New Conversation"}
                                                <div className="text-[10px] opacity-40 font-mono mt-0.5">{new Date(chat.created_at).toLocaleDateString()}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={(e) => startRenaming(e, chat)}
                                            className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-lg transition-all"
                                            title="Rename Chat"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => deleteChat(e, chat.chat_id)}
                                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                                            title="Delete Chat"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* User Profile Section (Bottom) */}
                <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group" onClick={onOpenProfile}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                {username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-sm font-bold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">{username}</span>
                                <span className="text-[10px] text-cyan-500/80 font-mono truncate">{userEmail}</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onLogout();
                            }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
