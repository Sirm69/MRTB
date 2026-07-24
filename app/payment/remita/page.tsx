"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, ShieldCheck, Loader2, ArrowLeft, CheckCircle2, ChevronRight, Landmark } from 'lucide-react';
import AlertModal from '../../components/AlertModal';

function RemitaPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Params
  const paymentType = searchParams.get('type') || 'registration';
  const amount = searchParams.get('amount') || '0';

  // UI state
  const [rrr, setRrr] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orgName, setOrgName] = useState('Your Organization');

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' | 'warning' }>({ isOpen: false, message: "" });

  useEffect(() => {
    // Generate a random 12-digit RRR code like 1202-3485-9485
    const r1 = Math.floor(1000 + Math.random() * 9000);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    const r3 = Math.floor(1000 + Math.random() * 9000);
    setRrr(`${r1}-${r2}-${r3}`);

    // Fetch the profile name for display on the invoice
    const fetchOrgProfileName = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (response.ok) {
          const res = await response.json();
          setOrgName(res.name || res.data?.name || 'Your Organization');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrgProfileName();
  }, []);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/payment/mock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ payment_type: paymentType })
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setCustomAlert({ isOpen: true, message: "Remita processing error. Please try again.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setCustomAlert({ isOpen: true, message: "Network error processing payment.", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FCF5] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-[32px] p-8 md:p-12 text-center max-w-md w-full shadow-2xl border border-[#CDE1B4]/40 flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-[#EEF6DF] text-[#5D9C0E] rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={42} strokeWidth={2.5} className="animate-bounce" />
          </div>
          <h2 className="text-[#5D9C0E] text-2xl font-black uppercase tracking-wide mb-2">Payment Successful</h2>
          <p className="text-gray-500 text-sm font-medium mb-6">
            Your mock Remita payment has been verified successfully. Redirecting you back to your dashboard...
          </p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="w-full py-3.5 bg-black hover:bg-slate-900 text-white rounded-full font-bold text-sm shadow-md transition-all uppercase tracking-wider"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCF8] font-sans pb-16">
      
      {/* Brand Green and White Header */}
      <header className="bg-white border-b border-gray-150 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="MRTB Logo" className="h-10 w-auto object-contain" />
          <div className="leading-none">
            <h1 className="text-sm md:text-base font-black text-gray-800 uppercase tracking-wider">MRTB Portal Payment</h1>
            <span className="text-[10px] text-[#5D9C0E] font-bold uppercase tracking-widest">Remita Mock Gateway</span>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1 text-black hover:opacity-80 text-xs font-bold transition-all border border-gray-200 px-4 py-2 rounded-full shadow-sm bg-white"
        >
          <ArrowLeft size={16} /> Cancel Payment
        </button>
      </header>

      {/* Main Form Container */}
      <main className="max-w-2xl mx-auto px-4 mt-8">
        
        {/* Payment Summary Box */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#CDE1B4]/40 overflow-hidden mb-6">
          <div className="bg-[#152405] text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest block mb-0.5">PAYEE ORGANISATION</span>
              <span className="text-sm font-bold uppercase tracking-wide">{orgName}</span>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest block mb-0.5">REMITA RETRIEVAL REFERENCE (RRR)</span>
              <span className="text-base font-mono font-black text-[#5D9C0E] tracking-wider bg-white px-3 py-1 rounded-md">{rrr || 'GENERATING...'}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice Description</h3>
              <div className="flex justify-between items-center text-slate-800">
                <span className="text-sm font-bold uppercase text-[#152405]">MRTB {paymentType} Fee</span>
                <span className="text-xl font-black text-[#5D9C0E]">₦{Number(amount).toLocaleString()}</span>
              </div>
            </div>

            {/* Simulated Form Options */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Choose Mock Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border-2 border-[#5D9C0E] bg-[#FAFCF8] p-4 rounded-2xl flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#5D9C0E] shrink-0" size={24} />
                    <div className="leading-tight">
                      <span className="text-xs font-bold text-slate-800 block">Mock Cards</span>
                      <span className="text-[10px] text-slate-400 font-medium">Visa, Mastercard, Verve</span>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-[#5D9C0E] bg-white"></div>
                </div>

                <div className="border border-slate-200 p-4 rounded-2xl flex items-center justify-between opacity-55 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <Landmark className="text-slate-400 shrink-0" size={24} />
                    <div className="leading-tight">
                      <span className="text-xs font-bold text-slate-500 block">Bank Branch</span>
                      <span className="text-[10px] text-slate-400 font-medium">Pay at any Bank branch</span>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-slate-200"></div>
                </div>
              </div>
            </div>

            {/* Disclaimer and Lock Information */}
            <div className="bg-[#F8FCF5] border border-[#CDE1B4]/30 p-4 rounded-2xl flex gap-3 text-slate-600 text-xs leading-relaxed font-medium">
              <ShieldCheck className="text-[#5D9C0E] shrink-0 mt-0.5" size={18} />
              <p>
                This is a secure mock payment sandbox. Completing this simulation updates the MRTB database instantly, marking your organization's <strong>{paymentType} payment</strong> as settled.
              </p>
            </div>
            
            {/* Pay Button */}
            <button 
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-4 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {isProcessing ? (
                <><Loader2 size={16} className="animate-spin" /> Verifying Payment Status...</>
              ) : (
                <>Submit Payment <ChevronRight size={16} /></>
              )}
            </button>

            {/* Minor Link to Return */}
            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => router.push('/dashboard')} 
                className="text-black hover:underline text-xs font-bold uppercase tracking-wider"
              >
                Return to Organization Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOM ALERT MODAL */}
        <AlertModal 
          isOpen={customAlert.isOpen} 
          message={customAlert.message} 
          type={customAlert.type} 
          onClose={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))} 
        />
      </main>
    </div>
  );
}

export default function RemitaPaymentPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFCF8]">
          <Loader2 className="animate-spin text-[#5D9C0E]" size={40} />
        </div>
      }
    >
      <RemitaPaymentContent />
    </Suspense>
  );
}
