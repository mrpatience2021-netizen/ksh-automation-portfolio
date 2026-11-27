'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, User, X } from 'lucide-react';
import { NAV_ITEMS, SITE_META } from '@data/site';
import { useSiteUI } from './SiteUIProvider';

export default function SiteHeader() {
  const pathname = usePathname();
  const { openPdfModal } = useSiteUI();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="no-print fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/40">
      <div className="h-14 max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/"
            className="font-display text-[17px] leading-none tracking-[-0.015em] text-on-surface font-bold hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>{SITE_META.brandName}</span>
            <span className="text-outline-variant font-normal text-sm">|</span>
            <span className="text-[13px] font-semibold text-on-surface-variant tracking-normal">
              {SITE_META.englishName}
            </span>
          </Link>
          <span className="hidden lg:inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-[11px] font-semibold">
            {SITE_META.roleBadge}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="주 메뉴" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[14px] leading-none tracking-[-0.01em] py-1 transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant font-medium hover:text-on-surface'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={openPdfModal}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-inverse-surface text-inverse-on-surface text-[12px] sm:text-[13px] font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-sm cursor-pointer"
          >
            <span>이력서 · 기술 리포트 PDF</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <Link
            href="/profile"
            aria-label="프로필 페이지로 이동"
            className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shrink-0 transition-transform hover:scale-105 shadow-sm"
          >
            <User className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface cursor-pointer"
            aria-label="모바일 메뉴 열기"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/40 px-5 py-3.5 space-y-1.5 shadow-glass">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-3.5 py-2 rounded-xl text-sm font-semibold ${
              pathname === '/'
                ? 'bg-surface-container text-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            허브 홈 (/)
          </Link>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3.5 py-2 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-surface-container text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
