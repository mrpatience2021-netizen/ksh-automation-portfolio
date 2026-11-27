'use client';

import React, { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, ZoomIn, X } from 'lucide-react';

export interface LightboxPayload {
  src: string;
  title: string;
  subtitle?: string;
}

interface ConditionalMediaImageProps {
  src?: string;
  alt: string;
  caption?: string;
  aspectClass?: string;
  onZoom: (payload: LightboxPayload) => void;
}

/**
 * 조건부 미디어 슬롯:
 * - src가 비어 있거나 파일이 아직 배치되지 않아 onError가 발생하면 DOM을 전혀 렌더링하지 않습니다.
 * - 깨진 이미지 아이콘이나 빈 플레이스홀더 박스를 절대 노출하지 않습니다.
 */
export function ConditionalMediaImage({
  src,
  alt,
  caption,
  aspectClass = 'aspect-[16/9]',
  onZoom,
}: ConditionalMediaImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return null;

  return (
    <button
      type="button"
      onClick={() => onZoom({ src, title: alt, subtitle: caption })}
      className="group relative w-full overflow-hidden rounded-2xl border border-outline-variant/45 bg-surface-container-low cursor-zoom-in text-left"
    >
      <div className={`${aspectClass} w-full overflow-hidden`}>
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="absolute inset-0 bg-[#141923]/0 group-hover:bg-[#141923]/30 transition flex items-end justify-between p-3">
        {caption ? (
          <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#141923] text-[11px] font-semibold shadow-sm opacity-0 group-hover:opacity-100 transition truncate max-w-[75%]">
            {caption}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#141923] text-white text-[11px] font-semibold shadow-sm opacity-0 group-hover:opacity-100 transition shrink-0">
          <ZoomIn className="w-3.5 h-3.5" />
          크게 보기
        </span>
      </div>
    </button>
  );
}

interface MediaLightboxModalProps {
  item: LightboxPayload | null;
  onClose: () => void;
}

export function MediaLightboxModal({ item, onClose }: MediaLightboxModalProps) {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[80] bg-[#141923]/65 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-3xl bg-white border border-outline-variant/60 shadow-[0_28px_70px_-14px_rgba(11,28,48,0.4)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#141923] via-[#1c2638] to-[#213145] text-white flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
            {item.subtitle && (
              <p className="text-[11px] text-slate-300 truncate mt-0.5">{item.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="이미지 닫기"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-rose-500 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 bg-[#f3f5f8] flex items-center justify-center max-h-[78vh] overflow-auto">
          <img
            src={item.src}
            alt={item.title}
            className="max-w-full max-h-[72vh] rounded-xl object-contain shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

export interface PdfDocConfig {
  title: string;
  subtitle: string;
  url?: string;
  filename: string;
}

interface WorkspacePdfModalProps {
  open: boolean;
  onClose: () => void;
  doc: PdfDocConfig;
}

export function WorkspacePdfModal({ open, onClose, doc }: WorkspacePdfModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || !doc.url) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="workspace-pdf-modal-title"
      className="fixed inset-0 z-[75] bg-[#141923]/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] flex flex-col rounded-3xl bg-white border border-outline-variant/60 shadow-[0_28px_70px_-14px_rgba(11,28,48,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#141923] via-[#1c2638] to-[#213145] text-white border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-sky-300" />
            </div>
            <div className="min-w-0">
              <h2
                id="workspace-pdf-modal-title"
                className="font-display text-sm sm:text-base font-bold text-white truncate"
              >
                {doc.title}
              </h2>
              <p className="font-mono text-[11px] text-sky-200 truncate">{doc.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 창 열기</span>
            </a>
            <a
              href={doc.url}
              download={doc.filename}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
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

        <div className="flex-1 bg-[#e8edf5] relative">
          <iframe
            src={`${doc.url}#view=FitH`}
            title={doc.title}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
