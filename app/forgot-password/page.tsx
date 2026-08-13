"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, ArrowRight, Loader2, XCircle, CheckCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const brandGreen = "#066936";
  const accentYellow = "#d8f22f";

  const [logoError, setLogoError] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "A new password has been sent to your email address. (Check terminal output for simulated email)");
        setMessageType("success");
        setIsSent(true);
      } else {
        setMessage(data.detail || data.message || "Failed to reset password. Please verify your email address.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
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
          href="/auth/login" 
          className="absolute left-6 md:left-12 p-2 hover:bg-slate-50 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold text-slate-700"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to Login</span>
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

        <div className="flex flex-col items-center mb-6 relative z-10 text-center">
          <div className="w-12 h-12 bg-[#EEF6DF] rounded-full flex items-center justify-center mb-2">
            <KeyRound size={22} className="text-[#066936]" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="text-slate-500 text-[11px] mt-1 max-w-xs">
            Enter the email address associated with your entity account and we will send you a new password.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md relative z-10">
          
          <div className="w-full bg-[#96C93D]/85 backdrop-blur-sm rounded-[1.25rem] p-6 shadow-lg border border-white/20">
            <div className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-900 ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com" 
                    disabled={loading || isSent}
                    className="w-full bg-white/90 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-60"
                    required
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-8">
            {!isSent ? (
              <button 
                type="submit" 
                disabled={loading}
                className="group flex items-center justify-center gap-2 bg-[#5e9900] hover:bg-[#4d7e00] text-white font-black text-[11px] uppercase tracking-wider py-4 px-12 rounded-full transition-all shadow-md active:scale-95 disabled:opacity-70 min-w-[220px]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={14} style={{ color: accentYellow }} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => router.push('/auth/login')}
                className="group flex items-center justify-center gap-2 bg-[#5e9900] hover:bg-[#4d7e00] text-white font-black text-[11px] uppercase tracking-wider py-4 px-12 rounded-full transition-all shadow-md active:scale-95 min-w-[220px]"
              >
                Return to Login
                <ArrowRight size={14} style={{ color: accentYellow }} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </form>

        {/* MESSAGE SECTION */}
        {message && (
          <div className={`mt-6 flex items-start justify-center gap-2 px-4 py-3 rounded-xl text-center text-xs font-semibold max-w-sm transition-all duration-300 ${
            messageType === "success"
              ? "bg-[#EEF6DF] text-[#5e9900] border border-[#5e9900]/40 shadow-sm"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {messageType === "error" && <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
            {messageType === "success" && <CheckCircle size={16} className="text-[#5e9900] shrink-0 mt-0.5" />}
            <div>{message}</div>
          </div>
        )}

        <p className="mt-8 text-slate-500 text-xs font-medium relative z-10">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-[#5e9900] font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </main>
    </div>
  );
}
