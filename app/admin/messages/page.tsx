"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Send, 
  User, 
  MessageSquare, 
  CheckCheck,
  Building2,
  ShieldCheck
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "admin";
  time: string;
}

interface FacilityThread {
  id: number;
  name: string;
  profession: string;
  category: string;
  messages: Message[];
}

function MessagesContent() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [threads, setThreads] = useState<FacilityThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
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
          
          // Map to threads
          const mapped = list.map((item: any, index: number) => ({
            id: item.id,
            name: item.name,
            profession: item.profession,
            category: item.category,
            messages: [
              { 
                id: 1, 
                sender: "user", 
                text: `Hello, we have registered our facility "${item.name}" and finished the Pre-Assessment. When will the review board schedule our inspection?`, 
                time: "Yesterday" 
              },
              { 
                id: 2, 
                sender: "admin", 
                text: "Hello! We are currently checking your licensing classification. Please ensure that all calculated fees are settled through Remita to unlock scheduling.", 
                time: "Yesterday" 
              }
            ]
          }));
          setThreads(mapped);
          if (mapped.length > 0) {
            setActiveThreadId(mapped[0].id);
          }
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error("Failed to load support threads:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, [router]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThreadId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || activeThreadId === null) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "admin",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return { ...t, messages: [...t.messages, newMsg] };
      }
      return t;
    }));
    setInputText("");

    // Simulate User response after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      const userReply: Message = {
        id: Date.now() + 1,
        sender: "user",
        text: "Thank you for the response. We have logged this request and are preparing the required documentation as instructed.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return { ...t, messages: [...t.messages, userReply] };
        }
        return t;
      }));
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Title Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Support Inbox</h1>
        <p className="text-xs text-gray-400 font-normal mt-0.5">Read and respond to support messages and queries from registered clinics</p>
      </div>

      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden flex h-[65vh] w-full">
          
          {/* Left pane: Threads list */}
          <div className="w-full sm:w-[300px] border-r border-gray-100 flex flex-col shrink-0">
            <div className="p-3.5 border-b border-gray-100">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search clinics..."
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
                    <div className="bg-[#EEF6DF] text-[#066936] rounded-xl p-2 shrink-0 flex items-center justify-center">
                      <Building2 size={16} />
                    </div>
                    <div className="leading-tight flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="font-medium text-gray-800 text-xs truncate">{thread.name}</p>
                        <span className="text-[9px] text-gray-400 font-normal">{lastMsg ? lastMsg.time : ""}</span>
                      </div>
                      <p className="text-[9.5px] text-[#5D9C0E] font-normal mb-0.5 truncate">{thread.profession}</p>
                      <p className="text-[11px] text-gray-400 truncate leading-snug font-normal">
                        {lastMsg ? (lastMsg.sender === "admin" ? "You: " : "") + lastMsg.text : "No messages."}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Message area */}
          {activeThread ? (
            <div className="flex-1 flex flex-col bg-gray-50/50 relative">
              
              {/* Message header */}
              <div className="bg-white p-3.5 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="bg-[#EEF6DF] text-[#066936] rounded-xl p-2 shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div className="leading-tight">
                    <h4 className="font-semibold text-gray-800 text-xs flex items-center gap-1.5">
                      {activeThread.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-normal">{activeThread.profession} • {activeThread.category}</p>
                  </div>
                </div>
              </div>

              {/* Chat history */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {activeThread.messages.map((msg) => {
                  const isMe = msg.sender === "admin";
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
                
                {/* Simulated loader */}
                {isTyping && (
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

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-gray-100 flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type administrative reply..."
                  className="flex-1 bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E]"
                  disabled={isTyping}
                />
                <button 
                  type="submit" 
                  className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white p-2.5 rounded-xl transition-colors cursor-pointer"
                  disabled={isTyping || !inputText.trim()}
                >
                  <Send size={16} />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 text-xs">
              <MessageSquare size={32} className="text-gray-300 mb-2" />
              <p>Select a clinic thread to start messaging.</p>
            </div>
          )}

        </div>
      )}
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
