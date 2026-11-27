'use client';

import React from 'react';
import { ArrowRight, Cloud, PlayCircle, Sparkles, Tv } from 'lucide-react';
import {
  CLOUD_AI_CREDENTIALS,
  OSMU_PIPELINE,
  OT_CLOUD_ROADMAP,
} from '@/data/aiData';

export function AiGcpLeaderTab() {
  return (
    <div id="gcp" className="scroll-mt-24 space-y-6">
      {/* 2 Cloud & AI Credentials */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CLOUD_AI_CREDENTIALS.map((cred) => (
          <article
            key={cred.id}
            className="rounded-3xl bg-gradient-to-br from-[#dce9ff]/65 via-white to-[#f7faff] border border-outline-variant/45 p-6 sm:p-7 shadow-glass flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-primary font-mono text-[10.5px] font-bold shadow-xs">
                  <Cloud className="w-3.5 h-3.5" />
                  {cred.org}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white font-mono text-[10.5px] font-bold">
                  {cred.duration}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-on-surface">{cred.title}</h3>
              <p className="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                {cred.summary}
              </p>

              <div className="p-4 rounded-2xl bg-white border border-outline-variant/40">
                <div className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                  OT · SCADA 현장 확장 연결고리
                </div>
                <p className="text-xs text-on-surface font-medium leading-relaxed">
                  {cred.otBridge}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-outline-variant/35">
              {cred.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-white border border-outline-variant/40 font-mono text-[11px] font-semibold text-on-surface"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Future Web SCADA (Ignition) & Cloud Data Convergence Roadmap */}
      <section className="rounded-3xl bg-white/95 border border-outline-variant/45 p-6 sm:p-7 shadow-glass">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5 pb-4 border-b border-outline-variant/35">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce9ff] text-primary font-mono text-[10.5px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              OT × IT CONVERGENCE ROADMAP
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
              향후 웹 기반 SCADA(Ignition) · GCP 클라우드 설비 데이터 연동 로드맵
            </h3>
          </div>
          <span className="font-mono text-[11px] font-bold text-primary">
            PLC/Cobot → Ignition → BigQuery/Vertex AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OT_CLOUD_ROADMAP.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-5 rounded-2xl bg-surface-container-low/75 border border-outline-variant/40 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#141923] text-sky-300 font-mono text-[10px] font-bold">
                    {item.step} · {item.layer}
                  </span>
                  {idx < OT_CLOUD_ROADMAP.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-primary hidden md:block" />
                  )}
                </div>
                <h4 className="text-sm sm:text-[15px] font-bold text-on-surface mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-2.5 border-t border-outline-variant/30 font-mono text-[10.5px] font-bold text-primary">
                {item.tech}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AiOsmuPipelineTab() {
  return (
    <section
      id="osmu"
      className="scroll-mt-24 rounded-3xl bg-white/95 border border-outline-variant/45 p-6 sm:p-7 shadow-glass space-y-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-outline-variant/35">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce9ff] text-primary font-mono text-[10.5px] font-bold mb-2">
            <PlayCircle className="w-3.5 h-3.5" />
            AI CONTENT AUTOMATION PIPELINE
          </span>
          <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
            {OSMU_PIPELINE.headline}
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-xs font-bold text-emerald-700">
          {OSMU_PIPELINE.metric}
        </span>
      </div>

      {/* 5-Channel Distribution Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#dce9ff]/75 via-[#eef4ff] to-white border border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
          <Tv className="w-4 h-4 text-primary" />
          <span>원소스 멀티유즈(OSMU) 5대 동시 배포 플랫폼</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {OSMU_PIPELINE.channels.map((ch) => (
            <span
              key={ch}
              className="px-3 py-1 rounded-full bg-white border border-outline-variant/40 font-display text-[11px] font-semibold text-on-surface shadow-xs"
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* 4-Stage Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OSMU_PIPELINE.stages.map((st) => (
          <div
            key={st.step}
            className="p-5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 flex flex-col justify-between gap-4"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white font-mono text-[10px] font-bold">
                {st.step}
              </span>
              <h4 className="text-sm sm:text-[15px] font-bold text-on-surface mt-2.5 mb-2">
                {st.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{st.desc}</p>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex flex-wrap gap-1.5">
              {st.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-0.5 rounded-md bg-white border border-outline-variant/35 font-mono text-[10.5px] font-semibold text-primary"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
