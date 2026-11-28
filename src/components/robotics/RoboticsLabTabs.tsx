'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Copy,
  FileCode2,
  Play,
  RotateCcw,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { useSiteUI } from '@/components/SiteUIProvider';
import { IO_HANDSHAKE_DATA, LUA_SCRIPT_ARCHIVE } from '@/data/roboticsData';
export { default as RoboticsMissionLab } from '@/components/robotics/RoboticsMissionLab';

type RobotState = 'IDLE' | 'BUSY' | 'DONE' | 'ACK_DONE' | 'EMG_ALARM';

const SIGNAL_STYLES: Record<string, string> = {
  Control: 'bg-blue-50 text-blue-700 border-blue-200',
  Safety: 'bg-rose-50 text-rose-700 border-rose-200',
  Recipe: 'bg-purple-50 text-purple-700 border-purple-200',
  Feedback: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Alarm: 'bg-amber-50 text-amber-800 border-amber-200',
};

const BUSY_PHASES = [
  'moveJ 상공 접근 (P_PICK + Z80mm)',
  'moveL 수직 하강 → gripper_close()',
  'moveJ 적재 상공 이동 (P_PLACE + Z80mm)',
  'moveL 수직 적재 → gripper_open() → P_HOME',
];

export function RoboticsHandshakeTab() {
  const [robotState, setRobotState] = useState<RobotState>('IDLE');
  const [emgNormal, setEmgNormal] = useState<boolean>(true); // b접점: true = 24V 정상, false = 차단
  const [recipeB, setRecipeB] = useState<boolean>(false); // Y22: false = 품종 A, true = 품종 B
  const [startPulse, setStartPulse] = useState<boolean>(false);
  const [ackPulse, setAckPulse] = useState<boolean>(false);
  const [phaseIdx, setPhaseIdx] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM READY — DI_1(EMG b접점) 24V 정상 인가 · Start(Y20) 대기 중',
  ]);

  const [ioFilter, setIoFilter] = useState<'전체' | 'PLC → 로봇' | '로봇 → PLC'>('전체');
  const [selectedSignal, setSelectedSignal] = useState<string>(IO_HANDSHAKE_DATA[0].plc);

  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const pushLog = (msg: string) => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;
    setLogs((prev) => [`[${ts}] ${msg}`, ...prev].slice(0, 6));
  };

  const handleStart = () => {
    if (!emgNormal) {
      pushLog('기동 불가 — Y21(EMG b접점)이 차단 상태입니다. EMG 복구 후 초기화하세요.');
      return;
    }
    if (robotState !== 'IDLE') {
      pushLog(`현재 상태(${robotState})에서는 Start를 중복 입력할 수 없습니다.`);
      return;
    }

    clearTimers();
    setStartPulse(true);
    setRobotState('BUSY');
    setPhaseIdx(0);
    pushLog(
      `PLC Y20(Start) ON → 로봇 DO_1(Busy) ON [레시피: ${recipeB ? '품종 B (Y22 ON)' : '품종 A (Y22 OFF)'}]`
    );

    const t0 = window.setTimeout(() => setStartPulse(false), 450);
    const t1 = window.setTimeout(() => setPhaseIdx(1), 650);
    const t2 = window.setTimeout(() => setPhaseIdx(2), 1300);
    const t3 = window.setTimeout(() => setPhaseIdx(3), 1950);
    const t4 = window.setTimeout(() => {
      setRobotState('DONE');
      pushLog('사이클 완료 — 로봇 DO_1(Busy) OFF, DO_0(Done · X00) ON → PLC Ack(Y23) 대기');
    }, 2600);

    timersRef.current.push(t0, t1, t2, t3, t4);
  };

  const handleToggleEmg = () => {
    if (emgNormal) {
      clearTimers();
      setEmgNormal(false);
      setStartPulse(false);
      setAckPulse(false);
      setRobotState('EMG_ALARM');
      pushLog('⚠ Y21(DI_1 EMG b접점) 0V 차단 감지! → 모션 즉시 정지 & DO_2(Alarm · X02) ON');
    } else {
      setEmgNormal(true);
      pushLog('Y21(DI_1 EMG b접점) 24V 복구 확인 — [알람 리셋]을 눌러 IDLE로 복귀하세요.');
    }
  };

  const handleAck = () => {
    if (!emgNormal || robotState !== 'DONE') return;
    clearTimers();
    setAckPulse(true);
    setRobotState('ACK_DONE');
    pushLog('PLC Y23(Ack) ON 수신 → 로봇 DO_0(Done) OFF · 4단계 핸드셰이크 완료!');

    const t1 = window.setTimeout(() => {
      setAckPulse(false);
      setRobotState('IDLE');
      pushLog('IDLE 복귀 — 다음 컨베이어 Start(Y20) 신호 대기 중');
    }, 1100);
    timersRef.current.push(t1);
  };

  const handleReset = () => {
    clearTimers();
    if (!emgNormal) {
      pushLog('EMG b접점이 여전히 차단(OFF) 상태입니다. 먼저 EMG를 복구하세요.');
      return;
    }
    setStartPulse(false);
    setAckPulse(false);
    setPhaseIdx(0);
    setRobotState('IDLE');
    pushLog('알람 해제 및 상태 초기화 완료 → IDLE 대기');
  };

  const signalState: Record<string, boolean> = {
    Y20: startPulse,
    Y21: emgNormal,
    Y22: recipeB,
    Y23: ackPulse,
    X00: robotState === 'DONE',
    X01: robotState === 'BUSY',
    X02: robotState === 'EMG_ALARM',
  };

  const filteredIo = useMemo(() => {
    if (ioFilter === '전체') return IO_HANDSHAKE_DATA;
    return IO_HANDSHAKE_DATA.filter((row) => row.dir === ioFilter);
  }, [ioFilter]);

  const stateBadge = {
    IDLE: { label: 'IDLE · 대기', cls: 'bg-slate-700 text-slate-100 border-slate-500' },
    BUSY: { label: 'BUSY · 모션 구동 중', cls: 'bg-[#2563EB] text-white border-sky-400 animate-pulse' },
    DONE: { label: 'DONE · Ack 대기', cls: 'bg-emerald-600 text-white border-emerald-300' },
    ACK_DONE: { label: 'ACK 완료 · 사이클 종료', cls: 'bg-sky-500 text-white border-sky-200' },
    EMG_ALARM: { label: 'EMG ALARM 정지', cls: 'bg-rose-600 text-white border-rose-300 animate-pulse' },
  }[robotState];

  return (
    <div id="handshake" className="scroll-mt-24 space-y-6">
      {/* =====================================================================
          1. INTERACTIVE MINI HANDSHAKE SIMULATOR (Dark Titanium Console)
         ===================================================================== */}
      <section className="rounded-3xl bg-gradient-to-br from-[#141923] via-[#1c2638] to-[#213145] text-white border border-white/15 p-6 sm:p-7 shadow-glass-dark">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 font-mono text-[10.5px] font-bold text-sky-300 mb-2">
              <Activity className="w-3.5 h-3.5" />
              INTERACTIVE HANDSHAKE SIMULATOR
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              PLC ↔ 브릴스 협동로봇 2-Way I/O 실시간 핸드셰이크 시뮬레이터
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              [Start(Y20)] → [BUSY → DONE] → [Ack(Y23)] 정상 흐름과 [EMG 차단(Y21 b접점)] Fail-Safe 알람 정지를 직접 눌러 검증하세요.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs font-bold shadow-sm ${stateBadge.cls}`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {stateBadge.label}
          </span>
        </div>

        {/* 4-Step State Flow Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {(
            [
              { id: 'IDLE', step: '01', title: 'IDLE', desc: 'Start(Y20) 대기' },
              { id: 'BUSY', step: '02', title: 'BUSY', desc: 'DO_1 ON · Pick & Place' },
              { id: 'DONE', step: '03', title: 'DONE', desc: 'DO_0 ON · Ack 대기' },
              { id: 'ACK_DONE', step: '04', title: 'ACK 완료', desc: 'Y23 수신 · DO_0 OFF' },
            ] as const
          ).map((st) => {
            const isActive = robotState === st.id;
            const isAlarm = robotState === 'EMG_ALARM';
            return (
              <div
                key={st.id}
                className={`p-3 rounded-2xl border transition ${
                  isAlarm
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : isActive
                    ? 'bg-[#2563EB]/30 border-[#2563EB] text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <div className="font-mono text-[10px] font-bold opacity-80">STEP {st.step}</div>
                <div className="font-display text-sm font-bold mt-0.5">{st.title}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{st.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Control Buttons + Live Motion Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Operator Control Panel */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4">
            <div>
              <div className="font-mono text-[10.5px] font-bold text-sky-300 uppercase tracking-wider mb-3">
                PLC 출력 조작반 (PLC → 로봇)
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!emgNormal || robotState !== 'IDLE'}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start (Y20)</span>
                </button>

                <button
                  type="button"
                  onClick={handleAck}
                  disabled={!emgNormal || robotState !== 'DONE'}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ack (Y23)</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleEmg}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    emgNormal
                      ? 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 border-amber-200 text-[#141923]'
                  }`}
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{emgNormal ? 'EMG 차단 (Y21 b접점)' : 'EMG 24V 복구 (NC)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRecipeB((prev) => {
                      const next = !prev;
                      pushLog(`레시피(Y22/DI_2) 전환 → ${next ? '품종 B (ON)' : '품종 A (OFF)'}`);
                      return next;
                    });
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    recipeB
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-200'
                  }`}
                >
                  <span>Recipe Y22: {recipeB ? '품종 B' : '품종 A'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
              <span className="text-[11px] text-slate-300">
                {robotState === 'BUSY'
                  ? `구동: ${BUSY_PHASES[phaseIdx]}`
                  : robotState === 'EMG_ALARM'
                  ? '비상정지 알람 — EMG 복구 후 리셋'
                  : robotState === 'DONE'
                  ? '완료 대기 — [Ack (Y23)]를 누르세요'
                  : '준비 완료 — [Start (Y20)]를 누르세요'}
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>리셋</span>
              </button>
            </div>
          </div>

          {/* Right: Live 7-Signal LED Monitor + Event Log */}
          <div className="lg:col-span-7 p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between gap-4">
            <div>
              <div className="font-mono text-[10.5px] font-bold text-sky-300 uppercase tracking-wider mb-3">
                실시간 7-신호 I/O LED 모니터
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {IO_HANDSHAKE_DATA.map((sig) => {
                  const isOn = signalState[sig.simKey];
                  const isEmgFault = sig.simKey === 'Y21' && !isOn;
                  const isAlarmOn = sig.simKey === 'X02' && isOn;
                  const ledClass =
                    isEmgFault || isAlarmOn
                      ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.85)]'
                      : isOn
                      ? sig.simKey === 'X01'
                        ? 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.85)]'
                        : 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]'
                      : 'bg-slate-600';

                  return (
                    <div
                      key={sig.plc}
                      className={`p-2.5 rounded-xl border transition ${
                        isEmgFault || isAlarmOn
                          ? 'bg-rose-950/60 border-rose-500/70'
                          : isOn
                          ? 'bg-white/10 border-sky-400/50'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="font-mono text-[11px] font-bold text-sky-200">
                          {sig.plc}/{sig.robot}
                        </span>
                        <span className={`w-2.5 h-2.5 rounded-full ${ledClass}`} />
                      </div>
                      <div className="text-[11px] font-semibold text-white truncate">
                        {sig.name}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                        {sig.simKey === 'Y21'
                          ? isOn
                            ? '24V 정상 (NC)'
                            : '0V 차단 (FAULT)'
                          : isOn
                          ? 'ON (1)'
                          : 'OFF (0)'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d121a] border border-white/10 font-mono text-[11px] space-y-1 max-h-28 overflow-y-auto">
              {logs.map((line, i) => (
                <div
                  key={`${line}-${i}`}
                  className={i === 0 ? 'text-sky-300 font-semibold' : 'text-slate-400'}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. STANDARD 7-SIGNAL MAPPING TABLE
         ===================================================================== */}
      <section className="rounded-3xl bg-white/90 border border-outline-variant/45 p-6 sm:p-7 shadow-glass">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce9ff] text-primary font-mono text-[10.5px] font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              STANDARD 7-SIGNAL MAPPING TABLE
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
              MELSEC Q06UDEH ↔ 브릴스 협동로봇 표준 I/O 매핑표
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              행을 클릭해 각 신호의 현장 안전 인터록 설계 수칙을 강조 확인하세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['전체', 'PLC → 로봇', '로봇 → PLC'] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => setIoFilter(dir)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition cursor-pointer ${
                  ioFilter === dir
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-outline-variant/40">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-display uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">실시간</th>
                <th className="py-3 px-4">신호 방향</th>
                <th className="py-3 px-4">PLC 주소</th>
                <th className="py-3 px-4">로봇 I/O</th>
                <th className="py-3 px-4">신호명</th>
                <th className="py-3 px-4">구분</th>
                <th className="py-3 px-4">현장 설계 수칙</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/25 bg-white">
              {filteredIo.map((row) => {
                const active = selectedSignal === row.plc;
                const liveOn = signalState[row.simKey];
                return (
                  <tr
                    key={row.plc}
                    onClick={() => setSelectedSignal(row.plc)}
                    className={`cursor-pointer transition ${
                      active ? 'bg-[#dce9ff]/55' : 'hover:bg-surface-container-low/60'
                    }`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          row.simKey === 'X02' && liveOn
                            ? 'bg-rose-500'
                            : row.simKey === 'Y21' && !liveOn
                            ? 'bg-rose-500'
                            : liveOn
                            ? 'bg-emerald-500'
                            : 'bg-slate-300'
                        }`}
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-on-surface whitespace-nowrap">
                      {row.dir}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-primary whitespace-nowrap">
                      {row.plc}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-on-surface whitespace-nowrap">
                      {row.robot}
                    </td>
                    <td className="py-3 px-4 font-bold text-on-surface whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full border font-mono text-[10px] font-bold ${
                          SIGNAL_STYLES[row.signalType] ?? SIGNAL_STYLES.Control
                        }`}
                      >
                        {row.signalType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant leading-relaxed">
                      {row.desc}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function RoboticsLuaTab() {
  const { copyText } = useSiteUI();
  const [activeScriptId, setActiveScriptId] = useState(LUA_SCRIPT_ARCHIVE[0].id);

  const activeScript =
    LUA_SCRIPT_ARCHIVE.find((s) => s.id === activeScriptId) ?? LUA_SCRIPT_ARCHIVE[0];
  const lines = useMemo(() => activeScript.code.split('\n'), [activeScript]);

  return (
    <div id="lua" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Expandable Lua Script Archive Cards */}
      <aside className="lg:col-span-4 space-y-3">
        <div className="p-4 rounded-2xl bg-white/90 border border-outline-variant/45 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono text-[10.5px] font-bold text-primary uppercase">
              LUA ARCHIVE ({LUA_SCRIPT_ARCHIVE.length})
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant">
              roboticsData.ts
            </span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            현장 실습에서 작성·검증한 브릴스 Lua 스크립트를 카드 단위로 계속 누적하는 아카이브입니다.
          </p>
        </div>

        {LUA_SCRIPT_ARCHIVE.map((item) => {
          const isActive = item.id === activeScript.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveScriptId(item.id)}
              className={`w-full text-left p-5 rounded-2xl border transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-[#141923] to-[#213145] text-white border-[#2563EB] ring-2 ring-[#2563EB]/50 shadow-glass-dark'
                  : 'bg-white/90 text-on-surface border-outline-variant/45 hover:border-primary/50 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/15 text-sky-300'
                      : 'bg-[#dce9ff] text-primary'
                  }`}
                >
                  {item.badge}
                </span>
                <span
                  className={`font-mono text-[10.5px] ${
                    isActive ? 'text-slate-300' : 'text-on-surface-variant'
                  }`}
                >
                  {item.date}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold mb-1.5">
                <FileCode2 className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-primary'}`} />
                <span className="truncate">{item.filename}</span>
              </div>
              <h4 className="text-sm font-bold leading-snug">{item.title}</h4>
              <p
                className={`text-xs mt-1.5 leading-relaxed ${
                  isActive ? 'text-slate-300' : 'text-on-surface-variant'
                }`}
              >
                {item.summary}
              </p>
            </button>
          );
        })}
      </aside>

      {/* Right: Dark Code Viewer */}
      <article className="lg:col-span-8 rounded-3xl bg-[#141923] text-slate-100 border border-white/10 shadow-glass-dark overflow-hidden">
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-300 font-bold block">
              BRILS 6-AXIS COBOT · LUA SCRIPT VIEWER
            </span>
            <div className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="truncate">{activeScript.filename}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyText(activeScript.code, activeScript.filename)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-display font-semibold shadow-sm transition cursor-pointer shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>코드 원클릭 복사</span>
          </button>
        </div>

        {/* Highlights Strip */}
        <div className="px-6 py-3 bg-[#1a2232] border-b border-white/10 flex flex-wrap gap-2">
          {activeScript.highlights.map((hl) => (
            <span
              key={hl}
              className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-sky-200"
            >
              ✓ {hl}
            </span>
          ))}
        </div>

        <div className="p-4 sm:p-5 overflow-x-auto bg-[#111722]">
          <pre className="font-mono text-[11.5px] leading-[1.75] text-slate-200">
            {lines.map((line, idx) => {
              const commentIdx = line.indexOf('--');
              const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
              const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';
              return (
                <div key={idx} className="flex gap-4 hover:bg-white/5 px-2 rounded">
                  <span className="w-6 text-right text-slate-500 select-none shrink-0">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre">
                    <span className="text-sky-100">{codePart}</span>
                    {commentPart && <span className="text-emerald-400">{commentPart}</span>}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
      </article>
    </div>
  );
}
