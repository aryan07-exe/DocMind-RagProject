import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import bgImage from "./images/bg5.jpg";

export default function Login() {
  const navigate = useNavigate();
  const API = "http://localhost:8000";
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Background animation
    gsap.to(bgRef.current, {
      scale: 1.1,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Content entrance
    tl.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
      .fromTo(formRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.5"
      );
  }, []);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.target);

    try {
      const res = await fetch(
        `${API}/auth/login?email=${form.get("email")}&password=${form.get("password")}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.token) {
        // Success animation before navigation
        await gsap.to(containerRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in"
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        navigate("/dashboard");
      } else {
        // Shake animation on failure
        gsap.to(containerRef.current, {
          x: [-10, 10, -10, 10, 0],
          duration: 0.4,
          ease: "power2.inOut"
        });
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Dynamic Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Tech Overlay Grid */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }}
      />

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/20" />

      <div
        ref={containerRef}
        className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10 mx-4 border border-white/10 shadow-[0_0_50px_-10px_rgba(6,182,212,0.15)] backdrop-blur-2xl bg-slate-900/60"
      >
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-300 mb-3 tracking-tighter font-display drop-shadow-sm">
            Neural<span className="text-cyan-400">Gate</span>
          </h2>
          <div className="flex items-center justify-center gap-3 opacity-60">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
            <p className="text-cyan-400 text-[10px] tracking-[0.2em] uppercase font-mono">Secure Access Terminal</p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
          </div>
        </div>

        <form ref={formRef} onSubmit={login} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-xs font-semibold text-cyan-500/80 uppercase tracking-widest ml-1 group-focus-within:text-cyan-400 transition-colors">
              Identity Protocol (Email)
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 p-4 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-700 font-mono text-sm"
                placeholder="user@neural.net"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-semibold text-cyan-500/80 uppercase tracking-widest ml-1 group-focus-within:text-cyan-400 transition-colors">
              Security Key (Password)
            </label>
            <div className="relative">
              <input
                name="password"
                type="password"
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 p-4 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-700 font-mono text-sm"
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="tracking-wider">AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span className="tracking-wider">INITIATE SESSION</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
          <p className="text-slate-500 text-xs uppercase tracking-wide">
            New to the network?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold hover:underline transition-colors ml-1"
            >
              ESTABLISH UPLINK
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
