'use client';

import React from 'react';
import {
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  Flame,
  Tv,
} from 'lucide-react';
import {
  ConditionalMediaImage,
  type LightboxPayload,
} from '@/components/workspace/WorkspaceMedia';
import { MEDIA_IR_ARCHIVE, SHORTS_EXECUTION_LOG } from '@/data/aiData';

interface AiFieldLogProps {
  onZoom: (payload: LightboxPayload) => void;
}

export function AiShortsLogTab({ onZoom }: AiFieldLogProps) {
  return (
    <section id="shorts" className="scroll-mt-24 space-y-6">
      {/* Main Execution Highlight Card */}
      <article className="rounded-3xl bg-gradient-to-br from-[#e9ddff] via-[#eef0ff] to-white border border-outline-variant/45 p-6 sm:p-7 shadow-glass space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary text-white font-mono text-[10.5px] font-bold">
                <Flame className="w-3.5 h-3.5" />
                {SHORTS_EXECUTION_LOG.channelName} ({SHORTS_EXECUTION_LOG.handle})
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-outline-variant/40 font-mono text-[10.5px] font-bold text-tertiary">
                {SHORTS_EXECUTION_LOG.period}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-[10.5px] font-bold text-emerald-700">
                {SHORTS_EXECUTION_LOG.status}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
              {SHORTS_EXECUTION_LOG.headline}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              {SHORTS_EXECUTION_LOG.summary}
            </p>
          </div>

          {SHORTS_EXECUTION_LOG.channelUrl && (
            <a
              href={SHORTS_EXECUTION_LOG.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#141923] hover:bg-tertiary text-white text-xs font-display font-semibold shadow-sm transition shrink-0"
            >
              <span>채널 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* 3 Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {SHORTS_EXECUTION_LOG.metrics.map((m) => (
            <div
              key={m.label}
              className="p-4 rounded-2xl bg-white/95 border border-outline-variant/40 shadow-xs"
            >
              <div className="font-mono text-[10.5px] font-bold text-tertiary uppercase">
                {m.label}
              </div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-on-surface mt-1">
                {m.value}
              </div>
              <div className="text-xs text-on-surface-variant mt-0.5">{m.desc}</div>
            </div>
          ))}
        </div>

        <ConditionalMediaImage
          src={SHORTS_EXECUTION_LOG.thumbnail}
          alt={SHORTS_EXECUTION_LOG.channelName}
          caption={SHORTS_EXECUTION_LOG.thumbnailCaption}
          onZoom={onZoom}
        />
      </article>

      {/* Retrospectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SHORTS_EXECUTION_LOG.retrospectives.map((retro, idx) => (
          <div
            key={retro.title}
            className="p-6 rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass flex flex-col justify-between gap-3"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e9ddff] text-tertiary font-mono text-[10px] font-bold mb-2.5">
                <CheckCircle2 className="w-3 h-3" />
                KEY LEARNING 0{idx + 1}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-on-surface mb-2">
                {retro.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{retro.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AiYoutubeIrTab({ onZoom }: AiFieldLogProps) {
  return (
    <section id="youtube" className="scroll-mt-24 space-y-5">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#e9ddff] via-[#eef0ff] to-white border border-outline-variant/45 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[10.5px] font-bold text-tertiary uppercase">
            MEDIA · IR PITCHING · LOCAL AI ARCHIVE
          </span>
          <h3 className="font-display text-lg font-bold text-on-surface mt-0.5">
            유튜브 메타박스 · IR 피칭 &amp; 오피스 · 로컬 AI 실험 누적 아카이브
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-white border border-outline-variant/40 font-mono text-[11px] font-bold text-tertiary">
          {MEDIA_IR_ARCHIVE.length} Archive Logs
        </span>
      </div>

      <div className="space-y-5">
        {MEDIA_IR_ARCHIVE.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl bg-white/95 border border-outline-variant/45 p-6 shadow-glass space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary text-white font-mono text-[10.5px] font-bold">
                  {item.id === 'youtube-metabox' ? (
                    <Tv className="w-3.5 h-3.5" />
                  ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  )}
                  {item.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#e9ddff] text-tertiary font-mono text-[10.5px] font-bold">
                  {item.date} · {item.status}
                </span>
              </div>

              {item.linkUrl && (
                <a
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#141923] hover:bg-tertiary text-white text-xs font-semibold transition"
                >
                  <span>{item.linkLabel ?? '바로가기'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div>
              <h4 className="font-display text-lg font-bold text-on-surface mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                {item.summary}
              </p>
            </div>

            <ConditionalMediaImage
              src={item.thumbnail}
              alt={item.title}
              caption={item.thumbnailCaption}
              onZoom={onZoom}
            />

            <ul className="space-y-1.5 text-xs sm:text-[13px] text-on-surface">
              {item.highlights.map((hl) => (
                <li key={hl} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-outline-variant/35 flex flex-wrap gap-1.5">
              {item.tools.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/35 font-mono text-[10.5px] font-semibold text-on-surface"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
