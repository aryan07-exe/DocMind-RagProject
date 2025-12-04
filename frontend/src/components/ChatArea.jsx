import React from 'react';
import Typewriter from './Typewriter';

export default function ChatArea({
    messages,
    loading,
    question,
    setQuestion,
    askQuestion,
    currentChatId,
    chatTitle,
    scrollToBottom,
    chatContainerRef,
    messagesEndRef,
    setMobileMenuOpen
}) {
    return (
        <div className={`flex-1 flex flex-col h-full relative transition-all duration-500 ${loading ? 'thinking-state' : ''}`}>
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Chat Header */}
                <div className="absolute top-0 left-0 right-0 z-30 px-6 py-4 glass-panel border-b-0 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors -ml-2 rounded-lg hover:bg-white/5"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${currentChatId ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                            <h2 className="text-sm font-bold text-slate-200 tracking-wide font-display">
                                {chatTitle || "New Session"}
                            </h2>
                        </div>
                    </div>
                    {loading && (
                        <div className="flex items-center gap-3 bg-cyan-950/30 px-3 py-1.5 rounded-full border border-cyan-500/20">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest animate-pulse">
                                Processing
                            </span>
                            <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto pt-20 pb-32 px-4 sm:px-8 space-y-8 custom-scrollbar scroll-smooth">
                    {messages.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-8 animate-fade-in-up">
                            <div className="w-24 h-24 rounded-3xl bg-slate-900/50 border border-white/5 flex items-center justify-center relative group animate-float">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-2xl group-hover:bg-cyan-500/30 transition-all duration-500"></div>
                                <svg className="w-10 h-10 text-slate-500 group-hover:text-cyan-400 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-xl font-bold text-slate-200 font-display">System Ready</h3>
                                <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Awaiting Input</p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                            <div
                                className={`${msg.role === "user"
                                    ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-cyan-900/20 border border-white/10"
                                    : "glass-card text-slate-200 rounded-2xl rounded-tl-sm"
                                    } px-6 py-5 max-w-[85%] sm:max-w-[75%] relative group`}
                            >
                                {msg.role === "ai" && (
                                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-lg bg-slate-800/50 border border-white/5 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                )}

                                {msg.role === "ai" ? (
                                    <div className="leading-relaxed text-sm sm:text-base font-light tracking-wide">
                                        <Typewriter
                                            text={msg.text}
                                            animate={msg.animate}
                                            scrollToBottom={scrollToBottom}
                                        />
                                    </div>
                                ) : (
                                    <p className="leading-relaxed text-sm sm:text-base font-medium">{msg.text}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start pl-12">
                            <div className="glass-card px-6 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Floating Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-20">
                    <div className="max-w-4xl mx-auto relative">
                        <div className="relative flex items-end gap-2 glass-panel rounded-2xl p-2 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all shadow-2xl shadow-cyan-900/5">
                            <textarea
                                rows="1"
                                value={question}
                                onChange={(e) => {
                                    setQuestion(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        askQuestion(e);
                                    }
                                }}
                                placeholder={currentChatId ? "Type your message..." : "Select a chat to begin..."}
                                className="flex-1 bg-transparent border-0 text-slate-200 placeholder-slate-500 focus:ring-0 resize-none py-3 px-4 max-h-32 custom-scrollbar text-sm sm:text-base font-light"
                                disabled={!currentChatId}
                                style={{ minHeight: '48px' }}
                            ></textarea>
                            <button
                                onClick={askQuestion}
                                disabled={loading || !question.trim() || !currentChatId}
                                className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mb-[2px] mr-[2px] hover:scale-105 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex justify-center mt-3">
                            <p className="text-[10px] text-slate-500 font-mono opacity-60 hover:opacity-100 transition-opacity">
                                AI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
