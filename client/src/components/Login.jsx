import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

// --- Left Side: Interactive Art Component ---
const ArtisticBackground = () => {
  const containerRef = useRef(null);
  const shapesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mouse move effect
      const onMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 50;
        const yPos = (clientY / window.innerHeight - 0.5) * 50;

        // Parallax effect on shapes
        gsap.to(shapesRef.current, {
          x: (i) => xPos * (i + 1) * 0.5,
          y: (i) => yPos * (i + 1) * 0.5,
          duration: 1,
          ease: "power2.out",
          stagger: 0.1,
        });
      };

      window.addEventListener("mousemove", onMouseMove);

      // Floating animation
      shapesRef.current.forEach((shape, i) => {
        gsap.to(shape, {
          rotation: "random(-20, 20)",
          y: "random(-30, 30)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      return () => window.removeEventListener("mousemove", onMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !shapesRef.current.includes(el)) {
      shapesRef.current.push(el);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-black" />
      
      {/* Abstract Shapes */}
      <div ref={addToRefs} className="absolute w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 top-1/4 left-1/4" />
      <div ref={addToRefs} className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 bottom-1/4 right-1/4" />
      <div ref={addToRefs} className="absolute w-40 h-40 bg-pink-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20 top-1/2 left-1/2" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

      <div className="relative z-10 text-center p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
            Elevate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Your Vision.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            Join a community of creators and innovators building the future of digital experiences.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// --- Custom Floating Input Component ---
const InputField = ({ label, type, value, onChange, icon }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="relative mb-6 group">
      <div className={`absolute left-0 top-3.5 transition-colors duration-300 ${focused ? "text-indigo-400" : "text-zinc-500"}`}>
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-b border-zinc-800 py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all duration-300 placeholder-transparent z-10 relative"
        placeholder={label} // Required for floating label trick
        id={label}
        required
      />
      <label
        htmlFor={label}
        className={`absolute left-10 transition-all duration-300 pointer-events-none
          ${focused || value 
            ? "-top-2.5 text-xs text-indigo-400" 
            : "top-3.5 text-sm text-zinc-500"
          }`}
      >
        {label}
      </label>
      {/* Background glow on focus */}
      <div className={`absolute bottom-0 left-0 h-[1px] w-full bg-indigo-500 origin-left transform transition-transform duration-500 ${focused ? "scale-x-100" : "scale-x-0"}`} />
    </div>
  );
};

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();
  
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        navigate("/");
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-zinc-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">Success!</p>
                  <p className="mt-1 text-sm text-zinc-400">Welcome back to the platform.</p>
                </div>
              </div>
            </div>
          </div>
        ));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // UI Variants for animation
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    // Main Container - Full Viewport
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#050505] font-sans">
      
      {/* LEFT: Artistic Side (Hidden on mobile, 50% on desktop) */}
      <div className="hidden md:block md:w-1/2 relative">
        <ArtisticBackground />
      </div>

      {/* RIGHT: Form Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-32 relative bg-[#050505]">
        
        {/* Back Button */}
        <button 
          onClick={() => setShowLogin(false)}
          className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 border border-zinc-800">
               <Sparkles className="text-indigo-500" size={20} />
            </div>
            <h2 className="text-3xl font-semibold text-white tracking-tight">
              {state === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-zinc-500 mt-2">
              {state === "login" 
                ? "Enter your details to access your account." 
                : "It's free and takes less than a minute."}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {state === "register" && (
                  <InputField 
                    label="Full Name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    icon={<div className="w-4" />} // Placeholder icon or real icon
                  />
                )}
                
                <InputField 
                  label="Email Address" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<div className="w-4" />}
                />
                
                <InputField 
                  label="Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<div className="w-4" />}
                />
              </motion.div>
            </AnimatePresence>

            {/* Toggle Link */}
            <div className="flex items-center justify-between mt-8 mb-8">
              <p className="text-sm text-zinc-500">
                {state === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setState(state === "login" ? "register" : "login")}
                  className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  {state === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {state === "register" ? "Get Started" : "Continue"}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer Credit (Optional) */}
        <div className="absolute bottom-6 left-0 w-full text-center md:text-left md:px-32">
          <p className="text-xs text-zinc-700">© 2024 Your Brand Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;