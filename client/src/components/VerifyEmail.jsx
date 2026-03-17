import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {useDispatch} from "react-redux"
import setUserData from "../redux/userSlice"

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email || "USER@NEXUS.SYSTEMS";
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const scope = useRef(null);
  const inputsRef = useRef([]);


  const dispatch = useDispatch()
  
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        ".side-panel",
        { xPercent: 100 },
        { xPercent: 0, duration: 1.2, ease: "expo.inOut" },
      )
        .from(".reveal-text", { y: 40, opacity: 0, stagger: 0.1, duration: 1 })
        .from(
          ".digit-slot",
          {
            y: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.8,
            clearProps: "all",
          },
          "-=0.5",
        );
    }, scope);
    return () => ctx.revert();
  }, []);

  // --- NEW: Copy-Paste Logic ---
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    // Check if it's a 6-digit number
    if (!/^\d{6}$/.test(pasteData)) {
      return toast.error("Please paste a valid 6-digit code.");
    }

    const pasteArray = pasteData.split("");
    setOtp(pasteArray);

    // Visual feedback for all boxes
    gsap.fromTo(
      ".digit-slot",
      { scale: 1.05, borderColor: "#000" },
      {
        scale: 1,
        borderColor: "rgba(0,0,0,0.1)",
        duration: 0.4,
        stagger: 0.05,
      },
    );

    // Focus the last input
    inputsRef.current[5].focus();
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    gsap.fromTo(
      e.target.parentElement,
      { scale: 1.1, borderColor: "#000" },
      { scale: 1, borderColor: "rgba(0,0,0,0.1)", duration: 0.4 },
    );

    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = ""; // Clear previous field
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
   try {
     e.preventDefault();
     setLoading(true);
     const result = await axios.post(
       "http://localhost:3000/api/user/verifyEmail",
       { verificationCode: otp },
       { withCredentials: true },
     );
     console.log(result)
     navigate("/")
     dispatch(setUserData(result.data))
     setLoading(false)
     toast.success("Account Created Successfully")
   } catch (error) {
    console.log(error)
    toast.error(error)
   }
  };

  return (
    <div
      ref={scope}
      className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden font-mono"
    >
      <Toaster position="bottom-left" />

      {/* LEFT SIDE: Brand Space */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-24 relative">
        <div className="relative z-10">
          <p className="reveal-text text-cyan-500 tracking-[1em] text-[10px] mb-4">
            SECURITY PROTOCOL
          </p>
          <h1 className="reveal-text text-[8vw] font-black leading-none tracking-tighter">
            NODE <br />{" "}
            <span className="text-transparent stroke-white">AUTH</span>
          </h1>
          <p className="reveal-text text-white/20 max-w-sm mt-8 font-sans text-sm leading-relaxed">
            Verification required. Enter the 6-digit key sent to your terminal.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Panel */}
      <div className="side-panel w-full lg:w-[500px] bg-white text-black p-12 lg:p-20 flex flex-col justify-center relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Verify
          </h2>
          <div className="h-1 w-12 bg-black mb-6" />
          <p className="text-black/40 text-xs font-sans">
            Recipient: <span className="text-black font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-6 gap-2">
            {otp.map((data, index) => (
              <div
                key={index}
                className="digit-slot h-16 bg-black/[0.03] border border-black/10 rounded-lg focus-within:border-black focus-within:bg-transparent transition-all overflow-hidden"
              >
                <input
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={data}
                  // Attach paste to all or specifically the first box
                  onPaste={handlePaste}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-full bg-transparent text-center text-2xl font-black outline-none"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full h-16 bg-black text-white group relative overflow-hidden flex items-center justify-center transition-transform active:scale-95"
          >
            <span className="relative z-10 font-black uppercase tracking-[0.3em] text-[10px]">
              {loading ? "Decrypting..." : "Confirm Identity"}
            </span>
            <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

          <div className="flex justify-between items-center mt-10 text-[10px] tracking-widest text-black/20 uppercase font-bold">
            <span>Secure SSL-256</span>
            <button className="text-black hover:text-cyan-600 transition-colors">
              Resend Code
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .stroke-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}