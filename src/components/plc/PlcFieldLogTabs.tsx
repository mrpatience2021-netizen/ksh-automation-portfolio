'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Copy, FileText, Search, Sparkles, Wrench, X, ZoomIn } from 'lucide-react';
import {
  AI_DIAGNOSIS_PROMPT,
  FIELD_ISSUE_LOGS,
  FieldIssueLogItem,
  TROUBLESHOOTING_DB,
} from '@/data/plcData';
import { useSiteUI } from '@/components/SiteUIProvider';

// ============================================================================
// Field Log Sub-tab 1: 증상별 트러블슈팅 검색 DB
// ============================================================================
export function PlcTroubleshootingDbTab() {
  const [tsCat, setTsCat] = useState<string>('전체');
  const [tsQuery, setTsQuery] = useState('');

  const filteredTs = useMemo(() => {
    const q = tsQuery.trim().toLowerCase();
    return TROUBLESHOOTING_DB.filter((item) => {
      const catOk = tsCat === '전체' || item.cat === tsCat;
      const qOk =
        !q ||
        [item.cat, item.equip, item.symptom, item.cause, item.action].some((f) =>
          f.toLowerCase().includes(q)
        );
      return catOk && qOk;
    });
  }, [tsCat, tsQuery]);

  return (
    <section className="rounded-3xl bg-white/95 border border-outline-variant/45 p-6 shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <span className="font-display text-[11px] uppercase tracking-[0.06em] text-tertiary font-bold flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            FIELD TROUBLESHOOTING DATABASE
          </span>
          <h2 className="font-display text-lg sm:text-xl font-bold text-on-surface mt-0.5">
            증상별 현장 트러블슈팅 검색 DB (3분 1차 진단)
          </h2>
        </div>
        <span className="font-mono text-xs font-bold text-tertiary bg-tertiary-fixed/70 px-3 py-1 rounded-full">
          {filteredTs.length} / {TROUBLESHOOTING_DB.length} Cases
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={tsQuery}
            onChange={(e) => setTsQuery(e.target.value)}
            placeholder="에러 코드, 증상 검색 (예: 2501, Pr.79, 특이점, 이중 코일)..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-low/75 border border-outline-variant/50 focus:border-primary focus:bg-white outline-none text-xs sm:text-sm text-on-surface"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['전체', 'MELSEC PLC', '인버터', '협동로봇', 'ROS 2'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setTsCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition cursor-pointer ${
                tsCat === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTs.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40 space-y-2.5 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-display font-bold text-[11px]">
                {item.cat}
              </span>
              <span className="font-mono font-bold text-on-surface-variant">{item.equip}</span>
            </div>
            <div className="font-bold text-on-surface text-sm">{item.symptom}</div>
            <div className="text-on-surface-variant leading-relaxed">
              <b className="text-rose-600">원인:</b> {item.cause}
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/85 border border-emerald-200 text-emerald-950 leading-relaxed">
              <b>1차 조치:</b> {item.action}
            </div>
          </div>
        ))}
        {filteredTs.length === 0 && (
          <div className="md:col-span-2 py-10 text-center text-sm text-on-surface-variant">
            검색어에 해당하는 트러블슈팅 사례가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Field Log Sub-tab 2: AI 정밀 진단 프롬프트 복사기
// ============================================================================
export function PlcAiPromptTab() {
  const { copyText } = useSiteUI();

  return (
    <section className="rounded-3xl bg-inverse-surface text-inverse-on-surface p-6 sm:p-7 shadow-glass-dark border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="font-display text-[10.5px] uppercase tracking-[0.06em] text-sky-300 font-bold block">
            AI-ASSISTED CS DIAGNOSTICS
          </span>
          <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Sparkles className="w-4 h-4 text-sky-400" />
            AI 정밀 진단 프롬프트 원클릭 복사기 (현장 CS 표준 포맷)
          </h2>
          <p className="text-xs text-inverse-on-surface/75 mt-1">
            장비 구성 · 증상 · 1차 점검 완료 항목 · 미확인 항목을 구조화해 AI에게 3순위 원인 진단을 즉시 요청하는 실무 템플릿입니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => copyText(AI_DIAGNOSIS_PROMPT, 'AI 정밀 진단 프롬프트')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary-container hover:bg-primary text-white text-xs font-display font-semibold shadow-sm transition cursor-pointer shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>AI 진단 프롬프트 복사</span>
        </button>
      </div>

      <pre className="p-4 sm:p-5 rounded-2xl bg-black/35 border border-white/10 font-mono text-xs text-slate-100 whitespace-pre-wrap leading-[1.75]">
        {AI_DIAGNOSIS_PROMPT}
      </pre>
    </section>
  );
}

// ============================================================================
// Field Log Sub-tab 3: 시운전 Issue Log (조건부 썸네일 + 라이트박스 확대)
// ============================================================================
function ConditionalIssueThumb({
  log,
  onOpen,
}: {
  log: FieldIssueLogItem;
  onOpen: (item: FieldIssueLogItem) => void;
}) {
  const [failed, setFailed] = useState(false);

  // 조건부 렌더링: thumbnail이 없거나 로드 실패 시 빈 박스 렌더링 금지
  if (!log.thumbnail || log.thumbnail.trim().length === 0 || failed) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(log)}
      aria-label={`${log.issue} 현장 사진 크게 보기`}
      className="group/thumb relative w-[72px] h-[48px] rounded-xl overflow-hidden border border-outline-variant/50 bg-surface-container-low shrink-0 cursor-zoom-in"
    >
      <img
        src={log.thumbnail}
        alt={log.issue}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
      />
      <span className="absolute inset-0 bg-[#141923]/0 group-hover/thumb:bg-[#141923]/35 transition-colors flex items-center justify-center">
        <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
      </span>
    </button>
  );
}

export function PlcIssueLogTab() {
  const [lightboxLog, setLightboxLog] = useState<FieldIssueLogItem | null>(null);

  useEffect(() => {
    if (!lightboxLog) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxLog(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxLog]);

  return (
    <>
      <section className="rounded-3xl bg-white/95 border border-outline-variant/45 p-6 shadow-glass">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <span className="font-display text-[11px] uppercase tracking-[0.06em] text-tertiary font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              COMMISSIONING FIELD ISSUE LOG
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-on-surface mt-0.5">
              현장 시운전 완료 보고서 — 이슈 해결 누적 로그
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-on-surface-variant">
            {FIELD_ISSUE_LOGS.length} Verified Logs · src/data/plcData.ts
          </span>
        </div>

        <div className="space-y-3.5">
          {FIELD_ISSUE_LOGS.map((log) => (
            <article
              key={log.id}
              className="p-5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              {/* 조건부 썸네일 슬롯 (thumbnail이 있을 때만 표시, 없으면 공간 점유 0) */}
              <ConditionalIssueThumb log={log} onOpen={setLightboxLog} />

              <div className="min-w-0 flex-1 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-inverse-surface text-white font-mono font-bold">
                      {log.no}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-bold">
                      {log.statusBadge}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-on-surface-variant">
                      {log.equip}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-on-surface text-sm sm:text-[15px] leading-snug">
                  {log.issue}
                </h3>

                <div className="text-on-surface-variant leading-relaxed">
                  <b className="text-on-surface">원인 분석:</b> {log.cause}
                </div>

                <div className="p-3 rounded-xl bg-white border border-primary/20 text-primary font-semibold leading-relaxed">
                  ✅ 현장 조치 및 검증: {log.fix}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {log.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-outline-variant/45 font-mono text-[10.5px] font-semibold text-on-surface"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Issue Photo Lightbox Modal */}
      {lightboxLog && lightboxLog.thumbnail && (
        <div
          className="fixed inset-0 z-[80] bg-[#141923]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxLog(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl bg-white border border-outline-variant/60 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-outline-variant/40 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-bold text-on-surface truncate">
                  {lightboxLog.no} · {lightboxLog.issue}
                </div>
                <div className="text-xs text-on-surface-variant truncate">
                  {lightboxLog.statusBadge} · {lightboxLog.equip}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLightboxLog(null)}
                aria-label="현장 사진 닫기"
                className="w-8 h-8 rounded-full bg-inverse-surface hover:bg-primary text-white flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-[#f4f6fa] flex items-center justify-center">
              <img
                src={lightboxLog.thumbnail}
                alt={lightboxLog.issue}
                className="max-h-[75vh] w-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
