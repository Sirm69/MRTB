"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  CreditCard, 
  DollarSign, 
  Receipt,
  AlertCircle
} from "lucide-react";
import { useUser } from "../layout";

function PaymentsContent() {
  const router = useRouter();
  const { userData, paidRegistration, paidLogistics } = useUser();

  const rawStatus = userData?.status;
  const isApproved = rawStatus === "approved";
  const registrationCost = userData?.cost_estimate || 0;
  const logisticsCost = userData?.logistics_fee || 0;
  const totalCost = registrationCost + logisticsCost;

  // Render dummy transaction history log
  const transactions = [];
  if (paidRegistration && registrationCost > 0) {
    transactions.push({
      ref: "REM-REG-" + userData?.id,
      desc: "Accreditation Registration Fee",
      amount: registrationCost,
      date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Successful"
    });
  }
  if (paidLogistics && logisticsCost > 0) {
    transactions.push({
      ref: "REM-LOG-" + userData?.id,
      desc: "Inspection Logistics Fee",
      amount: logisticsCost,
      date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Successful"
    });
  }

  return (
    <>
      {/* Title Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Payments & Fees</h1>
        <p className="text-sm text-gray-500">View estimates, make payments, and access transaction records</p>
      </div>

      {!isApproved && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-blue-700 text-xs flex gap-3 items-start max-w-xl mb-6">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Fee Estimate Locked</p>
            <p className="leading-relaxed">
              Your billing and fee details will be calculated and unlocked once our administrative review board approves your Pre-Assessment application.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Invoice breakdown column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Billing Cards */}
          {isApproved && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Registration Fee Card */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-gray-400 font-bold text-[9px] uppercase tracking-wider block mb-1">Item 01</span>
                  <h4 className="font-bold text-gray-800 text-sm">Accreditation Registration Fee</h4>
                  <p className="text-2xl font-black text-gray-800 mt-2">₦{registrationCost.toLocaleString()}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">Status</span>
                  {paidRegistration ? (
                    <span className="text-[#5D9C0E] text-[11px] font-bold flex items-center gap-1 bg-[#EEF6DF] px-3 py-1.5 rounded-full"><CheckCircle2 size={14}/> Paid</span>
                  ) : (
                    <button 
                      onClick={() => router.push(`/payment/remita?type=registration&amount=${registrationCost}`)} 
                      className="bg-[#5D9C0E] hover:bg-[#528a0c] text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Pay via Remita
                    </button>
                  )}
                </div>
              </div>

              {/* Logistics Fee Card */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-gray-400 font-bold text-[9px] uppercase tracking-wider block mb-1">Item 02</span>
                  <h4 className="font-bold text-gray-800 text-sm">Inspection Logistics Fee</h4>
                  <p className="text-2xl font-black text-gray-800 mt-2">₦{logisticsCost.toLocaleString()}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">Status</span>
                  {paidLogistics ? (
                    <span className="text-[#5D9C0E] text-[11px] font-bold flex items-center gap-1 bg-[#EEF6DF] px-3 py-1.5 rounded-full"><CheckCircle2 size={14}/> Paid</span>
                  ) : (
                    <button 
                      onClick={() => router.push(`/payment/remita?type=logistics&amount=${logisticsCost}`)} 
                      className="bg-[#5D9C0E] hover:bg-[#528a0c] text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Pay via Remita
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Transaction History Log */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Receipt size={18} className="text-[#5D9C0E]" /> Transaction Log
            </h3>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                      <th className="py-2.5">Reference ID</th>
                      <th className="py-2.5">Description</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-600 font-medium">
                    {transactions.map((tx, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-mono text-[10px] text-gray-400">{tx.ref}</td>
                        <td className="py-3 text-gray-800">{tx.desc}</td>
                        <td className="py-3 font-bold text-gray-850">₦{tx.amount.toLocaleString()}</td>
                        <td className="py-3 text-gray-450">{tx.date}</td>
                        <td className="py-3">
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 italic">No transaction records found.</p>
            )}
          </div>

        </div>

        {/* Payment Summary Sidebar */}
        <div className="bg-[#5D9C0E] text-white rounded-3xl p-6 shadow-md flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="bg-white/20 p-2.5 rounded-2xl w-fit text-white mb-4">
              <CreditCard size={20} />
            </div>
            <span className="text-[#DFEAD9] font-bold text-[9px] uppercase tracking-wider block mb-1">Accreditation Cycle Billing</span>
            <h3 className="text-sm font-semibold opacity-90">Estimated Total Cost</h3>
            <p className="text-3xl font-black mt-2 leading-none">
              ₦{isApproved ? totalCost.toLocaleString() : '0.00'}
            </p>
          </div>
          
          <div className="border-t border-white/20 pt-4 mt-6 text-xs space-y-1 text-[#DFEAD9] font-medium leading-relaxed">
            <p>• Prices include standard regulatory filing fee.</p>
            <p>• Payments are secured and verified in real-time by Remita gateway.</p>
          </div>
        </div>

      </div>
    </>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <PaymentsContent />
    </Suspense>
  );
}
