'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BatteryCharging,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Cpu,
  Layers,
  Navigation,
  Radio,
  RotateCcw,
  ShieldAlert,
  Terminal,
  Wrench,
  X,
} from 'lucide-react';

// ============================================================================
// 0. Type Definitions
// ============================================================================
type LabType = 'arm' | 'amr';
type MotionType = 'moveJ' | 'moveL';
type GripperState = 'open' | 'closed';
type ArmErrorType = 'EMG' | 'SINGULARITY' | 'COLLISION' | 'WARN';
type ArmPointKey =
  | 'home'
  | 'pickAbove'
  | 'pickDown'
  | 'waypointTop'
  | 'placeAbove'
  | 'placeDown'
  | 'singularPoint';

interface ArmPoint {
  x: number;
  y: number;
  label: string;
}

interface ArmOption {
  id: string;
  label: string;
  correct: boolean;
  errorType?: ArmErrorType;
  feedback: string;
}

interface ArmStepAction {
  target: ArmPointKey;
  motion: MotionType;
  gripper: GripperState;
  carrying: boolean;
  via?: ArmPointKey;
  placed?: boolean;
  plcState: string;
}

interface ArmStep {
  id: number;
  title: string;
  prompt: string;
  options: ArmOption[];
  action: ArmStepAction;
  luaChunk: string;
}

interface ArmMission {
  id: string;
  title: string;
  badge: string;
  hasObstacle: boolean;
  description: string;
  steps: ArmStep[];
}

interface TrailSegment {
  type: MotionType;
  points: { x: number; y: number }[];
}

interface FeedbackState {
  ok: boolean;
  text: string;
  errorType: ArmErrorType | null;
}

interface AmrPoint {
  x: number;
  y: number;
}

interface AmrState {
  x: number;
  y: number;
  theta: number;
  localized: boolean;
  forbiddenZone: boolean;
  battery: number;
  path: AmrPoint[];
  status: string;
}

interface AmrOption {
  id: string;
  label: string;
  correct: boolean;
  errorType?: ArmErrorType;
  feedback: string;
}

interface AmrStep {
  id: number;
  title: string;
  prompt: string;
  options: AmrOption[];
  amrUpdate?: Partial<AmrState>;
  cliChunk: string;
}

interface AmrMission {
  id: string;
  title: string;
  badge: string;
  hasCentralBlock: boolean;
  description: string;
  initialState: AmrState;
  steps: AmrStep[];
}

type WallSegment = [number, number, number, number];

// ============================================================================
// 1. 2-DOF Inverse Kinematics (Law of Cosines) & Geometry Helpers
// ============================================================================
const L1 = 155; // Upper arm length (px) -> maps to 420 mm
const L2 = 135; // Forearm length (px)   -> maps to 360 mm
const BASE_X = 110;
const BASE_Y = 275;
const PX_TO_MM = 2.6;

