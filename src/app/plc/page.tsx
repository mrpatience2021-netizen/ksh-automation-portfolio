'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  Keyboard,
  Plug,
  RotateCcw,
  Sliders,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';
import SubpageBreadcrumb from '@/components/SubpageBreadcrumb';
import { CIRCUIT_GROUPS, CIRCUITS, createFreshSim } from '@/components/plc/circuits';
import { SimState } from '@/components/plc/ladderPrimitives';
import PlcPdfViewerModal from '@/components/plc/PlcPdfViewerModal';
import {
  PlcPrinciplesTab,
  PlcTopCommandsTab,
  PlcWiringCommissioningTab,
} from '@/components/plc/PlcReferenceTabs';
import {
  PlcAiPromptTab,
  PlcIssueLogTab,
  PlcTroubleshootingDbTab,
} from '@/components/plc/PlcFieldLogTabs';
import { BINARY_TABLE_DATA } from '@/data/plcData';

type PillarId = 'lab' | 'reference' | 'fieldlog';
type LabSubTab = 'simulator' | 'binary';
type RefSubTab = 'principles' | 'commands' | 'wiring';
type FieldSubTab = 'db' | 'prompt' | 'issuelog';

const BTN_COLORS: Record<string, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white shadow-[0_4px_0_#1e40af]',
  emerald: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white shadow-[0_4px_0_#065f46]',
  rose: 'bg-rose-600 hover:bg-rose-700 border-rose-700 text-white shadow-[0_4px_0_#9f1239]',
  amber: 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-white shadow-[0_4px_0_#b45309]',
  purple: 'bg-purple-600 hover:bg-purple-700 border-purple-700 text-white shadow-[0_4px_0_#6b21a8]',
};

const LAMP_ON_COLORS: Record<string, string> = {
  blue: 'bg-blue-500 border-blue-200 text-white shadow-[0_0_14px_rgba(37,99,235,0.6)]',
  emerald: 'bg-emerald-500 border-emerald-200 text-white shadow-[0_0_14px_rgba(16,185,129,0.6)]',
  amber: 'bg-amber-400 border-amber-200 text-slate-900 shadow-[0_0_14px_rgba(245,158,11,0.6)]',
  purple: 'bg-purple-500 border-purple-200 text-white shadow-[0_0_14px_rgba(168,85,247,0.6)]',
  rose: 'bg-rose-500 border-rose-200 text-white shadow-[0_0_14px_rgba(244,63,94,0.6)]',
};

const BINARY_TAG_TONES: Record<string, string> = {
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function PlcLabPage() {
  // ---- 3-Pillar Primary Switcher & Active Sub-tabs ----
  const [activePillar, setActivePillar] = useState<PillarId>('lab');
  const [labTab, setLabTab] = useState<LabSubTab>('simulator');
  const [refTab, setRefTab] = useState<RefSubTab>('principles');
  const [fieldTab, setFieldTab] = useState<FieldSubTab>('db');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // Hash deep-link routing (e.g. /plc#simulator, /plc#binary, /plc#troubleshooting)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyHash = () => {
      const h = window.location.hash.replace(/^#/, '').toLowerCase();
      if (!h) return;
      if (h === 'simulator') {
        setActivePillar('lab');
        setLabTab('simulator');
      } else if (h === 'binary' || h === 'k1y20') {
        setActivePillar('lab');
        setLabTab('binary');
      } else if (h === 'principles') {
        setActivePillar('reference');
        setRefTab('principles');
      } else if (h === 'commands') {
        setActivePillar('reference');
        setRefTab('commands');
      } else if (h === 'wiring') {
        setActivePillar('reference');
        setRefTab('wiring');
      } else if (h === 'troubleshooting' || h === 'db') {
        setActivePillar('fieldlog');
        setFieldTab('db');
      } else if (h === 'prompt') {
        setActivePillar('fieldlog');
        setFieldTab('prompt');
      } else if (h === 'issuelog') {
        setActivePillar('fieldlog');
        setFieldTab('issuelog');
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // ---- Lab Sub-tab 1: 18-Circuit Simulator State ----
  const [circuitIdx, setCircuitIdx] = useState(0);
  const [heldInputs, setHeldInputs] = useState<Record<string, boolean>>({});
  const [pressedInputs, setPressedInputs] = useState<Record<string, boolean>>({});

  const simRef = useRef<SimState>(createFreshSim(0));
  const heldRef = useRef<Record<string, boolean>>({});
  const pressedRef = useRef<Record<string, boolean>>({});
  const circuitIdxRef = useRef(0);
  const [simSnap, setSimSnap] = useState<SimState>(() => createFreshSim(0));

  const switchCircuit = (newIdx: number) => {
    const normalized = (newIdx + CIRCUITS.length) % CIRCUITS.length;
    circuitIdxRef.current = normalized;
    setCircuitIdx(normalized);
    heldRef.current = {};
    pressedRef.current = {};
    setHeldInputs({});
    setPressedInputs({});
    const fresh = createFreshSim(normalized);
    simRef.current = fresh;
    setSimSnap(structuredClone(fresh));
  };

  const resetCurrentCircuit = () => switchCircuit(circuitIdxRef.current);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const s = simRef.current;
      const c = CIRCUITS[circuitIdxRef.current];

      s.prevSM412 = s.SM412;
      s.clockTick = (s.clockTick + 1) % 10;
      if (s.clockTick === 0) s.SM412 = !s.SM412;

      (['X00', 'X01', 'X02', 'X03'] as const).forEach((k) => {
        s.X[k] = Boolean(pressedRef.current[k] || heldRef.current[k]);
      });

      c.scan(s);

      s.SM402 = false;
      (['sm402', 'p1', 'p2', 'p3', 'p4'] as const).forEach((k) => {
        if (s.fl[k] > 0) s.fl[k] -= 1;
      });
      if (s.shiftPulse.ticks > 0) {
        s.shiftPulse.ticks -= 1;
        if (s.shiftPulse.ticks === 0) {
          s.shiftPulse.block = null;
          s.shiftPulse.branch = null;
        }
      }
      (['X00', 'X01', 'X02', 'X03'] as const).forEach((k) => {
        s.prevX[k] = s.X[k];
      });

      setSimSnap({
        X: { ...s.X },
        prevX: { ...s.prevX },
        Y: { ...s.Y },
        M: { ...s.M },
        T: { T0: { ...s.T.T0 }, T1: { ...s.T.T1 } },
        C: { C0: { ...s.C.C0 } },
        D: { ...s.D },
        SM400: s.SM400,
        SM402: s.SM402,
        SM412: s.SM412,
        prevSM412: s.prevSM412,
        clockTick: s.clockTick,
        fl: { ...s.fl },
        shiftPulse: { ...s.shiftPulse },
      });
    }, 50);

    return () => window.clearInterval(timer);
  }, []);

  const setPress = (dev: string, isDown: boolean) => {
    pressedRef.current = { ...pressedRef.current, [dev]: isDown };
    setPressedInputs((prev) => ({ ...prev, [dev]: isDown }));
  };

  const toggleHold = (dev: string) => {
    const next = !heldRef.current[dev];
    heldRef.current = { ...heldRef.current, [dev]: next };
    setHeldInputs((prev) => ({ ...prev, [dev]: next }));
  };

  const updateSlider = (dev: 'D0' | 'D1' | 'D2' | 'D3', val: string) => {
    const num = Number(val);
    simRef.current.D[dev] = num;
    setSimSnap((prev) => ({ ...prev, D: { ...prev.D, [dev]: num } }));
  };

  // ---- Lab Sub-tab 2: K1Y20 4-Bit Binary Calculator State ----
  const [binaryVal, setBinaryVal] = useState(5);
  const [binaryFilter, setBinaryFilter] = useState<'all' | 'single' | 'cumulative' | 'inverter'>('all');

  const filteredBinaryRows = useMemo(() => {
    return BINARY_TABLE_DATA.filter((row) => {
      if (binaryFilter === 'single') return row.isSingle;
      if (binaryFilter === 'cumulative') return row.isCumulative;
      if (binaryFilter === 'inverter') return row.isInverter;
      return true;
    });
  }, [binaryFilter]);

  const currentBinaryMeta = BINARY_TABLE_DATA[binaryVal] || BINARY_TABLE_DATA[0];

  const currentCircuit = CIRCUITS[circuitIdx];
  const motorInfo = currentCircuit.hasMotor && currentCircuit.getMotor ? currentCircuit.getMotor(simSnap) : null;

  return (
    <div className="relative min-h-screen bg-surface overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-[0.045] bg-[radial-gradient(#004ac6_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 py-5 lg:py-6">
        <SubpageBreadcrumb
          sectionCode="02. PLC AUTOMATION · 3-PILLAR WORKSPACE"
          sectionTitle="MELSEC Q06UDEH 엔지니어링 워크스페이스"
          subtitle="실습 툴(Lab), 시각 교본·치트시트(Reference), 현장 CS 누적 기록(Field Log)의 3-Pillar 구조로 계속 확장되는 PLC 실무 허브입니다."
          rightBadge="Q06UDEH · GX Works2/3 · FR-E700 · F3 RUN"
        />

        {/* ===================================================================
            PRIMARY NAVIGATION: 3-PILLAR SWITCHER (Lab · Reference · Field Log)
            (중복 6개 탭 바 제거 — 상단 3개 카드가 1차 대분류 스위처 역할 수행)
           =================================================================== */}
        <section
          aria-label="PLC 3-Pillar 대분류 선택"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
        >
          {/* PILLAR 1: Lab (Deep Charcoal #141923 ~ #213145) */}
          <button
            type="button"
            onClick={() => setActivePillar('lab')}
            aria-pressed={activePillar === 'lab'}
            className={`group relative overflow-hidden text-left rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-gradient-to-br from-[#141923] via-[#1c2638] to-[#213145] text-white border ${
              activePillar === 'lab'
                ? 'border-[#2563EB] ring-2 ring-[#2563EB]/70 shadow-[0_20px_44px_-8px_rgba(37,99,235,0.38)] -translate-y-0.5'
                : 'border-white/10 opacity-85 hover:opacity-100 hover:-translate-y-0.5 shadow-glass-dark'
            }`}
          >
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#2563EB]/25 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 font-mono text-[10.5px] font-bold text-sky-300">
                  <Zap className="w-3 h-3" />
                  PILLAR 01 · LAB
                </span>
                {activePillar === 'lab' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white font-mono text-[10px] font-bold">
                    ● ACTIVE
                  </span>
                ) : (
                  <span className="font-mono text-[10.5px] text-slate-400">2 Tools</span>
                )}
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                Lab · 인터랙티브 실습 툴
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                18종 실전 래더 시뮬레이터(50ms 스캔) &amp; K1Y20 4-Bit 바이너리 계산기
              </p>
            </div>
            <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 font-mono text-[10.5px] text-sky-200 font-semibold">
                18종 시뮬레이터
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 font-mono text-[10.5px] text-slate-200 font-semibold">
                K1Y20 (K{binaryVal})
              </span>
            </div>
          </button>

          {/* PILLAR 2: Reference (Cool Blue) */}
          <button
            type="button"
            onClick={() => setActivePillar('reference')}
            aria-pressed={activePillar === 'reference'}
            className={`group relative overflow-hidden text-left rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-gradient-to-br from-[#dce9ff] via-[#e7f0ff] to-[#f7faff] text-on-surface border ${
              activePillar === 'reference'
                ? 'border-[#2563EB] ring-2 ring-[#2563EB]/60 shadow-[0_20px_44px_-10px_rgba(37,99,235,0.28)] -translate-y-0.5'
                : 'border-outline-variant/45 opacity-90 hover:opacity-100 hover:-translate-y-0.5 shadow-glass'
            }`}
          >
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-primary/15 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-primary font-mono text-[10.5px] font-bold shadow-xs">
                  <BookOpen className="w-3 h-3" />
                  PILLAR 02 · REFERENCE
                </span>
                {activePillar === 'reference' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white font-mono text-[10px] font-bold">
                    ● ACTIVE
                  </span>
                ) : (
                  <span className="font-mono text-[10.5px] text-on-surface-variant">3 Guides + PDF</span>
                )}
              </div>
              <h2 className="font-display text-xl font-bold text-on-surface">
                Reference · 시각 교본 &amp; 치트시트
              </h2>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                PLC 원리·구조화, 빈출 명령어 Top 20, S/S 배선·FR-E700·시운전 5단계 + PDF 뷰어
              </p>
            </div>
            <div className="relative z-10 mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] text-primary font-semibold">
                원리 &amp; 구조
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] text-on-surface font-semibold">
                명령어 Top 20
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] text-on-surface font-semibold">
                배선·시운전
              </span>
            </div>
          </button>

          {/* PILLAR 3: Field Log (Soft Lavender) */}
          <button
            type="button"
            onClick={() => setActivePillar('fieldlog')}
            aria-pressed={activePillar === 'fieldlog'}
            className={`group relative overflow-hidden text-left rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-gradient-to-br from-[#e9ddff] via-[#e4e6ff] to-[#ffffff] text-on-surface border ${
              activePillar === 'fieldlog'
                ? 'border-tertiary ring-2 ring-tertiary/55 shadow-[0_20px_44px_-10px_rgba(99,46,205,0.26)] -translate-y-0.5'
                : 'border-outline-variant/45 opacity-90 hover:opacity-100 hover:-translate-y-0.5 shadow-glass'
            }`}
          >
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-tertiary/15 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-tertiary font-mono text-[10.5px] font-bold shadow-xs">
                  <Wrench className="w-3 h-3" />
                  PILLAR 03 · FIELD LOG
                </span>
                {activePillar === 'fieldlog' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary text-white font-mono text-[10px] font-bold">
                    ● ACTIVE
                  </span>
                ) : (
                  <span className="font-mono text-[10.5px] text-on-surface-variant">3 CS Logs</span>
                )}
              </div>
              <h2 className="font-display text-xl font-bold text-on-surface">
                Field Log · 현장 CS &amp; 누적 로그
              </h2>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                증상별 트러블슈팅 검색 DB, AI 정밀 진단 프롬프트 복사기, 시운전 Issue Log
              </p>
            </div>
            <div className="relative z-10 mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] text-tertiary font-semibold">
                트러블슈팅 DB
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] text-on-surface font-semibold">
                AI 진단 프롬프트
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] text-on-surface font-semibold">
                Issue Log
              </span>
            </div>
          </button>
        </section>

        {/* ===================================================================
            SECONDARY NAVIGATION: CONTEXTUAL SEGMENTED SUB-TAB BAR (2~3 Tabs Only)
           =================================================================== */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white/85 backdrop-blur-xl border border-outline-variant/45 shadow-xs">
          {/* Sub-tabs for Pillar 1: Lab */}
          {activePillar === 'lab' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'simulator', label: '18종 래더 시뮬레이터', icon: Zap },
                  { id: 'binary', label: 'K1Y20 바이너리 계산기', icon: Calculator },
                ] as const
              ).map((t) => {
                const Icon = t.icon;
                const active = labTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLabTab(t.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-display font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-[#141923] text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-sky-400' : 'text-primary'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sub-tabs for Pillar 2: Reference */}
          {activePillar === 'reference' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'principles', label: 'PLC 원리 & 구조', icon: BookOpen },
                  { id: 'commands', label: '빈출 명령어 Top 20', icon: Terminal },
                  { id: 'wiring', label: '배선 · 인버터 · 시운전', icon: Plug },
                ] as const
              ).map((t) => {
                const Icon = t.icon;
                const active = refTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRefTab(t.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-display font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-primary'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sub-tabs for Pillar 3: Field Log */}
          {activePillar === 'fieldlog' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'db', label: '트러블슈팅 검색 DB', icon: Wrench },
                  { id: 'prompt', label: 'AI 정밀 진단 프롬프트', icon: Sparkles },
                  { id: 'issuelog', label: '시운전 Issue Log', icon: FileText },
                ] as const
              ).map((t) => {
                const Icon = t.icon;
                const active = fieldTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFieldTab(t.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-display font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-tertiary text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-tertiary'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Right Contextual Action: Visual Guide PDF Button (Prominently in Reference, accessible anytime) */}
          <div className="flex items-center gap-2 ml-auto">
            {activePillar === 'reference' ? (
              <button
                type="button"
                onClick={() => setPdfModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141923] hover:bg-[#2563EB] text-white text-xs font-display font-semibold shadow-sm transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-sky-300" />
                <span>MELSEC PLC 시각 교본 PDF 보기</span>
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low font-mono text-[11px] font-semibold text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {activePillar === 'lab'
                  ? `F3 MONITOR LIVE · ${currentCircuit.category}`
                  : 'FIELD CS WORKSPACE · 2026'}
              </span>
            )}
          </div>
        </div>

        {/* ===================================================================
            WORKSPACE BODY — RENDER ACTIVE PILLAR & SUB-TAB
           =================================================================== */}
        <div className="space-y-6">
          {/* ---------------- PILLAR 1: LAB — 18종 래더 시뮬레이터 ---------------- */}
          {activePillar === 'lab' && labTab === 'simulator' && (
            <div className="space-y-5">
              {/* Circuit Selector Control Bar */}
              <div className="rounded-2xl bg-white/95 border border-outline-variant/45 p-3.5 shadow-glass flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => switchCircuit(circuitIdx - 1)}
                    className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">이전</span>
                  </button>

                  <select
                    value={circuitIdx}
                    onChange={(e) => switchCircuit(Number(e.target.value))}
                    aria-label="PLC 래더 회로 선택"
                    className="flex-1 min-w-0 bg-white border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-on-surface outline-none cursor-pointer"
                  >
                    {CIRCUIT_GROUPS.map((grp) => (
                      <optgroup key={grp.label} label={grp.label}>
                        {grp.ids.map((id) => (
                          <option key={id} value={id}>
                            {CIRCUITS[id].title}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => switchCircuit(circuitIdx + 1)}
                    className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span className="hidden sm:inline">다음</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetCurrentCircuit}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  회로 초기화
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                <div className="xl:col-span-8 space-y-5">
                  {/* 1. SVG Ladder Canvas */}
                  <section className="rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-outline-variant/35 bg-surface-container-low/70 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-fixed text-primary">
                          {currentCircuit.category}
                        </span>
                        <h2 className="text-sm sm:text-base font-display font-bold text-on-surface">
                          {currentCircuit.title}
                        </h2>
                      </div>
                      <span className="text-[11px] font-mono text-primary font-semibold">
                        ● 파란색 = 전류 흐름 (F3 ON)
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 bg-surface-container-low/35">
                      <div className="blueprint-canvas rounded-2xl border border-outline-variant/40 overflow-x-auto">
                        {currentCircuit.renderLadder(simSnap)}
                      </div>
                    </div>
                  </section>

                  {/* 2. Field Control Panel */}
                  <section className="rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass overflow-hidden">
                    <div className="px-5 py-3 border-b border-outline-variant/35 bg-surface-container-low/70 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-on-surface">
                        <Sliders className="w-4 h-4 text-primary" />
                        현장 제어반 (Control Panel)
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        누르는 동안 ON · 아래 <b>고정(Hold)</b> 체크 시 ON 유지
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                      <div className="md:col-span-7 bg-surface-container-low/65 rounded-2xl border border-outline-variant/35 p-4 flex flex-col justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-display font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                            입력 푸시버튼 (Input X)
                          </div>
                          <div className="flex flex-wrap items-start justify-around gap-3">
                            {currentCircuit.inputs.map((inp) => {
                              const isActive = Boolean(pressedInputs[inp.dev] || heldInputs[inp.dev]);
                              return (
                                <div key={inp.dev} className="flex flex-col items-center gap-1.5 min-w-[74px]">
                                  <button
                                    type="button"
                                    onMouseDown={() => setPress(inp.dev, true)}
                                    onMouseUp={() => setPress(inp.dev, false)}
                                    onMouseLeave={() => setPress(inp.dev, false)}
                                    onTouchStart={(e) => {
                                      e.preventDefault();
                                      setPress(inp.dev, true);
                                    }}
                                    onTouchEnd={(e) => {
                                      e.preventDefault();
                                      setPress(inp.dev, false);
                                    }}
                                    className={`w-14 h-14 rounded-full border-2 font-mono font-bold text-xs flex items-center justify-center transition select-none cursor-pointer ${
                                      BTN_COLORS[inp.color] || BTN_COLORS.blue
                                    } ${isActive ? 'translate-y-[3px] scale-95 brightness-110' : ''}`}
                                  >
                                    {inp.dev}
                                  </button>
                                  <span className="text-[11px] font-semibold text-on-surface text-center leading-tight">
                                    {inp.label}
                                  </span>
                                  <label className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-outline-variant/40 cursor-pointer hover:border-primary select-none">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(heldInputs[inp.dev])}
                                      onChange={() => toggleHold(inp.dev)}
                                      className="w-3 h-3 accent-primary cursor-pointer"
                                    />
                                    <span className="text-[10px] font-semibold text-on-surface-variant">고정</span>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {currentCircuit.sliders && currentCircuit.sliders.length > 0 && (
                          <div className="pt-3 border-t border-outline-variant/35 space-y-2.5">
                            {currentCircuit.sliders.map((sl) => (
                              <div key={sl.dev} className="flex items-center gap-3">
                                <span className="text-xs font-mono font-bold text-primary min-w-[130px]">
                                  {sl.label}
                                </span>
                                <input
                                  type="range"
                                  min={sl.min}
                                  max={sl.max}
                                  value={simSnap.D[sl.dev]}
                                  onChange={(e) => updateSlider(sl.dev, e.target.value)}
                                  className="flex-1 accent-primary cursor-pointer"
                                />
                                <span className="font-mono text-xs font-bold bg-white border border-outline-variant/50 text-on-surface px-2 py-0.5 rounded min-w-[38px] text-center">
                                  {simSnap.D[sl.dev]}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {currentCircuit.id === 16 && (
                          <div className="pt-3 border-t border-outline-variant/35 grid grid-cols-2 gap-2.5">
                            <div className="bg-white rounded-xl border border-outline-variant/40 p-2.5 text-center">
                              <div className="text-[10px] font-bold text-on-surface-variant">전송된 10진수 (K1Y20)</div>
                              <div className="font-mono text-lg font-bold text-primary">K{simSnap.D.D0}</div>
                            </div>
                            <div className="bg-white rounded-xl border border-outline-variant/40 p-2.5 text-center">
                              <div className="text-[10px] font-bold text-on-surface-variant">2진수 (Y23→Y20)</div>
                              <div className="font-mono text-lg font-bold text-on-surface tracking-widest">
                                {simSnap.D.D0.toString(2).padStart(4, '0')}
                              </div>
                            </div>
                          </div>
                        )}

                        {currentCircuit.id === 17 && (
                          <div className="pt-3 border-t border-outline-variant/35 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-on-surface-variant">데이터 레지스터 D0 진행률</span>
                              <span className="font-mono font-bold text-primary">{simSnap.D.D0} / 4 ON</span>
                            </div>
                            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-200 rounded-full"
                                style={{ width: `${(simSnap.D.D0 / 4) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-5 bg-surface-container-low/65 rounded-2xl border border-outline-variant/35 p-4 flex flex-col justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-display font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                            출력 파일럿 램프 (Output Y / M)
                          </div>
                          {currentCircuit.outputs.length > 0 ? (
                            <div className="flex flex-wrap items-center justify-around gap-3">
                              {currentCircuit.outputs.map((outp) => {
                                const isOn = outp.dev.startsWith('M')
                                  ? simSnap.M[outp.dev as keyof SimState['M']]
                                  : simSnap.Y[outp.dev as keyof SimState['Y']];
                                return (
                                  <div key={outp.dev} className="flex flex-col items-center gap-1 min-w-[58px]">
                                    <div
                                      className={`w-11 h-11 rounded-full border-4 flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                                        isOn
                                          ? LAMP_ON_COLORS[outp.color] || LAMP_ON_COLORS.emerald
                                          : 'bg-surface-container border-outline-variant/60 text-on-surface-variant'
                                      }`}
                                    >
                                      {isOn ? 'ON' : 'OFF'}
                                    </div>
                                    <span className="font-mono text-xs font-bold text-on-surface">{outp.dev}</span>
                                    <span className="text-[10px] text-on-surface-variant text-center leading-tight">
                                      {outp.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-xs text-on-surface-variant py-4 text-center">
                              하단 Live Device Monitor(D0~D3)에서 연산 결과를 확인하세요.
                            </div>
                          )}
                        </div>

                        {motorInfo && (
                          <div className="pt-3 border-t border-outline-variant/35 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white border-2 border-outline-variant/60 flex items-center justify-center shrink-0 shadow-xs">
                              <svg
                                className={`w-8 h-8 ${
                                  motorInfo.mode === 'cw'
                                    ? 'text-primary'
                                    : motorInfo.mode === 'ccw'
                                    ? 'text-tertiary'
                                    : 'text-slate-400'
                                }`}
                                style={
                                  motorInfo.mode === 'cw'
                                    ? { animation: `spinCW ${motorInfo.speed || '0.7s'} linear infinite` }
                                    : motorInfo.mode === 'ccw'
                                    ? { animation: `spinCCW ${motorInfo.speed || '0.7s'} linear infinite` }
                                    : undefined
                                }
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <circle cx="12" cy="12" r="2.2" />
                                <path d="M12 2C14.4 2 15.8 4.4 13.8 7.8C13.2 8.9 12.6 9.8 12 9.8C11.4 9.8 10.8 8.9 10.2 7.8C8.2 4.4 9.6 2 12 2Z" />
                                <path d="M22 12C22 14.4 19.6 15.8 16.2 13.8C15.1 13.2 14.2 12.6 14.2 12C14.2 11.4 15.1 10.8 16.2 10.2C19.6 8.2 22 9.6 22 12Z" />
                                <path d="M12 22C9.6 22 8.2 19.6 10.2 16.2C10.8 15.1 11.4 14.2 12 14.2C12.6 14.2 13.2 15.1 13.8 16.2C15.8 19.6 14.4 22 12 22Z" />
                                <path d="M2 12C2 9.6 4.4 8.2 7.8 10.2C8.9 10.8 9.8 11.4 9.8 12C9.8 12.6 8.9 13.2 7.8 13.8C4.4 15.8 2 14.4 2 12Z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                                    motorInfo.mode === 'stop'
                                      ? 'bg-surface-container text-on-surface-variant'
                                      : 'bg-primary text-white'
                                  }`}
                                >
                                  {motorInfo.badge}
                                </span>
                                <span className="font-mono text-xs font-bold text-primary">
                                  {motorInfo.freq}
                                </span>
                              </div>
                              <p className="text-[11px] text-on-surface-variant mt-1 truncate">{motorInfo.desc}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Device Monitor */}
                    <div className="px-5 py-3.5 border-t border-outline-variant/35 bg-surface-container-low/65">
                      <div className="text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Live Device Monitor (DEC / BIN)</span>
                        <span className="font-mono">SM412: {simSnap.SM412 ? 'ON' : 'OFF'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                        {(['Y20', 'Y21', 'Y22', 'Y23'] as const).map((yk) => (
                          <span
                            key={yk}
                            className={`px-2.5 py-1 rounded-lg border ${
                              simSnap.Y[yk]
                                ? 'bg-primary-fixed border-primary/40 text-primary font-bold'
                                : 'bg-white border-outline-variant/40 text-on-surface-variant'
                            }`}
                          >
                            {yk}:{simSnap.Y[yk] ? '1' : '0'}
                          </span>
                        ))}
                        {(['M0', 'M1', 'M2'] as const).map((mk) => (
                          <span
                            key={mk}
                            className={`px-2.5 py-1 rounded-lg border ${
                              simSnap.M[mk]
                                ? 'bg-tertiary-fixed border-tertiary/40 text-tertiary font-bold'
                                : 'bg-white border-outline-variant/40 text-on-surface-variant'
                            }`}
                          >
                            {mk}:{simSnap.M[mk] ? '1' : '0'}
                          </span>
                        ))}
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-outline-variant/40 text-on-surface">
                          T0:{Math.floor(simSnap.T.T0.acc)}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-outline-variant/40 text-on-surface">
                          C0:{simSnap.C.C0.acc}
                        </span>
                        {(['D0', 'D1', 'D2', 'D3'] as const).map((dk) => (
                          <span
                            key={dk}
                            className={`px-2.5 py-1 rounded-lg border ${
                              simSnap.D[dk] !== 0
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                : 'bg-white border-outline-variant/40 text-on-surface-variant'
                            }`}
                          >
                            {dk}={simSnap.D[dk]}
                            {dk === 'D0' && simSnap.D.D0 >= 0 && simSnap.D.D0 <= 15
                              ? ` (${simSnap.D.D0.toString(2).padStart(4, '0')}₂)`
                              : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Concept Note Sidebar */}
                <aside className="xl:col-span-4 rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass overflow-hidden">
                  <div className="px-5 py-3.5 bg-[#141923] text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-display font-bold">핵심 개념 노트 &amp; 테스트 가이드</h3>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3.5 text-xs leading-relaxed">
                    <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/35">
                      <div className="font-bold text-on-surface mb-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-primary" />
                        동작 원리
                      </div>
                      <p className="text-on-surface-variant">{currentCircuit.note.principle}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-primary-fixed/40 border border-primary/20">
                      <div className="font-bold text-primary mb-1 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                        웹/SW 개발 비유
                      </div>
                      <p className="text-on-surface">{currentCircuit.note.analogy}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/35">
                      <div className="font-bold text-on-surface mb-1.5 flex items-center gap-1.5">
                        <Keyboard className="w-3.5 h-3.5 text-on-surface-variant" />
                        핵심 GX Works 단축키
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCircuit.note.shortcuts.map((sc) => (
                          <span
                            key={sc}
                            className="px-2 py-1 rounded-lg bg-white border border-outline-variant/45 font-mono text-[11px] font-semibold text-on-surface"
                          >
                            {sc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/75 border border-emerald-200">
                      <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                        현장 활용처
                      </div>
                      <p className="text-emerald-950/85">{currentCircuit.note.field}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/85 border border-amber-200">
                      <div className="font-bold text-amber-800 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        직접 테스트 가이드
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-amber-950/85">
                        {currentCircuit.note.test.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* ---------------- PILLAR 1: LAB — K1Y20 바이너리 계산기 ---------------- */}
          {activePillar === 'lab' && labTab === 'binary' && (
            <div className="space-y-6">
              <section className="rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass overflow-hidden">
                <div className="px-6 py-4 bg-surface-container-low/70 border-b border-outline-variant/35 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    <h2 className="text-sm sm:text-base font-display font-bold text-on-surface">
                      인터랙티브 4-Bit 바이너리 계산기 (K1Y20 = Y23 · Y22 · Y21 · Y20)
                    </h2>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    각 램프 카드를 클릭해 0/1을 토글하며 10진수 K값 및 FR-E700 7단 속도 조합을 확인하세요.
                  </span>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                      { dev: 'Y23', weight: 8, sub: '2³ (MSB)' },
                      { dev: 'Y22', weight: 4, sub: '2² (RH)' },
                      { dev: 'Y21', weight: 2, sub: '2¹ (RM)' },
                      { dev: 'Y20', weight: 1, sub: '2⁰ (RL/LSB)' },
                    ].map((b) => {
                      const isOn = Boolean(binaryVal & b.weight);
                      return (
                        <button
                          key={b.dev}
                          type="button"
                          onClick={() => setBinaryVal((prev) => prev ^ b.weight)}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition cursor-pointer select-none ${
                            isOn
                              ? 'bg-primary-fixed/55 border-primary shadow-sm'
                              : 'bg-surface-container-low/65 border-outline-variant/40 hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full text-[11px] font-mono">
                            <span className="font-bold text-on-surface">{b.dev}</span>
                            <span className="text-on-surface-variant">{b.sub}</span>
                          </div>
                          <div
                            className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-mono text-xl font-bold transition-all ${
                              isOn
                                ? 'bg-primary border-primary-fixed text-white shadow-[0_0_18px_rgba(0,74,198,0.45)]'
                                : 'bg-white border-outline-variant/60 text-on-surface-variant'
                            }`}
                          >
                            {isOn ? '1' : '0'}
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                              isOn ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            가중치 +{b.weight}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-on-surface-variant">10진수 &amp; 2진수</div>
                        <div className="font-mono text-xl font-bold text-primary mt-0.5">
                          K{binaryVal}{' '}
                          <span className="text-on-surface-variant text-sm font-normal">
                            ({currentBinaryMeta.bin}₂)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBinaryVal(0)}
                        className="px-3 py-1 rounded-full bg-white hover:bg-surface-container border border-outline-variant/50 text-xs font-bold text-on-surface cursor-pointer"
                      >
                        K0
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40">
                      <div className="text-[11px] font-bold text-on-surface-variant">가중치 합산 공식</div>
                      <div className="font-mono text-base font-bold text-on-surface mt-1">
                        {currentBinaryMeta.formula}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-primary-fixed/55 border border-primary/25">
                      <div className="text-[11px] font-bold text-primary">PLC 래더 명령어</div>
                      <div className="font-mono text-base font-bold text-on-primary-fixed mt-1">
                        [ MOV K{binaryVal} K1Y20 ]
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-tertiary-fixed/45 border border-tertiary/25">
                      <div className="text-[11px] font-bold text-tertiary">FR-E700 다단속도 (RH·RM·RL)</div>
                      <div className="font-mono text-base font-bold text-on-surface mt-1">
                        {(binaryVal & 7) === 0 ? '0단 (정지)' : `${binaryVal & 7}단 속도 조합`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/30">
                    <span className="text-xs font-bold text-on-surface-variant mr-1">빠른 프리셋:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-primary">단일 점등</span>
                      {[1, 2, 4, 8].map((v) => (
                        <button
                          key={`s-${v}`}
                          type="button"
                          onClick={() => setBinaryVal(v)}
                          className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold border cursor-pointer transition ${
                            binaryVal === v
                              ? 'bg-primary text-white border-primary'
                              : 'bg-primary-fixed/60 text-primary border-primary/25 hover:bg-primary-fixed'
                          }`}
                        >
                          K{v}
                        </button>
                      ))}
                    </div>
                    <span className="text-outline-variant hidden sm:inline">|</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-emerald-700">누적 점등</span>
                      {[1, 3, 7, 15].map((v) => (
                        <button
                          key={`c-${v}`}
                          type="button"
                          onClick={() => setBinaryVal(v)}
                          className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold border cursor-pointer transition ${
                            binaryVal === v
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          K{v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* K0~K15 Full Conversion Table */}
              <section className="rounded-3xl bg-white/95 border border-outline-variant/45 shadow-glass overflow-hidden">
                <div className="p-5 border-b border-outline-variant/35 bg-surface-container-low/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-display font-bold text-on-surface">
                      K0 ~ K15 (0000 ~ 1111) 완전 변환표
                    </h3>
                    <p className="text-[11px] text-on-surface-variant">
                      원하는 행을 클릭하면 위 4-Bit 바이너리 계산기에 즉시 로드됩니다.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: 'all', label: '전체 (0~15)' },
                        { id: 'single', label: '단일 점등 (1,2,4,8)' },
                        { id: 'cumulative', label: '누적 점등 (1,3,7,15)' },
                        { id: 'inverter', label: '인버터 1~7단' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setBinaryFilter(f.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold border transition cursor-pointer ${
                          binaryFilter === f.id
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[680px]">
                    <thead>
                      <tr className="bg-surface-container-low/60 border-b border-outline-variant/35 text-[11px] font-display font-bold text-on-surface-variant uppercase">
                        <th className="py-3 px-4">10진수 (K값)</th>
                        <th className="py-3 px-4">2진수 (Y23·Y22·Y21·Y20)</th>
                        <th className="py-3 px-4">가중치 합산식</th>
                        <th className="py-3 px-4 text-center">4개 램프 상태 (Y23→Y20)</th>
                        <th className="py-3 px-4">실무 용도 태그</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 text-xs">
                      {filteredBinaryRows.map((row) => {
                        const selected = row.k === binaryVal;
                        return (
                          <tr
                            key={row.k}
                            onClick={() => setBinaryVal(row.k)}
                            className={`cursor-pointer transition ${
                              selected ? 'bg-primary-fixed/50' : 'hover:bg-surface-container-low/50'
                            }`}
                          >
                            <td className="py-2.5 px-4 font-mono font-bold text-primary">K{row.k}</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-on-surface tracking-widest">
                              {row.bin}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-on-surface-variant">{row.formula}</td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center justify-center gap-2">
                                {row.bits.map((bit, i) => (
                                  <span
                                    key={i}
                                    title={['Y23(8)', 'Y22(4)', 'Y21(2)', 'Y20(1)'][i]}
                                    className={`w-4 h-4 rounded-full border transition ${
                                      bit
                                        ? 'bg-rose-500 border-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.65)]'
                                        : 'bg-surface-container border-outline-variant/60'
                                    }`}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {row.tags.length > 0 ? (
                                  row.tags.map((t) => (
                                    <span
                                      key={t.text}
                                      className={`px-2 py-0.5 rounded-full border text-[10.5px] font-bold ${
                                        BINARY_TAG_TONES[t.tone]
                                      }`}
                                    >
                                      {t.text}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[11px] text-on-surface-variant/70">일반 4비트 조합</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ---------------- PILLAR 2: REFERENCE ---------------- */}
          {activePillar === 'reference' && refTab === 'principles' && <PlcPrinciplesTab />}
          {activePillar === 'reference' && refTab === 'commands' && <PlcTopCommandsTab />}
          {activePillar === 'reference' && refTab === 'wiring' && <PlcWiringCommissioningTab />}

          {/* ---------------- PILLAR 3: FIELD LOG ---------------- */}
          {activePillar === 'fieldlog' && fieldTab === 'db' && <PlcTroubleshootingDbTab />}
          {activePillar === 'fieldlog' && fieldTab === 'prompt' && <PlcAiPromptTab />}
          {activePillar === 'fieldlog' && fieldTab === 'issuelog' && <PlcIssueLogTab />}
        </div>
      </div>

      {/* PDF Visual Reference Viewer Modal */}
      <PlcPdfViewerModal open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} />
    </div>
  );
}
