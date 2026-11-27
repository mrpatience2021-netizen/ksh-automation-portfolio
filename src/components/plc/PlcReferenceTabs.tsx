'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Keyboard,
  Layers,
  Scale,
  Search,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  DEVICE_MAP,
  GX_SHORTCUT_GROUPS,
  OPTIMIZATION_GUIDES,
  PLC_REFERENCE_CARDS,
  PLC_TOP_COMMANDS,
  TOP_COMMAND_GROUPS,
  TopCommandGroupKey,
} from '@/data/plcData';
import { PlcChecklistTab, PlcWiringGuide } from './PlcWiringAndChecklist';

const DEVICE_BADGE_TONES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-300',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
};

const CALLOUT_TONES = {
  blue: 'bg-[#eff4ff] border-primary/25 text-on-surface',
  amber: 'bg-amber-50/90 border-amber-200 text-amber-950',
  purple: 'bg-[#f4eeff] border-tertiary/25 text-on-surface',
};

function ConditionalRefImage({
  src,
  alt,
  caption,
  onZoom,
}: {
  src?: string;
  alt: string;
  caption?: string;
  onZoom: (payload: { src: string; alt: string; caption?: string }) => void;
}) {
  const [failed, setFailed] = useState(false);

  // 조건부 렌더링: 경로가 없거나 이미지 로드 실패 시 빈 박스/깨진 아이콘을 절대 렌더링하지 않음
  if (!src || src.trim().length === 0 || failed) {
    return null;
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => onZoom({ src, alt, caption })}
        className="group relative block w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low cursor-zoom-in"
      >
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="w-full max-h-[300px] object-contain bg-white transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#141923]/80 text-white text-[11px] font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
          크게 보기
        </span>
      </button>
      {caption && (
        <p className="text-[11px] text-on-surface-variant mt-1.5 text-center">{caption}</p>
      )}
    </div>
  );
}

