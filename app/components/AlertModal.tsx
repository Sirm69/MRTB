"use client";

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, type = 'error', onClose }: AlertModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="bg-[#4CAF50] p-1.5 rounded-lg animate-in zoom-in duration-300">
            <CheckCircle2 size={32} className="text-white" />
          </div>
        );
      case 'warning':
        return (
          <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 animate-in zoom-in duration-300">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
        );
      case 'error':
      default:
        return (
          <div className="bg-red-50 p-2 rounded-lg border border-red-200 animate-in zoom-in duration-300">
            <XCircle size={32} className="text-red-500" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-[1px] animate-in fade-in duration-200 px-6">
      <div className="bg-white w-full max-w-[320px] p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200 text-center">
        <div className="mb-4">{getIcon()}</div>
        <p className="text-gray-800 text-xs font-semibold mb-6 leading-relaxed">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="w-full py-2 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white rounded-full text-center font-bold text-[11px] shadow-sm transition-all"
        >
          OK
        </button>
      </div>
    </div>
  );
}
