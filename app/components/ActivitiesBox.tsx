"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  CreditCard, 
  Calendar, 
  Award, 
  User, 
  ClipboardCheck, 
  ShieldCheck,
  ListChecks
} from "lucide-react";

export interface Activity {
  id: string | number;
  action: string;
  category: string;
  date: string;
  status: string;
}

interface ActivitiesBoxProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  { id: 1, action: "Account Creation", category: "Audiology Clinic", date: "July 31, 2025", status: "Successful" },
  { id: 2, action: "Pre-assessment form Submitted", category: "-", date: "-", status: "-" },
  { id: 3, action: "Payment", category: "-", date: "-", status: "-" },
  { id: 4, action: "Assessment form Submitted", category: "-", date: "-", status: "-" },
  { id: 5, action: "Visitation Date Accepted", category: "-", date: "-", status: "-" },
  { id: 6, action: "Visitation Exercise", category: "-", date: "-", status: "-" },
  { id: 7, action: "Accreditation Decision", category: "-", date: "-", status: "-" },
];

export default function ActivitiesBox({ activities = defaultActivities }: ActivitiesBoxProps) {
  const getStepOrder = (action: string): number => {
    const lower = action.toLowerCase();
    if (lower.includes("accreditation decision")) return 7;
    if (lower.includes("visitation exercise")) return 6;
    if (lower.includes("visitation date accepted") || lower.includes("accept visitation") || lower.includes("visitation accepted")) return 5;
    if (lower.includes("assessment form submitted") || lower.includes("assessment submitted")) return 4;
    if (lower.includes("payment")) return 3;
    if (lower.includes("pre-assessment")) return 2;
    if (lower.includes("account creation")) return 1;
    return 0;
  };

  const getStepIcon = (action: string, isDone: boolean) => {
    const lower = action.toLowerCase();
    const size = 14;
    const iconColor = isDone ? "text-[#5D9C0E]" : "text-gray-300";

    if (lower.includes("accreditation decision")) return <Award size={size} className={iconColor} />;
    if (lower.includes("visitation exercise")) return <ShieldCheck size={size} className={iconColor} />;
    if (lower.includes("visitation date accepted") || lower.includes("visitation")) return <Calendar size={size} className={iconColor} />;
    if (lower.includes("assessment form") || lower.includes("assessment")) return <ClipboardCheck size={size} className={iconColor} />;
    if (lower.includes("payment")) return <CreditCard size={size} className={iconColor} />;
    if (lower.includes("pre-assessment")) return <FileText size={size} className={iconColor} />;
    return <User size={size} className={iconColor} />;
  };

  const isActive = (status: string, date: string): boolean => {
    return status !== "-" && date !== "-";
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const aActive = isActive(a.status, a.date);
    const bActive = isActive(b.status, b.date);

    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    if (aActive && bActive) {
      return getStepOrder(b.action) - getStepOrder(a.action);
    }
    return getStepOrder(a.action) - getStepOrder(b.action);
  });

  const completedCount = activities.filter(a => isActive(a.status, a.date)).length;

  const renderStatusBadge = (status: string, isDone: boolean) => {
    const s = status.toLowerCase();
    if (!isDone || status === "-") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-gray-50 text-gray-400">
          Pending
        </span>
      );
    }
    if (s.includes("success") || s.includes("grant") || s.includes("paid") || s.includes("approv")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF6DF] text-[#066936]">
          <CheckCircle2 size={11} className="text-[#5D9C0E]" /> {status}
        </span>
      );
    }
    if (s.includes("reject")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-600">
          <XCircle size={11} className="text-red-500" /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700">
        <Clock size={11} className="text-amber-500" /> {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-gray-100 w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F8FCF5] flex items-center justify-center text-[#5D9C0E]">
            <ListChecks size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-[14.5px] leading-tight">
              Application Activities
            </h3>
            <p className="text-[10.5px] text-gray-400 font-normal">Timeline & status tracking</p>
          </div>
        </div>

        <span className="text-[10.5px] font-medium text-[#066936] bg-[#EEF6DF] px-2.5 py-0.5 rounded-full">
          {completedCount} of {activities.length} Completed
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full">
        <div className="grid grid-cols-12 gap-3 py-1.5 text-[10.5px] font-medium text-gray-400 border-b border-gray-100">
          <div className="col-span-5 pl-1.5">Activity</div>
          <div className="col-span-3">Details / Reference</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right pr-1.5">Status</div>
        </div>

        <div className="divide-y divide-gray-50 text-[12px]">
          {sortedActivities.map((activity) => {
            const isDone = isActive(activity.status, activity.date);
            return (
              <div
                key={activity.id}
                className={`grid grid-cols-12 gap-3 py-1.5 items-center transition-colors rounded-lg px-1.5 ${
                  isDone ? "hover:bg-gray-50/70 text-gray-800" : "text-gray-400 opacity-50"
                }`}
              >
                <div className="col-span-5 flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isDone ? "bg-[#F8FCF5]" : "bg-gray-50"
                  }`}>
                    {getStepIcon(activity.action, isDone)}
                  </div>
                  <span className={`font-normal truncate ${isDone ? "text-gray-800" : "text-gray-400"}`}>
                    {activity.action}
                  </span>
                </div>

                <div className="col-span-3 truncate text-gray-500 font-normal text-[11.5px]">
                  {activity.category !== "-" ? activity.category : "—"}
                </div>

                <div className="col-span-2 text-gray-500 font-normal text-[11px]">
                  {activity.date !== "-" ? activity.date : "—"}
                </div>

                <div className="col-span-2 text-right pr-1">
                  {renderStatusBadge(activity.status, isDone)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card / Feed View */}
      <div className="md:hidden flex flex-col divide-y divide-gray-100">
        {sortedActivities.map((activity) => {
          const isDone = isActive(activity.status, activity.date);
          return (
            <div
              key={activity.id}
              className={`py-2 flex items-start justify-between gap-2.5 ${
                isDone ? "opacity-100" : "opacity-50"
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  isDone ? "bg-[#F8FCF5]" : "bg-gray-50"
                }`}>
                  {getStepIcon(activity.action, isDone)}
                </div>
                <div className="min-w-0">
                  <p className={`text-[11.5px] font-medium leading-tight truncate ${
                    isDone ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400">
                    {activity.category !== "-" && (
                      <span className="truncate max-w-[120px]">{activity.category}</span>
                    )}
                    {activity.category !== "-" && activity.date !== "-" && <span>•</span>}
                    {activity.date !== "-" && <span>{activity.date}</span>}
                  </div>
                </div>
              </div>

              <div className="shrink-0 pt-0.5">
                {renderStatusBadge(activity.status, isDone)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}