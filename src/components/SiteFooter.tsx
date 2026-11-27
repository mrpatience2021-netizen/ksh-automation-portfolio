'use client';

import React from 'react';
import Link from 'next/link';
import { NAV_ITEMS, SITE_META } from '@data/site';
import { useSiteUI } from './SiteUIProvider';

export default function SiteFooter() {
  const { openPdfModal } = useSiteUI();

  return (
    <footer className="no-print w-full bg-surface-container-low border-t border-outline-variant/40 py-6 mt-6">
      <div className="max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-on-surface-variant">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <span className="font-display text-[12px] tracking-[0.02em] text-on-surface font-semibold">
            {SITE_META.brandName} ({SITE_META.englishName}) — © {SITE_META.year}
          </span>
          <span className="text-outline-variant">|</span>
          <span className="text-[12.5px] text-on-surface-variant">{SITE_META.footerSubtext}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[12.5px] font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openPdfModal}
            className="text-[12.5px] text-on-surface-variant hover:text-primary font-semibold transition-colors cursor-pointer"
          >
            이력서 · 리포트 PDF
          </button>
        </div>
      </div>
    </footer>
  );
}
