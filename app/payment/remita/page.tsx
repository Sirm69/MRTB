"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import {
  CreditCard,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Landmark,
  Copy,
  Check,
  Printer,
  RefreshCw,
  Building2,
  Lock,
  HelpCircle
} from 'lucide-react';
import AlertModal from '../../components/AlertModal';

interface RemitaInitResponse {
  status: string;
  env?: string;
  rrr: string;
  order_id: string;
  amount: number;
  payment_type: string;
  payer_name: string;
  payer_email: string;
  payer_phone: string;
  public_key: string;
  merchant_id: string;
  service_type_id: string;
  inline_script_url?: string;
}

function RemitaPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params
  const paymentType = searchParams.get('type') || 'registration';
  const urlAmount = searchParams.get('amount') || '0';

  // State
  const [initData, setInitData] = useState<RemitaInitResponse | null>(null);
  const [rrr, setRrr] = useState('');
  const [amount, setAmount] = useState<number>(Number(urlAmount) || 0);
  const [orgName, setOrgName] = useState('Your Organization');
  const [isInitiating, setIsInitiating] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'inline' | 'bank'>('inline');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{
    isOpen: boolean;
    message: string;
    type?: 'success' | 'error' | 'warning'
  }>({ isOpen: false, message: "" });

  // 1. Fetch Profile & Generate RRR
  useEffect(() => {
    let isMounted = true;

    const initializePayment = async () => {
      setIsInitiating(true);
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        // Fetch Org Profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (profileRes.ok) {
          const res = await profileRes.json();
          if (isMounted) {
            setOrgName(res.name || res.data?.name || 'Your Organization');
          }
        }

        // Generate Remita RRR
        const initRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/payment/remita/initiate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ payment_type: paymentType })
        });

        if (initRes.ok) {
          const data: RemitaInitResponse = await initRes.json();
          if (isMounted) {
            setInitData(data);
            setRrr(data.rrr);
            if (data.amount) setAmount(data.amount);
          }
        } else {
          const errData = await initRes.json().catch(() => null);
          const errMsg = errData?.detail || "Could not generate Remita invoice. Please check with admin if fee is set.";
          if (isMounted) {
            setCustomAlert({ isOpen: true, message: errMsg, type: "error" });
          }
        }
      } catch (err) {
        console.error("Error initiating Remita payment:", err);
        if (isMounted) {
          setCustomAlert({ isOpen: true, message: "Network connection error initializing payment.", type: "error" });
        }
      } finally {
        if (isMounted) setIsInitiating(false);
      }
    };

    initializePayment();

    return () => {
      isMounted = false;
    };
  }, [paymentType, router]);

  // 2. Copy RRR to Clipboard
  const handleCopyRRR = () => {
    if (!rrr) return;
    navigator.clipboard.writeText(rrr.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 3. Verify Payment Status
  const handleVerifyPayment = async (targetRrr?: string) => {
    const rrrToVerify = (targetRrr || rrr).replace(/-/g, '').trim();
    if (!rrrToVerify) {
      setCustomAlert({ isOpen: true, message: "Please enter or generate a valid RRR first.", type: "warning" });
      return;
    }

    setIsVerifying(true);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/payment/remita/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ rrr: rrrToVerify })
      });

      const res = await response.json();

      if (response.ok && (res.is_paid || res.status === "success")) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/payments');
        }, 3000);
      } else {
        const msg = res.message || "Payment has not been confirmed yet. If you made the payment just now, please allow 1-2 minutes for bank clearing and click verify again.";
        setCustomAlert({ isOpen: true, message: msg, type: "warning" });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setCustomAlert({ isOpen: true, message: "Network error checking payment status. Please try again.", type: "error" });
    } finally {
      setIsVerifying(false);
    }
  };

  // 4. Launch Remita Inline Modal
  const handlePayOnlineWithRemita = () => {
    if (!rrr) {
      setCustomAlert({ isOpen: true, message: "Remita RRR is still generating. Please wait...", type: "warning" });
      return;
    }

    const cleanRrr = rrr.replace(/-/g, '').trim();
    const publicKey = process.env.NEXT_PUBLIC_REMITA_PUBLIC_KEY || initData?.public_key || "QzAwMDAyNzEyNTN8MTEwNjQ4NDF8OTAwOGJkMDRiNTJmZGNiNzNlMmQzYjcxNGY4OTQyNzExMTA3ZDg1NDFlMzdlYjExMTc5YjFhMTgyYzUxODUwNWI2OTM2NzZjZjdmMGNmNWI3MzFiOTFkMzA1YWQ1ZWI2MjU5ZTA4M2Q1YjAwODcxYTUzYzhjYjgyNTgwMTUxZDY=";

    const win = window as any;
    if (typeof win.RmPaymentEngine === "undefined") {
      setCustomAlert({
        isOpen: true,
        message: "Remita Inline checkout engine is loading. If this persists, please refresh the page or pay with the RRR code at your bank.",
        type: "warning"
      });
      return;
    }

    try {
      const paymentEngine = win.RmPaymentEngine.init({
        key: publicKey,
        processRrr: true,
        rrr: cleanRrr,
        onSuccess: async function (response: any) {
          console.log("Remita Inline Payment Success:", response);
          await handleVerifyPayment(cleanRrr);
        },
        onError: function (response: any) {
          console.error("Remita Inline Payment Error:", response);
          setCustomAlert({
            isOpen: true,
            message: response?.message || "Payment was cancelled or could not be completed.",
            type: "error"
          });
        },
        onClose: function () {
          console.log("Remita payment widget closed");
        }
      });

      paymentEngine.showPaymentWidget();
    } catch (err: any) {
      console.error("Error opening Remita Widget:", err);
      setCustomAlert({
        isOpen: true,
        message: `Failed to open Remita checkout: ${err.message || "Unknown error"}. You can pay directly with the RRR code.`,
        type: "error"
      });
    }
  };

  const formatRRR = (rawRrr: string) => {
    const clean = rawRrr.replace(/[^0-9]/g, '');
    if (clean.length === 12) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
    }
    return rawRrr;
  };

  const isRegistration = paymentType.toLowerCase() === 'registration';
  const feeTitle = isRegistration ? "Accreditation Registration Fee" : "Inspection Logistics Fee";

  // SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFCF8] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center max-w-md w-full shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-12 h-12 bg-[#EEF6DF] text-[#5D9C0E] rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={26} strokeWidth={2} className="text-[#5D9C0E]" />
          </div>
          <span className="text-[10px] font-medium text-[#066936] bg-[#EEF6DF] px-2.5 py-0.5 rounded-full mb-2">
            Payment Confirmed
          </span>
          <h2 className="text-sm sm:text-base font-medium text-gray-900 tracking-tight mb-1.5">
            Remita Payment Verified
          </h2>
          <p className="text-gray-500 text-xs font-normal mb-5 leading-relaxed">
            Your payment of ₦{amount.toLocaleString()} for {feeTitle} has been settled successfully. Redirecting you to your dashboard...
          </p>

          <div className="w-full bg-gray-50/80 rounded-xl p-3.5 border border-gray-100 text-left text-xs mb-5 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-400">RRR Reference:</span>
              <span className="font-mono text-gray-800 font-medium">{formatRRR(rrr)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="font-medium text-emerald-700">Settled (Remita)</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard/payments')}
            className="w-full py-2.5 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white rounded-xl font-medium text-xs transition-colors cursor-pointer"
          >
            Go to Payments Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCF8] font-sans pb-16">
      {/* Remita Inline SDK Script */}
      <Script
        src={initData?.inline_script_url || (process.env.NEXT_PUBLIC_REMITA_ENV === 'live' ? "https://login.remita.net/payment/v1/remita-pay-inline.bundle.js" : "https://remitademo.net/payment/v1/remita-pay-inline.bundle.js")}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Clean Full-Width Navbar */}
      <header className="bg-white border-b border-gray-100 py-3.5 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MRTB Logo" className="h-8 w-auto object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-xs font-medium text-gray-900 tracking-tight">MRTB Portal Payment</h1>
              <p className="text-[10px] text-gray-400 font-normal">Official Remita Payment Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs font-normal border border-gray-200 px-3 py-1.5 rounded-xl bg-white transition-colors cursor-pointer"
            >
              <Printer size={12} /> Print Slip
            </button>
            <button
              onClick={() => router.push('/dashboard/payments')}
              className="flex items-center gap-1 text-xs text-gray-700 hover:text-black font-normal border border-gray-200 bg-white px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} /> Back to Fees
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Width Content Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Title Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-medium text-gray-900 tracking-tight">
                Fee Invoice & Checkout
              </h2>
              {initData?.env === 'demo' && (
                <span className="text-[10px] bg-amber-50 text-amber-700 font-normal px-2 py-0.5 rounded-full border border-amber-200/60">
                  Demo Sandbox
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-normal mt-0.5">
              Secure automated payment processed via Remita Federal Gateway
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAFCF8] border border-[#EEF6DF] px-3 py-1.5 rounded-xl text-xs text-gray-700 w-fit">
            <Building2 size={14} className="text-[#5D9C0E] shrink-0" />
            <span className="font-normal truncate max-w-[220px]">{orgName}</span>
          </div>
        </div>

        {/* Two-Column Grid across full page */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Main Payment Card (2 Columns) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Invoice Summary Details */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-5">

              {/* Fee Breakdown Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-normal block mb-0.5">Payment Description</span>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-800">{feeTitle}</h3>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-gray-400 font-normal block mb-0.5">Amount Payable</span>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    ₦{amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Remita Retrieval Reference (RRR) Container */}
              <div className="bg-[#FAFCF8] border border-[#CDE1B4]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider block mb-1">
                    Remita Retrieval Reference (RRR)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-medium text-gray-900 bg-white border border-gray-200/80 px-3 py-1.5 rounded-lg shadow-xs tracking-wider select-all">
                      {isInitiating ? (
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 font-sans font-normal">
                          <Loader2 size={12} className="animate-spin text-[#5D9C0E]" /> Generating RRR...
                        </span>
                      ) : (
                        formatRRR(rrr) || 'Unavailable'
                      )}
                    </span>
                    {rrr && (
                      <button
                        onClick={handleCopyRRR}
                        title="Copy RRR"
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1 text-xs font-normal"
                      >
                        {copied ? <Check size={12} className="text-[#5D9C0E]" /> : <Copy size={12} />}
                        <span className="text-[10.5px]">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right text-[11px] text-gray-400 font-normal">
                  <p>Use this reference to pay</p>
                  <p>online or at any bank branch</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <span className="text-xs font-medium text-gray-700 block mb-2.5">
                  Select Payment Option
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Option 1: Pay Online Now */}
                  <div
                    onClick={() => setSelectedMethod('inline')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${selectedMethod === 'inline'
                        ? 'border-[#5D9C0E] bg-[#FAFCF8] shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${selectedMethod === 'inline' ? 'bg-[#EEF6DF] text-[#5D9C0E]' : 'bg-gray-100 text-gray-400'}`}>
                        <CreditCard size={17} />
                      </div>
                      <div className="leading-tight">
                        <span className="text-xs font-medium text-gray-800 block">Pay Online Now</span>
                        <span className="text-[10px] text-gray-400 font-normal">Card, Transfer, USSD, Bank</span>
                      </div>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'inline' ? 'border-[#5D9C0E] bg-[#5D9C0E]' : 'border-gray-300'}`}>
                      {selectedMethod === 'inline' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                    </div>
                  </div>

                  {/* Option 2: Pay at Bank Branch */}
                  <div
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${selectedMethod === 'bank'
                        ? 'border-[#5D9C0E] bg-[#FAFCF8] shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${selectedMethod === 'bank' ? 'bg-[#EEF6DF] text-[#5D9C0E]' : 'bg-gray-100 text-gray-400'}`}>
                        <Landmark size={17} />
                      </div>
                      <div className="leading-tight">
                        <span className="text-xs font-medium text-gray-800 block">Pay at Bank Branch</span>
                        <span className="text-[10px] text-gray-400 font-normal">Over-the-counter with RRR</span>
                      </div>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'bank' ? 'border-[#5D9C0E] bg-[#5D9C0E]' : 'border-gray-300'}`}>
                      {selectedMethod === 'bank' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                    </div>
                  </div>

                </div>
              </div>

              {/* Instructions Panel */}
              {selectedMethod === 'inline' ? (
                <div className="bg-[#FAFCF8] border border-[#EEF6DF] p-3.5 rounded-xl flex gap-2.5 text-gray-600 text-xs leading-relaxed font-normal">
                  <ShieldCheck className="text-[#5D9C0E] shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-gray-800 mb-0.5">Secure Online Checkout</p>
                    <p className="text-gray-400 text-[11px]">
                      Opens the official Remita inline checkout modal. You can pay with your Mastercard, Visa, Verve, Internet Banking, or direct bank transfer.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-xl text-amber-900 text-xs leading-relaxed font-normal space-y-1.5">
                  <p className="font-medium text-amber-900">How to Pay at Bank Branch in Nigeria:</p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-800 text-[11px] pl-0.5">
                    <li>Visit any commercial bank branch across Nigeria.</li>
                    <li>Present your 12-digit RRR: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 font-medium">{formatRRR(rrr)}</span></li>
                    <li>State payment for <strong>Medical Rehabilitation Therapists Board of Nigeria (MRTB)</strong>.</li>
                    <li>After making payment, click the <strong>"Verify Bank Payment"</strong> button below.</li>
                  </ol>
                </div>
              )}

              {/* Primary Action Button */}
              {selectedMethod === 'inline' ? (
                <button
                  onClick={handlePayOnlineWithRemita}
                  disabled={isInitiating || isVerifying || !rrr}
                  className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] disabled:opacity-50 text-white py-3 rounded-xl font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isInitiating ? (
                    <><Loader2 size={14} className="animate-spin" /> Preparing Payment Reference...</>
                  ) : isVerifying ? (
                    <><Loader2 size={14} className="animate-spin" /> Verifying Payment Status...</>
                  ) : (
                    <>Pay ₦{amount.toLocaleString()} with Remita <ChevronRight size={14} /></>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleVerifyPayment(rrr)}
                  disabled={isVerifying || !rrr}
                  className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] disabled:opacity-50 text-white py-3 rounded-xl font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isVerifying ? (
                    <><Loader2 size={14} className="animate-spin" /> Checking Bank Settlement...</>
                  ) : (
                    <><RefreshCw size={13} /> I Have Completed Payment - Verify RRR</>
                  )}
                </button>
              )}

              {/* Re-verify Status Link */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => handleVerifyPayment(rrr)}
                  disabled={isVerifying || !rrr}
                  className="text-gray-400 hover:text-gray-700 text-[10.5px] font-normal transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} className={isVerifying ? "animate-spin text-[#5D9C0E]" : ""} /> Already made payment? Click to verify status
                </button>
              </div>

            </div>

          </div>

          {/* Sidebar Summary (1 Column) */}
          <div className="space-y-4">

            {/* Total Billing Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3.5">
              <div>
                <span className="text-[10px] text-gray-400 font-normal block mb-0.5">Invoice Summary</span>
                <h4 className="text-xs font-medium text-gray-700">Total Payable</h4>
                <p className="text-sm sm:text-base font-medium text-gray-900 mt-0.5">
                  ₦{amount.toLocaleString()}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Fee Category</span>
                  <span className="font-normal text-gray-700">{feeTitle}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service Type</span>
                  <span className="font-normal text-gray-700">LICENSE FEE</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service ID</span>
                  <span className="font-mono text-gray-700">{initData?.service_type_id || '4430731'}</span>
                </div>
                {initData?.order_id && (
                  <div className="flex justify-between text-gray-400">
                    <span>Order Ref</span>
                    <span className="font-mono text-gray-700 text-[10.5px] truncate max-w-[130px]">{initData.order_id}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center gap-1.5 text-[10.5px] text-gray-400">
                <Lock size={11} className="text-[#5D9C0E] shrink-0" />
                <span>256-bit Encrypted Government Payment</span>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-[#FAFCF8] rounded-xl p-3.5 border border-[#EEF6DF] text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-gray-800">
                <HelpCircle size={13} className="text-[#5D9C0E]" />
                <span>Payment Assistance</span>
              </div>
              <p className="text-[10.5px] text-gray-400 leading-relaxed font-normal">
                If you encounter any issues during payment, you can provide your RRR to your administrative officer or contact MRTB support.
              </p>
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
          <Loader2 className="animate-spin text-[#5D9C0E]" size={30} />
        </div>
      }
    >
      <RemitaPaymentContent />
    </Suspense>
  );
}
