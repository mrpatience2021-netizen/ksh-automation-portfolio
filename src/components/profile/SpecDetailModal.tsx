'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Cpu,
  Globe,
  GraduationCap,
  Languages,
  Terminal,
  Trophy,
  X,
} from 'lucide-react';
import type { SpecIconKey, SpecTileItem } from '@/data/profileData';
import ProofSlot from './ProofSlot';

export const SPEC_ICON_MAP: Record<SpecIconKey, React.ComponentType<{ className?: string }>> = {
  graduation: GraduationCap,
  cpu: Cpu,
  terminal: Terminal,
  languages: Languages,
  globe: Globe,
  badgeCheck: BadgeCheck,
  bookOpen: BookOpen,
  trophy: Trophy,
};

interface SpecDetailModalProps {
  spec: SpecTileItem | null;
  onClose: () => void;
}

export default function SpecDetailModal({ spec, onClose }: SpecDetailModalProps) {
  useEffect(() => {
    if (!spec) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [spec, onClose]);

  if (!spec) return null;

  const Icon = SPEC_ICON_MAP[spec.icon];
  const isLavender = spec.surface === 'lavender';
  const isDark = spec.surface === 'dark';

  const headerBg = isLavender
    ? 'bg-gradient-to-r from-[#efe6ff] via-[#ebefff] to-[#f8f9ff]'
    : isDark
    ? 'bg-gradient-to-r from-[#213145] via-[#273952] to-[#1e2d40] text-white'
    : 'bg-gradient-to-r from-[#dce9ff] via-[#e8f1ff] to-[#f8f9ff]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spec-modal-title"
      className="fixed inset-0 z-[65] bg-[#0b1c30]/35 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-3xl bg-white border border-[#c3c6d7]/60 shadow-[0_24px_60px_-12px_rgba(11,28,48,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Crisp Editorial Modal Header */}
        <div
          className={`sticky top-0 z-10 px-6 py-5 border-b ${
            isDark ? 'border-white/10' : 'border-[#c3c6d7]/40'
          } flex items-start justify-between gap-4 ${headerBg}`}
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
                isDark
                  ? 'bg-white/15 text-[#b4c5ff] border-white/20'
                  : isLavender
                  ? 'bg-white text-tertiary border-tertiary/20'
                  : 'bg-white text-primary border-primary/20'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="spec-modal-title"
                  className={`font-display text-lg sm:text-xl font-bold ${
                    isDark ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  {spec.title}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    isDark
                      ? 'bg-primary-container text-white'
                      : 'bg-inverse-surface text-white'
                  }`}
                >
                  {spec.keyword}
                </span>
              </div>
              <p
                className={`text-xs sm:text-[13px] mt-1 leading-relaxed ${
                  isDark ? 'text-inverse-on-surface/80' : 'text-on-surface-variant'
                }`}
              >
                {spec.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
              isDark
                ? 'bg-white/15 hover:bg-primary-container text-white'
                : 'bg-inverse-surface hover:bg-primary text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bright Clean Modal Body */}
        <div className="p-6 sm:p-7 space-y-5 bg-white">
          <div className="space-y-3">
            {spec.details.map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-2xl bg-[#f4f7fe] border border-[#dce6f8] space-y-1.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-on-surface">{item.title}</h3>
                  {item.meta && (
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      {item.meta}
                    </span>
                  )}
                </div>
                {item.desc && (
                  <p className="text-xs sm:text-[13px] text-on-surface-variant leading-[1.65]">
                    {item.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          {spec.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {spec.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/50 text-xs font-semibold text-on-surface"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <ProofSlot proofs={spec.proofs} />

          {spec.sectorLinks && spec.sectorLinks.length > 0 && (
            <div className="pt-4 border-t border-outline-variant/40 flex flex-wrap items-center justify-end gap-2.5">
              {spec.sectorLinks.map((sec) => (
                <Link
                  key={sec.href}
                  href={sec.href}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-display font-semibold shadow-sm transition"
                >
                  <span>{sec.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
