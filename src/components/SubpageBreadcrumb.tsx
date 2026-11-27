'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface SubpageBreadcrumbProps {
  sectionCode: string;
  sectionTitle: string;
  subtitle: string;
  rightBadge?: string;
}

export default function SubpageBreadcrumb({
  sectionCode,
  sectionTitle,
  subtitle,
  rightBadge,
}: SubpageBreadcrumbProps) {
  return (
    <div className="no-print mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/50 text-xs font-semibold text-on-surface hover:bg-inverse-surface hover:text-inverse-on-surface hover:border-inverse-surface transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>허브로 돌아가기</span>
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="font-display text-xs uppercase tracking-[0.05em] font-bold text-primary">
            {sectionCode}
          </span>
        </div>

        {rightBadge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-mono text-[11px] font-semibold text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {rightBadge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h1 className="font-display text-2xl sm:text-3xl lg:text-[34px] lg:leading-[1.22] font-bold tracking-[-0.025em] text-on-surface">
          {sectionTitle}
        </h1>
        <p className="mt-1.5 text-[14px] sm:text-[15px] text-on-surface-variant max-w-4xl leading-[1.6]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
