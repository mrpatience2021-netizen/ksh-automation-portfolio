'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Database, Search, Wrench } from 'lucide-react';
import { useSiteUI } from '@/components/SiteUIProvider';
import {
  ConditionalMediaImage,
  type LightboxPayload,
} from '@/components/workspace/WorkspaceMedia';
import {
  ROBOT_ALARM_DB,
  ROSBAG_FEATURED_CASE,
  TEACHING_CASE_STUDIES,
} from '@/data/roboticsData';

interface RoboticsTeachingTabProps {
  onZoom: (payload: LightboxPayload) => void;
}

export function RoboticsTeachingTab({ onZoom }: RoboticsTeachingTabProps) {
  return (
    <section id="teaching" className="scroll-mt-24 space-y-5">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#e9ddff] via-[#eef0ff] to-white border border-outline-variant/45 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[10.5px] font-bold text-tertiary uppercase">
            FIELD CASE ARCHIVE · BRILS COBOT TEACHING
          </span>
          <h3 className="font-display text-lg font-bold text-on-surface mt-0.5">
            브릴스 협동로봇 현장 티칭 &amp; 공정 트러블슈팅 케이스 스터디
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-white border border-outline-variant/40 font-mono text-[11px] font-bold text-tertiary">
          {TEACHING_CASE_STUDIES.length} Verified Cases
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {TEACHING_CASE_STUDIES.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl bg-white/95 border border-outline-variant/45 p-6 shadow-glass space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-tertiary text-white font-mono text-[10.5px] font-bold">
                  {item.date} · {item.status}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#e9ddff] text-tertiary text-[11px] font-bold">
                  {item.category}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.resultMetric}
              </span>
            </div>

            <h4 className="font-display text-lg font-bold text-on-surface">{item.title}</h4>

            <ConditionalMediaImage
              src={item.thumbnail}
              alt={item.title}
              caption={item.thumbnailCaption}
              onZoom={onZoom}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-rose-50/75 border border-rose-200/70">
                <div className="font-mono text-[10.5px] font-bold text-rose-700 mb-1">
                  01. 현상 (SYMPTOM)
                </div>
                <p className="text-xs text-on-surface leading-relaxed">{item.symptom}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/75 border border-amber-200/70">
                <div className="font-mono text-[10.5px] font-bold text-amber-800 mb-1">
                  02. 원인 분석 (ROOT CAUSE)
                </div>
                <p className="text-xs text-on-surface leading-relaxed">{item.rootCause}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/75 border border-emerald-200/70">
                <div className="font-mono text-[10.5px] font-bold text-emerald-800 mb-1">
                  03. 해결 조치 (SOLUTION)
                </div>
                <p className="text-xs text-on-surface leading-relaxed">{item.solution}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/35 font-mono text-[10.5px] font-semibold text-on-surface-variant"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RoboticsRosbagAlarmTab() {
  const { copyText } = useSiteUI();
  const [alarmQuery, setAlarmQuery] = useState('');
  const [alarmCat, setAlarmCat] = useState<string>('전체');

  const categories = ['전체', '기구학 · 특이점', '안전 · I/O', 'ROS 2 · Rosbag2', '그리퍼 · TCP'];

  const filteredAlarms = useMemo(() => {
    const q = alarmQuery.trim().toLowerCase();
    return ROBOT_ALARM_DB.filter((entry) => {
      if (alarmCat !== '전체' && entry.category !== alarmCat) return false;
      if (!q) return true;
      return [entry.code, entry.category, entry.symptom, entry.cause, entry.action, entry.prevention].some(
        (v) => v.toLowerCase().includes(q)
      );
    });
  }, [alarmCat, alarmQuery]);

  return (
    <div id="rosbag" className="scroll-mt-24 space-y-6">
      {/* Featured Rosbag2 4-Topic Diagnostic Case */}
      <article className="rounded-3xl bg-gradient-to-br from-[#141923] via-[#1c2638] to-[#213145] text-white border border-white/15 p-6 sm:p-7 shadow-glass-dark">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-300 font-mono text-[10.5px] font-bold">
              <Database className="w-3.5 h-3.5" />
              {ROSBAG_FEATURED_CASE.date} · {ROSBAG_FEATURED_CASE.status}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 font-mono text-[10.5px] font-bold">
              {ROSBAG_FEATURED_CASE.metric}
            </span>
          </div>
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4">
          {ROSBAG_FEATURED_CASE.title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-rose-400/30">
            <div className="font-mono text-[10.5px] font-bold text-rose-300 mb-1">
              ISSUE · 전체 녹화(-a) 용량 폭주
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{ROSBAG_FEATURED_CASE.problem}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-emerald-400/30">
            <div className="font-mono text-[10.5px] font-bold text-emerald-300 mb-1">
              SOLUTION · 필수 4대 경량 토픽 선별 녹화
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{ROSBAG_FEATURED_CASE.solution}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="font-mono text-[11px] font-bold text-slate-300">필수 4대 토픽:</span>
          {ROSBAG_FEATURED_CASE.essentialTopics.map((tp) => (
            <span
              key={tp}
              className="px-2.5 py-1 rounded-lg bg-[#2563EB]/30 border border-sky-400/40 font-mono text-xs font-bold text-sky-200"
            >
              {tp}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
            <code className="font-mono text-[11px] text-sky-200 overflow-x-auto">
              $ {ROSBAG_FEATURED_CASE.command}
            </code>
            <button
              type="button"
              onClick={() => copyText(ROSBAG_FEATURED_CASE.command, 'Rosbag2 선별 녹화 명령어')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-[#2563EB] text-white text-[11px] font-semibold transition cursor-pointer shrink-0"
            >
              <Copy className="w-3 h-3" />
              <span>복사</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
            <code className="font-mono text-[11px] text-emerald-200 overflow-x-auto">
              $ {ROSBAG_FEATURED_CASE.replayCommand}
            </code>
            <button
              type="button"
              onClick={() => copyText(ROSBAG_FEATURED_CASE.replayCommand, 'Rosbag2 0.5x 재생 명령어')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-emerald-600 text-white text-[11px] font-semibold transition cursor-pointer shrink-0"
            >
              <Copy className="w-3 h-3" />
              <span>복사</span>
            </button>
          </div>
        </div>
      </article>

      {/* Searchable Robot Alarm DB */}
      <section className="rounded-3xl bg-white/95 border border-outline-variant/45 p-6 sm:p-7 shadow-glass">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5 pb-4 border-b border-outline-variant/35">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9ddff] text-tertiary font-mono text-[10.5px] font-bold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              ROBOT ALARM &amp; TROUBLESHOOTING DB
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
              협동로봇 알람 · I/O · ROS 2 현장 트러블슈팅 검색 DB
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={alarmQuery}
              onChange={(e) => setAlarmQuery(e.target.value)}
              placeholder="증상·코드 검색 (특이점, EMG, TF...)"
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-outline-variant/50 focus:border-tertiary outline-none text-xs text-on-surface"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setAlarmCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition cursor-pointer ${
                alarmCat === cat
                  ? 'bg-tertiary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3.5">
          {filteredAlarms.map((al) => (
            <div
              key={al.id}
              className="p-5 rounded-2xl bg-surface-container-low/65 border border-outline-variant/40 space-y-2.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#141923] text-amber-300 font-mono text-[10.5px] font-bold">
                  <AlertTriangle className="w-3 h-3" />
                  {al.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e9ddff] text-tertiary text-[10.5px] font-bold">
                  {al.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">{al.symptom}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white border border-outline-variant/35">
                  <span className="font-bold text-rose-700 block mb-0.5">원인</span>
                  <span className="text-on-surface-variant">{al.cause}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-outline-variant/35">
                  <span className="font-bold text-[#2563EB] block mb-0.5">즉시 조치</span>
                  <span className="text-on-surface">{al.action}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-outline-variant/35">
                  <span className="font-bold text-emerald-700 block mb-0.5">재발 방지</span>
                  <span className="text-on-surface-variant">{al.prevention}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredAlarms.length === 0 && (
            <div className="py-10 text-center text-sm text-on-surface-variant rounded-2xl border border-outline-variant/40 bg-surface-container-low">
              검색어에 일치하는 알람 사례가 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
