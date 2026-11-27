'use client';

import React, { useEffect } from 'react';
import { Copy, Mail, MapPin, Phone, Printer, X } from 'lucide-react';
import { SITE_META } from '@data/site';
import { CAREER_TIMELINE, HR_PROFILE, SPEC_TILES } from '@/data/profileData';
import { COMMISSIONING_LOGS } from '@data/plc';
import { AIN_GOLF_SHOWCASE, CLOUD_AI_CREDENTIALS } from '@data/ai';
import { useSiteUI } from './SiteUIProvider';

interface ResumePdfModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ResumePdfModal({ open, onClose }: ResumePdfModalProps) {
  const { copyText } = useSiteUI();

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
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#141923]/55 backdrop-blur-md p-3 sm:p-6 print:static print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div
        className="print-only-sheet relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Action Bar */}
        <div className="no-print sticky top-0 z-10 px-5 sm:px-7 py-4 bg-[#F3F5F8]/95 backdrop-blur-xl border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-display text-[11px] uppercase tracking-[0.06em] text-[#2563EB] font-bold">
              ONE-PAGE INTERACTIVE RESUME &amp; TECHNICAL REPORT
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
              이력서 · 기술 리포트 인쇄 / PDF 저장 뷰
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141923] hover:bg-[#2563EB] text-white text-xs font-display font-semibold shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF 저장 / 인쇄</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="w-9 h-9 rounded-full bg-white hover:bg-[#141923] text-slate-700 hover:text-white border border-slate-200 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900">
          {/* Document Header */}
          <div className="pb-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#eef4ff] text-[#2563EB] font-display text-[10px] font-bold uppercase tracking-wider mb-2">
                {SITE_META.portfolioBadge}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {HR_PROFILE.nameKr}{' '}
                <span className="text-lg font-semibold text-[#2563EB]">| {HR_PROFILE.nameEn}</span>
              </h1>
              <p className="text-sm text-slate-600 mt-1">{HR_PROFILE.positioning}</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{HR_PROFILE.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-mono font-semibold text-slate-900">{HR_PROFILE.phone}</span>
                <button
                  type="button"
                  onClick={() => copyText(HR_PROFILE.phone, '연락처')}
                  className="no-print text-[#2563EB] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-mono font-semibold text-slate-900">{HR_PROFILE.email}</span>
                <button
                  type="button"
                  onClick={() => copyText(HR_PROFILE.email, '이메일')}
                  className="no-print text-[#2563EB] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Core Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HR_PROFILE.metrics.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-[#F3F5F8] border border-slate-200/80">
                <div className="font-display text-2xl font-extrabold text-[#2563EB]">{m.value}</div>
                <div className="text-xs font-bold text-slate-900 mt-1">{m.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{m.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Technical Commissioning & AI Build Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F3F5F8]/80 border border-slate-200/80 space-y-2.5">
              <div className="font-display text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                PLC · COBOT 현장 시운전 트러블슈팅 성과
              </div>
              <ul className="space-y-2 text-xs">
                {COMMISSIONING_LOGS.map((log) => (
                  <li key={log.no} className="leading-relaxed">
                    <span className="font-mono font-bold text-[#2563EB] mr-1.5">{log.no}</span>
                    <span className="font-semibold text-slate-900">{log.issue}</span>
                    <div className="text-[11px] text-slate-600 mt-0.5">→ {log.fix}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F3F5F8]/80 border border-slate-200/80 space-y-2.5">
              <div className="font-display text-xs font-bold uppercase tracking-wider text-tertiary">
                AI · CLOUD &amp; WEB BUILD 실행 증명
              </div>
              <div className="text-xs space-y-2 leading-relaxed">
                <div>
                  <span className="font-semibold text-slate-900">{AIN_GOLF_SHOWCASE.title}</span>
                  <div className="text-[11px] font-mono text-[#2563EB]">{AIN_GOLF_SHOWCASE.url}</div>
                  <div className="text-[11px] text-slate-600">
                    B2C 견적기 · 총무용 Top 3 발표 · 골프장 SaaS 드래그 요금 캔버스 · Admin ERP 독학 배포
                  </div>
                </div>
                {CLOUD_AI_CREDENTIALS.map((cred) => (
                  <div key={cred.id}>
                    <span className="font-semibold text-slate-900">{cred.title}</span>
                    <div className="text-[11px] text-slate-600">{cred.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 8 Verified Specs Summary */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-wider text-[#2563EB] font-bold mb-2.5">
              VERIFIED SPECIFICATIONS (8 CATEGORIES)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SPEC_TILES.map((spec) => (
                <div
                  key={spec.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-1.5"
                >
                  <div className="text-xs font-bold text-slate-900">{spec.title}</div>
                  <div className="flex flex-wrap gap-1">
                    {spec.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#F3F5F8] text-[10px] text-slate-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Timeline Summary */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-wider text-[#2563EB] font-bold mb-2.5">
              CAREER &amp; PROJECT TIMELINE (2009 – 2026)
            </h3>
            <div className="divide-y divide-slate-200/70 border border-slate-200/80 rounded-2xl overflow-hidden">
              {CAREER_TIMELINE.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5 text-xs"
                >
                  <span className="font-mono font-bold text-[#2563EB] sm:w-36 shrink-0">
                    {c.period}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900">{c.title}</span>{' '}
                    <span className="text-slate-500">· {c.org}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{c.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
