"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  CalendarDays, 
  MapPin, 
  User, 
  Calendar,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface ScheduledInspection {
  id: number;
  name: string;
  profession: string;
  visit_date: string;
  visitation_accepted: boolean;
  is_rescheduled: boolean;
  status: string;
  category: string;
}

function CalendarContent() {
  const router = useRouter();
  const [inspections, setInspections] = useState<ScheduledInspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom interactive calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/applications`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const data = await response.json();
          const list = data.data || [];
          
          // Map to inspection items strictly based on actual scheduled visit dates in the database
          const mapped = list
            .filter((item: any) => item.visit_date && item.visit_date.trim() !== "")
            .map((item: any) => {
              const dateVal = item.visit_date;
              return {
                id: item.id,
                name: item.name,
                profession: item.profession,
                visit_date: dateVal,
                visitation_accepted: item.visitation_accepted || false,
                is_rescheduled: item.is_rescheduled || false,
                status: item.status,
                category: item.category
              };
            });
          setInspections(mapped);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error("Failed to fetch admin schedules:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [router]);

  const changeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getMonthName = (monthIdx: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIdx];
  };

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty spaces for first week offset
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-50 bg-gray-50/20 text-transparent">0</div>);
    }

    // Days with numbers
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayInspections = inspections.filter(item => item.visit_date.startsWith(dateStr));
      const hasInspections = dayInspections.length > 0;
      
      const isSelected = selectedDate === dateStr;

      days.push(
        <button
          key={`day-${day}`}
          onClick={() => hasInspections && setSelectedDate(isSelected ? null : dateStr)}
          className={`p-2 border border-gray-50 flex flex-col justify-between min-h-[70px] transition text-left cursor-default ${
            isSelected ? "bg-[#EEF6DF] border-[#5D9C0E]/40" : "bg-white hover:bg-gray-50"
          }`}
        >
          <span className={`text-xs font-bold ${hasInspections ? "text-[#5D9C0E]" : "text-gray-400"}`}>{day}</span>
          {hasInspections && (
            <div className="w-full">
              <span className="w-2 h-2 bg-[#5D9C0E] rounded-full inline-block animate-pulse md:hidden"></span>
              <span className="hidden md:block truncate text-[8px] bg-[#EEF6DF] text-[#066936] font-bold px-1.5 py-0.5 rounded leading-none">
                {dayInspections[0].name}
              </span>
              {dayInspections.length > 1 && (
                <span className="hidden md:block text-[7px] text-gray-400 font-bold mt-0.5">
                  +{dayInspections.length - 1} more
                </span>
              )}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedInspections = selectedDate ? inspections.filter(i => i.visit_date.startsWith(selectedDate)) : [];

  return (
    <>
      {/* Page Title */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Inspection Calendar</h1>
        <p className="text-xs text-gray-400 font-normal mt-0.5">Track acceptances, rescheduling request lists, and active visit audits</p>
      </div>

      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
          
          {/* Calendar Grid Pane */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100">
              
              {/* Month Header controls */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">
                  {getMonthName(currentMonth)} {currentYear}
                </h3>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => changeMonth("prev")} className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => changeMonth("next")} className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-px text-center text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                {renderCalendarDays()}
              </div>

            </div>

            {/* Selected Date Inspector Panel */}
            {selectedDate && (
              <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-150 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarDays size={16} className="text-[#5D9C0E]" /> 
                  Inspections on {new Date(selectedDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>

                <div className="space-y-3">
                  {selectedInspections.map((item, idx) => (
                    <div key={idx} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-850 text-sm leading-tight">{item.name}</p>
                        <p className="text-gray-400 text-[10.5px] font-normal">{item.profession} • {item.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.visitation_accepted ? (
                          <span className="text-[#066936] bg-[#EEF6DF] font-medium px-3 py-1 rounded-full flex items-center gap-1 text-[10.5px]">
                            <CheckCircle size={12} className="text-[#5D9C0E]" /> Accepted
                          </span>
                        ) : item.is_rescheduled ? (
                          <span className="text-amber-700 bg-amber-50 font-medium px-3 py-1 rounded-full flex items-center gap-1 text-[10.5px]">
                            <Clock size={12} className="text-amber-500" /> Rescheduled
                          </span>
                        ) : (
                          <span className="text-blue-600 bg-blue-50 font-medium px-3 py-1 rounded-full flex items-center gap-1 text-[10.5px]">
                            <Clock size={12} className="text-blue-500" /> Awaiting Acceptance
                          </span>
                        )}
                        <button 
                          onClick={() => router.push(`/admin/dashboard`)} 
                          className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium px-4 py-1.5 rounded-full text-[10.5px] transition-colors cursor-pointer"
                        >
                          View Case
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Schedule List */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-[#5D9C0E]" /> Upcoming Visits ({inspections.length})
              </h3>
              
              {inspections.length > 0 ? (
                <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar text-xs">
                  {inspections.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="font-medium text-gray-800 leading-tight truncate">{item.name}</p>
                        <span className="text-[10px] text-gray-400 font-mono shrink-0">
                          {new Date(item.visit_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2 text-[10.5px]">
                        <span className="text-gray-400 font-normal leading-none truncate max-w-[120px]">{item.profession}</span>
                        {item.visitation_accepted ? (
                          <span className="text-[#066936] font-medium flex items-center gap-0.5"><CheckCircle size={10} className="text-[#5D9C0E]" /> Confirmed</span>
                        ) : (
                          <span className="text-amber-600 font-medium flex items-center gap-0.5"><Clock size={10} /> Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-2 italic font-normal">No inspections scheduled yet.</p>
              )}
            </div>

            <div className="bg-[#5D9C0E] text-white rounded-2xl md:rounded-3xl p-5 sm:p-6 flex gap-3 text-xs leading-relaxed">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-1">Administrative Note:</span>
                <p className="font-normal text-white/90">Inspection dates confirmed by facilities are dispatched automatically to designated regional coordinators and field officers.</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
}

export default function SchedulePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <CalendarContent />
    </Suspense>
  );
}
