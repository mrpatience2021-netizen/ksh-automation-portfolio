'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Globe, Play, TrendingUp, Users } from 'lucide-react';
import { CORE_CAPABILITIES, HERO_METRICS, SITE_META } from '@data/site';

const METRIC_ICONS = {
  trending_up: TrendingUp,
  groups: Users,
  public: Globe,
};

export default function HomePage() {
  const [heroSrc, setHeroSrc] = useState<string>(SITE_META.heroImageLocal);

  return (
    <div className="w-full max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-6 lg:pt-5 lg:pb-8 flex flex-col gap-5">
      {/* =====================================================================
          HERO SECTION — 1-Screen Compact Editorial Bento (Flush Aligned)
         ===================================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-surface-container-lowest/75 border border-outline-variant/35 shadow-glass px-6 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-6">
        {/* Subtle Architectural Micro-Dot Grid & Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.045] bg-[radial-gradient(#004ac6_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 via-tertiary/10 to-transparent blur-3xl pointer-events-none" />

        {/* Subtle Kinematics Vector Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <svg className="w-full h-full" fill="none" viewBox="0 0 900 320" aria-hidden="true">
            <line stroke="#004ac6" strokeDasharray="4 6" strokeOpacity="0.28" strokeWidth="0.8" x1="510" x2="510" y1="0" y2="320" />
            <line stroke="#004ac6" strokeDasharray="4 6" strokeOpacity="0.2" strokeWidth="0.8" x1="400" x2="880" y1="165" y2="165" />
            <circle cx="510" cy="86" fill="#004ac6" r="3" />
            <polyline points="510,86 476,86 460,68" stroke="#004ac6" strokeOpacity="0.7" strokeWidth="1" />
            <rect fill="#ffffff" fillOpacity="0.92" height="22" rx="6" stroke="#004ac6" strokeWidth="0.8" width="96" x="372" y="56" />
            <text fill="#004ac6" fontFamily="monospace" fontSize="9.5" fontWeight="700" x="380" y="70">
              TCP ±0.02mm
            </text>
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Crisp Identity, Editorial Headline & 3 Balanced KPI Tiles */}
          <div className="lg:col-span-7 flex flex-col justify-between min-w-0">
            <div>
              {/* Top Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant mb-3.5 border border-outline-variant/40">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-display text-[11px] leading-none font-semibold uppercase tracking-[0.06em]">
                  {SITE_META.portfolioBadge}
                </span>
              </div>

              {/* Name & Identity Bar (김성현 | Ricky Kim) */}
              <div className="flex flex-wrap items-baseline gap-2.5 mb-2.5">
                <span className="text-[24px] sm:text-[28px] font-extrabold tracking-[0.06em] text-on-surface">
                  {SITE_META.heroIdentityKr}
                </span>
                <span className="text-outline-variant font-light text-xl">|</span>
                <span className="font-display text-[20px] sm:text-[23px] font-semibold tracking-[-0.01em] text-primary">
                  {SITE_META.heroIdentityEn}
                </span>
              </div>

              {/* Single-Line Crisp Main Headline */}
              <h1 className="text-[22px] sm:text-[27px] lg:text-[31px] xl:text-[34px] leading-[1.28] font-extrabold tracking-[-0.025em] text-on-surface mb-3 lg:whitespace-nowrap">
                {SITE_META.heroHeadline}
              </h1>

              <p className="text-[14.5px] sm:text-[15.5px] leading-[1.6] text-on-surface-variant max-w-2xl mb-6">
                {SITE_META.heroSubtitle}
              </p>
            </div>

            {/* 3 Mini KPI Tiles — Full Column Width, Compact & Balanced */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {HERO_METRICS.map((metric) => {
                const Icon = METRIC_ICONS[metric.icon];
                return (
                  <Link
                    key={metric.id}
                    href={metric.href}
                    className="group px-4 py-3 rounded-xl bg-surface-container-low/85 border border-outline-variant/40 hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 hover:scale-[1.02] shadow-xs hover:shadow-glass transition-all duration-300 ease-out flex flex-col justify-between min-h-[82px]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon className="w-[17px] h-[17px] text-primary group-hover:text-on-primary transition-colors" />
                      <ArrowUpRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-on-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <div>
                      <span className="font-display text-[10.5px] leading-none font-semibold tracking-[0.06em] text-on-surface-variant group-hover:text-inverse-on-surface/80 uppercase block">
                        {metric.kicker}
                      </span>
                      <span className="text-[13.5px] leading-[1.35] font-bold block text-on-surface group-hover:text-on-primary mt-1">
                        {metric.title}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Column: Proportioned Wide Robotics Visual Card (Matches Left Height) */}
          <div className="lg:col-span-5 flex items-stretch">
            <div className="group relative w-full h-[240px] sm:h-[268px] lg:h-full lg:min-h-[268px] lg:max-h-[296px] rounded-2xl bg-gradient-to-br from-surface-container-low via-tertiary-fixed/40 to-primary-fixed/40 shadow-glass overflow-hidden border border-outline-variant/40 p-2.5">
              {/* Rotating Circular Orbit Text */}
              <div className="absolute top-3 left-3 w-20 h-20 pointer-events-none opacity-85 z-20">
                <svg className="w-full h-full animate-slow-orbit" viewBox="0 0 120 120" aria-hidden="true">
                  <defs>
                    <path
                      d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                      id="circleTextPath"
                    />
                  </defs>
                  <text className="fill-on-surface font-display text-[10px] font-semibold uppercase tracking-[0.14em]">
                    <textPath href="#circleTextPath" startOffset="0%">
                      AUTOMATION • ROBOTICS • AI •
                    </textPath>
                  </text>
                </svg>
              </div>

              <img
                src={heroSrc}
                onError={() => {
                  if (heroSrc !== SITE_META.heroImageFallback) {
                    setHeroSrc(SITE_META.heroImageFallback);
                  }
                }}
                alt="김성현 글로벌 자동화 아키텍트 로보틱스 3D 비주얼"
                className="w-full h-full object-cover object-center rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />

              {/* Circular Floating Profile CTA */}
              <Link
                href="/profile"
                className="group/cta absolute bottom-4 right-4 w-[74px] h-[74px] rounded-full bg-gradient-to-tr from-primary to-tertiary text-on-primary shadow-xl flex flex-col items-center justify-center text-center p-1 hover:scale-110 transition-transform duration-300 z-30"
              >
                <span className="text-[11px] leading-[1.2] font-bold">프로필·재능</span>
                <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          01 / CORE CAPABILITIES — Compact 3-Column Bento Grid (100% Above-Fold)
         ===================================================================== */}
      <section className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2 border-b border-outline-variant/40">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[12px] uppercase tracking-[0.06em] text-primary font-bold">
              01 / Core Capabilities
            </span>
            <span className="text-outline-variant">—</span>
            <span className="text-[13px] text-on-surface-variant font-semibold">
              핵심 실무 역량 매트릭스
            </span>
          </div>
          <span className="font-display text-[12px] text-on-surface-variant font-semibold">
            3 Disciplines Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {CORE_CAPABILITIES.map((card) => {
            const isDark = card.theme === 'dark';
            const isBlue = card.theme === 'blue';

            const containerClass = isDark
              ? 'bg-inverse-surface text-inverse-on-surface border-outline-variant/30 shadow-glass-dark'
              : isBlue
              ? 'bg-surface-container-high text-on-surface border-outline-variant/35 shadow-glass'
              : 'bg-gradient-to-br from-tertiary-fixed via-primary-fixed to-surface-container-lowest text-on-surface border-outline-variant/35 shadow-glass';

            const indexColor = isDark
              ? 'text-inverse-primary'
              : isBlue
              ? 'text-primary'
              : 'text-tertiary';

            const descColor = isDark ? 'text-inverse-on-surface/85' : 'text-on-surface-variant';
            const dividerColor = isDark ? 'border-surface/15' : 'border-outline-variant/40';

            return (
              <div
                key={card.id}
                className={`group rounded-2xl px-6 py-7 flex flex-col justify-between min-h-[252px] border relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-glass-lg ${containerClass}`}
              >
                {/* Full-card Stretched Link (allows independent interactive pill links below) */}
                <Link
                  href={card.href}
                  aria-label={`${card.title} 워크스페이스로 이동`}
                  className="absolute inset-0 z-10 rounded-2xl"
                />

                {/* Decorative Vector Motifs (Scaled to Compact Card) */}
                {card.id === 'plc' && (
                  <div className="absolute -right-5 -bottom-7 w-44 h-44 pointer-events-none opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 200 200" aria-hidden="true">
                      <circle cx="100" cy="100" r="80" stroke="#38bdf8" strokeDasharray="6 4" strokeOpacity="0.4" strokeWidth="2" />
                      <path d="M 30 100 A 70 70 0 0 1 170 100" stroke="#38bdf8" strokeDasharray="140 200" strokeLinecap="round" strokeWidth="6" />
                      <circle cx="100" cy="100" r="50" stroke="#2563eb" strokeWidth="1.5" />
                      <text fill="#38bdf8" fontFamily="monospace" fontSize="18" fontWeight="700" textAnchor="middle" x="100" y="94">
                        18
                      </text>
                      <text fill="#94a3b8" fontFamily="monospace" fontSize="10" letterSpacing="0.1em" textAnchor="middle" x="100" y="112">
                        SEQ STEP
                      </text>
                    </svg>
                  </div>
                )}

                {card.id === 'robotics' && (
                  <div className="absolute -right-6 -bottom-6 w-44 h-44 pointer-events-none opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 200 200" aria-hidden="true">
                      <line stroke="#004ac6" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="180" y1="100" y2="100" />
                      <line stroke="#004ac6" strokeDasharray="3 3" strokeWidth="1" x1="100" x2="100" y1="20" y2="180" />
                      <circle cx="100" cy="100" r="75" stroke="#2563eb" strokeDasharray="5 5" strokeWidth="1.5" />
                      <circle cx="100" cy="100" r="50" stroke="#2563eb" strokeWidth="1.5" />
                      <circle cx="100" cy="50" fill="#2563eb" r="5" />
                      <circle cx="150" cy="100" fill="#2563eb" r="5" />
                      <circle cx="70" cy="130" fill="#2563eb" r="5" />
                      <polyline points="100,100 100,50 150,100 70,130" stroke="#2563eb" strokeLinecap="round" strokeWidth="1.5" />
                      <text fill="#004ac6" fontFamily="monospace" fontSize="11" fontWeight="700" x="132" y="85">
                        J3: 74.2°
                      </text>
                    </svg>
                  </div>
                )}

                {card.id === 'ai' && (
                  <div className="absolute -right-5 -bottom-6 w-44 h-44 pointer-events-none opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 200 200" aria-hidden="true">
                      <rect height="85" rx="8" stroke="#632ecd" strokeDasharray="3 3" strokeWidth="1.5" width="125" x="55" y="35" />
                      <line stroke="#632ecd" strokeWidth="1" x1="55" x2="180" y1="55" y2="55" />
                      <rect fill="#632ecd" fillOpacity="0.3" height="14" rx="3" width="38" x="65" y="68" />
                      <rect fill="#2563eb" fillOpacity="0.25" height="14" rx="3" width="50" x="110" y="68" />
                      <circle cx="70" cy="150" fill="#7d4ce7" r="6" />
                      <circle cx="120" cy="130" fill="#2563eb" r="5" />
                      <circle cx="150" cy="165" fill="#632ecd" r="7" />
                      <line stroke="#7d4ce7" strokeWidth="1.5" x1="70" x2="120" y1="150" y2="130" />
                      <line stroke="#2563eb" strokeWidth="1.5" x1="120" x2="150" y1="130" y2="165" />
                    </svg>
                  </div>
                )}

                {/* Top Copy */}
                <div className="relative z-10 pointer-events-none">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-display text-[12px] tracking-[0.03em] font-bold ${indexColor}`}>
                      {card.indexLabel}
                    </span>
                    <ArrowUpRight
                      className={`w-5 h-5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        isDark
                          ? 'text-inverse-on-surface/75 group-hover:text-inverse-on-surface'
                          : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                    />
                  </div>

                  <h2 className="font-display text-[22px] lg:text-[24px] leading-[1.2] font-bold uppercase tracking-[-0.02em] mb-3 whitespace-nowrap">
                    {card.title}
                  </h2>

                  <p className={`text-[14px] leading-[1.6] mb-3.5 max-w-[95%] ${descColor}`}>
                    {card.description}
                  </p>

                  <span className={`font-mono text-[11px] tracking-[0.02em] font-semibold block ${indexColor}`}>
                    {card.techSpec}
                  </span>
                </div>

                {/* Bottom Interactive Pills — Direct Deep Links to Target Tabs */}
                <div className={`flex flex-wrap items-center gap-2 pt-4 mt-5 border-t relative z-20 ${dividerColor}`}>
                  {card.pills.map((pill) => {
                    if (isDark) {
                      return (
                        <Link
                          key={pill.label}
                          href={pill.href}
                          className={`px-3 py-1 rounded-full text-[11px] flex items-center gap-1 font-semibold transition hover:scale-105 ${
                            pill.highlight
                              ? 'bg-primary-container hover:bg-[#2563EB] text-white shadow-sm'
                              : 'bg-white/10 hover:bg-white/25 text-inverse-on-surface'
                          }`}
                        >
                          {pill.highlight && <Play className="w-3 h-3 fill-current" />}
                          <span>{pill.label}</span>
                        </Link>
                      );
                    }

                    return (
                      <Link
                        key={pill.label}
                        href={pill.href}
                        className={`px-3 py-1 rounded-full text-[11px] flex items-center gap-1 font-semibold transition hover:scale-105 ${
                          pill.highlight
                            ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm'
                            : 'bg-surface-container-lowest/95 hover:bg-[#2563EB] hover:text-white text-on-surface shadow-xs'
                        }`}
                      >
                        {pill.highlight && <Play className="w-3 h-3 fill-current" />}
                        <span>{pill.label}</span>
                        {pill.externalArrow && <ArrowUpRight className="w-3 h-3" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
