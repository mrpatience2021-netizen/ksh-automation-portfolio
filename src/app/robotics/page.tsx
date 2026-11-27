'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  BookOpen,
  Bot,
  Cpu,
  Database,
  FileCode2,
  FileText,
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
import {
  RoboticsHandshakeTab,
  RoboticsLuaTab,
} from '@/components/robotics/RoboticsLabTabs';
import {
  RoboticsCliTab,
  RoboticsConceptsTab,
} from '@/components/robotics/RoboticsReferenceTabs';
import {
  RoboticsRosbagAlarmTab,
  RoboticsTeachingTab,
} from '@/components/robotics/RoboticsFieldLogTabs';
import { ROBOTICS_VISUAL_GUIDE_PDF } from '@/data/roboticsData';

type LabSubTab = 'handshake' | 'lua';
type RefSubTab = 'concepts' | 'cli';
type FieldSubTab = 'teaching' | 'rosbag';

const ROBOTICS_PILLARS: [PillarCardMeta, PillarCardMeta, PillarCardMeta] = [
  {
    id: 'lab',
    badge: 'PILLAR 01 · LAB',
    countLabel: '2 Interactive Labs',
    title: 'Lab · 핸드셰이크 & Lua 아카이브',
    description:
      'PLC↔로봇 7신호 실시간 I/O 핸드셰이크 시뮬레이터 & 브릴스 ::MAIN_LOOP:: Lua 스크립트 뷰어',
    tags: ['I/O 핸드셰이크', '브릴스 Lua'],
    icon: Bot,
  },
  {
    id: 'reference',
    badge: 'PILLAR 02 · REFERENCE',
    countLabel: 'Concepts + CLI',
    title: 'Reference · 로보틱스 핵심 개념 & ROS 2 CLI',
    description:
      'FK/IK 특이점·moveJ/moveL·URDF/TF2·5단계 FSM 비유 노트 & WSL2·ROS 2 실전 CLI 치트시트',
    tags: ['핵심 개념 4종', 'WSL2 · ROS 2 CLI'],
    icon: BookOpen,
  },
  {
    id: 'fieldlog',
    badge: 'PILLAR 03 · FIELD LOG',
    countLabel: 'Cases + Alarm DB',
    title: 'Field Log · 티칭 케이스 & 오류 재현 로그',
    description:
      '브릴스 6축 티칭 문제 해결 케이스 스터디, Rosbag2 4대 토픽 선별 녹화 & 로봇 알람 검색 DB',
    tags: ['티칭 케이스 스터디', 'Rosbag2 · 알람 DB'],
    icon: Wrench,
  },
];

export default function RoboticsWorkspacePage() {
  const [activePillar, setActivePillar] = useState<PillarId>('lab');
  const [labTab, setLabTab] = useState<LabSubTab>('handshake');
  const [refTab, setRefTab] = useState<RefSubTab>('concepts');
  const [fieldTab, setFieldTab] = useState<FieldSubTab>('teaching');

  const [lightboxItem, setLightboxItem] = useState<LightboxPayload | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const applyHashRoute = useCallback((rawHash: string) => {
    const hash = rawHash.replace(/^#/, '').toLowerCase();
    if (!hash) return;

    let targetId = '';
    if (hash === 'handshake' || hash === 'io') {
      setActivePillar('lab');
      setLabTab('handshake');
      targetId = 'handshake';
    } else if (hash === 'lua') {
      setActivePillar('lab');
      setLabTab('lua');
      targetId = 'lua';
    } else if (hash === 'concepts' || hash === 'ros2') {
      setActivePillar('reference');
      setRefTab('concepts');
      targetId = 'concepts';
    } else if (hash === 'cli' || hash === 'ros2-cli') {
      setActivePillar('reference');
      setRefTab('cli');
      targetId = 'ros2-cli';
    } else if (hash === 'teaching') {
      setActivePillar('fieldlog');
      setFieldTab('teaching');
      targetId = 'teaching';
    } else if (hash === 'rosbag' || hash === 'alarm') {
      setActivePillar('fieldlog');
      setFieldTab('rosbag');
      targetId = 'rosbag';
    }

    if (targetId) {
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    applyHashRoute(window.location.hash);
    const onHashChange = () => applyHashRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [applyHashRoute]);

  const hasPdf = Boolean(ROBOTICS_VISUAL_GUIDE_PDF.url);

  return (
    <div className="relative min-h-screen bg-surface overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-[0.045] bg-[radial-gradient(#004ac6_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 py-5 lg:py-6">
        <SubpageBreadcrumb
          sectionCode="03. ROBOTICS & ROS 2 · 3-PILLAR WORKSPACE"
          sectionTitle="협동로봇 제어 · Lua 스크립트 · ROS 2 랩"
          subtitle="PLC↔협동로봇 2-Way I/O 핸드셰이크 시뮬레이터(Lab), 기구학·ROS 2 CLI 교본(Reference), 브릴스 티칭·Rosbag2 오류 재현 기록(Field Log)을 통합한 로보틱스 워크스페이스입니다."
          rightBadge="BRILS 6-Axis · Lua · ROS 2 Jazzy/Humble"
        />

        <ThreePillarSwitcher
          ariaLabel="로보틱스 3-Pillar 대분류 선택"
          pillars={ROBOTICS_PILLARS}
          activePillar={activePillar}
          onSelect={setActivePillar}
        />

        {/* Contextual Segmented Sub-Tab Bar */}
        {activePillar === 'lab' && (
          <SubTabBar
            activePillar="lab"
            tabs={[
              { id: 'handshake', label: 'PLC↔로봇 I/O 핸드셰이크', icon: Activity },
              { id: 'lua', label: '브릴스 Lua 스크립트', icon: FileCode2 },
            ]}
            activeTab={labTab}
            onSelect={setLabTab}
          />
        )}

        {activePillar === 'reference' && (
          <SubTabBar
            activePillar="reference"
            tabs={[
              { id: 'concepts', label: '핵심 개념 노트', icon: BookOpen },
              { id: 'cli', label: 'WSL2 · ROS 2 CLI 치트시트', icon: Cpu },
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
                  <span>로보틱스 교본 PDF 보기</span>
                </button>
              ) : undefined
            }
          />
        )}

        {activePillar === 'fieldlog' && (
          <SubTabBar
            activePillar="fieldlog"
            tabs={[
              { id: 'teaching', label: '브릴스 티칭 케이스 스터디', icon: Wrench },
              { id: 'rosbag', label: 'Rosbag2 & 로봇 알람 로그', icon: Database },
            ]}
            activeTab={fieldTab}
            onSelect={setFieldTab}
          />
        )}

        {/* Active Content View */}
        <main className="pb-12">
          {activePillar === 'lab' && labTab === 'handshake' && <RoboticsHandshakeTab />}
          {activePillar === 'lab' && labTab === 'lua' && <RoboticsLuaTab />}

          {activePillar === 'reference' && refTab === 'concepts' && (
            <RoboticsConceptsTab onZoom={setLightboxItem} />
          )}
          {activePillar === 'reference' && refTab === 'cli' && <RoboticsCliTab />}

          {activePillar === 'fieldlog' && fieldTab === 'teaching' && (
            <RoboticsTeachingTab onZoom={setLightboxItem} />
          )}
          {activePillar === 'fieldlog' && fieldTab === 'rosbag' && <RoboticsRosbagAlarmTab />}
        </main>
      </div>

      <MediaLightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
      <WorkspacePdfModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        doc={ROBOTICS_VISUAL_GUIDE_PDF}
      />
    </div>
  );
}
