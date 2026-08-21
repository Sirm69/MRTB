"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  CreditCard, 
  Receipt,
  AlertCircle,
  RefreshCw,
  Clock,
  XCircle,
  ExternalLink,
  Loader2
} from "lucide-react";
import { useUser } from "../layout";
import AlertModal from "../../components/AlertModal";

interface Transaction {
  id: number;
  ref: string;
  rrr?: string;
  order_id?: string;
  payment_type: string;
  desc: string;
  amount: number;
  status: string;
  date: string;
  payment_channel?: string;
}

function PaymentsContent() {
  const router = useRouter();
  const { userData, paidRegistration, paidLogistics, refreshProfile } = useUser();

  const rawStatus = userData?.status;
  const isApproved = rawStatus === "approved";
  const registrationCost = userData?.cost_estimate || 0;
  const logisticsCost = userData?.logistics_fee || 0;
  const totalCost = registrationCost + logisticsCost;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [verifyingRrr, setVerifyingRrr] = useState<string | null>(null);
  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' | 'warning' }>({ isOpen: false, message: "" });

  // Fetch real transaction history from backend
  const loadTransactions = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return;

    setIsLoadingTx(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/payment/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setIsLoadingTx(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Quick verify RRR from transaction log
  const handleVerifyTx = async (targetRrr: string) => {
    if (!targetRrr) return;
    setVerifyingRrr(targetRrr);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/payment/remita/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ rrr: targetRrr })
      });

      const data = await response.json();
      if (response.ok && (data.is_paid || data.status === "success")) {
        setCustomAlert({ isOpen: true, message: "Payment verified successfully!", type: "success" });
        await loadTransactions();
        if (refreshProfile) refreshProfile();
      } else {
        setCustomAlert({ isOpen: true, message: data.message || "Payment has not been confirmed yet.", type: "warning" });
      }
    } catch (err) {
      setCustomAlert({ isOpen: true, message: "Network error verifying payment.", type: "error" });
    } finally {
      setVerifyingRrr(null);
    }
  };


  // Build fallback transaction list if no backend tx records yet
  const displayTransactions: Transaction[] = [...transactions];
  if (displayTransactions.length === 0) {
    if (paidRegistration && registrationCost > 0) {
      displayTransactions.push({
        id: 1,
        ref: "REM-REG-" + userData?.id,
        payment_type: "registration",
        desc: "Accreditation Registration Fee",
        amount: registrationCost,
        date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
        status: "Successful",
        payment_channel: "Remita Gateway"
      });
    }
    if (paidLogistics && logisticsCost > 0) {
      displayTransactions.push({
        id: 2,
        ref: "REM-LOG-" + userData?.id,
        payment_type: "logistics",
        desc: "Inspection Logistics Fee",
        amount: logisticsCost,
        date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
        status: "Successful",
        payment_channel: "Remita Gateway"
      });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Payments & Fees</h1>
          <p className="text-xs text-gray-400 font-normal mt-0.5">View official Remita estimates, make payments, and access transaction records</p>
        </div>
        <button
          onClick={() => {
            loadTransactions();
            if (refreshProfile) refreshProfile();
          }}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-black font-semibold border border-gray-200 bg-white px-3 py-1.5 rounded-full shadow-sm w-fit transition-all cursor-pointer"
        >
          <RefreshCw size={13} className={isLoadingTx ? "animate-spin" : ""} /> Refresh Status
        </button>
      </div>

      {!isApproved && (
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 sm:p-5 text-blue-700 text-xs flex gap-3 items-start max-w-xl">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-blue-600" />
          <div>
            <p className="font-semibold mb-0.5 text-blue-900">Fee Estimate Pending</p>
            <p className="leading-relaxed text-blue-700 font-normal">
              Your billing and fee details will be calculated and unlocked once our administrative review board approves your Pre-Assessment application.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Invoice breakdown column */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Billing Cards */}
          {isApproved && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Registration Fee Card */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-5 border border-gray-100 flex flex-col justify-between min-h-[160px] shadow-sm">
                <div>
                  <span className="text-gray-400 font-medium text-[10px] block mb-1">Item 01</span>
                  <h4 className="font-semibold text-gray-800 text-sm">Accreditation Registration Fee</h4>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">₦{registrationCost.toLocaleString()}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400 font-normal">Status</span>
                  {paidRegistration ? (
                    <span className="text-[#066936] text-[11px] font-medium flex items-center gap-1 bg-[#EEF6DF] px-3 py-1 rounded-full">
                      <CheckCircle2 size={12} className="text-[#5D9C0E]" /> Paid (Remita)
                    </span>
                  ) : (
                    <button 
                      onClick={() => router.push(`/payment/remita?type=registration&amount=${registrationCost}`)} 
                      className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-4 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Pay via Remita
                    </button>
                  )}
                </div>
              </div>

              {/* Logistics Fee Card */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-5 border border-gray-100 flex flex-col justify-between min-h-[160px] shadow-sm">
                <div>
                  <span className="text-gray-400 font-medium text-[10px] block mb-1">Item 02</span>
                  <h4 className="font-semibold text-gray-800 text-sm">Inspection Logistics Fee</h4>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">₦{logisticsCost.toLocaleString()}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400 font-normal">Status</span>
                  {paidLogistics ? (
                    <span className="text-[#066936] text-[11px] font-medium flex items-center gap-1 bg-[#EEF6DF] px-3 py-1 rounded-full">
                      <CheckCircle2 size={12} className="text-[#5D9C0E]" /> Paid (Remita)
                    </span>
                  ) : (
                    <button 
                      onClick={() => router.push(`/payment/remita?type=logistics&amount=${logisticsCost}`)} 
                      className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-4 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Pay via Remita
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Transaction History Log */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Receipt size={16} className="text-[#5D9C0E]" /> Remita Transaction Log
            </h3>
            {displayTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-medium">
                      <th className="py-2.5 pl-1">RRR / Reference</th>
                      <th className="py-2.5">Description</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5 text-right pr-1">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-600 font-normal">
                    {displayTransactions.map((tx, idx) => {
                      const isSuccessStatus = tx.status.toLowerCase() === "successful";
                      const isPendingStatus = tx.status.toLowerCase() === "pending";

                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 font-mono text-[11px] text-gray-800 font-bold pl-1">
                            {tx.rrr || tx.ref}
                          </td>
                          <td className="py-3 text-gray-800">
                            <div>{tx.desc}</div>
                            {tx.payment_channel && (
                              <span className="text-[10px] text-gray-400 font-sans">{tx.payment_channel}</span>
                            )}
                          </td>
                          <td className="py-3 font-semibold text-gray-900">₦{tx.amount.toLocaleString()}</td>
                          <td className="py-3 text-gray-400 whitespace-nowrap">{tx.date}</td>
                          <td className="py-3 text-right pr-1">
                            {isSuccessStatus ? (
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold">
                                Successful
                              </span>
                            ) : isPendingStatus ? (
                              <div className="inline-flex items-center gap-1.5">
                                <span className="text-amber-700 bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium flex items-center gap-1">
                                  <Clock size={10} /> Pending
                                </span>
                                {tx.rrr && (
                                  <button
                                    onClick={() => handleVerifyTx(tx.rrr!)}
                                    disabled={verifyingRrr === tx.rrr}
                                    title="Verify RRR with Remita"
                                    className="p-1 text-gray-500 hover:text-black bg-gray-100 rounded-md transition-colors cursor-pointer"
                                  >
                                    {verifyingRrr === tx.rrr ? (
                                      <Loader2 size={12} className="animate-spin text-[#5D9C0E]" />
                                    ) : (
                                      <RefreshCw size={12} />
                                    )}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-rose-700 bg-rose-50 border border-rose-200/50 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium">
                                {tx.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 italic">No Remita transaction records found.</p>
            )}
          </div>

        </div>

        {/* Payment Summary Sidebar */}
        <div className="bg-[#5D9C0E] text-white rounded-2xl md:rounded-3xl p-6 flex flex-col justify-between min-h-[220px] shadow-sm">
          <div>
            <div className="bg-white/20 p-2 rounded-xl w-fit text-white mb-4">
              <CreditCard size={18} />
            </div>
            <span className="text-white/80 font-medium text-[10px] block mb-1">Accreditation Cycle Billing</span>
            <h3 className="text-xs font-medium text-white/90">Estimated Total Cost</h3>
            <p className="text-2xl sm:text-3xl font-semibold mt-1 leading-tight">
              ₦{isApproved ? totalCost.toLocaleString() : '0.00'}
            </p>
          </div>
          
          <div className="border-t border-white/20 pt-4 mt-6 text-xs space-y-1 text-white/80 font-normal leading-relaxed">
            <p>• Prices include standard regulatory filing fee.</p>
            <p>• Payments are secured and verified in real-time by Remita Federal Gateway.</p>
          </div>
        </div>

      </div>

      {/* ALERT MODAL */}
      <AlertModal
        isOpen={customAlert.isOpen}
        message={customAlert.message}
        type={customAlert.type}
        onClose={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <PaymentsContent />
    </Suspense>
  );
}
