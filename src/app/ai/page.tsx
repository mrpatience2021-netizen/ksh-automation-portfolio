'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  Cloud,
  Cpu,
  FileText,
  Flame,
  PlayCircle,
  Sparkles,
  Tv,
  Wrench,
} from 'lucide-react';
import SubpageBreadcrumb from '@/components/SubpageBreadcrumb';
import {
  SubTabBar,
  ThreePillarSwitcher,
  type PillarCardMeta,
  type PillarId,
} from '@/components/workspace/ThreePillarSwitcher';
import {
  MediaLightboxModal,
  WorkspacePdfModal,
  type LightboxPayload,
} from '@/components/workspace/WorkspaceMedia';
import { AiAinGolfTab, AiCustomToolsTab } from '@/components/ai/AiLabTabs';
import { AiGcpLeaderTab, AiOsmuPipelineTab } from '@/components/ai/AiReferenceTabs';
import { AiShortsLogTab, AiYoutubeIrTab } from '@/components/ai/AiFieldLogTabs';
import { AI_REFERENCE_PDF } from '@/data/aiData';

type LabSubTab = 'ain-golf' | 'tools';
type RefSubTab = 'gcp' | 'osmu';
type FieldSubTab = 'shorts' | 'youtube';

const AI_PILLARS: [PillarCardMeta, PillarCardMeta, PillarCardMeta] = [
  {
    id: 'lab',
    badge: 'PILLAR 01 · LAB',
    countLabel: 'Live Web Apps',
    title: 'Lab · 라이브 웹앱 & 자체 툴',
    description:
      'AIN GOLF 풀스택 MVP 라이브 쇼케이스 & MELSEC PLC 18종 학습 허브·자체 자동화 툴 아카이브',
    tags: ['AIN GOLF MVP', '자체 제작 툴'],
    icon: Sparkles,
  },
  {
    id: 'reference',
    badge: 'PILLAR 02 · REFERENCE',
    countLabel: 'Cloud + Pipeline',
    title: 'Reference · 클라우드 AI & 제작 파이프라인',
    description:
      'GCP AI 심화(36h)·AI Leader 수료, Ignition SCADA 클라우드 로드맵 & AI OSMU 제작 파이프라인',
    tags: ['GCP · AI Leader', 'OSMU 파이프라인'],
    icon: BookOpen,
  },
  {
    id: 'fieldlog',
    badge: 'PILLAR 03 · FIELD LOG',
    countLabel: 'Execution Archive',
    title: 'Field Log · 매일 실행 아카이브 & 미디어/IR',
    description:
      '썰푸는 상점 4개월 매일 1건 OSMU 실행 로그, 유튜브 메타박스 · IR 피칭 & 로컬 AI 실험 노트',
    tags: ['OSMU 쇼츠 4개월', '유튜브 · IR 피칭'],
    icon: Wrench,
  },
];

