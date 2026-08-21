"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { 
  Send, 
  User, 
  Search, 
  CheckCheck, 
  ShieldCheck 
} from "lucide-react";
import { useUser } from "../layout";

interface Message {
  id: number;
  text: string;
  sender: "user" | "admin" | "inspector";
  time: string;
}

interface Thread {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  messages: Message[];
}

function MessagesContent() {
  const { userData } = useUser();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize interactive threads
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "admin",
      name: "MRTB Admin Support",
      role: "Registrar & Review Board",
      avatarBg: "bg-[#5D9C0E]",
      messages: [
        { id: 1, sender: "admin", text: "Hello! Welcome to the Medical Rehabilitation Therapists Board portal. Your account is successfully registered.", time: "09:00 AM" },
        { id: 2, sender: "admin", text: "Once you submit your Pre-Assessment form, we will review and assign your licensing category and fees schedule.", time: "09:05 AM" }
      ]
    },
    {
      id: "inspection",
      name: "Inspection Panel Lead",
      role: "Visitation Coordinator",
      avatarBg: "bg-blue-600",
      messages: [
        { id: 1, sender: "inspector", text: "Greetings. I have been assigned as the coordinator for your physical inspection visitation cycle.", time: "Yesterday" },
        { id: 2, sender: "inspector", text: "Please review the preparation checklist on your Schedule page and make sure all licenses are on site.", time: "Yesterday" }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("admin");
  const [inputText, setInputText] = useState("");
  const [isTypingSim, setIsTypingSim] = useState(false);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThreadId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active thread messages
    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return { ...t, messages: [...t.messages, newMessage] };
      }
      return t;
    });
    setThreads(updatedThreads);
    setInputText("");

    // Simulate Admin Auto-Reply after 1.5 seconds
    setIsTypingSim(true);
    setTimeout(() => {
      const autoReply: Message = {
        id: Date.now() + 1,
        sender: activeThreadId === "admin" ? "admin" : "inspector",
        text: activeThreadId === "admin" 
          ? `Thank you for contacting MRTB support, ${userData?.name || "Facility Director"}. We have received your query and will update you shortly.`
          : "Thank you for the update. We have logged this request. Please continue with preparation in accordance with guidelines.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return { ...t, messages: [...t.messages, autoReply] };
        }
        return t;
      }));
      setIsTypingSim(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Support Messages</h1>
        <p className="text-xs text-gray-400 font-normal mt-0.5">Discuss compliance details, ask registration questions, or contact inspectors</p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden flex h-[65vh] w-full">
        
        {/* Left Side: Threads Panel */}
        <div className="w-full sm:w-[300px] border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-3.5 border-b border-gray-100">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search threads..."
                className="w-full bg-gray-50 text-xs rounded-xl pl-8 pr-3 py-2 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-normal"
              />
              <Search className="absolute left-2.5 top-2.5 text-gray-400" size={13} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {threads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const isSelected = thread.id === activeThreadId;

              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-3.5 flex gap-3 text-left transition-colors items-start ${
                    isSelected ? "bg-[#FAFCF8]" : "hover:bg-gray-50/70"
                  }`}
                >
                  <div className={`${thread.avatarBg} text-white rounded-xl p-2 shrink-0 flex items-center justify-center`}>
                    <User size={16} />
                  </div>
                  <div className="leading-tight flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="font-medium text-gray-800 text-xs truncate">{thread.name}</p>
                      <span className="text-[9px] text-gray-400 font-normal">{lastMsg ? lastMsg.time : ""}</span>
                    </div>
                    <p className="text-[10px] text-[#5D9C0E] font-normal mb-1">{thread.role}</p>
                    <p className="text-[11px] text-gray-400 truncate leading-snug font-normal">
                      {lastMsg ? lastMsg.text : "No messages."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Message Window */}
        <div className="flex-1 flex flex-col bg-gray-50/50 relative">
          
          {/* Active Thread Header */}
          <div className="bg-white p-3.5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className={`${activeThread.avatarBg} text-white rounded-xl p-2 shrink-0`}>
                <User size={16} />
              </div>
              <div className="leading-tight">
                <h4 className="font-semibold text-gray-800 text-xs flex items-center gap-1.5">
                  {activeThread.name} 
                  <ShieldCheck size={13} className="text-[#5D9C0E]" />
                </h4>
                <p className="text-[10px] text-gray-400 font-normal">{activeThread.role}</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {activeThread.messages.map((msg) => {
              const isMe = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isMe 
                      ? "bg-[#5D9C0E] text-white rounded-tr-none" 
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  }`}>
                    <p className="font-normal">{msg.text}</p>
                    <div className={`text-[9px] mt-1 flex justify-end items-center gap-1 ${isMe ? "text-white/70" : "text-gray-400"}`}>
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck size={11} />}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Simulating typing loader */}
            {isTypingSim && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 border border-gray-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message here..."
              className="flex-1 bg-gray-50 text-xs rounded-xl px-3.5 py-2 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-normal"
              disabled={isTypingSim}
            />
            <button 
              type="submit" 
              className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white p-2 rounded-xl transition-colors cursor-pointer"
              disabled={isTypingSim || !inputText.trim()}
            >
              <Send size={15} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