// ============================================================================
// Reference Sub-tab 1: PLC 원리 & 구조 (비주얼 퍼스트 카드 3종 + 라이트박스)
// ============================================================================
export function PlcPrinciplesTab() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption?: string } | null>(
    null
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {PLC_REFERENCE_CARDS.map((card, idx) => {
          const isAccentBlue = idx === 0;
          const isAccentAmber = idx === 1;
          const headerTone = isAccentBlue
            ? 'from-[#dce9ff] via-[#ecf3ff] to-white'
            : isAccentAmber
            ? 'from-[#eef4ff] via-[#f6f9ff] to-white'
            : 'from-[#e9ddff] via-[#eeefff] to-white';

          return (
            <article
              key={card.id}
              className="rounded-3xl bg-white/95 backdrop-blur-xl border border-outline-variant/45 shadow-glass overflow-hidden"
            >
              <div
                className={`px-6 py-4 bg-gradient-to-r ${headerTone} border-b border-outline-variant/35 flex flex-wrap items-center justify-between gap-2`}
              >
                <div>
                  <span className="font-display text-[11px] uppercase tracking-[0.06em] font-bold text-primary">
                    {card.badge}
                  </span>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-on-surface mt-0.5">
                    {card.title}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white/90 border border-outline-variant/45 font-mono text-[11px] font-semibold text-on-surface"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-on-surface-variant leading-[1.7] font-medium">
                  {card.lead}
                </p>

                {/* 조건부 시각 이미지 (경로 존재 & 로드 성공 시에만 노출 + 클릭 시 라이트박스) */}
                <ConditionalRefImage
                  src={card.image}
                  alt={card.title}
                  caption={card.imageCaption}
                  onZoom={setLightbox}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {card.bullets.map((b) => (
                    <div
                      key={b.label}
                      className="p-4 rounded-2xl bg-surface-container-low/75 border border-outline-variant/35 space-y-1"
                    >
                      <div className="text-xs sm:text-[13px] font-bold text-primary">{b.label}</div>
                      <p className="text-xs sm:text-[13px] text-on-surface-variant leading-[1.65]">
                        {b.text}
                      </p>
                    </div>
                  ))}
                </div>

                {card.callout && (
                  <div
                    className={`p-4 rounded-2xl border text-xs sm:text-[13px] leading-relaxed ${
                      CALLOUT_TONES[card.callout.tone]
                    }`}
                  >
                    <span className="font-bold mr-2">💡 {card.callout.title}:</span>
                    <span className="font-medium">{card.callout.body}</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Image Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[80] bg-[#141923]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-3xl bg-white border border-outline-variant/60 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-outline-variant/40 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-bold text-on-surface truncate">{lightbox.alt}</div>
                {lightbox.caption && (
                  <div className="text-xs text-on-surface-variant truncate">{lightbox.caption}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="확대 이미지 닫기"
                className="w-8 h-8 rounded-full bg-inverse-surface hover:bg-primary text-white flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-[#f4f6fa] flex items-center justify-center">
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[78vh] w-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Reference Sub-tab 2: 빈출 명령어 Top 20 (현장 6대 그룹 + GX Works 단축키 + 메모리 맵)
// ============================================================================
export function PlcTopCommandsTab() {
  const [groupFilter, setGroupFilter] = useState<TopCommandGroupKey>('전체');
  const [query, setQuery] = useState('');

  const groupKeys: TopCommandGroupKey[] = [
    '전체',
    '1. 비교',
    '2. 연산·카운트',
    '3. 데이터 전송',
    '4. 일괄 리셋',
    '5. 시프트',
    '6. 특수모듈',
  ];

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLC_TOP_COMMANDS.filter((row) => {
      const grpOk = groupFilter === '전체' || row.group === groupFilter;
      const qOk =
        !q ||
        [row.group, row.cmd, row.full, row.syntax, row.analogy, row.caution].some((f) =>
          f.toLowerCase().includes(q)
        );
      return grpOk && qOk;
    });
  }, [groupFilter, query]);

  return (
    <div className="space-y-6">
      {/* 1. 현장 6대 그룹 한눈에 보기 (클릭 시 아래 테이블 필터 연동) */}
      <section className="rounded-3xl bg-white/95 border border-outline-variant/45 p-5 sm:p-6 shadow-glass">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <span className="font-display text-[11px] uppercase tracking-[0.06em] font-bold text-primary flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              321개 매뉴얼 → 현장 90% 커버 6대 핵심 그룹
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-on-surface mt-0.5">
              실전 빈출 명령어 6대 그룹 (클릭하여 필터링)
            </h2>
          </div>
          {groupFilter !== '전체' && (
            <button
              type="button"
              onClick={() => setGroupFilter('전체')}
              className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-primary cursor-pointer"
            >
              전체 보기 초기화
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOP_COMMAND_GROUPS.map((g) => {
            const active = groupFilter === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setGroupFilter(active ? '전체' : g.key)}
                className={`text-left p-4 rounded-2xl border transition cursor-pointer ${
                  active
                    ? 'bg-[#eef4ff] border-primary ring-1 ring-primary/30 shadow-xs'
                    : 'bg-surface-container-low/65 border-outline-variant/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-extrabold text-primary">{g.key}</span>
                  <span className="font-mono text-[11px] font-bold text-on-surface truncate">
                    {g.commands}
                  </span>
                </div>
                <div className="text-xs font-semibold text-on-surface">{g.analogy}</div>
                <p className="text-[11.5px] text-on-surface-variant mt-1 leading-relaxed">
                  {g.fieldUse}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. 검색 & 6대 그룹 필터링 명령어 테이블 */}
      <section className="rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass overflow-hidden">
        <div className="p-5 border-b border-outline-variant/35 bg-surface-container-low/70 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="명령어 약어, 영문, 현장 용도 검색 (예: BKRST, INCP, FROM, 시프트)..."
              className="w-full bg-white border border-outline-variant/55 focus:border-primary rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {groupKeys.map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setGroupFilter(grp)}
                className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold transition cursor-pointer border ${
                  groupFilter === grp
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white text-on-surface-variant border-outline-variant/45 hover:bg-surface-container'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/35 text-[11px] font-display font-bold text-on-surface-variant uppercase">
                <th className="py-3 px-4">명령어 / 그룹</th>
                <th className="py-3 px-4">영문 풀네임</th>
                <th className="py-3 px-4">작성 예시</th>
                <th className="py-3 px-4">쉬운 비유</th>
                <th className="py-3 px-4">현장 실무 주의사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-xs">
              {filteredCommands.map((row) => (
                <tr key={`${row.group}-${row.cmd}`} className="hover:bg-surface-container-low/45 transition">
                  <td className="py-3 px-4 font-mono font-bold text-primary whitespace-nowrap">
                    {row.cmd}
                    <div className="text-[10px] font-sans font-semibold text-on-surface-variant">
                      {row.group}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-700 whitespace-nowrap">
                    {row.full}
                  </td>
                  <td className="py-3 px-4 font-mono text-on-surface whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-low border border-outline-variant/40">
                      {row.syntax}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-amber-800 whitespace-nowrap">
                    {row.analogy}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant leading-relaxed">{row.caution}</td>
                </tr>
              ))}
              {filteredCommands.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-on-surface-variant">
                    검색어에 해당하는 명령어가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. GX Works2/3 단축키 + 디바이스 메모리 맵 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-5 rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant/35 bg-surface-container-low/70 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-bold text-on-surface">
              GX Works2 / 3 필수 단축키 치트시트
            </h3>
          </div>
          <div className="p-5 space-y-3.5 text-xs">
            {GX_SHORTCUT_GROUPS.map((sec) => (
              <div key={sec.group} className="space-y-1.5">
                <div className="text-[11px] font-display font-bold text-primary uppercase tracking-wider">
                  {sec.group}
                </div>
                <div className="divide-y divide-outline-variant/25 rounded-xl border border-outline-variant/35 overflow-hidden">
                  {sec.keys.map(([k, desc]) => (
                    <div
                      key={k}
                      className="px-3 py-2 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <span className="font-mono font-bold text-on-surface bg-surface-container-low border border-outline-variant/40 px-2 py-0.5 rounded w-fit text-[11px]">
                        {k}
                      </span>
                      <span className="text-on-surface-variant sm:text-right">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-7 rounded-3xl bg-white/95 border border-outline-variant/45 p-5 shadow-glass space-y-3">
          <h3 className="text-sm font-display font-bold text-on-surface flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            MELSEC Q-Series 핵심 디바이스 메모리 맵
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEVICE_MAP.map((d) => (
              <div
                key={d.dev}
                className="rounded-2xl bg-surface-container-low/55 border border-outline-variant/40 p-3.5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-md border font-mono text-xs font-bold ${
                      DEVICE_BADGE_TONES[d.tone]
                    }`}
                  >
                    {d.dev}
                  </span>
                  <span className="text-[10.5px] font-mono text-on-surface-variant">{d.radix}</span>
                </div>
                <div className="text-xs font-bold text-on-surface">{d.name}</div>
                <div className="text-[11px] font-mono text-primary font-semibold mt-0.5 mb-1">
                  {d.range}
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. 현장 표준 vs 스텝 압축 최적화 가이드 */}
      <section className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-display font-bold text-on-surface flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            현장 표준(사람 중심) vs 스텝 압축 최적화 가이드
          </h3>
          <span className="text-xs text-on-surface-variant">
            새벽 3시에 장비가 멈췄을 때 10초 만에 원인을 찾는 코드가 진짜 좋은 코드입니다.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {OPTIMIZATION_GUIDES.map((g) => (
            <div
              key={g.num}
              className="rounded-2xl bg-white/95 border border-outline-variant/40 p-5 shadow-glass space-y-2.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                  {g.num}
                </span>
                <h4 className="font-bold text-on-surface text-sm">{g.title}</h4>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/75 border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-800">✅ 현장 표준 (직관성 최우선)</div>
                <div className="font-mono font-semibold text-emerald-950">{g.standardCmd}</div>
                <p className="text-emerald-900/85 leading-relaxed">{g.standardReason}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/85 border border-amber-200 space-y-1">
                <div className="font-bold text-amber-800">⚡ 압축 방안 &amp; ⚠️ 리스크</div>
                <div className="font-mono font-semibold text-on-surface">{g.compactCmd}</div>
                <p className="text-amber-950/85 leading-relaxed">{g.risk}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-high/80 border border-primary/20 flex items-start gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-on-surface-variant leading-relaxed">
            <b className="text-on-surface">공짜 스텝 최적화 원칙:</b> 복잡한 병렬(OR) 회로는 왼쪽에, 단순 직렬(AND) 조건은 오른쪽에 배치하면 가독성을 유지하면서도 불필요한 분기 스택 명령어(<code className="font-mono font-bold text-primary">MPS/MRD/MPP</code>)를 줄일 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// Reference Sub-tab 3: 배선 · 인버터 · 시운전 (통합)
// ============================================================================
export function PlcWiringCommissioningTab() {
  return (
    <div className="space-y-8">
      <PlcWiringGuide />
      <PlcChecklistTab />
    </div>
  );
}
