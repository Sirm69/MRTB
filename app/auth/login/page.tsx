"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogIn, ArrowRight, Loader2, Eye, EyeOff, XCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const brandGreen = "#066936";
  const accentYellow = "#d8f22f";

  const [logoError, setLogoError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        const storage = rememberMe ? localStorage : sessionStorage;

        if (data.access_token) storage.setItem('accessToken', data.access_token);
        if (data.refresh_token) storage.setItem('refreshToken', data.refresh_token);
        if (data.role) storage.setItem('userRole', data.role);

        setMessage("Login successful! Redirecting to dashboard...");
        setMessageType("success");

        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setMessage(data.message || "Login failed. Please check your credentials.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Could not connect to the server. Please check your network connection and try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-800">
      
      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-center py-4 px-6 bg-white shadow-sm">
        <Link 
          href="/" 
          className="absolute left-6 md:left-12 p-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={18} className="text-slate-700" />
        </Link>
        
        <div className="w-12 h-12 relative flex items-center justify-center">
          {!logoError ? (
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="object-contain w-full h-full"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-center p-1" style={{ borderColor: brandGreen, color: brandGreen }}>
              LOGO
            </div>
          )}
        </div>
      </header>

      {/* MAIN SECTION */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-12 px-6 bg-[#FCFDFF] relative overflow-hidden">
        
        {/* Page Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
          <img 
            src="/logo.png" 
            alt="Background Watermark" 
            className="w-[90%] max-w-3xl h-auto object-contain opacity-50" 
          />
        </div>

        <div className="flex flex-col items-center mb-6 relative z-10">
          <LogIn size={18} className="mb-2 text-slate-900" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Portal Login</h1>
          <p className="text-slate-500 text-[11px] mt-1">Access your professional dashboard</p>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md relative z-10">
          
          <div className="w-full bg-[#96C93D]/85 backdrop-blur-sm rounded-[1.25rem] p-6 shadow-lg border border-white/20">
            <div className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-900 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com" 
                  disabled={loading}
                  className="w-full bg-white/90 rounded-lg py-2.5 px-4 text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50"
                  required
                />
              </div>

              {/* PASSWORD INPUT WITH TOGGLE */}
              <div className="space-y-1 relative">
                <label className="text-[11px] font-bold text-slate-900 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="****************" 
                    disabled={loading}
                    className="w-full bg-white/90 rounded-lg py-2.5 pl-4 pr-10 text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50"
                    required
                  />
                  <button 
                    type="button"
                    disabled={loading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER & FORGOT */}
              <div className="flex items-center justify-between px-1 pt-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#066936] cursor-pointer" 
                  />
                  <label htmlFor="remember" className="text-[11px] font-bold text-slate-900 cursor-pointer">Keep me logged in</label>
                </div>
                
                <Link href="/forgot-password" className="text-[11px] text-slate-900 font-bold hover:underline decoration-white/40">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="group flex items-center justify-center gap-2 bg-[#71b600] hover:bg-[#609a00] text-white font-black text-[11px] uppercase tracking-wider py-4 px-12 rounded-full transition-all shadow-md active:scale-95 disabled:opacity-70 min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight size={14} style={{ color: accentYellow }} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* MESSAGE SECTION */}
        {message && (
          <div className={`mt-5 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-center text-[11px] font-bold max-w-xs transition-all duration-300 ${
            messageType === "success"
              ? "bg-[#EEF6DF] text-[#65A30D] border border-[#65A30D]/30"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {messageType === "error" && <XCircle size={14} className="text-red-500 shrink-0" />}
            {message}
          </div>
        )}

        <p className="mt-8 text-slate-500 text-xs font-medium relative z-10">
          New to MRTB?{' '}
          <Link href="/auth/register" className="text-[#066936] font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </main>
    </div>
  );
}
