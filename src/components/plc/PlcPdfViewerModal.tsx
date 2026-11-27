'use client';

import React, { useEffect } from 'react';
import { Download, ExternalLink, FileText, X } from 'lucide-react';
import { PLC_VISUAL_GUIDE_PDF } from '@/data/plcData';

interface PlcPdfViewerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PlcPdfViewerModal({ open, onClose }: PlcPdfViewerModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plc-pdf-modal-title"
      className="fixed inset-0 z-[75] bg-[#141923]/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] flex flex-col rounded-3xl bg-white border border-outline-variant/60 shadow-[0_28px_70px_-14px_rgba(11,28,48,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#213145] via-[#263850] to-[#1a2637] text-white border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-sky-300" />
            </div>
            <div className="min-w-0">
              <h2
                id="plc-pdf-modal-title"
                className="font-display text-sm sm:text-base font-bold text-white truncate"
              >
                {PLC_VISUAL_GUIDE_PDF.title}
              </h2>
              <p className="font-mono text-[11px] text-inverse-primary truncate">
                {PLC_VISUAL_GUIDE_PDF.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={PLC_VISUAL_GUIDE_PDF.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 창 열기</span>
            </a>
            <a
              href={PLC_VISUAL_GUIDE_PDF.url}
              download={PLC_VISUAL_GUIDE_PDF.filename}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary-container hover:bg-primary text-white text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF 다운로드</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="PDF 뷰어 닫기"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-rose-500 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="flex-1 bg-[#e8edf5] relative">
          <iframe
            src={`${PLC_VISUAL_GUIDE_PDF.url}#view=FitH`}
            title={PLC_VISUAL_GUIDE_PDF.title}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