function solveIK2DOF(targetX: number, targetY: number, elbowUp = true) {
  const dx = targetX - BASE_X;
  const dy = BASE_Y - targetY; // screen Y inverted to Cartesian Z-up
  const distSq = dx * dx + dy * dy;
  const dist = Math.sqrt(distSq);
  const maxReach = L1 + L2 - 2;
  const minReach = Math.abs(L1 - L2) + 8;

  const clampedDist = Math.min(Math.max(dist, minReach), maxReach);
  const cosQ2 = (clampedDist * clampedDist - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const safeCosQ2 = Math.max(-1, Math.min(1, cosQ2));

  let q2 = Math.acos(safeCosQ2);
  if (elbowUp) q2 = -q2;

  const k1 = L1 + L2 * Math.cos(q2);
  const k2 = L2 * Math.sin(q2);
  const q1 = Math.atan2(dy, dx) - Math.atan2(k2, k1);

  const elbowX = BASE_X + L1 * Math.cos(q1);
  const elbowY = BASE_Y - L1 * Math.sin(q1);
  const tcpX = elbowX + L2 * Math.cos(q1 + q2);
  const tcpY = elbowY - L2 * Math.sin(q1 + q2);

  const reachRatio = dist / (L1 + L2);
  const isSingular = reachRatio > 0.96 || Math.abs(q2) < 0.1;

  return {
    q1,
    q2,
    q1Deg: (q1 * 180) / Math.PI,
    q2Deg: (q2 * 180) / Math.PI,
    elbowX,
    elbowY,
    tcpX,
    tcpY,
    reachRatio,
    isSingular,
    mmX: Math.round((tcpX - BASE_X) * PX_TO_MM),
    mmZ: Math.round((BASE_Y - tcpY) * PX_TO_MM),
  };
}

function solveFK2DOF(q1: number, q2: number) {
  const elbowX = BASE_X + L1 * Math.cos(q1);
  const elbowY = BASE_Y - L1 * Math.sin(q1);
  const tcpX = elbowX + L2 * Math.cos(q1 + q2);
  const tcpY = elbowY - L2 * Math.sin(q1 + q2);
  return {
    q1,
    q2,
    q1Deg: (q1 * 180) / Math.PI,
    q2Deg: (q2 * 180) / Math.PI,
    elbowX,
    elbowY,
    tcpX,
    tcpY,
    mmX: Math.round((tcpX - BASE_X) * PX_TO_MM),
    mmZ: Math.round((BASE_Y - tcpY) * PX_TO_MM),
  };
}

// ============================================================================
// 2. Robot Arm Mission Definitions (BRILS 2D)
// ============================================================================
const ARM_POINTS: Record<ArmPointKey, ArmPoint> = {
  home: { x: 200, y: 120, label: 'HOME' },
  pickAbove: { x: 235, y: 165, label: 'PICK_UP (+80mm)' },
  pickDown: { x: 235, y: 245, label: 'PICK' },
  waypointTop: { x: 295, y: 85, label: 'SAFE_WP' },
  placeAbove: { x: 355, y: 165, label: 'PLACE_UP (+80mm)' },
  placeDown: { x: 355, y: 245, label: 'PLACE' },
  singularPoint: { x: 398, y: 265, label: 'SINGULAR (r=100%)' },
};

const ARM_MISSIONS: ArmMission[] = [
  {
    id: 'pick-place-basic',
    title: '예제 1. 기본 Pick & Place + PLC 핸드셰이크',
    badge: '표준 공정 · 6단계',
    hasObstacle: false,
    description:
      '비상정지(EMG b접점) 확인부터 PLC Start 신호 수신, moveJ/moveL 분리 접근, 그리퍼 파지, Done/Ack 완료까지 브릴스 협동로봇의 표준 사이클을 익힙니다.',
    steps: [
      {
        id: 1,
        title: '안전 인터록(EMG b접점) 확인 & 서보 Ready',
        prompt:
          '장비 가동 전 PLC 비상정지(Y21/DI_1, b접점)와 작업 반경을 점검하고, PLC의 Start(Y20/DI_0) 신호를 대기해야 합니다. 올바른 시작 절차는?',
        options: [
          {
            id: 'a',
            label: 'EMG b접점(DI_1 == 1) 정상 확인 → ::MAIN_LOOP:: 진입 & Start(DI_0) 대기',
            correct: true,
            feedback:
              '정확합니다! 비상정지는 단선 시 안전 정지되도록 b접점(평상시 1)으로 검증한 뒤 Start(DI_0) 신호를 받아 Busy(DO_1=1)를 올립니다.',
          },
          {
            id: 'b',
            label: 'EMG 신호를 무시하고 즉시 고속(100%) moveL로 워크피스에 하강',
            correct: false,
            errorType: 'EMG',
            feedback:
              '[EMG b접점 안전 위반] 비상정지 인터록 미확인 상태의 고속 기동은 ISO/TS 15066 위반 및 충돌 사고로 직결됩니다.',
          },
          {
            id: 'c',
            label: 'PLC 핸드셰이크 없이 무한 루프로 그리퍼만 먼저 닫고 대기',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[공정 순서 오류] 컨베이어/PLC와 동기화(DI_0 Start) 없이 선동작하면 워크피스 미도착 상태에서 공회전(에어 픽업)이 발생합니다.',
          },
        ],
        action: {
          target: 'home',
          motion: 'moveJ',
          gripper: 'open',
          carrying: false,
          plcState: 'READY / WAIT_START',
        },
        luaChunk: `-- [Step 1] 안전 인터록 확인 및 메인 루프 진입
::MAIN_LOOP::
if get_value("DI_1") == 0 then -- EMG b접점 차단 감지
  set_value("DO_2", 1)         -- Alarm 출력
  return
end
if get_value("DI_0") == 1 then -- PLC Start(Y20) 수신
  set_value("DO_1", 1)         -- Busy(X01) ON`,
      },
      {
        id: 2,
        title: '픽업 상공(+80mm) 안전 접근 — moveJ(PTP)',
        prompt:
          '홈 위치에서 픽업 지점 바로 위(+80mm 상공)까지 허공을 빠르게 이동하려 합니다. 어떤 보간 방식을 선택할까요?',
        options: [
          {
            id: 'a',
            label: 'moveJ (관절 보간 PTP)로 픽업 상공(+80mm)까지 빠르게 이동',
            correct: true,
            feedback:
              '정답입니다! 허공의 원거리 이동은 특이점 위험이 적고 사이클 타임이 빠른 관절 보간(moveJ · 파란 곡선)을 사용하는 것이 현장 표준입니다.',
          },
          {
            id: 'b',
            label: '팔을 100% 끝까지 일자로 뻗는 경계 좌표(r=100%)로 직선 이동',
            correct: false,
            errorType: 'SINGULARITY',
            feedback:
              '[ERR_SINGULARITY 경계 특이점] 팔꿈치가 0°로 완전히 펴지면 역기구학 자유도가 소실되어 알람 정지가 발생합니다. 작업대는 최대 리치의 85~90% 이내에 둡니다.',
          },
        ],
        action: {
          target: 'pickAbove',
          motion: 'moveJ',
          gripper: 'open',
          carrying: false,
          plcState: 'BUSY (APPROACH)',
        },
        luaChunk: `  -- [Step 2] 홈 -> 픽업 상공(+80mm) 관절 보간(PTP)
  local p_pick_up = pose_trans(p_pick, {0, 0, 80, 0, 0, 0})
  movej(p_pick_up, 60, 40)`,
      },
      {
        id: 3,
        title: '워크피스 수직 하강 — moveL(LIN) & 파지(Grip)',
        prompt:
          '픽업 상공(+80mm)에 도착했습니다. 주변 지그와 부딪히지 않게 수직으로 내려가 파란 블록을 집으려면 어떻게 해야 할까요?',
        options: [
          {
            id: 'a',
            label: 'moveL (직선 보간 LIN)로 수직 하강 → 그리퍼 닫기(Close) + 안정화 대기',
            correct: true,
            feedback:
              '완벽합니다! 지그나 워크피스 진입 직전 짧은 구간은 자로 긋듯 반듯하게 내려가는 moveL(에메랄드 직선)을 써야 측면 충돌을 막습니다.',
          },
          {
            id: 'b',
            label: 'moveJ (곡선 보간)로 비스듬히 휘어져 내려가며 이동 중에 그리퍼 닫기',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[측면 간섭 위험] moveJ는 손끝이 둥근 호를 그리므로 좁은 지그/트레이 진입 시 워크피스를 옆에서 쳐서 쓰러뜨릴 수 있습니다.',
          },
        ],
        action: {
          target: 'pickDown',
          motion: 'moveL',
          gripper: 'closed',
          carrying: true,
          plcState: 'BUSY (GRASPING)',
        },
        luaChunk: `  -- [Step 3] 직선 보간(LIN) 수직 하강 및 그리퍼 파지
  movel(p_pick, 120, 80)
  set_value("DO_GRIP", 1)      -- 2지 평행 그리퍼 닫기
  sleep(0.3)                   -- 파지 안정화 대기`,
      },
      {
        id: 4,
        title: '수직 이탈(Retreat) 후 하차 상공 이동',
        prompt:
          '블록을 단단히 잡았습니다. 이제 하차(Place) 구역 상공으로 옮겨야 합니다. 안전한 이동 순서는?',
        options: [
          {
            id: 'a',
            label: '먼저 moveL로 +80mm 수직 상승(Retreat) → 이후 moveJ로 하차 상공 이동',
            correct: true,
            feedback:
              '정석입니다! 바닥에서 수직으로 뽑아 올린(moveL) 뒤 허공에서 관절 이동(moveJ)으로 넘어가야 지그 걸림과 파손을 원천 차단합니다.',
          },
          {
            id: 'b',
            label: '수직 상승 없이 바닥을 스치듯 바로 우측 하차 지점으로 직행',
            correct: false,
            errorType: 'COLLISION',
            feedback:
              '[지그 충돌 경고] 수직 이탈(Retreat)을 생략하면 픽업 지그 벽면이나 컨베이어 가이드에 파지물이 그대로 충돌합니다.',
          },
        ],
        action: {
          target: 'placeAbove',
          motion: 'moveJ',
          gripper: 'closed',
          carrying: true,
          via: 'pickAbove',
          plcState: 'BUSY (TRANSFER)',
        },
        luaChunk: `  -- [Step 4] 수직 상승(Retreat) 후 하차 상공으로 이동
  movel(p_pick_up, 150, 100)
  local p_place_up = pose_trans(p_place, {0, 0, 80, 0, 0, 0})
  movej(p_place_up, 60, 40)`,
      },
      {
        id: 5,
        title: '하차 지점 수직 하강 & 그리퍼 열기(Release)',
        prompt:
          '하차 상공(+80mm)에 도달했습니다. 트레이 위에 블록을 정확히 안착시키고 이탈하는 명령은?',
        options: [
          {
            id: 'a',
            label: 'moveL로 수직 하강 → 그리퍼 열기(Open) → moveL로 상공 복귀',
            correct: true,
            feedback:
              '정확합니다! 수직 하강 후 그리퍼를 열고 0.2~0.3초 대기 뒤 수직 이탈해야 워크피스가 틀어지지 않고 정위치에 안착합니다.',
          },
          {
            id: 'b',
            label: '상공 +80mm 위치에서 바로 그리퍼를 열어 자유낙하 시킴',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[품질 불량 경고] 상공에서 떨어뜨리면 부품 파손 및 정렬 불량이 발생합니다. 반드시 목표 Z축까지 moveL 하강 후 개방하세요.',
          },
        ],
        action: {
          target: 'placeDown',
          motion: 'moveL',
          gripper: 'open',
          carrying: false,
          placed: true,
          plcState: 'BUSY (PLACING)',
        },
        luaChunk: `  -- [Step 5] 하차 수직 하강 및 그리퍼 개방
  movel(p_place, 120, 80)
  set_value("DO_GRIP", 0)      -- 그리퍼 열기
  sleep(0.2)
  movel(p_place_up, 150, 100)`,
      },
      {
        id: 6,
        title: '홈 복귀 & PLC Done(X00) / Ack(Y23) 핸드셰이크 완료',
        prompt:
          '작업을 마쳤습니다. PLC가 다음 워크피스를 투입할 수 있도록 표준 핸드셰이크 마무리 절차를 선택하세요.',
        options: [
          {
            id: 'a',
            label: 'moveJ로 HOME 복귀 → Busy OFF, Done(DO_0=1) ON → PLC Ack(DI_3) 수신 후 Done OFF',
            correct: true,
            feedback:
              '미션 완료! 2-Way 핸드셰이크(Done → Ack 확인 → Done 클리어)를 거쳐야 PLC 스캔 타임 차이로 인한 신호 누락·중복 카운트를 완벽히 막습니다.',
          },
          {
            id: 'b',
            label: 'Done 신호를 켜지 않고 바로 다음 사이클을 자체 무한 반복',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[핸드셰이크 단절] PLC는 로봇의 Done(X00)을 받아야 컨베이어를 구동합니다. Done/Ack 없이 단독 반복하면 라인 전체가 멈춥니다.',
          },
        ],
        action: {
          target: 'home',
          motion: 'moveJ',
          gripper: 'open',
          carrying: false,
          placed: true,
          plcState: 'DONE -> ACK OK',
        },
        luaChunk: `  -- [Step 6] 홈 복귀 및 PLC Done/Ack 핸드셰이크 완료
  movej(p_home, 60, 40)
  set_value("DO_1", 0)         -- Busy(X01) OFF
  set_value("DO_0", 1)         -- Done(X00) ON
  wait_di("DI_3", 1, 3000)     -- PLC Ack(Y23) 대기 (타임아웃 3s)
  set_value("DO_0", 0)         -- Done 클리어
end
goto MAIN_LOOP`,
      },
    ],
  },
  {
    id: 'obstacle-singularity',
    title: '예제 2. 중앙 장애물 우회 & 특이점 회피 공정',
    badge: '실전 심화 · 5단계',
    hasObstacle: true,
    description:
      '픽업과 하차 사이에 빨간 장애물 격벽이 있는 라인입니다. 직선 이동 충돌과 팔 최대 신전 특이점(ERR_SINGULARITY)을 피해 안전 경유점(Waypoint)으로 5단계 FSM을 완성합니다.',
    steps: [
      {
        id: 1,
        title: '작업공간(Workspace) 및 리치 85% 사전 검증',
        prompt:
          '중앙에 높이 130mm 격벽 장애물이 추가되었습니다. 티칭 시작 전 로봇팔 배치와 작업 반경 기준은?',
        options: [
          {
            id: 'a',
            label: '모든 목표점(Pick/Place/Waypoint)이 최대 리치 85~90% 이내 & 팔꿈치 15° 이상 굽힘 유지 확인',
            correct: true,
            feedback:
              '정확합니다! 팔꿈치를 항상 10~15° 이상 굽힌 작업공간 내부에 배치해야 경계 특이점(Elbow Singularity)을 예방할 수 있습니다.',
          },
          {
            id: 'b',
            label: '격벽을 멀리 돌아가기 위해 최대 리치 100% 끝단까지 팔을 완전히 펴서 티칭',
            correct: false,
            errorType: 'SINGULARITY',
            feedback:
              '[ERR_SINGULARITY 발생] 팔꿈치가 완전히 펴지는 경계선(r=100%)에서는 자코비안 행렬식이 0에 수렴해 모터 속도 폭주 및 비상 정지가 걸립니다.',
          },
        ],
        action: {
          target: 'home',
          motion: 'moveJ',
          gripper: 'open',
          carrying: false,
          plcState: 'WORKSPACE OK',
        },
        luaChunk: `-- [Step 1] 장애물 우회 공정 초기화 & 리치/안전 검증
::MAIN_LOOP::
if get_value("DI_1") == 0 then return end
-- 모든 포인트는 Max Reach 85% 이내(Elbow >= 15 deg) 검증 완료`,
      },
      {
        id: 2,
        title: '픽업 접근(moveJ) → 수직 하강 파지(moveL) → 수직 이탈',
        prompt: '격벽 왼쪽 구역의 파란 블록을 집어 올리는 안전한 조합을 선택하세요.',
        options: [
          {
            id: 'a',
            label: '픽업 상공(moveJ) → 수직 하강(moveL) → 그리퍼 닫기 → 수직 상승(moveL)',
            correct: true,
            feedback:
              '정확합니다! 파지 직전·직후만 직선 보간(moveL)을 적용해 주변 지그와 격벽 간섭을 피했습니다.',
          },
          {
            id: 'b',
            label: '홈에서 픽업 바닥점까지 단일 moveL로 사선 직진',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[사선 진입 위험] 장거리 구간을 moveL로 한 번에 내려가면 손목 축 정렬(특이점) 또는 지그 모서리 충돌 위험이 커집니다.',
          },
        ],
        action: {
          target: 'pickAbove',
          motion: 'moveL',
          gripper: 'closed',
          carrying: true,
          via: 'pickDown',
          plcState: 'FSM: 2_GRASPED',
        },
        luaChunk: `-- [Step 2] 픽업 시퀀스 (Approach -> Grasp -> Retreat)
local p_pick_up = pose_trans(p_pick, {0, 0, 80, 0, 0, 0})
movej(p_pick_up, 60, 40)
movel(p_pick, 100, 80)
set_value("DO_GRIP", 1)
sleep(0.3)
movel(p_pick_up, 140, 100)`,
      },
      {
        id: 3,
        title: '중앙 장애물 벽 우회 — 안전 경유점(Waypoint) 통과',
        prompt:
          '지금 위치(픽업 상공)에서 우측 하차 상공으로 넘어가야 하는데 가운데에 빨간 격벽이 서 있습니다. 올바른 경로는?',
        options: [
          {
            id: 'a',
            label: '격벽 상단 안전 경유점(SAFE_WP)을 추가해 moveJ(PTP)로 여유 있게 상공 우회',
            correct: true,
            feedback:
              '최고입니다! C-Space 장애물 회피 원리처럼 격벽 위로 안전 경유점(Waypoint)을 찍어 moveJ로 넘어가면 충돌과 특이점을 동시에 피할 수 있습니다.',
          },
          {
            id: 'b',
            label: '경유점 없이 현재 높이에서 하차 상공까지 moveL 직선으로 최단거리 통과',
            correct: false,
            errorType: 'COLLISION',
            feedback:
              '[충돌 경보! COLLISION DETECTED] 중앙 빨간 장애물 격벽을 직선으로 관통했습니다! 반드시 상단 안전 경유점(Waypoint)을 경유해야 합니다.',
          },
        ],
        action: {
          target: 'waypointTop',
          motion: 'moveJ',
          gripper: 'closed',
          carrying: true,
          plcState: 'FSM: 3_AVOID_WALL',
        },
        luaChunk: `-- [Step 3] 중앙 장애물 벽 상단 안전 경유점(Waypoint) 우회
movej(p_safe_wp, 60, 40)       -- 격벽 +100mm 여유 상공 통과`,
      },
      {
        id: 4,
        title: '하차 상공 진입 → 수직 하강(moveL) & 블록 안착',
        prompt: '장애물 벽을 안전하게 넘었습니다. 우측 초록 트레이에 블록을 내려놓으세요.',
        options: [
          {
            id: 'a',
            label: '하차 상공(moveJ) → 수직 하강(moveL) → 그리퍼 열기 → 수직 상승(moveL)',
            correct: true,
            feedback:
              '깔끔합니다! 격벽 오른쪽 공간에서 상공 정렬 후 moveL 수직 하강으로 오차 없이 트레이에 안착시켰습니다.',
          },
          {
            id: 'b',
            label: '경유점에서 바닥 트레이까지 한 번에 moveJ로 급강하',
            correct: false,
            errorType: 'COLLISION',
            feedback:
              '[궤적 간섭 경고] moveJ 곡선 하강은 경로가 바깥이나 안쪽으로 휘어 격벽 측면이나 트레이 모서리를 건드릴 수 있습니다.',
          },
        ],
        action: {
          target: 'placeDown',
          motion: 'moveL',
          gripper: 'open',
          carrying: false,
          placed: true,
          via: 'placeAbove',
          plcState: 'FSM: 4_PLACED',
        },
        luaChunk: `-- [Step 4] 하차 상공 진입 및 수직 안착
local p_place_up = pose_trans(p_place, {0, 0, 80, 0, 0, 0})
movej(p_place_up, 60, 40)
movel(p_place, 100, 80)
set_value("DO_GRIP", 0)
sleep(0.2)
movel(p_place_up, 140, 100)`,
      },
      {
        id: 5,
        title: '경유점 경유 홈 복귀 & 카운트 증가(Production Count)',
        prompt: '빈 손으로 홈 복귀할 때도 중앙 장애물을 주의해야 합니다. 마무리 절차는?',
        options: [
          {
            id: 'a',
            label: 'SAFE_WP를 다시 거쳐 moveJ로 HOME 복귀 → 생산 카운트 +1 & PLC Done(DO_0=1) 전송',
            correct: true,
            feedback:
              '미션 완수! 빈 손 복귀 시에도 장애물 경유점을 빼먹으면 빈 그리퍼가 격벽에 부딪힙니다. 완벽한 5단계 FSM 사이클입니다.',
          },
          {
            id: 'b',
            label: '빈 손이니 경유점 생략하고 하차 바닥에서 바로 HOME으로 직선 복귀',
            correct: false,
            errorType: 'COLLISION',
            feedback:
              '[복귀 충돌 경보!] 실무에서 가장 흔한 실수가 "갈 때만 우회하고 올 때 직행"하다가 그리퍼가 파손되는 사고입니다.',
          },
        ],
        action: {
          target: 'home',
          motion: 'moveJ',
          gripper: 'open',
          carrying: false,
          placed: true,
          via: 'waypointTop',
          plcState: 'FSM: 5_CYCLE_DONE',
        },
        luaChunk: `-- [Step 5] 복귀 시에도 SAFE_WP 경유 후 홈 복귀 & 완료 보고
movej(p_safe_wp, 65, 45)
movej(p_home, 65, 45)
cycle_cnt = cycle_cnt + 1
set_value("DO_0", 1)           -- PLC Done(X00) 출력
wait_di("DI_3", 1, 3000)       -- Ack 확인
set_value("DO_0", 0)
goto MAIN_LOOP`,
      },
    ],
  },
];

// ============================================================================
// 3. AMR Map Walls & 360-degree Raycasting LiDAR Engine
// ============================================================================
const MAP_W = 460;
const MAP_H = 310;

const BASE_WALLS: WallSegment[] = [
  [16, 16, 444, 16],
  [444, 16, 444, 294],
  [444, 294, 16, 294],
  [16, 294, 16, 16],
  [140, 16, 140, 95],
  [140, 95, 190, 95],
  [190, 95, 190, 16],
  [250, 210, 325, 210],
  [325, 210, 325, 294],
  [250, 294, 250, 210],
  [16, 185, 85, 185],
];

const EXTRA_OBSTACLE_WALLS: WallSegment[] = [
  [215, 128, 265, 128],
  [265, 128, 265, 178],
  [265, 178, 215, 178],
  [215, 178, 215, 128],
];

function castRay(ox: number, oy: number, angle: number, segments: WallSegment[], maxDist = 220) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let closest = maxDist;

  for (let i = 0; i < segments.length; i++) {
    const [x1, y1, x2, y2] = segments[i];
    const sx = x2 - x1;
    const sy = y2 - y1;
    const denom = dx * sy - dy * sx;
    if (Math.abs(denom) < 1e-6) continue;

    const qpx = x1 - ox;
    const qpy = y1 - oy;
    const t = (qpx * sy - qpy * sx) / denom;
    const u = (qpx * dy - qpy * dx) / denom;

    if (t >= 0 && u >= 0 && u <= 1 && t < closest) {
      closest = t;
    }
  }
  return { x: ox + dx * closest, y: oy + dy * closest, dist: closest };
}

