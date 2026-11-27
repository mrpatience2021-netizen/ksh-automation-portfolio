'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ResumePdfModal from './ResumePdfModal';

interface SiteUIContextValue {
  openPdfModal: () => void;
  closePdfModal: () => void;
  showToast: (message: string) => void;
  copyText: (text: string, label: string) => void;
}

const SiteUIContext = createContext<SiteUIContextValue | null>(null);

export function useSiteUI() {
  const ctx = useContext(SiteUIContext);
  if (!ctx) {
    throw new Error('useSiteUI must be used within SiteUIProvider');
  }
  return ctx;
}

export function SiteUIProvider({ children }: { children: React.ReactNode }) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === message ? '' : prev));
    }, 2400);
  }, []);

  const copyText = useCallback(
    (text: string, label: string) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          void navigator.clipboard.writeText(text);
        }
        showToast(`${label} 클립보드에 복사되었습니다.`);
      } catch {
        showToast(`${label} 복사 완료`);
      }
    },
    [showToast]
  );

  const openPdfModal = useCallback(() => setPdfOpen(true), []);
  const closePdfModal = useCallback(() => setPdfOpen(false), []);

  return (
    <SiteUIContext.Provider value={{ openPdfModal, closePdfModal, showToast, copyText }}>
      {children}

      {/* Floating Toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-6 right-6 z-[70] px-4 py-2.5 rounded-2xl bg-inverse-surface/95 backdrop-blur-xl border border-white/15 text-inverse-on-surface text-xs font-semibold shadow-glass-dark flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Resume & Technical Report Print/PDF Modal */}
      <ResumePdfModal open={pdfOpen} onClose={closePdfModal} />
    </SiteUIContext.Provider>
  );
}
