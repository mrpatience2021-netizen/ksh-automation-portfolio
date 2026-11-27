'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Copy,
  Layers,
  Mail,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { useSiteUI } from '@/components/SiteUIProvider';
import ProofSlot from '@/components/profile/ProofSlot';
import SpecDetailModal, { SPEC_ICON_MAP } from '@/components/profile/SpecDetailModal';
import {
  CAREER_TIMELINE,
  CareerFilterKey,
  HR_PROFILE,
  SKILL_PROOF_MATRIX,
  SPEC_TILES,
  SpecTileItem,
} from '@/data/profileData';

const SKILL_ACCENTS = {
  blue: {
    badge: 'bg-[#dbe7ff] text-primary border-primary/20',
    tag: 'bg-[#eff4ff] text-on-surface border-[#c7d9ff]',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tag: 'bg-emerald-50/70 text-on-surface border-emerald-200/80',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    tag: 'bg-amber-50/70 text-on-surface border-amber-200/80',
  },
  purple: {
    badge: 'bg-[#ebe2ff] text-tertiary border-tertiary/20',
    tag: 'bg-[#f4eeff] text-on-surface border-tertiary/20',
  },
  slate: {
    badge: 'bg-[#e5ecf6] text-on-surface border-outline-variant/60',
    tag: 'bg-[#f2f5fa] text-on-surface border-outline-variant/50',
  },
};

const TIMELINE_FILTERS: { key: CareerFilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'automation', label: '자동화 · AI · 빌드' },
  { key: 'global', label: '글로벌 EPC · 무역 · ERP' },
];

