'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen, Copy, Cpu, Lightbulb, Search } from 'lucide-react';
import { useSiteUI } from '@/components/SiteUIProvider';
import {
  ConditionalMediaImage,
  type LightboxPayload,
} from '@/components/workspace/WorkspaceMedia';
import {
  ROBOTICS_CONCEPT_CARDS,
  ROBOTICS_QUICK_NOTES,
  ROS2_CLI_CHEATSHEET,
  ROS2_CLI_GROUPS,
} from '@/data/roboticsData';

interface RoboticsConceptsTabProps {
  onZoom: (payload: LightboxPayload) => void;
}

export function RoboticsConceptsTab({ onZoom }: RoboticsConceptsTabProps) {
  return (
    <div id="concepts" className="scroll-mt-24 space-y-8">
      {/* 4 Core Visual-First Concept Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ROBOTICS_CONCEPT_CARDS.map((card) => (
          <article
            key={card.id}
            className="rounded-3xl bg-white/95 border border-outline-variant/45 p-6 shadow-glass flex flex-col justify-between gap-4"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce9ff] text-primary font-mono text-[10.5px] font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  {card.stepNo} · {card.badge}
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                  {card.title}
                </h3>
              </div>

              {/* Conditional Diagram Image (Never renders broken box if empty) */}
              <ConditionalMediaImage
                src={card.image}
                alt={card.title}
                caption={card.imageCaption}
                onZoom={onZoom}
              />

              {/* Non-major Friendly Analogy Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f8faff] border border-[#2563EB]/20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                  <span>{card.analogyTitle}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{card.analogy}</p>
              </div>

              {/* Technical Bullet Points */}
              <ul className="space-y-2 text-xs sm:text-[13px] text-on-surface leading-relaxed">
                {card.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-3 border-t border-outline-variant/35">
              <div className="p-3 rounded-xl bg-[#141923] text-white text-xs leading-relaxed">
                <span className="font-mono font-bold text-sky-300 mr-1.5">FIELD POINT:</span>
                <span>{card.takeaway}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/35 font-mono text-[10.5px] font-semibold text-on-surface-variant"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Supplementary Quick Notes */}
      <section className="rounded-3xl bg-gradient-to-br from-[#dce9ff]/55 via-white to-[#f7faff] border border-outline-variant/45 p-6 shadow-xs">
        <div className="mb-4">
          <span className="font-mono text-[10.5px] font-bold text-primary uppercase">
            QUICK FIELD NOTES · 4 ESSENTIAL RULES
          </span>
          <h3 className="font-display text-lg font-bold text-on-surface mt-0.5">
            현장 연동 · 안전 · 캘리브레이션 핵심 요약
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROBOTICS_QUICK_NOTES.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-white border border-outline-variant/40 shadow-xs flex flex-col justify-between gap-2.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-primary text-[10.5px] font-bold">
                    {note.category}
                  </span>
                  <span className="font-mono text-[10.5px] text-on-surface-variant">
                    {note.updatedAt}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-1">{note.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{note.summary}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low text-xs">
                <span className="font-bold text-primary mr-1">핵심:</span>
                <span className="text-on-surface font-medium">{note.takeaway}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RoboticsCliTab() {
  const { copyText } = useSiteUI();
  const [groupFilter, setGroupFilter] = useState<string>('전체');
  const [query, setQuery] = useState('');

  const filteredCli = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROS2_CLI_CHEATSHEET.filter((item) => {
      if (groupFilter !== '전체' && item.group !== groupFilter) return false;
      if (!q) return true;
      return [item.group, item.command, item.purpose, item.tip ?? ''].some((f) =>
        f.toLowerCase().includes(q)
      );
    });
  }, [groupFilter, query]);

  return (
    <section
      id="ros2-cli"
      className="scroll-mt-24 rounded-3xl bg-white/95 border border-outline-variant/45 p-6 sm:p-7 shadow-glass"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5 pb-4 border-b border-outline-variant/35">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce9ff] text-primary font-mono text-[10.5px] font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            WSL2 · UBUNTU · ROS 2 JAZZY / HUMBLE
          </span>
          <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
            WSL2 · ROS 2 실전 CLI 명령어 치트시트
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            노드·토픽 점검, TF2 좌표 트리 검증, Rosbag2 4대 핵심 토픽 녹화·RViz2 재생 명령어를 검색하고 원클릭 복사하세요.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="명령어 검색 (tf2, rosbag, colcon...)"
            className="w-full pl-9 pr-3 py-2 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-[#2563EB] bg-white outline-none text-xs text-on-surface"
          />
        </div>
      </div>

      {/* Group Filter Pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {ROS2_CLI_GROUPS.map((grp) => (
          <button
            key={grp}
            type="button"
            onClick={() => setGroupFilter(grp)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition cursor-pointer ${
              groupFilter === grp
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCli.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-surface-container-low/65 border border-outline-variant/40 flex flex-col justify-between gap-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-outline-variant/40 text-primary font-display text-[10.5px] font-bold">
                {item.group}
              </span>
              <button
                type="button"
                onClick={() => copyText(item.command, 'ROS 2 CLI 명령어')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#141923] hover:bg-[#2563EB] text-white text-[11px] font-semibold transition cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>복사</span>
              </button>
            </div>

            <code className="block p-3 rounded-xl bg-[#141923] text-sky-200 font-mono text-[11.5px] overflow-x-auto">
              $ {item.command}
            </code>

            <div className="text-xs text-on-surface font-semibold leading-relaxed">
              {item.purpose}
            </div>
            {item.tip && (
              <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                💡 {item.tip}
              </div>
            )}
          </div>
        ))}
        {filteredCli.length === 0 && (
          <div className="md:col-span-2 py-10 text-center text-sm text-on-surface-variant rounded-2xl border border-outline-variant/40 bg-surface-container-low">
            검색어에 일치하는 CLI 명령어가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
