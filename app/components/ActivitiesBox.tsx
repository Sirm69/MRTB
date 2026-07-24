"use client";

import React from "react";

// 1. Define the shape of your data for TypeScript
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

// 2. Default mock data (matches your original design)
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
  // Helper to determine step workflow order
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

  // Helper to determine if an activity is active/completed
  const isActive = (status: string, date: string): boolean => {
    return status !== "-" && date !== "-";
  };

  // Sort activities: active/completed items first (sorted descending/newest first),
  // then pending/placeholder items at the bottom (sorted ascending/workflow sequence).
  const sortedActivities = [...activities].sort((a, b) => {
    const aActive = isActive(a.status, a.date);
    const bActive = isActive(b.status, b.date);

    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    if (aActive && bActive) {
      // Both active: descending step order (latest step/operation first)
      return getStepOrder(b.action) - getStepOrder(a.action);
    }

    // Both inactive: ascending step order (logical workflow progression)
    return getStepOrder(a.action) - getStepOrder(b.action);
  });

  return (
    <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-gray-100 w-full overflow-hidden">
      <h3 className="w-full border-b-[2px] border-gray-200 pb-4 mb-5 font-bold text-gray-800 text-[15px]">
        Activities:
      </h3>
      <div className="w-full overflow-x-auto pb-1">
        <div className="flex flex-col text-[13px] md:text-[12.5px] min-w-[600px] whitespace-nowrap">
          
          {/* Map through the sorted data array */}
          {sortedActivities.map((activity, index) => {
            const isLast = index === sortedActivities.length - 1;
            
            // Check if this row is a placeholder by checking if the date or status is a "-"
            const isPlaceholder = activity.date === "-" || activity.status === "-";

            return (
              <div
                key={activity.id}
                className={`grid grid-cols-4 gap-4 ${
                  isLast ? "pt-3.5" : "py-3.5 border-b border-gray-100"
                } ${
                  // Apply faded color ONLY if it's a placeholder, otherwise use solid text
                  isPlaceholder ? "text-[#d1d5db]" : "text-gray-700 font-medium"
                }`}
              >
                <div>{activity.action}</div>
                <div>{activity.category}</div>
                <div>{activity.date}</div>
                <div className="text-right pr-2">{activity.status}</div>
              </div>
            );
          })}
          
        </div>
      </div>
    </div>
  );
}