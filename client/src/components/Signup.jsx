import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// --- Sub-Component: Fixed Animated Input Field ---
const ModernInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  const inputRef = useRef(null);
  const lineRef = useRef(null);
  const labelRef = useRef(null);

  const onFocus = () => {
    gsap.to(lineRef.current, { width: "100%", duration: 0.8, ease: "expo.out" });
    gsap.to(labelRef.current, { y: -5, color: "#22d3ee", duration: 0.4 });
    gsap.to(inputRef.current, {
      x: 10,
      backgroundColor: "rgba(255,255,255,0.03)",
      duration: 0.4,
    });
  };

  const onBlur = () => {
    gsap.to(lineRef.current, { width: "0%", duration: 0.6, ease: "power2.in" });
    gsap.to(labelRef.current, { y: 0, color: "rgba(255,255,255,0.3)", duration: 0.4 });
    gsap.to(inputRef.current, {
      x: 0,
      backgroundColor: "rgba(255,255,255,0.01)",
      duration: 0.4,
    });
  };

  return (
    <div className="group relative w-full mb-6">
      <label
        ref={labelRef}
        className="block text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2 ml-1 transition-all"
      >
        {label}
      </label>
      <div className="relative overflow-hidden rounded-lg">
        <input
          ref={inputRef}
          type={type}
          value={value}
          // FIXED: Passing the value directly to the handler passed from parent
          onChange={(e) => onChange(e.target.value)} 
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full bg-white/[0.01] border border-white/5 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-white/10"
          required
        />
        <div ref={lineRef} className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-400" />
      </div>
    </div>
  );
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const mainRef = useRef(null);
  const sidePanelRef = useRef(null);
  const formBoxRef = useRef(null);
  const cursorRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(mainRef.current, { opacity: 1, duration: 0.5 })
        .from(sidePanelRef.current, { xPercent: -100, duration: 1.8, ease: "expo.inOut" })
        .from(".stagger-text", { y: 50, opacity: 0, stagger: 0.1, duration: 1.2 }, "-=0.8")
        .from(formBoxRef.current, { x: 100, opacity: 0, duration: 1.2 }, "-=1");

      const moveCursor = (e) => {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.5 });
      };
      
      const moveParticles = (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
        gsap.to(particlesRef.current, { x: xPos, y: yPos, duration: 2 });
      };

      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("mousemove", moveParticles);
      return () => {
        window.removeEventListener("mousemove", moveCursor);
        window.removeEventListener("mousemove", moveParticles);
      };
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    const fullname = `${firstName} ${lastName}`;
    
    try {
      const result = await axios.post(
        "http://localhost:3000/api/user/signup",
        { fullname, email, password },
        { withCredentials: true }
      );
      
      toast.success("Identity Created. Check your email.");
      
      gsap.to(mainRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        onComplete: () => navigate("/verifyemail", { state: { email } }),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Protocol failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#020202] text-white overflow-hidden opacity-0 font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

      {/* Floating Cursor - Ensure it doesn't block clicks */}
      <div ref={cursorRef} className="fixed w-8 h-8 border border-cyan-400/50 rounded-full pointer-events-none z-[9999] hidden lg:block -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />

      {/* Particles - Ensure pointer-events-none */}
      <div ref={particlesRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, boxShadow: "0 0 10px white" }}
          />
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* LEFT PANEL */}
        <div ref={sidePanelRef} className="hidden lg:flex lg:col-span-5 bg-[#080808] border-r border-white/5 flex-col justify-between p-20 relative">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-cyan-900/10 blur-[150px] rounded-full" />
          <div className="relative">
            <div className="stagger-text flex items-center gap-4 mb-32">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center rotate-12 transition-transform duration-500 hover:rotate-0">
                <div className="w-4 h-4 bg-black rounded-sm" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Car Rental</span>
            </div>
            <h1 className="stagger-text text-[8vw] font-black leading-[0.85] tracking-tighter mb-10">
              JOIN THE <br /> <span className="text-transparent stroke-text">FUTURE.</span>
            </h1>
          </div>
          <p className="stagger-text text-[10px] uppercase tracking-[0.5em] text-white/20">Protocol v.4.0.2</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-7 flex items-center justify-center p-8 lg:p-24 relative bg-[#050505]">
          <div ref={formBoxRef} className="w-full max-w-[420px]">
            <div className="mb-12">
              <h2 className="text-5xl font-bold tracking-tighter mb-4">Create Your Account</h2>
              <p className="text-white/30">Secure your digital fingerprint to continue.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernInput label="First Name" value={firstName} onChange={setFirstName} placeholder="Jane" />
                <ModernInput label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" />
              </div>
              <ModernInput label="Email" type="email" value={email} onChange={setEmail} placeholder="jane@nexus.systems" />
              <ModernInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

              <div className="py-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-[64px] bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                >
                  <span className="relative z-10">{loading ? "Synchronizing..." : "Initiate Protocol"}</span>
                  <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2); }
        .ease-expo { transition-timing-function: cubic-bezier(0.9, 0, 0.1, 1); }
      `}</style>
    </div>
  );
}