export default function AiWorkspacePage() {
  const [activePillar, setActivePillar] = useState<PillarId>('lab');
  const [labTab, setLabTab] = useState<LabSubTab>('ain-golf');
  const [refTab, setRefTab] = useState<RefSubTab>('gcp');
  const [fieldTab, setFieldTab] = useState<FieldSubTab>('shorts');

  const [lightboxItem, setLightboxItem] = useState<LightboxPayload | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  /**
   * 딥링크 해시 자동 라우팅:
   * /profile 또는 메인(/)에서 #ain-golf, #tools, #gcp, #osmu, #shorts, #youtube로 진입 시
   * 해당 Pillar & 서브 탭으로 자동 전환하고 해당 섹션으로 부드럽게 스크롤합니다.
   */
  const applyHashRoute = useCallback((rawHash: string) => {
    const hash = rawHash.replace(/^#/, '').toLowerCase();
    if (!hash) return;

    let targetId = '';
    if (hash === 'ain-golf') {
      setActivePillar('lab');
      setLabTab('ain-golf');
      targetId = 'ain-golf';
    } else if (hash === 'tools') {
      setActivePillar('lab');
      setLabTab('tools');
      targetId = 'tools';
    } else if (hash === 'gcp' || hash === 'ai-leader') {
      setActivePillar('reference');
      setRefTab('gcp');
      targetId = 'gcp';
    } else if (hash === 'osmu' || hash === 'pipeline') {
      setActivePillar('reference');
      setRefTab('osmu');
      targetId = 'osmu';
    } else if (hash === 'shorts') {
      setActivePillar('fieldlog');
      setFieldTab('shorts');
      targetId = 'shorts';
    } else if (hash === 'youtube' || hash === 'ir') {
      setActivePillar('fieldlog');
      setFieldTab('youtube');
      targetId = 'youtube';
    }

    if (targetId) {
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 90);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    applyHashRoute(window.location.hash);
    const onHashChange = () => applyHashRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [applyHashRoute]);

  const hasPdf = Boolean(AI_REFERENCE_PDF.url);

  return (
    <div className="relative min-h-screen bg-surface overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-[0.045] bg-[radial-gradient(#004ac6_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 py-5 lg:py-6">
        <SubpageBreadcrumb
          sectionCode="04. AI & WEB BUILD · 3-PILLAR WORKSPACE"
          sectionTitle="AI 워크플로우 · 풀스택 웹 빌드 · 실행 아카이브"
          subtitle="AIN GOLF MVP 독학 배포와 자체 제작 엔지니어링 툴(Lab), GCP·OSMU 파이프라인 정리(Reference), 4개월 매일 1건 쇼츠·유튜브·IR 피칭 실행 기록(Field Log)을 통합했습니다."
          rightBadge="Next.js · Supabase · GCP · Vertex AI"
        />

        <ThreePillarSwitcher
          ariaLabel="AI 및 웹 빌드 3-Pillar 대분류 선택"
          pillars={AI_PILLARS}
          activePillar={activePillar}
          onSelect={setActivePillar}
        />

        {/* Contextual Segmented Sub-Tab Bar */}
        {activePillar === 'lab' && (
          <SubTabBar
            activePillar="lab"
            tabs={[
              { id: 'ain-golf', label: 'AIN GOLF MVP', icon: Sparkles },
              { id: 'tools', label: '자체 제작 툴 & 웹앱', icon: Cpu },
            ]}
            activeTab={labTab}
            onSelect={setLabTab}
          />
        )}

        {activePillar === 'reference' && (
          <SubTabBar
            activePillar="reference"
            tabs={[
              { id: 'gcp', label: 'GCP 심화 & AI Leader', icon: Cloud },
              { id: 'osmu', label: 'AI OSMU 파이프라인', icon: PlayCircle },
            ]}
            activeTab={refTab}
            onSelect={setRefTab}
            rightSlot={
              hasPdf ? (
                <button
                  type="button"
                  onClick={() => setPdfModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141923] hover:bg-[#2563EB] text-white text-xs font-display font-semibold shadow-sm transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-300" />
                  <span>AI 기술 노트 PDF 보기</span>
                </button>
              ) : undefined
            }
          />
        )}

        {activePillar === 'fieldlog' && (
          <SubTabBar
            activePillar="fieldlog"
            tabs={[
              { id: 'shorts', label: 'OSMU 쇼츠 4개월 기록', icon: Flame },
              { id: 'youtube', label: '유튜브 · IR 피칭 아카이브', icon: Tv },
            ]}
            activeTab={fieldTab}
            onSelect={setFieldTab}
          />
        )}

        {/* Active Content View */}
        <main className="pb-12">
          {activePillar === 'lab' && labTab === 'ain-golf' && (
            <AiAinGolfTab onZoom={setLightboxItem} />
          )}
          {activePillar === 'lab' && labTab === 'tools' && (
            <AiCustomToolsTab onZoom={setLightboxItem} />
          )}

          {activePillar === 'reference' && refTab === 'gcp' && <AiGcpLeaderTab />}
          {activePillar === 'reference' && refTab === 'osmu' && <AiOsmuPipelineTab />}

          {activePillar === 'fieldlog' && fieldTab === 'shorts' && (
            <AiShortsLogTab onZoom={setLightboxItem} />
          )}
          {activePillar === 'fieldlog' && fieldTab === 'youtube' && (
            <AiYoutubeIrTab onZoom={setLightboxItem} />
          )}
        </main>
      </div>

      <MediaLightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
      <WorkspacePdfModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        doc={AI_REFERENCE_PDF}
      />
    </div>
  );
}