const AMR_MISSIONS: AmrMission[] = [
  {
    id: 'amr-localization-nav',
    title: '예제 1. 초기 로컬라이제이션(2D Pose) & Nav2 자율주행',
    badge: 'ROS 2 Nav2 · 5단계',
    hasCentralBlock: false,
    description:
      '지도 위 로봇의 초기 위치가 어긋나 LiDAR 스캔(빨강)이 벽과 맞지 않는 상태입니다. 2D Pose Estimate로 위치를 맞추고(초록), Nav2 자율주행과 Rosbag2 4대 토픽 기록까지 완주합니다.',
    initialState: {
      x: 72,
      y: 120,
      theta: 0,
      localized: false,
      forbiddenZone: false,
      battery: 86,
      path: [],
      status: 'UNLOCALIZED (LiDAR 불일치)',
    },
    steps: [
      {
        id: 1,
        title: 'ROS 2 노드·토픽 및 TF 트리 사전 점검',
        prompt:
          'AMR 전원을 켠 직후 자율주행 명령을 내리기 전에, 센서와 좌표계(/tf)가 정상 발행되는지 확인하는 명령은?',
        options: [
          {
            id: 'a',
            label: 'ros2 node list 및 ros2 topic list -t 로 /scan, /odom, /tf 발행 확인',
            correct: true,
            feedback:
              '정확합니다! 현장 셋업 1순위는 LiDAR(/scan)와 오도메트리(/odom), TF 트리가 살아있는지 터미널에서 검증하는 것입니다.',
          },
          {
            id: 'b',
            label: '노드 확인 없이 바로 최고 속도로 /cmd_vel 토픽 발행',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[안전 경고] /scan과 /tf 상태 미확인 상태에서 강제 속도 명령(/cmd_vel)을 보내면 장애물 감지 없이 벽면에 충돌할 수 있습니다.',
          },
        ],
        amrUpdate: { status: 'NODES OK · NEED POSE' },
        cliChunk: `# [Step 1] 실행 노드 및 핵심 토픽 점검
ros2 node list
ros2 topic list -t | grep -E "scan|odom|tf"`,
      },
      {
        id: 2,
        title: '2D Pose Estimate — 로컬라이제이션 정합',
        prompt:
          '현재 빨간색 360° LiDAR 스캔이 공장 벽면과 어긋나 있습니다. Nav2(AMCL)가 내 위치를 벽에 딱 맞추도록 하려면?',
        options: [
          {
            id: 'a',
            label: 'RViz2 [2D Pose Estimate]로 현재 위치·방향 지정 → LiDAR 스캔 벽면 정합(초록)',
            correct: true,
            feedback:
              '완벽합니다! 초기 추정 위치를 알려주자 360° LiDAR 스캔이 지도 벽면과 일치(초록색)하며 로컬라이제이션이 완료되었습니다.',
          },
          {
            id: 'b',
            label: '위치가 어긋난 상태 그대로 바로 [Nav2 Goal] 목적지 클릭',
            correct: false,
            errorType: 'COLLISION',
            feedback:
              '[로컬라이제이션 오류] 로봇이 자기 위치를 착각한 채 주행하면 지도의 빈 공간이라고 믿고 실제 랙 기둥을 들이받습니다.',
          },
        ],
        amrUpdate: { localized: true, status: 'LOCALIZED (AMCL LOCKED)' },
        cliChunk: `# [Step 2] AMCL 초기 위치 추정 (2D Pose Estimate)
ros2 topic pub --once /initialpose geometry_msgs/msg/PoseWithCovarianceStamped "{...}"`,
      },
      {
        id: 3,
        title: 'Nav2 Goal 지정 — 전역·지역 경로 계획 실행',
        prompt:
          '로컬라이제이션이 완료되었습니다. 우측 하차 스테이션(Station B)으로 자율주행을 명령하는 올바른 통신 방식은?',
        options: [
          {
            id: 'a',
            label: 'Nav2 Action (/navigate_to_pose)으로 목표 좌표 전송 (실시간 피드백 + 취소 가능)',
            correct: true,
            feedback:
              '정답입니다! 목표 이동은 시간이 오래 걸리고 도중 비상 취소가 필요하므로 Topic/Service가 아닌 Action으로 호출합니다.',
          },
          {
            id: 'b',
            label: '1회성 동기 Service 호출로 완료될 때까지 전체 시스템을 블로킹 대기',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[통신 패턴 오용] 장시간 소요되는 자율주행을 동기 Service로 묶으면 주행 중 피드백 수신과 비상 취소가 불가능합니다.',
          },
        ],
        amrUpdate: {
          path: [
            { x: 72, y: 120 },
            { x: 185, y: 145 },
            { x: 300, y: 145 },
            { x: 385, y: 120 },
          ],
          status: 'NAVIGATING -> STATION B',
        },
        cliChunk: `# [Step 3] Nav2 Action 기반 목표 스테이션 자율주행
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose "{pose: {position: {x: 8.5, y: 2.4}}}" --feedback`,
      },
      {
        id: 4,
        title: '목적지 정밀 도착 & 작업 완료 확인',
        prompt:
          'AMR이 Station B에 도착했습니다. 주행 중 좌표계 드리프트가 없었는지 확인하는 ROS 2 명령은?',
        options: [
          {
            id: 'a',
            label: 'tf2_echo map base_link 로 지도 기준 최종 로봇 포즈 오차 검증',
            correct: true,
            feedback:
              '정확합니다! map → odom → base_link 체인의 최종 오차를 tf2_echo로 검증하면 현장 납품 검수 시 신뢰도가 확 올라갑니다.',
          },
          {
            id: 'b',
            label: '오도메트리(바퀴 회전수)만 믿고 지도 좌표 검증 생략',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[드리프트 위험] 바퀴 슬립으로 오도메트리는 시간이 갈수록 누적 오차가 발생합니다. 반드시 map 기준 TF로 확인하세요.',
          },
        ],
        amrUpdate: {
          x: 385,
          y: 120,
          theta: 0,
          battery: 79,
          status: 'ARRIVED AT STATION B',
        },
        cliChunk: `# [Step 4] map -> base_link 최종 포즈 오차 검증
ros2 run tf2_ros tf2_echo map base_link`,
      },
      {
        id: 5,
        title: 'Rosbag2 필수 4대 토픽 선별 기록 (블랙박스)',
        prompt:
          '오늘 시운전 주행 데이터를 디스크 용량 폭주 없이 블랙박스로 저장해 두고 싶습니다. 최적의 Rosbag2 명령은?',
        options: [
          {
            id: 'a',
            label: 'ros2 bag record /tf /tf_static /odom /joint_states -o amr_run_data',
            correct: true,
            feedback:
              '미션 완료! 무거운 전체 토픽(-a) 대신 필수 4대 토픽만 선별 기록하면 가벼운 용량으로 사무실에서 RViz2 100% 주행 재현이 가능합니다.',
          },
          {
            id: 'b',
            label: 'ros2 bag record -a (카메라 원본 영상 포함 모든 토픽 무제한 녹화)',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[디스크 용량 폭탄!] -a 옵션은 고해상도 이미지/점군까지 전부 저장해 몇 분 만에 현장 IPC 저장공간을 가득 채웁니다.',
          },
        ],
        amrUpdate: { status: 'ROSBAG2 4-TOPICS SAVED' },
        cliChunk: `# [Step 5] 현장 표준 Rosbag2 필수 4대 토픽 선별 녹화
ros2 bag record /tf /tf_static /odom /joint_states -o amr_run_data
# 사무실 재현 시: ros2 bag play amr_run_data`,
      },
    ],
  },
  {
    id: 'amr-forbidden-dock',
    title: '예제 2. 금지구역(*.map) 마스킹 우회 & 저전압 충전 복귀',
    badge: 'MobilePlanner · 5단계',
    hasCentralBlock: true,
    description:
      '중앙 통로에 작업자·임시 파렛트가 들어온 상황입니다. Omron MobilePlanner / Nav2 방식으로 금지구역을 마스킹해 상단 우회 경로를 확보하고, 배터리 18% 저전압 시 충전 독 접안까지 수행합니다.',
    initialState: {
      x: 72,
      y: 145,
      theta: 0,
      localized: true,
      forbiddenZone: false,
      battery: 34,
      path: [
        { x: 72, y: 145 },
        { x: 240, y: 150 },
        { x: 385, y: 145 },
      ],
      status: 'CENTRAL AISLE BLOCKED!',
    },
    steps: [
      {
        id: 1,
        title: '중앙 통로 장애물 감지 & 즉시 일시 정지',
        prompt:
          '기존 중앙 직진 경로 상에 임시 작업 구역(파렛트)이 발생했습니다. 관제/현장 엔지니어의 1차 조치는?',
        options: [
          {
            id: 'a',
            label: '로봇 주행 일시 정지 후 LiDAR(/scan)로 중앙 통로 점유 상태 확인',
            correct: true,
            feedback:
              '정확합니다! 무리하게 밀고 들어가기 전 현재 경로를 정지시키고 장애물 영역을 지도 상에서 확인해야 합니다.',
          },
          {
            id: 'b',
            label: '충돌 방지 센서를 끄고 기존 직진 경로로 강제 통과 시도',
            correct: false,
            errorType: 'COLLISION',
            feedback:
              '[중대 안전 사고] 안전 라이다를 해제하면 작업자 및 파렛트와 정면 충돌합니다.',
          },
        ],
        amrUpdate: { status: 'PAUSED · OBSTACLE DETECTED' },
        cliChunk: `# [Step 1] 주행 일시 정지 및 장애물 스캔 확인
ros2 topic echo /scan --once`,
      },
      {
        id: 2,
        title: '*.map 금지구역(Forbidden Zone) 마스킹 & 경로 재계산',
        prompt:
          '앞으로 2시간 동안 작업자가 중앙 통로에서 작업합니다. 모든 AMR이 중앙을 아예 진입하지 못하게 막으려면?',
        options: [
          {
            id: 'a',
            label: '맵에 금지구역(Forbidden Zone / Keepout Mask) 설정 → 상단 우회 경로 자동 재계산',
            correct: true,
            feedback:
              '정답입니다! 금지구역(빨간 빗금)을 마스킹하는 즉시 전역 플래너가 상단 안전 통로로 우회 경로를 재계산했습니다.',
          },
          {
            id: 'b',
            label: '맵 수정 없이 작업자에게 매번 로봇이 오면 비켜달라고 요청',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[현장 운영 실패] Omron MobilePlanner나 Nav2 Keepout Filter로 금지구역을 지정해 두어야 전 차량군이 안전하게 우회합니다.',
          },
        ],
        amrUpdate: {
          forbiddenZone: true,
          path: [
            { x: 72, y: 145 },
            { x: 112, y: 112 },
            { x: 225, y: 68 },
            { x: 335, y: 68 },
            { x: 385, y: 145 },
          ],
          status: 'REROUTED VIA UPPER CORRIDOR',
        },
        cliChunk: `# [Step 2] Keepout / Forbidden Zone 마스크 반영 및 경로 재계산
# MobilePlanner(*.map Forbidden Area) 또는 Nav2 costmap_filter_info 적용`,
      },
      {
        id: 3,
        title: '상단 우회 경로 자율주행 & Station B 도착',
        prompt: '새로 계산된 상단 우회 경로(초록 점선)를 따라 Station B까지 물류를 이송하세요.',
        options: [
          {
            id: 'a',
            label: '우회 경로 주행 개시 → 금지구역 간섭 없이 Station B 안전 도착',
            correct: true,
            feedback:
              '좋습니다! 랙 기둥과 중앙 금지구역을 모두 피해 상단 통로로 매끄럽게 도착했습니다. 그런데 배터리가 18%로 떨어졌습니다!',
          },
          {
            id: 'b',
            label: '금지구역을 바로 해제해 중앙으로 되돌아감',
            correct: false,
            errorType: 'COLLISION',
            feedback:
              '[구역 침범 경고] 작업이 끝나기 전에 금지구역을 풀면 중앙 작업 구역으로 진입해 사고 위험이 생깁니다.',
          },
        ],
        amrUpdate: {
          x: 385,
          y: 145,
          theta: 0,
          battery: 18,
          status: 'LOW BATTERY (18%)! DOCK NEEDED',
        },
        cliChunk: `# [Step 3] 우회 경로 이송 완료 & 배터리 상태 모니터링
ros2 topic echo /battery_state --once  # percentage: 0.18 (LOW)`,
      },
      {
        id: 4,
        title: '배터리 18% 저전압 경보 — 충전 독(Dock) 자동 복귀',
        prompt:
          '배터리가 임계치(20%) 미만인 18%에 도달했습니다. 방전으로 라인이 멈추기 전에 내려야 할 명령은?',
        options: [
          {
            id: 'a',
            label: '신규 작업 할당 보류 → 상단 안전 경로를 통해 좌측 하단 충전 독(Dock) 자동 접안',
            correct: true,
            feedback:
              '완벽합니다! 금지구역을 피해 충전 독으로 복귀하여 자동 접안(Charging)을 시작했습니다.',
          },
          {
            id: 'b',
            label: '배터리 5% 남을 때까지 무리하게 추가 이송 미션 3건 더 투입',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[라인 정지 경고] 통로 한가운데서 완전 방전되면 수동 견인 및 재로컬라이제이션으로 전체 물류 라인이 지연됩니다.',
          },
        ],
        amrUpdate: {
          x: 52,
          y: 242,
          theta: Math.PI,
          battery: 24,
          path: [
            { x: 385, y: 145 },
            { x: 335, y: 68 },
            { x: 225, y: 68 },
            { x: 112, y: 112 },
            { x: 112, y: 242 },
            { x: 52, y: 242 },
          ],
          status: 'DOCKED & CHARGING (24%)',
        },
        cliChunk: `# [Step 4] 저전압 임계치 감지 -> 충전 독 자동 접안
ros2 action send_goal /dock_robot opennav_docking_msgs/action/DockRobot "{dock_id: 'dock_01'}"`,
      },
      {
        id: 5,
        title: '이슈 로그 & Rosbag2 4대 토픽 아카이빙 완료',
        prompt:
          '금지구역 우회 및 저전압 복귀 시나리오 검증이 끝났습니다. 현장 CS 리포트용 블랙박스 저장 명령은?',
        options: [
          {
            id: 'a',
            label: 'ros2 bag record /tf /tf_static /odom /joint_states -o amr_detour_dock_log',
            correct: true,
            feedback:
              '미션 완수! 금지구역 마스킹 → 우회 주행 → 충전 독 복귀 → 4대 토픽 로깅까지 현장 AMR 운영 전 과정을 마스터하셨습니다.',
          },
          {
            id: 'b',
            label: '별도 로그 없이 터미널 강제 종료',
            correct: false,
            errorType: 'WARN',
            feedback:
              '[이력 누락] 장애·우회 이력을 남기지 않으면 동일 구간 병목 개선 및 고객사 트렌드 리포트 작성이 어렵습니다.',
          },
        ],
        amrUpdate: { battery: 42, status: 'MISSION COMPLETE · LOG SAVED' },
        cliChunk: `# [Step 5] 우회 및 충전 복귀 4대 토픽 저장 완료
ros2 bag record /tf /tf_static /odom /joint_states -o amr_detour_dock_log`,
      },
    ],
  },
];

