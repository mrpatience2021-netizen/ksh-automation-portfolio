'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ConditionalMediaImage,
  type LightboxPayload,
} from '@/components/workspace/WorkspaceMedia';
import { AIN_GOLF_SHOWCASE, CUSTOM_TOOLS_ARCHIVE } from '@/data/aiData';

interface AiLabTabProps {
  onZoom: (payload: LightboxPayload) => void;
}

export function AiAinGolfTab({ onZoom }: AiLabTabProps) {
  const [activeModId, setActiveModId] = useState(AIN_GOLF_SHOWCASE.modules[0].id);
  const activeMod =
    AIN_GOLF_SHOWCASE.modules.find((m) => m.id === activeModId) ?? AIN_GOLF_SHOWCASE.modules[0];

  return (
    <section id="ain-golf" className="scroll-mt-24 space-y-6">
      {/* Main Live Showcase Card (Deep Charcoal) */}
      <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#141923] via-[#1c2638] to-[#213145] text-white border border-white/15 p-6 sm:p-8 shadow-glass-dark">
        <div className="pointer-events-none absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#2563EB]/25 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 font-mono text-[10.5px] font-bold text-amber-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  FULL-STACK MVP · LIVE DEPLOYED
                </span>
                <span className="font-mono text-[11px] text-slate-300">
                  {AIN_GOLF_SHOWCASE.period}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {AIN_GOLF_SHOWCASE.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {AIN_GOLF_SHOWCASE.tagline}
              </p>
            </div>

            <a
              href={AIN_GOLF_SHOWCASE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-display font-semibold shadow-md transition shrink-0"
            >
              <span>라이브 서비스 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Live Browser Address Strip */}
          <a
            href={AIN_GOLF_SHOWCASE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl bg-black/35 border border-white/15 hover:border-sky-400/60 overflow-hidden transition"
          >
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[11px] text-slate-300 truncate">
                https://{AIN_GOLF_SHOWCASE.domainDisplay}/
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/35 font-mono text-[10px] font-bold text-emerald-300 shrink-0">
                ● LIVE
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
            <div className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {AIN_GOLF_SHOWCASE.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 font-mono text-[10.5px] font-semibold text-sky-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="text-xs text-sky-300 font-semibold group-hover:underline">
                새 창에서 직접 체험하기 →
              </span>
            </div>
          </a>

          {/* Conditional Screenshot Slot (Hidden cleanly when empty) */}
          <ConditionalMediaImage
            src={AIN_GOLF_SHOWCASE.thumbnail}
            alt={AIN_GOLF_SHOWCASE.title}
            caption={AIN_GOLF_SHOWCASE.thumbnailCaption}
            onZoom={onZoom}
          />

          {/* Interactive 3-Core-Module Explorer */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] font-bold text-sky-300 uppercase tracking-wider">
              3대 핵심 모듈 탐색 (클릭하여 상세 구조 확인)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {AIN_GOLF_SHOWCASE.modules.map((mod, idx) => {
                const active = mod.id === activeMod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveModId(mod.id)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      active
                        ? 'bg-[#2563EB] border-sky-300 text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-mono text-[10px] font-bold opacity-80">
                      0{idx + 1} · {mod.tier}
                    </div>
                    <div className="text-xs sm:text-sm font-bold mt-0.5">{mod.shortLabel}</div>
                  </button>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-bold text-white">{activeMod.title}</h4>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/25 font-mono text-[10.5px] font-bold text-sky-200">
                  {activeMod.tier}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed">
                {activeMod.desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeMod.highlights.map((hl) => (
                  <span
                    key={hl}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/35 border border-white/15 text-[11px] font-medium text-sky-200"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {hl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 3-Column Overview Grid of All 3 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {AIN_GOLF_SHOWCASE.modules.map((mod, idx) => (
          <div
            key={mod.id}
            className="p-5 rounded-2xl bg-white/95 border border-outline-variant/45 shadow-xs flex flex-col justify-between gap-3"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-primary font-mono text-[10px] font-bold">
                MODULE 0{idx + 1} · {mod.tier}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-on-surface mt-2 mb-1.5">
                {mod.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{mod.desc}</p>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex flex-wrap gap-1.5">
              {mod.highlights.map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-[11px] font-semibold text-on-surface"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AiCustomToolsTab({ onZoom }: AiLabTabProps) {
  return (
    <section id="tools" className="scroll-mt-24 space-y-5">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#141923] via-[#1c2638] to-[#213145] text-white border border-white/15 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[10.5px] font-bold text-sky-300 uppercase">
            SELF-BUILT ENGINEERING WEB APPS
          </span>
          <h3 className="font-display text-lg font-bold text-white mt-0.5">
            자체 제작 엔지니어링 툴 &amp; 자동화 웹앱 아카이브
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/10 font-mono text-[11px] font-bold text-sky-200">
          {CUSTOM_TOOLS_ARCHIVE.length} Projects / Slots
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CUSTOM_TOOLS_ARCHIVE.map((tool) => {
          const isUpcoming = tool.badge.includes('UPCOMING');
          return (
            <article
              key={tool.id}
              className={`rounded-3xl p-6 border flex flex-col justify-between gap-4 shadow-glass ${
                isUpcoming
                  ? 'bg-gradient-to-br from-[#e9ddff]/45 via-white to-[#f7faff] border-dashed border-tertiary/45'
                  : 'bg-white/95 border-outline-variant/45'
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      isUpcoming
                        ? 'bg-[#e9ddff] text-tertiary'
                        : 'bg-[#141923] text-sky-300'
                    }`}
                  >
                    {isUpcoming ? <Layers className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                    {tool.badge}
                  </span>
                  <span className="font-mono text-[10.5px] font-semibold text-on-surface-variant">
                    {tool.status}
                  </span>
                </div>

                <h4 className="font-display text-base sm:text-lg font-bold text-on-surface leading-snug">
                  {tool.title}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{tool.summary}</p>

                <ConditionalMediaImage
                  src={tool.thumbnail}
                  alt={tool.title}
                  caption={tool.thumbnailCaption}
                  onZoom={onZoom}
                />

                <ul className="space-y-1.5 text-xs text-on-surface">
                  {tool.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-3 border-t border-outline-variant/35">
                <div className="flex flex-wrap gap-1.5">
                  {tool.stack.map((st) => (
                    <span
                      key={st}
                      className="px-2 py-0.5 rounded-md bg-surface-container-low font-mono text-[10.5px] font-semibold text-primary"
                    >
                      {st}
                    </span>
                  ))}
                </div>

                {tool.href && (
                  <Link
                    href={tool.href}
                    className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-[#141923] hover:bg-[#2563EB] text-white text-xs font-display font-semibold transition"
                  >
                    <span>{tool.hrefLabel ?? '열기'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