export default function ProfilePage() {
  const { copyText, openPdfModal } = useSiteUI();

  // Zone 1: Portrait graceful fallback (shows sleek metallic card if /images/profile-main.jpg is absent)
  const [photoFailed, setPhotoFailed] = useState(false);

  // Zone 2: Selected Spec Modal
  const [selectedSpec, setSelectedSpec] = useState<SpecTileItem | null>(null);

  // Zone 3: Timeline Filter & Accordion (latest 2 expanded by default)
  const [activeFilter, setActiveFilter] = useState<CareerFilterKey>('all');
  const [openIds, setOpenIds] = useState<string[]>([
    CAREER_TIMELINE[0].id,
    CAREER_TIMELINE[1].id,
  ]);

  const filteredTimeline = useMemo(() => {
    if (activeFilter === 'all') return CAREER_TIMELINE;
    return CAREER_TIMELINE.filter((item) => item.track === activeFilter);
  }, [activeFilter]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allVisibleOpen =
    filteredTimeline.length > 0 &&
    filteredTimeline.every((item) => openIds.includes(item.id));

  const toggleAllVisible = () => {
    if (allVisibleOpen) {
      const visibleSet = new Set(filteredTimeline.map((i) => i.id));
      setOpenIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      setOpenIds((prev) => Array.from(new Set([...prev, ...filteredTimeline.map((i) => i.id)])));
    }
  };

  return (
    <div className="relative min-h-screen bg-surface overflow-x-hidden">
      {/* Main(/)과 동일한 배경 도트 그리드 & 블루·라벤더 앰비언트 글로우 */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.045] bg-[radial-gradient(#004ac6_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute -top-24 right-0 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-primary/10 via-tertiary/10 to-transparent blur-3xl" />

      <div className="relative z-10 max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 pt-5 pb-16 space-y-10">
        {/* Top Minimal Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-inverse-surface text-on-surface hover:text-inverse-on-surface border border-outline-variant/50 text-xs font-semibold shadow-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>허브로 돌아가기</span>
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="font-display text-xs uppercase tracking-[0.06em] font-bold text-primary">
              01. INTERACTIVE RESUME
            </span>
          </div>

          <span className="font-mono text-[11px] font-semibold text-on-surface-variant">
            UPDATED 2026 · GLOBAL AUTOMATION ENGINEER
          </span>
        </div>

        {/* ===================================================================
            ZONE 1. 상단 인사 카드 (메인 히어로 톤앤매너 그대로 계승)
           =================================================================== */}
        <section
          aria-label="인사 프로필 카드"
          className="relative rounded-3xl overflow-hidden bg-white/85 backdrop-blur-xl border border-outline-variant/40 shadow-glass"
        >
          {/* 메인 히어로와 동일한 은은한 우측 상단 라벤더-블루 광원 */}
          <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-br from-tertiary-fixed/70 via-primary-fixed/50 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#004ac6_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-9">
            <div className="flex flex-col md:flex-row gap-7 lg:gap-9 items-start">
              {/* Left: Vertical Portrait Frame with Main Hero Lavender/Blue Metallic Aesthetic */}
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="relative w-[148px] sm:w-[164px] aspect-[3/4] rounded-2xl overflow-hidden p-1.5 bg-gradient-to-br from-surface-container-low via-tertiary-fixed/60 to-primary-fixed/70 border border-outline-variant/40 shadow-glass">
                  {!photoFailed ? (
                    <img
                      src={HR_PROFILE.photoSrc}
                      alt={`${HR_PROFILE.nameKr} (${HR_PROFILE.nameEn}) 프로필 사진`}
                      onError={() => setPhotoFailed(true)}
                      className="w-full h-full object-cover object-top rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl relative flex flex-col items-center justify-between p-4 bg-gradient-to-br from-[#213145] via-[#273a54] to-[#1a2738] text-white overflow-hidden">
                      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary-container/35 blur-2xl pointer-events-none" />
                      <div className="relative z-10 w-full flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-inverse-primary">
                          ID · 2026
                        </span>
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                      </div>

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-tertiary text-white flex items-center justify-center shadow-lg border border-white/25">
                          <span className="font-display text-lg font-bold tracking-wider">KSH</span>
                        </div>
                        <span className="mt-2.5 font-display text-[11px] font-bold tracking-[0.12em] text-inverse-on-surface uppercase">
                          RICKY KIM
                        </span>
                      </div>

                      <div className="relative z-10 w-full text-center pt-2 border-t border-white/15">
                        <span className="font-mono text-[9.5px] font-semibold text-sky-300">
                          PLC · COBOT · AI
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Name, Positioning, 4 Basic Info Items, PDF Button */}
              <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-outline-variant/35">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-primary font-display text-[10.5px] font-bold uppercase tracking-[0.06em] mb-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      PROFILE — 2026 · INTERACTIVE RESUME
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-on-surface">
                        {HR_PROFILE.nameKr}
                      </h1>
                      <span className="text-outline-variant font-light text-2xl">|</span>
                      <span className="font-display text-xl sm:text-2xl font-semibold text-primary tracking-[-0.01em]">
                        {HR_PROFILE.nameEn}
                      </span>
                    </div>
                    <p className="mt-2 text-sm sm:text-[15.5px] text-on-surface-variant leading-[1.6] font-medium">
                      {HR_PROFILE.positioning}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openPdfModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-inverse-surface hover:bg-primary text-white text-xs font-display font-semibold shadow-sm transition-all cursor-pointer shrink-0 self-start"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>이력서 PDF 인쇄</span>
                  </button>
                </div>

                {/* 4 Basic Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-low/85 border border-outline-variant/40">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-[13.5px] font-medium text-on-surface">
                      {HR_PROFILE.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-low/85 border border-outline-variant/40">
                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-[13.5px] font-semibold text-on-surface">
                      {HR_PROFILE.experienceTotal}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText(HR_PROFILE.phone, '연락처')}
                    className="group flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-surface-container-low/85 hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary/40 transition cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-mono text-xs sm:text-[13.5px] font-semibold text-on-surface">
                        {HR_PROFILE.phone}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant group-hover:text-primary shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                      복사
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyText(HR_PROFILE.email, '이메일')}
                    className="group flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-surface-container-low/85 hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary/40 transition cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-mono text-xs sm:text-[13.5px] font-semibold text-on-surface truncate">
                        {HR_PROFILE.email}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant group-hover:text-primary shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                      복사
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Internal Slim Metric Strip (Cool Blue → Soft Lavender Editorial Strip) */}
          <div
            id="metrics"
            className="relative z-10 scroll-mt-24 px-6 sm:px-8 lg:px-9 py-4 bg-gradient-to-r from-[#eaf1ff] via-[#eef3ff] to-[#f3ebff] border-t border-outline-variant/40 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant/40"
          >
            {HR_PROFILE.metrics.map((metric, idx) => (
              <div
                key={metric.id}
                className={`flex items-baseline sm:items-center gap-3 py-2.5 sm:py-0.5 ${
                  idx === 0 ? 'sm:pr-6' : idx === 1 ? 'sm:px-6' : 'sm:pl-6'
                }`}
              >
                <span className="font-display text-lg sm:text-xl font-extrabold text-primary tracking-tight whitespace-nowrap">
                  {metric.value}
                </span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-[13px] font-semibold text-on-surface leading-snug">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================
            ZONE 1.5. 실무 증명 스킬 · 자격증 매트릭스 (인사 카드 바로 아래)
           =================================================================== */}
        <section id="skill-matrix" className="scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-4 pb-2.5 border-b border-outline-variant/40">
            <div>
              <span className="font-display text-[12px] uppercase tracking-[0.06em] font-bold text-primary inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                02 / Evidence-Based Skill &amp; Credential Matrix
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
                실무 증명 스킬 · 자격증 매트릭스
              </h2>
              <p className="text-xs sm:text-[13px] text-on-surface-variant mt-1">
                주관적인 퍼센트(%) 막대그래프 대신, 실제 현장·프로젝트·공인 자격으로 검증된 역량만 카테고리별 태그로 정리했습니다.
              </p>
            </div>
            <span className="font-display text-[12px] text-on-surface-variant font-semibold">
              5 Verified Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SKILL_PROOF_MATRIX.map((cat, idx) => {
              const palette = SKILL_ACCENTS[cat.accent];
              const isLastWide = idx === SKILL_PROOF_MATRIX.length - 1;
              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl bg-white/90 backdrop-blur-xl border border-outline-variant/40 p-5 shadow-glass flex flex-col justify-between ${
                    isLastWide ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span
                        className={`px-3 py-1 rounded-full border font-display text-[11px] font-bold ${palette.badge}`}
                      >
                        {cat.title}
                      </span>
                      <span className="text-[11.5px] text-on-surface-variant font-medium">
                        {cat.subtitle}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold leading-snug ${palette.tag}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            ZONE 2. 정밀 스펙 벤토 그리드 (메인의 딥차콜 · 쿨블루 · 소프트라벤더 · 실버 톤 완벽 계승)
           =================================================================== */}
        <section id="specs" className="scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-4 pb-2.5 border-b border-outline-variant/40">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[12px] uppercase tracking-[0.06em] font-bold text-primary">
                03 / Verified Specifications
              </span>
              <span className="text-outline-variant">—</span>
              <span className="text-[13px] text-on-surface-variant font-semibold">
                정밀 스펙 &amp; 역량 인덱스 (클릭 시 상세 모달)
              </span>
            </div>
            <span className="font-display text-[12px] text-on-surface-variant font-semibold">
              8 Spec Tiles Active
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {SPEC_TILES.map((tile) => {
              const Icon = SPEC_ICON_MAP[tile.icon];

              // 메인 페이지(/) 3대 카드와 100% 동일한 컬러 표면 계승
              const surfaceStyles =
                tile.surface === 'dark'
                  ? {
                      card: 'bg-inverse-surface text-inverse-on-surface border-outline-variant/30 shadow-glass-dark hover:shadow-[0_20px_44px_-8px_rgba(11,28,48,0.38)]',
                      iconBox: 'bg-white/15 text-[#b4c5ff] border-white/15 group-hover:bg-primary-container group-hover:text-white',
                      arrow: 'text-inverse-on-surface/65 group-hover:text-white',
                      title: 'text-white',
                      keyword: 'text-inverse-primary',
                      decor: 'from-sky-400/20 to-transparent',
                    }
                  : tile.surface === 'blue'
                  ? {
                      card: 'bg-gradient-to-br from-[#dce9ff] via-[#e6f0ff] to-[#f4f8ff] text-on-surface border-outline-variant/40 shadow-glass hover:shadow-glass-lg',
                      iconBox: 'bg-white/90 text-primary border-primary/15 group-hover:bg-primary group-hover:text-white',
                      arrow: 'text-on-surface-variant group-hover:text-primary',
                      title: 'text-on-surface',
                      keyword: 'text-primary',
                      decor: 'from-primary/15 to-transparent',
                    }
                  : tile.surface === 'lavender'
                  ? {
                      card: 'bg-gradient-to-br from-[#e9ddff] via-[#e4e6ff] to-[#ffffff] text-on-surface border-outline-variant/40 shadow-glass hover:shadow-glass-lg',
                      iconBox: 'bg-white/90 text-tertiary border-tertiary/15 group-hover:bg-tertiary group-hover:text-white',
                      arrow: 'text-on-surface-variant group-hover:text-tertiary',
                      title: 'text-on-surface',
                      keyword: 'text-tertiary',
                      decor: 'from-tertiary/15 to-transparent',
                    }
                  : {
                      card: 'bg-gradient-to-br from-[#eff4ff] via-[#f7f9ff] to-[#ffffff] text-on-surface border-outline-variant/45 shadow-glass hover:shadow-glass-lg',
                      iconBox: 'bg-white text-primary border-outline-variant/40 group-hover:bg-inverse-surface group-hover:text-white',
                      arrow: 'text-on-surface-variant group-hover:text-primary',
                      title: 'text-on-surface',
                      keyword: 'text-on-surface-variant',
                      decor: 'from-primary/10 to-transparent',
                    };

              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setSelectedSpec(tile)}
                  className={`group relative overflow-hidden text-left rounded-2xl border p-5 sm:p-6 min-h-[156px] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] flex flex-col justify-between cursor-pointer ${surfaceStyles.card}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-tl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity ${surfaceStyles.decor}`}
                  />

                  <div className="relative z-10 flex items-start justify-between gap-2 w-full">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs transition-colors ${surfaceStyles.iconBox}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${surfaceStyles.arrow}`}
                    />
                  </div>

                  <div className="relative z-10 mt-6">
                    <div className={`text-[15.5px] sm:text-[17px] font-bold leading-snug ${surfaceStyles.title}`}>
                      {tile.title}
                    </div>
                    <div className={`text-xs font-semibold mt-1 truncate ${surfaceStyles.keyword}`}>
                      {tile.keyword}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            ZONE 3. 전체 경력 & 프로젝트 타임라인 (필터 + 아코디언 + ProofSlot)
           =================================================================== */}
        <section id="timeline" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 pb-2.5 border-b border-outline-variant/40">
            <div>
              <span className="font-display text-[12px] uppercase tracking-[0.06em] font-bold text-primary inline-flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                04 / Career &amp; Project Timeline (2009 – 2026)
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
                전체 경력 및 핵심 프로젝트 타임라인
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-surface-container-low border border-outline-variant/45 shadow-xs">
                {TIMELINE_FILTERS.map((f) => {
                  const active = activeFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setActiveFilter(f.key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        active
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-white/80'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={toggleAllVisible}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-inverse-surface text-on-surface hover:text-white border border-outline-variant/50 text-xs font-semibold transition cursor-pointer"
              >
                {allVisibleOpen ? '모두 접기' : '모두 펼치기'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTimeline.map((item) => {
              const isOpen = openIds.includes(item.id);
              const isAutomation = item.track === 'automation';

              return (
                <article
                  key={item.id}
                  className={`rounded-2xl bg-white/90 backdrop-blur-xl border shadow-glass overflow-hidden transition-all ${
                    isOpen
                      ? isAutomation
                        ? 'border-tertiary/35 ring-1 ring-tertiary/15'
                        : 'border-primary/35 ring-1 ring-primary/15'
                      : 'border-outline-variant/40 hover:border-outline-variant/75'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className={`w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-3 transition cursor-pointer ${
                      isOpen
                        ? isAutomation
                          ? 'bg-gradient-to-r from-[#f4eeff]/75 via-[#f7f5ff]/60 to-white'
                          : 'bg-gradient-to-r from-[#eaf1ff]/80 via-[#f3f7ff]/60 to-white'
                        : 'hover:bg-surface-container-low/50'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 min-w-0 flex-1">
                      <span
                        className={`font-mono text-xs font-bold md:w-36 shrink-0 ${
                          isAutomation ? 'text-tertiary' : 'text-primary'
                        }`}
                      >
                        {item.period}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[15px] sm:text-base font-bold text-on-surface leading-snug">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                              isAutomation
                                ? 'bg-tertiary-fixed/80 text-tertiary border-tertiary/20'
                                : 'bg-surface-container-high text-primary border-primary/20'
                            }`}
                          >
                            {item.trackLabel}
                          </span>
                        </div>
                        <div className="text-xs sm:text-[13px] text-on-surface-variant mt-1">
                          {item.org}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {item.proofs && item.proofs.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-mono text-[10.5px] font-bold">
                          증빙 {item.proofs.length}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-outline-variant/35 bg-white space-y-4">
                      <p className="text-xs sm:text-[14px] font-medium text-on-surface leading-[1.7]">
                        {item.summary}
                      </p>

                      <ul className="space-y-2 text-xs sm:text-[13.5px] text-on-surface-variant leading-[1.7]">
                        {item.highlights.map((hl) => (
                          <li key={hl} className="flex items-start gap-2.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                                isAutomation ? 'bg-tertiary' : 'bg-primary'
                              }`}
                            />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/45 font-mono text-[11px] font-semibold text-on-surface"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <ProofSlot proofs={item.proofs} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Spec Detail Glass Modal */}
      <SpecDetailModal spec={selectedSpec} onClose={() => setSelectedSpec(null)} />
    </div>
  );
}
