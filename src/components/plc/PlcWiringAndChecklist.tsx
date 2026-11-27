'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  Keyboard,
  Plug,
  RotateCcw,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  COMMISSIONING_STEPS,
  GX_SHORTCUT_GROUPS,
  PLC_GOLDEN_RULES,
} from '@/data/plcData';

export function PlcWiringGuide() {
  return (
    <div className="space-y-6">
      {/* Section A: S/S Sink vs Source */}
      <section className="rounded-3xl bg-surface-container-lowest/95 border border-outline-variant/40 shadow-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/35 bg-surface-container-low/70 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-display font-semibold text-on-surface flex items-center gap-2">
            <Plug className="w-4 h-4 text-primary" />
            Section A. PLC 입력 결선 원리 — 싱크(Sink) vs 소스(Source)
          </h2>
          <span className="px-3 py-0.5 rounded-full bg-surface-container text-primary font-mono text-[11px] font-bold">
            QX40 / QX80 · DC 24V
          </span>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 bg-surface-container-low/60 rounded-2xl border border-outline-variant/35 p-3 overflow-x-auto">
            <svg viewBox="0 0 640 220" className="w-full min-w-[540px] h-auto block">
              {/* Sink */}
              <rect x="10" y="10" width="295" height="200" rx="10" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1.5" />
              <text x="157" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="#004ac6">
                싱크 (Sink / 플러스 공통 · 국내/일본 주류)
              </text>
              <rect x="26" y="60" width="46" height="128" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="49" y="128" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
                DC24V
              </text>
              <circle cx="72" cy="76" r="5" fill="#ef4444" />
              <text x="58" y="80" textAnchor="end" fontSize="9.5" fontWeight="700" fill="#dc2626">
                P24
              </text>
              <circle cx="72" cy="176" r="5" fill="#334155" />
              <text x="58" y="180" textAnchor="end" fontSize="9.5" fontWeight="700" fill="#334155">
                N24
              </text>
              <rect x="218" y="54" width="74" height="134" rx="6" fill="#eff4ff" stroke="#2563eb" strokeWidth="1.5" />
              <text x="255" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#004ac6">
                PLC INPUT
              </text>
              <circle cx="218" cy="96" r="6" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
              <text x="250" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="#004ac6">
                X00
              </text>
              <circle cx="218" cy="154" r="6" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
              <text x="260" y="158" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">
                COM(S/S)
              </text>
              <path d="M 72 76 L 154 76 L 154 154 L 212 154" fill="none" stroke="#ef4444" strokeWidth="2.2" />
              <path d="M 72 176 L 120 176 L 120 96 L 136 96" fill="none" stroke="#334155" strokeWidth="2.2" />
              <line x1="136" y1="96" x2="166" y2="82" stroke="#0b1c30" strokeWidth="2.5" />
              <circle cx="136" cy="96" r="3" fill="#0b1c30" />
              <circle cx="170" cy="96" r="3" fill="#0b1c30" />
              <text x="153" y="114" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#475569">
                PB0
              </text>
              <line x1="170" y1="96" x2="212" y2="96" stroke="#004ac6" strokeWidth="2.2" />
              <text x="157" y="204" textAnchor="middle" fontSize="10" fill="#475569">
                COM에 (+)24V → X00으로 (-)신호 입력
              </text>

              {/* Source */}
              <rect x="316" y="10" width="314" height="200" rx="10" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
              <text x="473" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857">
                소스 (Source / 마이너스 공통 · QX80 등)
              </text>
              <rect x="332" y="60" width="46" height="128" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="355" y="128" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
                DC24V
              </text>
              <circle cx="378" cy="76" r="5" fill="#ef4444" />
              <text x="364" y="80" textAnchor="end" fontSize="9.5" fontWeight="700" fill="#dc2626">
                P24
              </text>
              <circle cx="378" cy="176" r="5" fill="#334155" />
              <text x="364" y="180" textAnchor="end" fontSize="9.5" fontWeight="700" fill="#334155">
                N24
              </text>
              <rect x="524" y="54" width="90" height="134" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <text x="569" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">
                PLC INPUT
              </text>
              <circle cx="524" cy="96" r="6" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
              <text x="556" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">
                X00
              </text>
              <circle cx="524" cy="154" r="6" fill="#ffffff" stroke="#475569" strokeWidth="2" />
              <text x="566" y="158" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
                COM(S/S)
              </text>
              <path d="M 378 76 L 426 76 L 426 96 L 442 96" fill="none" stroke="#ef4444" strokeWidth="2.2" />
              <line x1="442" y1="96" x2="472" y2="82" stroke="#0b1c30" strokeWidth="2.5" />
              <circle cx="442" cy="96" r="3" fill="#0b1c30" />
              <circle cx="476" cy="96" r="3" fill="#0b1c30" />
              <text x="459" y="114" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#475569">
                PB0
              </text>
              <line x1="476" y1="96" x2="518" y2="96" stroke="#10b981" strokeWidth="2.2" />
              <path d="M 378 176 L 460 176 L 460 154 L 518 154" fill="none" stroke="#334155" strokeWidth="2.2" />
              <text x="480" y="204" textAnchor="middle" fontSize="10" fill="#475569">
                COM에 (-)0V → X00으로 (+)신호 입력
              </text>
            </svg>
          </div>

          <div className="lg:col-span-5 space-y-3 text-xs leading-relaxed">
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40">
              <div className="font-bold text-primary mb-1">
                핵심 법칙: &quot;S/S(COM)와 스위치 전원은 항상 반대 극성!&quot;
              </div>
              <p className="text-on-surface-variant">
                싱크/소스 공용 모듈(S/S 단자)은 기준선을 <b>P24(+)</b>에 물리면 스위치에서 <b>N24(-)</b>가 들어올 때 켜지고(싱크), 반대로 <b>N24(-)</b>에 물리면 <b>P24(+)</b>가 들어올 때 켜집니다(소스).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200">
              <div className="font-bold text-amber-900 mb-1">실습실 Q시리즈 체크 포인트</div>
              <p className="text-amber-900/85">
                버튼을 눌러도 입력 LED가 안 들어온다면 99% <b>COM 단자 누락</b> 또는 <b>P24/N24 극성 일치(전위차 0V)</b> 실수입니다. 반드시 테스터기로 24V 전위차를 먼저 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: FREQROL-E700 Inverter Master Card */}
      <section className="rounded-3xl bg-surface-container-lowest/95 border border-outline-variant/40 shadow-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/35 bg-surface-container-low/70 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-display font-semibold text-on-surface flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Section B. 미쓰비시 인버터 (FREQROL-E700) 마스터 카드
          </h2>
          <span className="px-3 py-0.5 rounded-full bg-surface-container text-primary font-mono text-[11px] font-bold">
            Dry Contact · Pr.79
          </span>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/35 text-xs space-y-2.5">
              <div className="font-bold text-on-surface text-sm">1. 드라이 컨택 (무전압 접점) 제어 배선</div>
              <p className="text-on-surface-variant leading-relaxed">
                인버터 내부에 이미 <b>자체 DC 24V 전원</b>이 들어 있습니다. 따라서 PLC는 전기를 쏘지 않고 스위치(다리) 역할만 수행합니다.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-primary/25 text-center">
                  <div className="text-on-surface-variant">정회전</div>
                  <div className="font-bold text-primary">Y20 ↔ STF</div>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-tertiary/25 text-center">
                  <div className="text-on-surface-variant">역회전</div>
                  <div className="font-bold text-tertiary">Y21 ↔ STR</div>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/50 text-center">
                  <div className="text-on-surface-variant">공통선</div>
                  <div className="font-bold text-on-surface">COM ↔ SD</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/35 text-xs space-y-2">
              <div className="font-bold text-on-surface text-sm">2. 3상 동력 배선: R/S/T vs U/V/W</div>
              <ul className="space-y-1.5 text-on-surface-variant">
                <li>
                  <b className="font-mono text-on-surface">R / S / T (입력):</b> 분전반 3상 전원 인입. 내부에서 직류(DC) 변환하므로 순서가 바뀌어도 회전 방향에 영향 없음.
                </li>
                <li>
                  <b className="font-mono text-primary">U / V / W (출력):</b> 모터로 나가는 가변 주파수 출력. <b>현장에서 모터가 반대로 돌면 U·V·W 중 아무 두 선만 서로 교체</b>하면 즉시 해결!
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/75 border border-emerald-200 text-xs space-y-2">
              <div className="font-bold text-emerald-900 text-sm">3. 주파수(Hz) 수동 설정 3단계 (안 먹힐 때)</div>
              <div className="flex flex-wrap items-center gap-1.5 font-semibold text-emerald-800">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300">① PU/EXT → PU 점등</span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300">② 다이얼로 Hz 맞춤</span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white">③ SET 버튼 확정!</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-surface-container-low/70 rounded-2xl border border-outline-variant/35 p-4 flex flex-col justify-between">
            <div>
              <div className="font-bold text-on-surface text-sm mb-1">4. 마스터 파라미터 Pr.79 운전 모드 선택표</div>
              <p className="text-xs text-on-surface-variant mb-3">
                배선이 완벽한데 PLC 신호로 모터가 안 돌면 100% <b>PU/EXT 모드</b> 또는 <b>Pr.79</b> 설정 때문입니다.
              </p>
              <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] text-on-surface-variant">
                      <th className="py-2.5 px-3">Pr.79 값</th>
                      <th className="py-2.5 px-3">운전 모드</th>
                      <th className="py-2.5 px-3">특징 및 용도</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/25">
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-on-surface">0 (초기값)</td>
                      <td className="py-2.5 px-3 font-semibold">PU / EXT 전환</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">패널 버튼으로 수동/외부 자유 전환</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-on-surface">1</td>
                      <td className="py-2.5 px-3 font-semibold">PU 전용</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">본체 다이얼/버튼으로만 수동 조작</td>
                    </tr>
                    <tr className="bg-primary-fixed/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-primary">2</td>
                      <td className="py-2.5 px-3 font-bold text-primary">EXT 전용</td>
                      <td className="py-2.5 px-3 text-on-surface">PLC 외부 신호(STF/STR/RH·RM·RL)만 수용</td>
                    </tr>
                    <tr className="bg-emerald-50/70">
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">3 ★실습추천</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">혼합 (외부기동)</td>
                      <td className="py-2.5 px-3 text-emerald-900">주파수=본체 다이얼, 시작/정지=PLC 신호</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-on-surface">4</td>
                      <td className="py-2.5 px-3 font-semibold">혼합 (PU기동)</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">주파수=외부 신호, 시작/정지=본체 RUN 버튼</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Noise & Grounding */}
      <section className="space-y-3.5">
        <h2 className="text-sm sm:text-base font-display font-semibold text-on-surface flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          Section C. 현장 노이즈 &amp; 접지(Earth) 치명적 휴먼에러 3대 수칙
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              badge: '수칙 1 · 혼촉 배선 금지',
              badgeCls: 'bg-rose-50 text-rose-700',
              borderCls: 'border-rose-200',
              title: '전력선과 신호선 완벽 분리',
              desc: '인버터 동력선(PWM 고주파 노이즈원)과 PLC 24V 센서·통신선을 같은 덕트에 묶으면 유도 노이즈로 오작동이 발생합니다.',
              fix: '✅ 해결: 최소 20cm 이상 이격 배선, 불가피하게 교차 시 반드시 90° 직각 교차!',
            },
            {
              badge: '수칙 2 · 그라운드 루프 차단',
              badgeCls: 'bg-amber-50 text-amber-800',
              borderCls: 'border-amber-200',
              title: '실드선 편단 접지 (1점 접지)',
              desc: '실드 케이블 양쪽 끝을 모두 접지하면 양측 0V 전위차로 인해 실드망에 노이즈 전류(Ground Loop)가 콸콸 흐릅니다.',
              fix: '✅ 해결: 제어반(PLC) 측 한쪽 끝에만 접지하고, 현장 센서 측은 절연 테이핑 마감!',
            },
            {
              badge: '수칙 3 · 데이지 체인 금지',
              badgeCls: 'bg-primary-fixed text-primary',
              borderCls: 'border-primary/25',
              title: '접지선 스타 토폴로지 (단독 접지)',
              desc: '인버터 접지를 PLC 접지에 기차놀이(직렬)로 물리면 인버터 노이즈가 PLC로 역류해 CPU가 다운됩니다.',
              fix: '✅ 해결: 메인 접지 바(Earth Bar)에서 인버터·모터·PLC로 각각 단독 방사형 결선!',
            },
          ].map((rule) => (
            <div
              key={rule.title}
              className={`rounded-2xl bg-surface-container-lowest/95 border p-5 shadow-glass space-y-2.5 ${rule.borderCls}`}
            >
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${rule.badgeCls}`}>
                {rule.badge}
              </span>
              <h3 className="text-sm font-bold text-on-surface">{rule.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{rule.desc}</p>
              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] font-semibold text-emerald-900">
                {rule.fix}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PlcChecklistTab() {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const totalCheckItems = useMemo(
    () => COMMISSIONING_STEPS.reduce((sum, st) => sum + st.items.length, 0),
    []
  );
  const completedCheckItems = Object.values(checkedMap).filter(Boolean).length;
  const checkProgress = Math.round((completedCheckItems / totalCheckItems) * 100);

  const toggleCheck = (key: string) => {
    setCheckedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Top 2 Columns: Shortcuts + 7 Golden Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-6 rounded-3xl bg-surface-container-lowest/95 border border-outline-variant/40 shadow-glass overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant/35 bg-surface-container-low/70 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-on-surface">
              GX Works2 / 3 필수 단축키 치트시트
            </h2>
          </div>
          <div className="p-5 space-y-3.5 text-xs">
            {GX_SHORTCUT_GROUPS.map((sec) => (
              <div key={sec.group} className="space-y-1.5">
                <div className="text-[11px] font-display font-semibold text-primary uppercase tracking-wider">
                  {sec.group}
                </div>
                <div className="divide-y divide-outline-variant/25 rounded-xl border border-outline-variant/35 overflow-hidden">
                  {sec.keys.map(([k, desc]) => (
                    <div
                      key={k}
                      className="px-3 py-2.5 bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-1"
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

        <section className="lg:col-span-6 rounded-3xl bg-surface-container-lowest/95 border border-outline-variant/40 shadow-glass overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant/35 bg-surface-container-low/70 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-display font-semibold text-on-surface">
              PLC 래더 설계 7대 철칙 (오류 원천 차단)
            </h2>
          </div>
          <div className="p-5 space-y-2.5 text-xs">
            {PLC_GOLDEN_RULES.map(([title, desc]) => (
              <div key={title} className="p-3 rounded-xl bg-surface-container-low/65 border border-outline-variant/35">
                <div className="font-bold text-on-surface">{title}</div>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Interactive 5-Phase Commissioning Checklist */}
      <section className="rounded-3xl bg-surface-container-lowest/95 border border-outline-variant/40 shadow-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/35 bg-surface-container-low/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm sm:text-base font-display font-semibold text-on-surface">
              인터랙티브 현장 시운전 5단계 체크리스트
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-28 sm:w-36 h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${checkProgress}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700">
                {completedCheckItems}/{totalCheckItems} ({checkProgress}%)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCheckedMap({})}
              className="px-3 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/50 text-on-surface-variant text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              초기화
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMISSIONING_STEPS.map((st) => (
            <div
              key={st.id}
              className="rounded-2xl border border-outline-variant/40 bg-surface-container-low/55 p-4 space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-display font-bold">
                  {st.phase}
                </span>
                <h3 className="text-xs font-bold text-on-surface">{st.title}</h3>
              </div>
              <div className="space-y-2">
                {st.items.map((text, idx) => {
                  const key = `${st.id}-${idx}`;
                  const checked = Boolean(checkedMap[key]);
                  return (
                    <label
                      key={key}
                      className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                        checked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through decoration-emerald-500/60'
                          : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheck(key)}
                        className="mt-0.5 w-3.5 h-3.5 accent-emerald-600 shrink-0 cursor-pointer"
                      />
                      <span className="leading-snug">{text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bonus Cards: GX Works2 vs 3 & GT Designer 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="rounded-3xl bg-surface-container-lowest/95 border border-outline-variant/40 p-5 shadow-glass space-y-3 text-xs">
          <div className="font-display font-semibold text-on-surface text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            GX Works2 vs GX Works3 핵심 차이점
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-primary/20">
              <div className="font-bold text-primary mb-1">GX Works2 (수업/현장 주력)</div>
              <ul className="space-y-1 text-on-surface-variant">
                <li>• 대상: <b>Q시리즈(Q06UDEH)</b>, FX3U</li>
                <li>• 디바이스 주소 중심(X00, Y20, D0)</li>
                <li>• 심플 프로젝트 + 래더 기반</li>
              </ul>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40">
              <div className="font-bold text-on-surface mb-1">GX Works3 (차세대 표준)</div>
              <ul className="space-y-1 text-on-surface-variant">
                <li>• 대상: <b>iQ-R / iQ-F(FX5U)</b></li>
                <li>• 글로벌 라벨(변수명) + FB/ST 강화</li>
                <li>• 모듈 구성도 그래픽 자동 설정</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-surface-container-lowest/95 border border-outline-variant/40 p-5 shadow-glass space-y-3 text-xs">
          <div className="font-display font-semibold text-on-surface text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            GT Designer 3 (HMI) 작화 3대 원칙
          </div>
          <ul className="space-y-2 text-on-surface-variant">
            <li className="p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/35">
              <b className="text-on-surface">1. 절대 좌표 &amp; 고정 해상도:</b> 반응형 웹이 아닌 패널 고정 픽셀(예: 800×480)에 격자(Grid) 맞춰 배치.
            </li>
            <li className="p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/35">
              <b className="text-on-surface">2. 크고 극단적인 산업 UI/UX:</b> 안전장갑 착용 터치 고려해 버튼은 큼직하게, ON(녹/적)·OFF(회색) 대비 극대화.
            </li>
            <li className="p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/35">
              <b className="text-on-surface">3. PLC 메모리 1:1 매칭:</b> 도형/버튼 속성에 <code className="font-mono text-primary font-bold">M0, Y20, D0</code> 주소만 연결하면 끝.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
