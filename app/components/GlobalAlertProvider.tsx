"use client";

import React, { useState, useEffect } from 'react';
import AlertModal from './AlertModal';

export default function GlobalAlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    isOpen: false,
    message: "",
    type: "error"
  });

  useEffect(() => {
    // Override window.alert
    const originalAlert = window.alert;

    window.alert = (message: string) => {
      let type: 'success' | 'error' | 'warning' = 'error';
      const lower = message.toLowerCase();

      if (
        lower.includes("success") || 
        lower.includes("verified") || 
        lower.includes("sent to your email") ||
        lower.includes("approved") ||
        lower.includes("successfully")
      ) {
        type = 'success';
      } else if (
        lower.includes("warn") || 
        lower.includes("please select") || 
        lower.includes("fill in all") ||
        lower.includes("do not match") ||
        lower.includes("invalid file type")
      ) {
        type = 'warning';
      }

      setAlertState({
        isOpen: true,
        message,
        type
      });
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  return (
    <>
      {children}
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
