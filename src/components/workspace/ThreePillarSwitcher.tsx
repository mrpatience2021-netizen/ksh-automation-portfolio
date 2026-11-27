'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type PillarId = 'lab' | 'reference' | 'fieldlog';

export interface PillarCardMeta {
  id: PillarId;
  badge: string;
  countLabel: string;
  title: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
}

interface ThreePillarSwitcherProps {
  ariaLabel: string;
  pillars: [PillarCardMeta, PillarCardMeta, PillarCardMeta];
  activePillar: PillarId;
  onSelect: (id: PillarId) => void;
}

export function ThreePillarSwitcher({
  ariaLabel,
  pillars,
  activePillar,
  onSelect,
}: ThreePillarSwitcherProps) {
  return (
    <section aria-label={ariaLabel} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;
        const isActive = activePillar === pillar.id;

        if (pillar.id === 'lab') {
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => onSelect('lab')}
              aria-pressed={isActive}
              className={`group relative overflow-hidden text-left rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-gradient-to-br from-[#141923] via-[#1c2638] to-[#213145] text-white border ${
                isActive
                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/70 shadow-[0_20px_44px_-8px_rgba(37,99,235,0.38)] -translate-y-0.5'
                  : 'border-white/10 opacity-85 hover:opacity-100 hover:-translate-y-0.5 shadow-glass-dark'
              }`}
            >
              <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#2563EB]/25 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 font-mono text-[10.5px] font-bold text-sky-300">
                    <Icon className="w-3 h-3" />
                    {pillar.badge}
                  </span>
                  {isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white font-mono text-[10px] font-bold">
                      ● ACTIVE
                    </span>
                  ) : (
                    <span className="font-mono text-[10.5px] text-slate-400">
                      {pillar.countLabel}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl font-bold text-white">{pillar.title}</h2>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                {pillar.tags.map((tag, idx) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-0.5 rounded-full bg-white/10 font-mono text-[10.5px] font-semibold ${
                      idx === 0 ? 'text-sky-200' : 'text-slate-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        }

        if (pillar.id === 'reference') {
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => onSelect('reference')}
              aria-pressed={isActive}
              className={`group relative overflow-hidden text-left rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-gradient-to-br from-[#dce9ff] via-[#e7f0ff] to-[#f7faff] text-on-surface border ${
                isActive
                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/60 shadow-[0_20px_44px_-10px_rgba(37,99,235,0.28)] -translate-y-0.5'
                  : 'border-outline-variant/45 opacity-90 hover:opacity-100 hover:-translate-y-0.5 shadow-glass'
              }`}
            >
              <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-primary/15 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-primary font-mono text-[10.5px] font-bold shadow-xs">
                    <Icon className="w-3 h-3" />
                    {pillar.badge}
                  </span>
                  {isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white font-mono text-[10px] font-bold">
                      ● ACTIVE
                    </span>
                  ) : (
                    <span className="font-mono text-[10.5px] text-on-surface-variant">
                      {pillar.countLabel}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl font-bold text-on-surface">{pillar.title}</h2>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="relative z-10 mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-1.5">
                {pillar.tags.map((tag, idx) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] font-semibold ${
                      idx === 0 ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        }

        // fieldlog (Soft Lavender)
        return (
          <button
            key={pillar.id}
            type="button"
            onClick={() => onSelect('fieldlog')}
            aria-pressed={isActive}
            className={`group relative overflow-hidden text-left rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-gradient-to-br from-[#e9ddff] via-[#e4e6ff] to-[#ffffff] text-on-surface border ${
              isActive
                ? 'border-tertiary ring-2 ring-tertiary/55 shadow-[0_20px_44px_-10px_rgba(99,46,205,0.26)] -translate-y-0.5'
                : 'border-outline-variant/45 opacity-90 hover:opacity-100 hover:-translate-y-0.5 shadow-glass'
            }`}
          >
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-tertiary/15 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-tertiary font-mono text-[10.5px] font-bold shadow-xs">
                  <Icon className="w-3 h-3" />
                  {pillar.badge}
                </span>
                {isActive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary text-white font-mono text-[10px] font-bold">
                    ● ACTIVE
                  </span>
                ) : (
                  <span className="font-mono text-[10.5px] text-on-surface-variant">
                    {pillar.countLabel}
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl font-bold text-on-surface">{pillar.title}</h2>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {pillar.description}
              </p>
            </div>
            <div className="relative z-10 mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-1.5">
              {pillar.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className={`px-2.5 py-0.5 rounded-full bg-white/90 font-mono text-[10.5px] font-semibold ${
                    idx === 0 ? 'text-tertiary' : 'text-on-surface'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </section>
  );
}

export interface SubTabItem<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

interface SubTabBarProps<T extends string> {
  activePillar: PillarId;
  tabs: readonly SubTabItem<T>[];
  activeTab: T;
  onSelect: (id: T) => void;
  rightSlot?: React.ReactNode;
}

export function SubTabBar<T extends string>({
  activePillar,
  tabs,
  activeTab,
  onSelect,
  rightSlot,
}: SubTabBarProps<T>) {
  const activeBg =
    activePillar === 'lab'
      ? 'bg-[#141923] text-white shadow-sm'
      : activePillar === 'reference'
      ? 'bg-[#2563EB] text-white shadow-sm'
      : 'bg-tertiary text-white shadow-sm';

  const activeIconColor = activePillar === 'lab' ? 'text-sky-400' : 'text-white';
  const inactiveIconColor = activePillar === 'fieldlog' ? 'text-tertiary' : 'text-primary';

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white/85 backdrop-blur-xl border border-outline-variant/45 shadow-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-display font-semibold transition cursor-pointer ${
                active
                  ? activeBg
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? activeIconColor : inactiveIconColor}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </div>
  );
}
