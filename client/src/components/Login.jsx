import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate, Link } from "react-router-dom"; // Ensure react-router-dom is installed
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";


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
    gsap.to(lineRef.current, {
      width: "100%",
      duration: 0.8,
      ease: "expo.out",
    });
    gsap.to(labelRef.current, { y: -5, color: "#22d3ee", duration: 0.4 });
    gsap.to(inputRef.current, {
      x: 10,
      backgroundColor: "rgba(255,255,255,0.03)",
      duration: 0.4,
    });
  };

  const onBlur = () => {
    gsap.to(lineRef.current, { width: "0%", duration: 0.6, ease: "power2.in" });
    if (!value) {
      gsap.to(labelRef.current, {
        y: 0,
        color: "rgba(255,255,255,0.3)",
        duration: 0.4,
      });
    }
    gsap.to(inputRef.current, {
      x: 0,
      backgroundColor: "rgba(255,255,255,0.01)",
      duration: 0.4,
    });
  };

  return (
    <div className="group relative w-full mb-8">
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
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full bg-white/[0.01] border border-white/5 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-white/5"
        />
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-400"
        />
      </div>
    </div>
  );
};

const PasswordInput = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);
  const lineRef = useRef(null);
  const labelRef = useRef(null);

  const onFocus = () => {
    gsap.to(lineRef.current, {
      width: "100%",
      duration: 0.8,
      ease: "expo.out",
    });
    gsap.to(labelRef.current, { y: -5, color: "#22d3ee", duration: 0.4 });
    gsap.to(inputRef.current, {
      x: 10,
      backgroundColor: "rgba(255,255,255,0.03)",
      duration: 0.4,
    });
  };

  const onBlur = () => {
    gsap.to(lineRef.current, { width: "0%", duration: 0.6, ease: "power2.in" });
    if (!value) {
      gsap.to(labelRef.current, {
        y: 0,
        color: "rgba(255,255,255,0.3)",
        duration: 0.4,
      });
    }
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
      <div className="relative overflow-hidden rounded-lg flex items-center">
        <input
          ref={inputRef}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full bg-white/[0.01] border border-white/5 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-white/5 pr-12"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 text-white/30 hover:text-cyan-400 transition-colors z-20"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-400"
        />
      </div>
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const mainRef = useRef(null);
  const sidePanelRef = useRef(null);
  const formBoxRef = useRef(null);
  const cursorRef = useRef(null);
  const particlesRef = useRef(null);
  const dispatch = useDispatch()



  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(mainRef.current, { opacity: 1, duration: 0.1 })
        .from(sidePanelRef.current, {
          xPercent: -100,
          duration: 1.5,
          ease: "expo.inOut",
        })
        .from(
          ".stagger-text",
          { y: 60, opacity: 0, stagger: 0.1, duration: 1.2 },
          "-=0.6",
        )
        .from(
          formBoxRef.current,
          { x: 50, opacity: 0, duration: 1.2 },
          "-=0.8",
        );

      // Cursor & Particles Logic
      const moveCursor = (e) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "power2.out",
        });
        // Parallax
        const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
        gsap.to(particlesRef.current, { x: xPos, y: yPos, duration: 2 });
      };

      window.addEventListener("mousemove", moveCursor);
      return () => window.removeEventListener("mousemove", moveCursor);
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) return toast.error("Credentials required.");
      setLoading(true);
  
      const result = await axios.post(
        "http://localhost:3000/api/user/login",
        { email, password },
        { withCredentials: true },
      );
  
      console.log(result)
      console.log(result.data)
      dispatch(setUserData(result.data))
  
      setTimeout(() => {
        setLoading(false);
        toast.success("Welcome back, Commander.");
  
        // Exit Animation
        const tl = gsap.timeline();
        tl.to(sidePanelRef.current, {
          xPercent: -100,
          duration: 1,
          ease: "expo.inOut",
        })
          .to(formBoxRef.current, { opacity: 0, x: 50, duration: 0.5 }, "-=0.8")
          .to(mainRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => navigate("/"),
          });
      }, 1500);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div
      ref={mainRef}
      className="relative min-h-screen bg-[#020202] text-white overflow-hidden opacity-0 font-sans selection:bg-cyan-500 selection:text-black"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />

      {/* Cursor & Particles */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border border-cyan-400/50 rounded-full pointer-events-none z-[9999] hidden lg:block -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={particlesRef}
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* LEFT PANEL: Welcome Back */}
        <div
          ref={sidePanelRef}
          className="hidden lg:flex lg:col-span-5 bg-[#080808] border-r border-white/5 flex-col justify-between p-20 relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full" />

          <div className="relative z-10">
            <div className="stagger-text flex items-center gap-3 mb-24">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-[2px]" />
              </div>
              <span className="text-lg font-bold tracking-widest uppercase">
                Nexus OS
              </span>
            </div>

            <h1 className="stagger-text text-[7vw] font-black leading-[0.9] tracking-tighter mb-8">
              SYSTEM <br />{" "}
              <span className="text-transparent stroke-text">READY.</span>
            </h1>
            <p className="stagger-text text-white/40 text-lg max-w-sm font-light leading-relaxed">
              Resume your session. The terminal is waiting for your command.
            </p>
          </div>

          <div className="stagger-text border-t border-white/5 pt-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
              Secure Connection Established
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="lg:col-span-7 flex items-center justify-center p-8 lg:p-24 relative bg-[#050505]">
          <div ref={formBoxRef} className="w-full max-w-[420px]">
            <div className="mb-12">
              <h2 className="text-4xl font-bold tracking-tighter mb-3">
                Login
              </h2>
              <p className="text-white/40">Enter your digital fingerprint.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <ModernInput
                label="Email Identity"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="admin@nexus.systems"
              />

              <div>
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••••••"
                />
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-[10px] uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors"
                  >
                    Lost Credentials?
                  </Link>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-[60px] bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Authenticating..." : "Authenticate"}
                    {!loading && <ArrowRight size={14} />}
                  </span>
                  <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
                </button>
              </div>
            </form>

            <div className="mt-12 text-center">
              <p className="text-white/30 text-sm font-light">
                New to the system?
                <Link
                  to="/signup"
                  className="ml-2 text-white font-bold hover:text-cyan-400 transition-colors underline decoration-white/20 underline-offset-4"
                >
                  Initialize Protocol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

     <style>
  {`
    .stroke-text {
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
    }

    .ease-expo {
      transition-timing-function: cubic-bezier(0.9, 0, 0.1, 1);
    }
  `}
</style>
    </div>
  );
}
