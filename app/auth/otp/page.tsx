"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import AlertModal from '../../components/AlertModal';

export default function OTPPage() {
  const brandGreen = "#066936";
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' | 'warning' }>({ isOpen: false, message: "" });

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --- NEW: Added handlePaste function to process pasted text ---
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Remove any non-numeric characters and grab up to the first 6 digits
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (!pastedNumbers) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedNumbers.length; i++) {
      newOtp[i] = pastedNumbers[i];
    }
    setOtp(newOtp);

    // Automatically focus on the next empty input box or the last one if full
    const nextFocusIndex = Math.min(pastedNumbers.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length < 6) {
      setCustomAlert({ isOpen: true, message: "Please enter the full 6-digit code.", type: "error" });
      return;
    }

    setLoading(true);

    const email = localStorage.getItem('userEmailForOTP');

    if (!email) {
      setCustomAlert({ isOpen: true, message: "Session expired or email missing. Please try registering again.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/verify-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ 
          email: email, 
          otp: otpValue 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsVerified(true);
        localStorage.removeItem('userEmailForOTP');
      } else {
        setCustomAlert({ isOpen: true, message: data.message || "Verification failed. Please check the code.", type: "error" });
      }
    } catch (err) {
      console.error("API Error:", err);
      setCustomAlert({ isOpen: true, message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem('userEmailForOTP');

    if (!email) {
      setCustomAlert({ isOpen: true, message: "Registration data expired. Please register again.", type: "error" });
      return;
    }

    setResendLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/resend-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setCustomAlert({ isOpen: true, message: "A new OTP has been sent to your email.", type: "success" });
      } else {
        const data = await response.json();
        setCustomAlert({ isOpen: true, message: data.message || "Failed to resend OTP.", type: "error" });
      }
    } catch (err) {
      setCustomAlert({ isOpen: true, message: "Failed to resend OTP due to network error.", type: "error" });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-800">
      
      <header className="relative z-20 flex items-center justify-center py-5 border-b border-slate-100 bg-white">
        <Link 
          href="/registrations/category" 
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

      <main className="flex-grow flex flex-col items-center pt-16 pb-10 px-6 bg-white relative overflow-hidden">
        
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
          <img 
            src="/logo.png" 
            alt="Background Watermark" 
            className="w-[80%] max-w-2xl h-auto object-contain" 
          />
        </div>

        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle2 size={20} className="text-slate-900 fill-white" />
            <h1 className="text-2xl font-semibold text-slate-900">Verify Your Identity</h1>
          </div>
          <p className="text-slate-700 text-sm mt-3 max-w-md mx-auto leading-tight">
            An <span className="font-bold">OTP</span> has been sent to your email.<br/>
            Kindly enter the OTP in the box below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md relative z-10">
          <div className="w-full bg-[#96C93D] rounded-[1.5rem] py-6 px-4 md:py-8 md:px-6 shadow-sm flex justify-center items-center">
            <div className="flex justify-center gap-1.5 md:gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={loading}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste} // --- NEW: Added onPaste event handler ---
                  className="w-9 h-10 md:w-11 md:h-12 text-center text-lg font-bold bg-white text-slate-900 rounded-md border-none outline-none focus:ring-2 focus:ring-[#71b600] transition-all disabled:opacity-50"
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#71b600] hover:bg-[#609a00] text-white font-bold text-sm tracking-widest py-3 px-16 rounded-full transition-all shadow-md active:scale-95 uppercase flex items-center justify-center min-w-[180px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  VERIFYING...
                </>
              ) : "SUBMIT"}
            </button>
          </div>
        </form>

        <div className="mt-6 relative z-10 text-sm font-medium text-slate-700 flex items-center justify-center gap-1">
          <span>Don't receive the <span className="font-bold">OTP</span>?</span>
          <button 
            type="button" 
            onClick={handleResend}
            disabled={resendLoading}
            className="text-[#71b600] font-bold underline transition-all hover:text-[#609a00] disabled:opacity-50 disabled:no-underline flex items-center"
          >
            {resendLoading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin inline" />
                Resending...
              </>
            ) : "Resend OTP"}
          </button>
        </div>

        {isVerified && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[1px] animate-in fade-in duration-200 px-6">
            <div className="bg-white w-full max-w-[260px] p-5 rounded-xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
              
              <div className="mb-2">
                <div className="bg-[#4CAF50] p-1.5 rounded-lg">
                  <CheckCircle2 size={28} className="text-white" />
                </div>
              </div>
              
              <h2 className="text-[#4CAF50] text-sm font-bold mb-5">OTP Approved</h2>
              
              <Link 
                href="/auth/login" 
                className="w-full py-2 px-4 border border-slate-300 rounded-full text-center font-bold text-black text-xs hover:bg-slate-50 transition-colors"
              >
                Continue to Login
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* CUSTOM ALERT MODAL */}
      <AlertModal 
        isOpen={customAlert.isOpen} 
        message={customAlert.message} 
        type={customAlert.type} 
        onClose={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
}