// ============================================================================
// 4. Unit & Coordinate Checker Modal
// ============================================================================
interface UnitCoordinateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UnitCoordinateModal({ isOpen, onClose }: UnitCoordinateModalProps) {
  const [deg, setDeg] = useState('90');
  const [rad, setRad] = useState('1.5708');
  const [mm, setMm] = useState('80');
  const [meters, setMeters] = useState('0.0800');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDegChange = (val: string) => {
    setDeg(val);
    const num = parseFloat(val);
    if (!Number.isNaN(num)) {
      setRad(((num * Math.PI) / 180).toFixed(4));
    }
  };

  const handleRadChange = (val: string) => {
    setRad(val);
    const num = parseFloat(val);
    if (!Number.isNaN(num)) {
      setDeg(((num * 180) / Math.PI).toFixed(2));
    }
  };

  const handleMmChange = (val: string) => {
    setMm(val);
    const num = parseFloat(val);
    if (!Number.isNaN(num)) {
      setMeters((num / 1000).toFixed(4));
    }
  };

  const handleMeterChange = (val: string) => {
    setMeters(val);
    const num = parseFloat(val);
    if (!Number.isNaN(num)) {
      setMm((num * 1000).toFixed(1));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="현장 로봇 단위 · 좌표계 체크기"
      className="fixed inset-0 z-[75] flex items-center justify-center bg-[#141923]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dce9ff] text-[#2563EB]">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">현장 로봇 단위 · 좌표계 체크기</h3>
              <p className="text-xs text-slate-500">
                ROS 2 표준 단위(m · rad · s) &amp; 오른손 법칙(RGB = XYZ)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 cursor-pointer"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          {/* Angle Converter */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                각도 변환 (Angle)
              </span>
              <div className="flex gap-1">
                {[45, 90, 180].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleDegChange(String(preset))}
                    className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-[#dce9ff] hover:text-[#2563EB] cursor-pointer"
                  >
                    {preset}°
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Degree (° · 티칭 펜던트)
                </label>
                <input
                  type="number"
                  value={deg}
                  onChange={(e) => handleDegChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Radian (rad · ROS 2 / URDF)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rad}
                  onChange={(e) => handleRadChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>
          </div>

          {/* Length Converter */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                길이 변환 (Length)
              </span>
              <div className="flex gap-1">
                {[80, 400, 700].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleMmChange(String(preset))}
                    className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-[#dce9ff] hover:text-[#2563EB] cursor-pointer"
                  >
                    {preset}mm
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  mm (브릴스 Lua · 도면)
                </label>
                <input
                  type="number"
                  value={mm}
                  onChange={(e) => handleMmChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  m (ROS 2 · TF2 표준)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={meters}
                  onChange={(e) => handleMeterChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>
          </div>

          {/* Right-hand Rule + Quaternion Guide */}
          <div className="rounded-2xl border border-slate-700/80 bg-[#141923] p-4 text-slate-100 md:col-span-2">
            <div className="grid items-center gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 120 110" className="h-24 w-28 shrink-0">
                  <circle cx="48" cy="68" r="4" fill="#94a3b8" />
                  <line x1="48" y1="68" x2="48" y2="16" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
                  <polygon points="48,10 43,20 53,20" fill="#3b82f6" />
                  <text x="56" y="22" fill="#60a5fa" fontSize="11" fontWeight="bold">Z (상방)</text>
                  <line x1="48" y1="68" x2="100" y2="82" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                  <polygon points="106,84 95,77 97,87" fill="#ef4444" />
                  <text x="72" y="102" fill="#f87171" fontSize="11" fontWeight="bold">X (전방)</text>
                  <line x1="48" y1="68" x2="14" y2="90" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
                  <polygon points="9,93 19,92 14,83" fill="#22c55e" />
                  <text x="4" y="106" fill="#4ade80" fontSize="11" fontWeight="bold">Y (좌측)</text>
                </svg>
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-white">오른손 법칙 (RGB = XYZ)</div>
                  <p className="text-red-300">• Red (X): 로봇 전방 (Forward)</p>
                  <p className="text-emerald-300">• Green (Y): 로봇 좌측 (Left)</p>
                  <p className="text-blue-300">• Blue (Z): 로봇 상방 (Up)</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-700/80 bg-[#213145]/70 p-3 text-xs leading-relaxed text-slate-200">
                <div className="mb-1 font-bold text-[#dce9ff]">
                  왜 내부 연산에 쿼터니언(x,y,z,w)을 쓸까?
                </div>
                오일러 각(Roll·Pitch·Yaw)은 Pitch가{' '}
                <span className="font-mono text-amber-300">±90°</span>에 도달하면 두 회전축이 겹치는{' '}
                <strong className="text-white">짐벌락(Gimbal Lock)</strong>이 발생합니다. ROS 2와 로봇
                제어기는 4원소 쿼터니언으로 짐벌락 없이 부드럽게 보간합니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. Main Component: RoboticsMissionLab (Embedded inside /robotics Pillar 1 Lab)
// ============================================================================
export default function RoboticsMissionLab() {
  const [labType, setLabType] = useState<LabType>('arm');
  const [unitModalOpen, setUnitModalOpen] = useState(false);

  // ---------------- Arm State ----------------
  const [armMissionIdx, setArmMissionIdx] = useState(0);
  const [armStepIdx, setArmStepIdx] = useState(0);
  const [armCompleted, setArmCompleted] = useState(false);
  const [armFeedback, setArmFeedback] = useState<FeedbackState | null>(null);
  const [armLuaChunks, setArmLuaChunks] = useState<string[]>([]);
  const [armPlcState, setArmPlcState] = useState('IDLE / POWER ON');
  const [armGripper, setArmGripper] = useState<GripperState>('open');
  const [armCarrying, setArmCarrying] = useState(false);
  const [armPlaced, setArmPlaced] = useState(false);
  const [armElbowUp, setArmElbowUp] = useState(true);
  const [armTrails, setArmTrails] = useState<TrailSegment[]>([]);
  const [armAlertFlash, setArmAlertFlash] = useState<ArmErrorType | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const initialArmIK = useMemo(() => solveIK2DOF(ARM_POINTS.home.x, ARM_POINTS.home.y, true), []);
  const [armPose, setArmPose] = useState({ q1: initialArmIK.q1, q2: initialArmIK.q2 });
  const armAnimRef = useRef<number | null>(null);
  const armPoseRef = useRef({ q1: initialArmIK.q1, q2: initialArmIK.q2 });

  const currentArmMission = ARM_MISSIONS[armMissionIdx];
  const currentArmStep = currentArmMission.steps[armStepIdx];

  // ---------------- AMR State ----------------
  const [amrMissionIdx, setAmrMissionIdx] = useState(0);
  const [amrStepIdx, setAmrStepIdx] = useState(0);
  const [amrCompleted, setAmrCompleted] = useState(false);
  const [amrFeedback, setAmrFeedback] = useState<FeedbackState | null>(null);
  const [amrCliChunks, setAmrCliChunks] = useState<string[]>([]);
  const [amrState, setAmrState] = useState<AmrState>(AMR_MISSIONS[0].initialState);
  const [amrAlertFlash, setAmrAlertFlash] = useState(false);
  const amrAnimRef = useRef<number | null>(null);

  const currentAmrMission = AMR_MISSIONS[amrMissionIdx];
  const currentAmrStep = currentAmrMission.steps[amrStepIdx];

  // ---------------- Arm Animation Helper ----------------
  const animateArmSegment = useCallback(
    (
      fromQ1: number,
      fromQ2: number,
      targetKey: ArmPointKey,
      motion: MotionType,
      elbowUpFlag: boolean
    ): Promise<{ q1: number; q2: number }> => {
      return new Promise((resolve) => {
        if (armAnimRef.current !== null) cancelAnimationFrame(armAnimRef.current);
        const startFK = solveFK2DOF(fromQ1, fromQ2);
        const targetPt = ARM_POINTS[targetKey];
        const endIK = solveIK2DOF(targetPt.x, targetPt.y, elbowUpFlag);

        const duration = 680;
        const startTime = performance.now();
        const trailPoints: { x: number; y: number }[] = [{ x: startFK.tcpX, y: startFK.tcpY }];

        const tick = (now: number) => {
          const rawT = Math.min(1, (now - startTime) / duration);
          const t = 0.5 - 0.5 * Math.cos(rawT * Math.PI);

          let nextQ1: number;
          let nextQ2: number;
          let tcpX: number;
          let tcpY: number;

          if (motion === 'moveL') {
            const ix = startFK.tcpX + (targetPt.x - startFK.tcpX) * t;
            const iy = startFK.tcpY + (targetPt.y - startFK.tcpY) * t;
            const stepIK = solveIK2DOF(ix, iy, elbowUpFlag);
            nextQ1 = stepIK.q1;
            nextQ2 = stepIK.q2;
            tcpX = stepIK.tcpX;
            tcpY = stepIK.tcpY;
          } else {
            nextQ1 = fromQ1 + (endIK.q1 - fromQ1) * t;
            nextQ2 = fromQ2 + (endIK.q2 - fromQ2) * t;
            const stepFK = solveFK2DOF(nextQ1, nextQ2);
            tcpX = stepFK.tcpX;
            tcpY = stepFK.tcpY;
          }

          trailPoints.push({ x: tcpX, y: tcpY });
          armPoseRef.current = { q1: nextQ1, q2: nextQ2 };
          setArmPose({ q1: nextQ1, q2: nextQ2 });

          if (rawT < 1) {
            armAnimRef.current = requestAnimationFrame(tick);
          } else {
            setArmTrails((prev) => [...prev.slice(-7), { type: motion, points: trailPoints }]);
            resolve({ q1: nextQ1, q2: nextQ2 });
          }
        };

        armAnimRef.current = requestAnimationFrame(tick);
      });
    },
    []
  );

  const resetArmMission = useCallback(
    (idx = armMissionIdx) => {
      if (armAnimRef.current !== null) cancelAnimationFrame(armAnimRef.current);
      setArmMissionIdx(idx);
      setArmStepIdx(0);
      setArmCompleted(false);
      setArmFeedback(null);
      setArmLuaChunks([]);
      setArmPlcState('IDLE / POWER ON');
      setArmGripper('open');
      setArmCarrying(false);
      setArmPlaced(false);
      setArmTrails([]);
      setArmAlertFlash(null);
      const homeIK = solveIK2DOF(ARM_POINTS.home.x, ARM_POINTS.home.y, armElbowUp);
      armPoseRef.current = { q1: homeIK.q1, q2: homeIK.q2 };
      setArmPose({ q1: homeIK.q1, q2: homeIK.q2 });
    },
    [armMissionIdx, armElbowUp]
  );

  const handleArmOptionClick = async (opt: ArmOption) => {
    if (armCompleted) return;

    if (!opt.correct) {
      const errType: ArmErrorType = opt.errorType ?? 'WARN';
      setArmFeedback({ ok: false, text: opt.feedback, errorType: errType });
      setArmAlertFlash(errType);
      if (errType === 'SINGULARITY') {
        const prev = { ...armPoseRef.current };
        await animateArmSegment(prev.q1, prev.q2, 'singularPoint', 'moveL', armElbowUp);
        window.setTimeout(() => {
          void animateArmSegment(
            armPoseRef.current.q1,
            armPoseRef.current.q2,
            'home',
            'moveJ',
            armElbowUp
          );
          setArmAlertFlash(null);
        }, 900);
      } else {
        window.setTimeout(() => setArmAlertFlash(null), 1100);
      }
      return;
    }

    const step = currentArmStep;
    setArmFeedback({ ok: true, text: opt.feedback, errorType: null });
    setArmAlertFlash(null);
    setArmPlcState(step.action.plcState);
    setArmLuaChunks((prev) => [...prev, step.luaChunk]);

    if (step.action.via) {
      const mid = await animateArmSegment(
        armPoseRef.current.q1,
        armPoseRef.current.q2,
        step.action.via,
        step.action.motion === 'moveL' ? 'moveJ' : 'moveL',
        armElbowUp
      );
      if (step.action.via === 'pickDown') {
        setArmGripper('closed');
        setArmCarrying(true);
      }
      await animateArmSegment(mid.q1, mid.q2, step.action.target, step.action.motion, armElbowUp);
    } else {
      await animateArmSegment(
        armPoseRef.current.q1,
        armPoseRef.current.q2,
        step.action.target,
        step.action.motion,
        armElbowUp
      );
    }

    setArmGripper(step.action.gripper);
    setArmCarrying(Boolean(step.action.carrying));
    if (step.action.placed !== undefined) setArmPlaced(step.action.placed);

    if (armStepIdx + 1 < currentArmMission.steps.length) {
      setArmStepIdx((s) => s + 1);
    } else {
      setArmCompleted(true);
    }
  };

  const handleToggleElbow = () => {
    const nextElbow = !armElbowUp;
    setArmElbowUp(nextElbow);
    const fk = solveFK2DOF(armPoseRef.current.q1, armPoseRef.current.q2);
    const ik = solveIK2DOF(fk.tcpX, fk.tcpY, nextElbow);
    armPoseRef.current = { q1: ik.q1, q2: ik.q2 };
    setArmPose({ q1: ik.q1, q2: ik.q2 });
  };

  // ---------------- AMR Animation Helper ----------------
  const resetAmrMission = useCallback(
    (idx = amrMissionIdx) => {
      if (amrAnimRef.current !== null) cancelAnimationFrame(amrAnimRef.current);
      setAmrMissionIdx(idx);
      setAmrStepIdx(0);
      setAmrCompleted(false);
      setAmrFeedback(null);
      setAmrCliChunks([]);
      setAmrState(AMR_MISSIONS[idx].initialState);
      setAmrAlertFlash(false);
    },
    [amrMissionIdx]
  );

  const animateAmrAlongPath = useCallback(
    (waypoints: AmrPoint[], finalUpdate: Partial<AmrState>) => {
      if (!waypoints || waypoints.length < 2) {
        setAmrState((prev) => ({ ...prev, ...finalUpdate }));
        return;
      }
      if (amrAnimRef.current !== null) cancelAnimationFrame(amrAnimRef.current);

      let segIdx = 0;
      const segDuration = 380;
      let segStart = performance.now();

      const stepFrame = (now: number) => {
        const p0 = waypoints[segIdx];
        const p1 = waypoints[segIdx + 1];
        const t = Math.min(1, (now - segStart) / segDuration);
        const nx = p0.x + (p1.x - p0.x) * t;
        const ny = p0.y + (p1.y - p0.y) * t;
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

        setAmrState((prev) => ({ ...prev, x: nx, y: ny, theta: angle }));

        if (t < 1) {
          amrAnimRef.current = requestAnimationFrame(stepFrame);
        } else if (segIdx + 2 < waypoints.length) {
          segIdx += 1;
          segStart = performance.now();
          amrAnimRef.current = requestAnimationFrame(stepFrame);
        } else {
          setAmrState((prev) => ({ ...prev, ...finalUpdate }));
        }
      };

      amrAnimRef.current = requestAnimationFrame(stepFrame);
    },
    []
  );

  const handleAmrOptionClick = (opt: AmrOption) => {
    if (amrCompleted) return;

    if (!opt.correct) {
      setAmrFeedback({ ok: false, text: opt.feedback, errorType: opt.errorType ?? 'WARN' });
      setAmrAlertFlash(true);
      window.setTimeout(() => setAmrAlertFlash(false), 1000);
      return;
    }

    const step = currentAmrStep;
    setAmrFeedback({ ok: true, text: opt.feedback, errorType: null });
    setAmrAlertFlash(false);
    setAmrCliChunks((prev) => [...prev, step.cliChunk]);

    const update = step.amrUpdate ?? {};
    if (update.x !== undefined && amrState.path && amrState.path.length > 1 && !update.path) {
      animateAmrAlongPath(amrState.path, update);
    } else if (update.path && update.x !== undefined) {
      setAmrState((prev) => ({ ...prev, path: update.path ?? prev.path }));
      animateAmrAlongPath(update.path, update);
    } else {
      setAmrState((prev) => ({ ...prev, ...update }));
    }

    if (amrStepIdx + 1 < currentAmrMission.steps.length) {
      setAmrStepIdx((s) => s + 1);
    } else {
      setAmrCompleted(true);
    }
  };

  useEffect(() => {
    return () => {
      if (armAnimRef.current !== null) cancelAnimationFrame(armAnimRef.current);
      if (amrAnimRef.current !== null) cancelAnimationFrame(amrAnimRef.current);
    };
  }, []);

  const armFK = useMemo(() => solveFK2DOF(armPose.q1, armPose.q2), [armPose]);
  const combinedCode = useMemo(() => {
    if (labType === 'arm') {
      if (armLuaChunks.length === 0) {
        return `-- 우측 미션 단계를 선택하면 브릴스(BRILS) Lua 제어 스크립트가 자동 누적됩니다.\n-- 완료 후 우측 상단 [코드 복사] 버튼으로 현장에서 바로 활용할 수 있습니다.`;
      }
      return armLuaChunks.join('\n\n');
    }
    if (amrCliChunks.length === 0) {
      return `# 우측 미션 단계를 선택하면 ROS 2 (Nav2 · TF2 · Rosbag2) 실전 명령어가 누적됩니다.\n# Rosbag2 필수 4대 토픽: /tf /tf_static /odom /joint_states`;
    }
    return amrCliChunks.join('\n\n');
  }, [labType, armLuaChunks, amrCliChunks]);

  const lidarRays = useMemo(() => {
    const activeWalls = currentAmrMission.hasCentralBlock
      ? [...BASE_WALLS, ...EXTRA_OBSTACLE_WALLS]
      : BASE_WALLS;

    const originX = amrState.localized ? amrState.x : amrState.x + 28;
    const originY = amrState.localized ? amrState.y : amrState.y - 22;
    const angleOffset = amrState.localized ? 0 : 0.42;

    const rayCount = 36;
    const rays: { x2: number; y2: number }[] = [];
    for (let i = 0; i < rayCount; i++) {
      const a = (i / rayCount) * Math.PI * 2 + angleOffset;
      const hit = castRay(originX, originY, a, activeWalls, 185);
      rays.push({
        x2: amrState.localized ? hit.x : amrState.x + Math.cos(a - angleOffset) * hit.dist,
        y2: amrState.localized ? hit.y : amrState.y + Math.sin(a - angleOffset) * hit.dist,
      });
    }
    return rays;
  }, [amrState.x, amrState.y, amrState.localized, currentAmrMission.hasCentralBlock]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(combinedCode);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      const el = document.createElement('textarea');
      el.value = combinedCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    }
  };

  const totalSteps =
    labType === 'arm' ? currentArmMission.steps.length : currentAmrMission.steps.length;
  const doneSteps =
    labType === 'arm'
      ? armCompleted
        ? totalSteps
        : armStepIdx
      : amrCompleted
      ? totalSteps
      : amrStepIdx;
  const progressPct = Math.round((doneSteps / totalSteps) * 100);
  const activeFeedback = labType === 'arm' ? armFeedback : amrFeedback;

  return (
    <div id="mission-lab" className="scroll-mt-24 w-full space-y-5 text-slate-900">
      {/* Top Control Bar (Apple Silver / White Glass Surface) */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-glass backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setLabType('arm')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
              labType === 'arm'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-[#dce9ff] hover:text-[#2563EB]'
            }`}
          >
            <Cpu className="h-4 w-4" />
            협동로봇팔 랩 (BRILS 2D)
          </button>
          <button
            type="button"
            onClick={() => setLabType('amr')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
              labType === 'amr'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-[#dce9ff] hover:text-[#2563EB]'
            }`}
          >
            <Navigation className="h-4 w-4" />
            자율이동로봇 랩 (AMR · Nav2)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setUnitModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-[#e9ddff]/70 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-[#e9ddff] cursor-pointer"
          >
            <Compass className="h-4 w-4 text-[#2563EB]" />
            단위 · 좌표계 체크기
          </button>
          <button
            type="button"
            onClick={() =>
              labType === 'arm' ? resetArmMission(armMissionIdx) : resetAmrMission(amrMissionIdx)
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            미션 초기화
          </button>
        </div>
      </div>

      {/* Mission Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(labType === 'arm' ? ARM_MISSIONS : AMR_MISSIONS).map((m, idx) => {
          const isActive = labType === 'arm' ? armMissionIdx === idx : amrMissionIdx === idx;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => (labType === 'arm' ? resetArmMission(idx) : resetAmrMission(idx))}
              className={`flex flex-wrap items-center gap-2 rounded-xl border px-3.5 py-2 text-left text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'border-[#2563EB] bg-[#dce9ff]/80 text-slate-900 shadow-sm'
                  : 'border-slate-200/80 bg-white/85 text-slate-600 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${
                  isActive ? 'bg-[#2563EB]' : 'bg-slate-300'
                }`}
              />
              <span>{m.title}</span>
              <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                {m.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Workspace (Desktop 2-col / Mobile Vertical Stack) */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* LEFT COLUMN: 2D Simulator + Accumulating Code/CLI Console */}
        <div className="min-w-0 space-y-4 lg:col-span-7">
          {/* 2D Simulator Card (Deep Charcoal #141923 ~ #213145) */}
          <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-[#141923] via-[#1b2638] to-[#213145] shadow-glass-dark">
            {/* Simulator HUD Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 px-4 py-3 text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-200 min-w-0">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">
                  {labType === 'arm'
                    ? `BRILS 2D KINEMATICS · ${armPlcState}`
                    : `NAV2 / LIDAR 360° · ${amrState.status}`}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {labType === 'arm' ? (
                  <button
                    type="button"
                    onClick={handleToggleElbow}
                    className="rounded-lg border border-slate-600 bg-slate-800/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#dce9ff] transition hover:border-[#2563EB] hover:bg-[#213145] cursor-pointer"
                  >
                    자세: {armElbowUp ? 'Elbow UP' : 'Elbow DOWN'}
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold ${
                      amrState.battery <= 20
                        ? 'bg-red-500/20 text-red-300 ring-1 ring-red-400/50'
                        : 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40'
                    }`}
                  >
                    <BatteryCharging className="h-3.5 w-3.5" />
                    BAT {amrState.battery}%
                  </span>
                )}
              </div>
            </div>

            {/* Simulator Viewport */}
            <div className="relative p-3">
              {labType === 'arm' ? (
                <svg
                  viewBox="0 0 460 310"
                  className="h-auto w-full rounded-2xl border border-slate-700/60 bg-[#0f141d]"
                >
                  <defs>
                    <pattern id="armGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="460" height="310" fill="url(#armGrid)" />

                  {/* Workspace Reach Envelope (100% & 88% Safe Zone) */}
                  <circle
                    cx={BASE_X}
                    cy={BASE_Y}
                    r={L1 + L2}
                    fill="none"
                    stroke="#ef4444"
                    strokeOpacity="0.28"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={BASE_X}
                    cy={BASE_Y}
                    r={(L1 + L2) * 0.88}
                    fill="none"
                    stroke="#38bdf8"
                    strokeOpacity="0.22"
                    strokeDasharray="6 4"
                  />

                  {/* Floor / Conveyor Workbench */}
                  <line x1="20" y1={BASE_Y} x2="440" y2={BASE_Y} stroke="#475569" strokeWidth="2.5" />

                  {/* Pick Station & Place Tray */}
                  <rect x="208" y={BASE_Y - 12} width="54" height="12" rx="3" fill="#1e3a8a" stroke="#60a5fa" />
                  <text x="235" y={BASE_Y + 16} textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">
                    PICK (X=325)
                  </text>

                  <rect x="328" y={BASE_Y - 12} width="54" height="12" rx="3" fill="#064e3b" stroke="#34d399" />
                  <text x="355" y={BASE_Y + 16} textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
                    PLACE (X=637)
                  </text>

                  {/* Optional Central Obstacle Wall (Mission 2) */}
                  {currentArmMission.hasObstacle && (
                    <g>
                      <rect
                        x="284"
                        y={BASE_Y - 128}
                        width="22"
                        height="128"
                        rx="3"
                        fill={armAlertFlash === 'COLLISION' ? '#ef4444' : '#991b1b'}
                        stroke="#f87171"
                        strokeWidth="1.5"
                      />
                      <text x="295" y={BASE_Y - 135} textAnchor="middle" fill="#fca5a5" fontSize="9.5" fontWeight="bold">
                        장애물 격벽
                      </text>
                      <circle
                        cx={ARM_POINTS.waypointTop.x}
                        cy={ARM_POINTS.waypointTop.y}
                        r="5"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={ARM_POINTS.waypointTop.x}
                        y={ARM_POINTS.waypointTop.y - 10}
                        textAnchor="middle"
                        fill="#c4b5fd"
                        fontSize="9"
                      >
                        SAFE_WP
                      </text>
                    </g>
                  )}

                  {/* Motion Trails: moveJ (Blue dashed arc) vs moveL (Emerald solid line) */}
                  {armTrails.map((tr, i) => {
                    const d = tr.points
                      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                      .join(' ');
                    return (
                      <path
                        key={i}
                        d={d}
                        fill="none"
                        stroke={tr.type === 'moveL' ? '#10b981' : '#3b82f6'}
                        strokeWidth={tr.type === 'moveL' ? '2.5' : '2'}
                        strokeDasharray={tr.type === 'moveL' ? undefined : '5 4'}
                        strokeOpacity="0.85"
                      />
                    );
                  })}

                  {/* Blue Workpiece Block */}
                  {!armCarrying && !armPlaced && (
                    <rect x="223" y={BASE_Y - 34} width="24" height="22" rx="3" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="1.5" />
                  )}
                  {armPlaced && !armCarrying && (
                    <rect x="343" y={BASE_Y - 34} width="24" height="22" rx="3" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="1.5" />
                  )}

                  {/* Robot Base Pedestal */}
                  <rect x={BASE_X - 24} y={BASE_Y - 14} width="48" height="14" rx="4" fill="#334155" stroke="#94a3b8" />
                  <circle cx={BASE_X} cy={BASE_Y} r="10" fill="#1e293b" stroke="#60a5fa" strokeWidth="2.5" />

                  {/* Link 1 */}
                  <line x1={BASE_X} y1={BASE_Y} x2={armFK.elbowX} y2={armFK.elbowY} stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                  <line x1={BASE_X} y1={BASE_Y} x2={armFK.elbowX} y2={armFK.elbowY} stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />

                  {/* Link 2 */}
                  <line x1={armFK.elbowX} y1={armFK.elbowY} x2={armFK.tcpX} y2={armFK.tcpY} stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
                  <line x1={armFK.elbowX} y1={armFK.elbowY} x2={armFK.tcpX} y2={armFK.tcpY} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

                  {/* Elbow Joint */}
                  <circle cx={armFK.elbowX} cy={armFK.elbowY} r="8" fill="#0f172a" stroke="#93c5fd" strokeWidth="2.5" />

                  {/* 2-Finger Parallel Gripper at TCP */}
                  <g transform={`translate(${armFK.tcpX}, ${armFK.tcpY})`}>
                    <circle r="5" fill="#f8fafc" stroke="#2563EB" strokeWidth="2" />
                    <line x1="-10" y1="6" x2="10" y2="6" stroke="#94a3b8" strokeWidth="3" />
                    <line
                      x1={armGripper === 'closed' ? -6 : -11}
                      y1="6"
                      x2={armGripper === 'closed' ? -6 : -11}
                      y2="18"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1={armGripper === 'closed' ? 6 : 11}
                      y1="6"
                      x2={armGripper === 'closed' ? 6 : 11}
                      y2="18"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {armCarrying && (
                      <rect x="-11" y="9" width="22" height="19" rx="3" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="1.5" />
                    )}
                  </g>

                  {/* Alert Flash Banner */}
                  {armAlertFlash && (
                    <g>
                      <rect x="75" y="14" width="310" height="32" rx="8" fill="#dc2626" fillOpacity="0.92" />
                      <text x="230" y="34" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                        {armAlertFlash === 'SINGULARITY'
                          ? '⚠ ERR_SINGULARITY (경계 특이점 초과!)'
                          : armAlertFlash === 'EMG'
                          ? '⚠ EMG b접점 인터록 차단 경보!'
                          : '⚠ COLLISION DETECTED (장애물 충돌!)'}
                      </text>
                    </g>
                  )}

                  {/* Legend */}
                  <g transform="translate(14, 14)" fontSize="9.5" fontFamily="monospace">
                    <line x1="0" y1="4" x2="18" y2="4" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" />
                    <text x="23" y="7" fill="#93c5fd">moveJ (PTP 곡선)</text>
                    <line x1="0" y1="20" x2="18" y2="20" stroke="#10b981" strokeWidth="2.5" />
                    <text x="23" y="23" fill="#6ee7b7">moveL (LIN 직선)</text>
                  </g>
                </svg>
              ) : (
                /* AMR 2D Map + 360° Raycasting LiDAR SVG */
                <svg
                  viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                  className="h-auto w-full rounded-2xl border border-slate-700/60 bg-[#0f141d]"
                >
                  <defs>
                    <pattern id="amrGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" strokeWidth="1" />
                    </pattern>
                    <pattern
                      id="forbiddenHatch"
                      width="8"
                      height="8"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2.5" strokeOpacity="0.7" />
                    </pattern>
                  </defs>
                  <rect width={MAP_W} height={MAP_H} fill="url(#amrGrid)" />

                  {/* Rack Pillars */}
                  <rect x="140" y="16" width="50" height="79" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                  <text x="165" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">RACK A</text>

                  <rect x="250" y="210" width="75" height="84" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                  <text x="287" y="255" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">RACK B</text>

                  {/* Charging Dock Zone */}
                  <rect x="20" y="205" width="58" height="72" rx="6" fill="#1e3a8a" fillOpacity="0.35" stroke="#60a5fa" strokeDasharray="4 3" />
                  <text x="49" y="270" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">⚡ DOCK</text>

                  {/* Station B Goal Marker */}
                  <circle cx="385" cy="132" r="22" fill="#065f46" fillOpacity="0.35" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="385" y="136" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontWeight="bold">STATION B</text>

                  {/* Central Aisle Obstruction (Mission 2) */}
                  {currentAmrMission.hasCentralBlock && (
                    <g>
                      <rect x="215" y="128" width="50" height="50" rx="4" fill="#7c2d12" stroke="#fb923c" strokeWidth="1.5" />
                      <text x="240" y="156" textAnchor="middle" fill="#fed7aa" fontSize="9" fontWeight="bold">작업 파렛트</text>
                    </g>
                  )}

                  {/* Forbidden Zone Masking (*.map Keepout) */}
                  {amrState.forbiddenZone && (
                    <g>
                      <rect x="196" y="112" width="92" height="84" rx="6" fill="url(#forbiddenHatch)" stroke="#ef4444" strokeWidth="2" />
                      <text x="242" y="106" textAnchor="middle" fill="#fca5a5" fontSize="9.5" fontWeight="bold">
                        FORBIDDEN ZONE (*.map)
                      </text>
                    </g>
                  )}

                  {/* Outer Map Walls */}
                  {BASE_WALLS.map((w, idx) => (
                    <line key={idx} x1={w[0]} y1={w[1]} x2={w[2]} y2={w[3]} stroke="#94a3b8" strokeWidth="2.5" />
                  ))}

                  {/* Planned Nav2 Path */}
                  {amrState.path && amrState.path.length > 1 && (
                    <polyline
                      points={amrState.path.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke={amrState.forbiddenZone || amrState.localized ? '#10b981' : '#f59e0b'}
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                  )}

                  {/* 360-degree Raycasting LiDAR Beams */}
                  {lidarRays.map((r, idx) => (
                    <g key={idx}>
                      <line
                        x1={amrState.x}
                        y1={amrState.y}
                        x2={r.x2}
                        y2={r.y2}
                        stroke={amrState.localized ? '#22c55e' : '#ef4444'}
                        strokeOpacity="0.32"
                        strokeWidth="1"
                      />
                      <circle cx={r.x2} cy={r.y2} r="2" fill={amrState.localized ? '#4ade80' : '#f87171'} />
                    </g>
                  ))}

                  {/* AMR Chassis */}
                  <g transform={`translate(${amrState.x}, ${amrState.y}) rotate(${(amrState.theta * 180) / Math.PI})`}>
                    <rect x="-15" y="-12" width="30" height="24" rx="6" fill="#2563EB" stroke="#e2e8f0" strokeWidth="2" />
                    <polygon points="15,0 6,-5 6,5" fill="#f8fafc" />
                    <circle cx="0" cy="0" r="4" fill={amrState.localized ? '#4ade80' : '#ef4444'} />
                  </g>

                  {/* Alert Banner */}
                  {amrAlertFlash && (
                    <g>
                      <rect x="85" y="14" width="290" height="30" rx="8" fill="#dc2626" fillOpacity="0.92" />
                      <text x="230" y="33" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="bold" fontFamily="monospace">
                        ⚠ 안전/운용 절차 위반 — 우측 가이드를 확인하세요
                      </text>
                    </g>
                  )}

                  {/* LiDAR Legend */}
                  <g transform="translate(24, 24)" fontSize="9.5" fontFamily="monospace">
                    <circle cx="4" cy="4" r="3.5" fill={amrState.localized ? '#4ade80' : '#f87171'} />
                    <text x="12" y="7" fill={amrState.localized ? '#86efac' : '#fca5a5'}>
                      {amrState.localized ? 'LiDAR 360° 벽면 정합 (OK)' : 'LiDAR 미정합 (2D Pose 필요)'}
                    </text>
                  </g>
                </svg>
              )}

              {/* Live Telemetry Strip */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                {labType === 'arm' ? (
                  <>
                    <div className="rounded-xl bg-[#213145]/80 px-2.5 py-2 text-slate-200">
                      <div className="text-[10px] text-slate-400">TCP (mm)</div>
                      <div className="font-bold text-white">
                        X:{armFK.mmX} Z:{armFK.mmZ}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#213145]/80 px-2.5 py-2 text-slate-200">
                      <div className="text-[10px] text-slate-400">JOINTS (deg)</div>
                      <div className="font-bold text-[#93c5fd]">
                        q1:{armFK.q1Deg.toFixed(0)}° q2:{armFK.q2Deg.toFixed(0)}°
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#213145]/80 px-2.5 py-2 text-slate-200">
                      <div className="text-[10px] text-slate-400">GRIPPER</div>
                      <div
                        className={`font-bold ${
                          armGripper === 'closed' ? 'text-emerald-300' : 'text-amber-300'
                        }`}
                      >
                        {armGripper === 'closed' ? 'CLOSED (파지)' : 'OPEN (개방)'}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl bg-[#213145]/80 px-2.5 py-2 text-slate-200">
                      <div className="text-[10px] text-slate-400">MAP POSE (m)</div>
                      <div className="font-bold text-white">
                        X:{(amrState.x / 45).toFixed(1)} Y:{((MAP_H - amrState.y) / 45).toFixed(1)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#213145]/80 px-2.5 py-2 text-slate-200">
                      <div className="text-[10px] text-slate-400">LOCALIZATION</div>
                      <div
                        className={`font-bold ${
                          amrState.localized ? 'text-emerald-300' : 'text-red-300'
                        }`}
                      >
                        {amrState.localized ? 'AMCL LOCKED' : 'UNLOCALIZED'}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#213145]/80 px-2.5 py-2 text-slate-200">
                      <div className="text-[10px] text-slate-400">KEEPOUT MASK</div>
                      <div
                        className={`font-bold ${
                          amrState.forbiddenZone ? 'text-red-300' : 'text-slate-300'
                        }`}
                      >
                        {amrState.forbiddenZone ? 'ACTIVE (*.map)' : 'NONE'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Accumulating Lua / ROS 2 CLI Console */}
          <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-[#141923] shadow-glass-dark">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Terminal className="h-4 w-4 text-[#60a5fa] shrink-0" />
                <span>
                  {labType === 'arm'
                    ? '브릴스(BRILS) 누적 Lua 제어 스크립트'
                    : 'ROS 2 (Nav2 · TF2 · Rosbag2) 누적 실전 명령어'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500 cursor-pointer shrink-0"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedCode ? '복사 완료!' : '코드 복사'}
              </button>
            </div>
            <pre className="max-h-56 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
              <code>{combinedCode}</code>
            </pre>
          </div>
        </div>

        {/* RIGHT COLUMN: Sequential Field Mission Control Panel */}
        <div className="min-w-0 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-glass lg:col-span-5">
          <div className="space-y-4">
            {/* Progress Header */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 text-[#2563EB]">
                  <Layers className="h-3.5 w-3.5" />
                  순차 실전 미션 진행률
                </span>
                <span className="font-mono text-slate-600">
                  {doneSteps} / {totalSteps} ({progressPct}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                {labType === 'arm' ? currentArmMission.description : currentAmrMission.description}
              </p>
            </div>

            {/* Stepper Chips */}
            <div className="flex flex-wrap gap-1.5">
              {(labType === 'arm' ? currentArmMission.steps : currentAmrMission.steps).map(
                (s, idx) => {
                  const isDone =
                    labType === 'arm'
                      ? armCompleted || idx < armStepIdx
                      : amrCompleted || idx < amrStepIdx;
                  const isCurr =
                    labType === 'arm'
                      ? !armCompleted && idx === armStepIdx
                      : !amrCompleted && idx === amrStepIdx;
                  return (
                    <span
                      key={s.id}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : isCurr
                          ? 'bg-[#dce9ff] text-[#2563EB] ring-1 ring-[#2563EB]/40'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-3 w-3" /> : <span>#{s.id}</span>}
                    </span>
                  );
                }
              )}
            </div>

            {/* Active Step Card or Completion Banner */}
            {(labType === 'arm' ? armCompleted : amrCompleted) ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center">
                <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">전 과정 미션 완료!</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  좌측 하단에 생성된{' '}
                  <strong>
                    {labType === 'arm' ? '브릴스 Lua 표준 스크립트' : 'ROS 2 Nav2 · Rosbag2 명령어'}
                  </strong>
                  를 복사해 현장이나 복습 노트에 바로 활용하실 수 있습니다.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    최종 스크립트 복사
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      labType === 'arm'
                        ? resetArmMission((armMissionIdx + 1) % ARM_MISSIONS.length)
                        : resetAmrMission((amrMissionIdx + 1) % AMR_MISSIONS.length)
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    다음 예제 도전
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[#2563EB] px-2 py-0.5 font-mono text-[11px] font-bold text-white shrink-0">
                    STEP {(labType === 'arm' ? currentArmStep : currentAmrStep).id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {(labType === 'arm' ? currentArmStep : currentAmrStep).title}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  {(labType === 'arm' ? currentArmStep : currentAmrStep).prompt}
                </p>

                <div className="space-y-2 pt-1">
                  {labType === 'arm'
                    ? currentArmStep.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => void handleArmOptionClick(opt)}
                          className="group flex w-full items-start gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-left text-xs font-medium text-slate-800 shadow-sm transition hover:border-[#2563EB] hover:bg-[#dce9ff]/30 cursor-pointer"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[11px] font-bold uppercase text-slate-600 group-hover:bg-[#2563EB] group-hover:text-white">
                            {opt.id}
                          </span>
                          <span className="leading-relaxed">{opt.label}</span>
                        </button>
                      ))
                    : currentAmrStep.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleAmrOptionClick(opt)}
                          className="group flex w-full items-start gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-left text-xs font-medium text-slate-800 shadow-sm transition hover:border-[#2563EB] hover:bg-[#dce9ff]/30 cursor-pointer"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[11px] font-bold uppercase text-slate-600 group-hover:bg-[#2563EB] group-hover:text-white">
                            {opt.id}
                          </span>
                          <span className="leading-relaxed">{opt.label}</span>
                        </button>
                      ))}
                </div>
              </div>
            )}

            {/* Instant Field Feedback Box */}
            {activeFeedback && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                  activeFeedback.ok
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-red-200 bg-red-50 text-red-900'
                }`}
              >
                {activeFeedback.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                )}
                <span>{activeFeedback.text}</span>
              </div>
            )}
          </div>

          {/* Bottom Field Note */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-slate-400" />
              {labType === 'arm'
                ? 'ISO/TS 15066 · 2-DOF IK 실시간 연산'
                : 'ROS 2 Jazzy/Humble · 360° Raycast LiDAR'}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[#2563EB]">
              <Radio className="h-3 w-3" />
              LIVE SANDBOX
            </span>
          </div>
        </div>
      </div>

      {/* Unit & Coordinate Checker Modal */}
      <UnitCoordinateModal isOpen={unitModalOpen} onClose={() => setUnitModalOpen(false)} />
    </div>
  );
}
