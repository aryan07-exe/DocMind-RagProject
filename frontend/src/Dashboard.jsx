import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import bgImage from "./images/bg5.jpg";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import ProfileModal from "./components/ProfileModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const API = "http://localhost:8000";
  const username = localStorage.getItem("name") || "User";
  const userEmail = localStorage.getItem("email") || "user@neural.net";
  const userId = localStorage.getItem("user_id");
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Chat Management States
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState("");

  // Profile States
  const [showProfile, setShowProfile] = useState(false);
  const [userDocuments, setUserDocuments] = useState([]);
  const [fetchingDocs, setFetchingDocs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  if (!userId) navigate("/login");

  // Initial Entrance Animation
  useEffect(() => {
    const tl = gsap.timeline();

    if (sidebarRef.current && mainRef.current) {
      tl.fromTo(sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(mainRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
    }

    fetchChats();
  }, []);

  // Profile Modal Data Fetching
  useEffect(() => {
    if (showProfile) {
      fetchDocuments();
    }
  }, [showProfile]);

  const scrollToBottom = (instant = false) => {
    if (instant && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();

    // Animate new message
    if (messages.length > 0 && chatContainerRef.current) {
      const lastMsg = chatContainerRef.current.lastElementChild;
      if (lastMsg) {
        gsap.fromTo(lastMsg,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.2)" }
        );
      }
    }
  }, [messages]);

  async function fetchDocuments() {
    setFetchingDocs(true);
    try {
      const res = await fetch(`${API}/documents?user_id=${userId}`);
      const data = await res.json();
      setUserDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setFetchingDocs(false);
    }
  }

  async function deleteDocument(filename) {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const res = await fetch(`${API}/documents/delete?user_id=${userId}&filename=${filename}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.status === "deleted") {
        setUserDocuments((prev) => prev.filter((doc) => doc !== filename));
      } else {
        alert("Failed to delete document");
      }
    } catch (error) {
      console.error("Failed to delete document", error);
      alert("Error deleting document");
    }
  }

  // Chat Functions
  async function fetchChats() {
    setLoadingChats(true);
    try {
      const res = await fetch(`${API}/chat/list?user_id=${userId}`);
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    } finally {
      setLoadingChats(false);
    }
  }

  async function createNewChat() {
    try {
      const res = await fetch(`${API}/chat/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      setChats((prev) => [data, ...prev]);
      loadChat(data.chat_id);
      if (window.innerWidth < 1024) setMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to create new chat", error);
    }
  }

  async function loadChat(chatId) {
    if (currentChatId === chatId) return; // Don't reload if already active

    setCurrentChatId(chatId);
    setLoading(true);
    setMessages([]); // Clear previous messages immediately for smoother feel

    try {
      const res = await fetch(`${API}/chat/${chatId}`);
      const data = await res.json();

      // Transform backend messages to frontend format
      const formattedMessages = data.map(msg => ({
        role: msg.role === "assistant" ? "ai" : msg.role,
        text: msg.content,
        timestamp: msg.timestamp,
        animate: false // Don't animate loaded messages
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load chat", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteChat(e, chatId) {
    e.stopPropagation(); // Prevent triggering loadChat
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      const res = await fetch(`${API}/chat/delete?user_id=${userId}&chat_id=${chatId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setChats((prev) => prev.filter(c => c.chat_id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  }

  async function startRenaming(e, chat) {
    e.stopPropagation();
    setEditingChatId(chat.chat_id);
    setNewChatTitle(chat.title);
  }

  async function renameChat(e, chatId) {
    e.preventDefault();
    e.stopPropagation();
    if (!newChatTitle.trim()) return;

    try {
      const res = await fetch(`${API}/chat/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          chat_id: chatId,
          new_title: newChatTitle
        }),
      });

      if (res.ok) {
        setChats((prev) => prev.map(c =>
          c.chat_id === chatId ? { ...c, title: newChatTitle } : c
        ));
        setEditingChatId(null);
      }
    } catch (error) {
      console.error("Failed to rename chat", error);
    }
  }

  async function uploadDoc(e) {
    e.preventDefault();

    if (!file) return alert("Choose a file!");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`${API}/upload?user_id=${userId}`, {
        method: "POST",
        body: formData,
      });
      alert("Document uploaded successfully!");
      if (showProfile) fetchDocuments(); // Refresh list if profile is open
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function askQuestion(e) {
    e.preventDefault();
    if (!question.trim()) return;
    if (!currentChatId) {
      alert("Please select a chat or create a new one.");
      return;
    }

    const userMsg = { role: "user", text: question, animate: false };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          chat_id: currentChatId,
          question: userMsg.text
        }),
      });

      const data = await res.json();
      const aiMsg = { role: "ai", text: data.answer, animate: true }; // Animate new AI responses
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      alert("Failed to get answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative flex">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        loadingChats={loadingChats}
        createNewChat={createNewChat}
        loadChat={loadChat}
        deleteChat={deleteChat}
        startRenaming={startRenaming}
        renameChat={renameChat}
        editingChatId={editingChatId}
        newChatTitle={newChatTitle}
        setNewChatTitle={setNewChatTitle}
        setEditingChatId={setEditingChatId}
        username={username}
        userEmail={userEmail}
        onOpenProfile={() => setShowProfile(true)}
        onLogout={() => {
          localStorage.clear();
          navigate("/login");
        }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        sidebarRef={sidebarRef}
      />

      {/* Main Chat Area */}
      <div ref={mainRef} className="flex-1 relative z-10 h-screen flex flex-col">
        <ChatArea
          messages={messages}
          loading={loading}
          question={question}
          setQuestion={setQuestion}
          askQuestion={askQuestion}
          currentChatId={currentChatId}
          chatTitle={chats.find(c => c.chat_id === currentChatId)?.title}
          scrollToBottom={scrollToBottom}
          chatContainerRef={chatContainerRef}
          messagesEndRef={messagesEndRef}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        username={username}
        userEmail={userEmail}
        userId={userId}
        userDocuments={userDocuments}
        fetchingDocs={fetchingDocs}
        uploadDoc={uploadDoc}
        deleteDocument={deleteDocument}
        file={file}
        setFile={setFile}
        uploading={uploading}
      />
    </div>
  );
}
