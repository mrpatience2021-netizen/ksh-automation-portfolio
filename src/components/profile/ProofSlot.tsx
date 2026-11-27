'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, FileCheck2, ZoomIn, X } from 'lucide-react';
import type { ProofItem } from '@/data/profileData';

interface ProofSlotProps {
  proofs?: ProofItem[];
  title?: string;
}

/**
 * 조건부 실물 증빙(ProofSlot) 컴포넌트
 * 1) proofs가 없거나 빈 배열이면 null 반환 (빈 플레이스홀더 절대 렌더링 금지)
 * 2) proof.thumbnail 경로가 있을 때만 72x48px 둥근 썸네일 표시 + 클릭 시 이미지 라이트박스 확대
 * 3) proof.thumbnail이 없으면 이미지 박스 없이 깔끔한 글라스 링크 카드만 렌더링
 */
export default function ProofSlot({ proofs, title = '실물 증빙 · 관련 아카이브' }: ProofSlotProps) {
  const [lightboxProof, setLightboxProof] = useState<ProofItem | null>(null);

  useEffect(() => {
    if (!lightboxProof) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxProof(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxProof]);

  if (!proofs || proofs.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-4 pt-4 border-t border-slate-200/70">
        <div className="text-[11px] font-display font-semibold uppercase tracking-[0.06em] text-slate-400 mb-2.5">
          {title}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {proofs.map((proof) => {
            const hasThumbnail = Boolean(proof.thumbnail && proof.thumbnail.trim().length > 0);
            const hasHref = Boolean(proof.href && proof.href.trim().length > 0);

            const cardContent = (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {hasThumbnail ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLightboxProof(proof);
                    }}
                    aria-label={`${proof.title} 증빙 이미지 크게 보기`}
                    className="group/thumb relative w-[72px] h-[48px] rounded-lg overflow-hidden border border-slate-200/80 bg-slate-100 shrink-0 cursor-zoom-in"
                  >
                    <img
                      src={proof.thumbnail}
                      alt={proof.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    />
                    <span className="absolute inset-0 bg-[#141923]/0 group-hover/thumb:bg-[#141923]/35 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                    </span>
                  </button>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-[#eef4ff] border border-[#2563EB]/15 text-[#2563EB] flex items-center justify-center shrink-0">
                    {proof.external ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <FileCheck2 className="w-4 h-4" />
                    )}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-semibold text-slate-800 group-hover:text-[#2563EB] transition-colors truncate">
                    {proof.title}
                  </div>
                  {proof.subtitle && (
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {proof.subtitle}
                    </div>
                  )}
                </div>

                {hasHref && (
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                )}
              </div>
            );

            const baseCardClass =
              'group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/85 hover:bg-[#eef4ff]/70 backdrop-blur-md border border-slate-200/80 hover:border-[#2563EB]/35 shadow-xs transition-all';

            if (hasHref && proof.external) {
              return (
                <a
                  key={`${proof.title}-${proof.href}`}
                  href={proof.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseCardClass}
                >
                  {cardContent}
                </a>
              );
            }

            if (hasHref && proof.href) {
              return (
                <Link
                  key={`${proof.title}-${proof.href}`}
                  href={proof.href}
                  className={baseCardClass}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={proof.title}
                onClick={hasThumbnail ? () => setLightboxProof(proof) : undefined}
                className={`${baseCardClass} ${hasThumbnail ? 'cursor-zoom-in' : ''}`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Lightbox Modal (Only opens when thumbnail exists & clicked) */}
      {lightboxProof && lightboxProof.thumbnail && (
        <div
          className="fixed inset-0 z-[80] bg-[#141923]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxProof(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{lightboxProof.title}</div>
                {lightboxProof.subtitle && (
                  <div className="text-xs text-slate-500 truncate">{lightboxProof.subtitle}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxProof(null)}
                aria-label="이미지 확대 닫기"
                className="w-8 h-8 rounded-full bg-[#141923] hover:bg-[#2563EB] text-white flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-[#F3F5F8] flex items-center justify-center">
              <img
                src={lightboxProof.thumbnail}
                alt={lightboxProof.title}
                className="max-h-[75vh] w-auto rounded-xl object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
