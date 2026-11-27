'use client';

import React from 'react';
import {
  CircuitDef,
  Coil,
  CompareBox,
  ContactA,
  ContactB,
  ContactRise,
  Dot,
  InstBox,
  LadderRails,
  RungNum,
  SimState,
  TagTheme,
  Wire,
} from './ladderPrimitives';

export const CIRCUIT_GROUPS = [
  { label: '1. 기초 논리 (4)', ids: [0, 1, 2, 3] },
  { label: '2. 안전 & 상태 제어 (4)', ids: [4, 5, 6, 7] },
  { label: '3. 타이머 & 카운터 (4)', ids: [8, 9, 10, 11] },
  { label: '4. 인버터 & 응용 연산 (4)', ids: [12, 13, 14, 15] },
  { label: '5. 실전 비교 응용 (2) ★NEW', ids: [16, 17] },
];

export const CIRCUITS: CircuitDef[] = [
  // 01. a접점 / b접점 기본
  {
    id: 0,
    category: '1. 기초 논리',
    title: '01. a접점 · b접점 기본',
    inputs: [
      { dev: 'X00', label: 'a접점 스위치', color: 'blue' },
      { dev: 'X01', label: 'b접점 스위치', color: 'rose' },
    ],
    outputs: [
      { dev: 'Y20', label: 'a접점 램프', color: 'blue' },
      { dev: 'Y21', label: 'b접점 램프', color: 'amber' },
    ],
    scan(s) {
      s.Y.Y20 = s.X.X00;
      s.Y.Y21 = !s.X.X01;
    },
    renderLadder(s) {
      const h = 215;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={62} num="0" />
          <Wire x1={36} y1={62} x2={142} y2={62} on />
          <ContactA x={160} y={62} dev="X00" label="a접점 (NO)" on={s.X.X00} theme="blue" />
          <Wire x1={178} y1={62} x2={678} y2={62} on={s.Y.Y20} />
          <Coil x={700} y={62} dev="Y20" label="a접점 출력" on={s.Y.Y20} theme="blue" />
          <Wire x1={722} y1={62} x2={784} y2={62} on={s.Y.Y20} />

          <RungNum y={152} num="2" />
          <Wire x1={36} y1={152} x2={142} y2={152} on />
          <ContactB x={160} y={152} dev="X01" label="b접점 (NC)" on={!s.X.X01} theme="red" />
          <Wire x1={178} y1={152} x2={678} y2={152} on={s.Y.Y21} />
          <Coil x={700} y={152} dev="Y21" label="b접점 출력" on={s.Y.Y21} theme="amber" />
          <Wire x1={722} y1={152} x2={784} y2={152} on={s.Y.Y21} />
        </svg>
      );
    },
    note: {
      principle: 'a접점(NO: Normally Open)은 평소 열려 있다가 입력이 들어오면 닫히고, b접점(NC: Normally Closed)은 평소 닫혀 있다가 입력이 들어오면 회로를 끊습니다.',
      analogy: 'a접점은 if (X00 === true), b접점은 if (!X01) NOT 연산자와 완벽히 동일합니다.',
      shortcuts: ['F5 : a접점 삽입', 'F6 : b접점 삽입', 'F7 : 출력 코일 삽입', 'F4 : 컴파일(변환)'],
      field: '시작 버튼·감지 센서는 a접점, 비상정지(EMG)·정지 버튼·안전 도어는 단선 시에도 기계가 멈추도록 b접점(Fail-Safe)으로 구성합니다.',
      test: ['X00을 눌러 Y20에 파란 전류가 흐르는지 확인하세요.', 'Y21은 평소 켜져 있다가 X01을 누르면 즉시 꺼집니다.'],
    },
  },

  // 02. AND 직렬 회로
  {
    id: 1,
    category: '1. 기초 논리',
    title: '02. AND 직렬 회로',
    inputs: [
      { dev: 'X00', label: '왼손 스위치', color: 'blue' },
      { dev: 'X01', label: '오른손 스위치', color: 'blue' },
    ],
    outputs: [{ dev: 'Y20', label: '프레스 하강', color: 'emerald' }],
    scan(s) {
      s.Y.Y20 = s.X.X00 && s.X.X01;
    },
    renderLadder(s) {
      const h = 155;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={72} num="0" />
          <Wire x1={36} y1={72} x2={142} y2={72} on />
          <ContactA x={160} y={72} dev="X00" label="조건 1 (왼손)" on={s.X.X00} theme="blue" />
          <Wire x1={178} y1={72} x2={332} y2={72} on={s.X.X00} />
          <ContactA x={350} y={72} dev="X01" label="조건 2 (오른손)" on={s.X.X01} theme="blue" />
          <Wire x1={368} y1={72} x2={678} y2={72} on={s.Y.Y20} />
          <Coil x={700} y={72} dev="Y20" label="AND 출력" on={s.Y.Y20} theme="green" />
          <Wire x1={722} y1={72} x2={784} y2={72} on={s.Y.Y20} />
        </svg>
      );
    },
    note: {
      principle: '접점을 가로로 직렬 연결하면 모든 조건이 동시에 ON일 때만 코일이 동작하는 논리곱(AND) 회로가 됩니다.',
      analogy: 'JavaScript의 if (X00 && X01) { Y20 = true; } 조건문과 같습니다.',
      shortcuts: ['F5 : 직렬 a접점 추가', 'F6 : 직렬 b접점 추가'],
      field: '프레스 양손 조작 안전 스위치, 안전 도어 닫힘 + 원점 완료 시에만 자동 운전 허용 등 모든 인터록 조건의 기본입니다.',
      test: ['X00 아래 "고정"을 체크한 뒤 X01을 눌러 두 조건이 모두 켜질 때만 Y20이 점등되는지 확인하세요.'],
    },
  },

  // 03. OR 병렬 회로
  {
    id: 2,
    category: '1. 기초 논리',
    title: '03. OR 병렬 회로',
    inputs: [
      { dev: 'X00', label: '현장 시작버튼', color: 'emerald' },
      { dev: 'X01', label: 'HMI 터치버튼', color: 'blue' },
    ],
    outputs: [{ dev: 'Y20', label: '컨베이어 출력', color: 'emerald' }],
    scan(s) {
      s.Y.Y20 = s.X.X00 || s.X.X01;
    },
    renderLadder(s) {
      const h = 215;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={62} num="0" />
          <Wire x1={36} y1={62} x2={142} y2={62} on />
          <ContactA x={160} y={62} dev="X00" label="현장 PB" on={s.X.X00} theme="green" />
          <Wire x1={178} y1={62} x2={290} y2={62} on={s.X.X00} />

          <Wire x1={36} y1={148} x2={142} y2={148} on />
          <ContactA x={160} y={148} dev="X01" label="HMI 버튼" on={s.X.X01} theme="blue" />
          <Wire x1={178} y1={148} x2={290} y2={148} on={s.X.X01} />

          <Wire x1={290} y1={62} x2={290} y2={148} on={s.X.X01} />
          <Dot x={290} y={62} on={s.Y.Y20} />
          <Wire x1={290} y1={62} x2={678} y2={62} on={s.Y.Y20} />
          <Coil x={700} y={62} dev="Y20" label="OR 출력" on={s.Y.Y20} theme="green" />
          <Wire x1={722} y1={62} x2={784} y2={62} on={s.Y.Y20} />
        </svg>
      );
    },
    note: {
      principle: '접점을 세로로 병렬 연결하면 어느 한쪽 길로라도 전기가 통할 때 출력이 켜지는 논리합(OR) 회로가 됩니다.',
      analogy: 'if (X00 || X01) { Y20 = true; } 와 완벽히 일치합니다.',
      shortcuts: ['Shift + F5 : 병렬 a접점 추가', 'Shift + F6 : 병렬 b접점 추가'],
      field: '현장 물리 버튼(X)과 터치패널 HMI 버튼(M) 어느 쪽을 눌러도 장비를 가동할 수 있게 병렬로 묶을 때 자주 씁니다.',
      test: ['X00 또는 X01 중 하나만 눌러도 Y20이 즉시 켜지는 것을 확인하세요.'],
    },
  },

  // 04. 자기유지 회로 (Self-Holding)
  {
    id: 3,
    category: '1. 기초 논리',
    title: '04. 자기유지 회로 (Self-Holding)',
    inputs: [
      { dev: 'X00', label: '시작 (START)', color: 'emerald' },
      { dev: 'X01', label: '정지 (STOP)', color: 'rose' },
    ],
    outputs: [{ dev: 'Y20', label: '모터 연속운전', color: 'emerald' }],
    hasMotor: true,
    getMotor(s) {
      return s.Y.Y20
        ? { mode: 'cw', speed: '0.65s', badge: 'RUN (자기유지)', freq: '60.0 Hz', desc: 'Y20 스스로 전기를 유지하며 연속 구동 중' }
        : { mode: 'stop', badge: 'STOP', freq: '0.0 Hz', desc: 'X00(시작)을 짧게 1회 눌러보세요.' };
    },
    scan(s) {
      s.Y.Y20 = (s.X.X00 || s.Y.Y20) && !s.X.X01;
    },
    renderLadder(s) {
      const h = 215;
      const merged = s.X.X00 || s.Y.Y20;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={62} num="0" />
          <Wire x1={36} y1={62} x2={142} y2={62} on />
          <ContactA x={160} y={62} dev="X00" label="시작 (a)" on={s.X.X00} theme="green" />
          <Wire x1={178} y1={62} x2={290} y2={62} on={s.X.X00} />

          <Wire x1={36} y1={148} x2={142} y2={148} on />
          <ContactA x={160} y={148} dev="Y20" label="자기유지" on={s.Y.Y20} theme="blue" />
          <Wire x1={178} y1={148} x2={290} y2={148} on={s.Y.Y20} />

          <Wire x1={290} y1={62} x2={290} y2={148} on={s.Y.Y20} />
          <Dot x={290} y={62} on={merged} />
          <Wire x1={290} y1={62} x2={412} y2={62} on={merged} />
          <ContactB x={430} y={62} dev="X01" label="정지 (b)" on={!s.X.X01} theme="red" />
          <Wire x1={448} y1={62} x2={678} y2={62} on={s.Y.Y20} />
          <Coil x={700} y={62} dev="Y20" label="모터 출력" on={s.Y.Y20} theme="green" />
          <Wire x1={722} y1={62} x2={784} y2={62} on={s.Y.Y20} />
        </svg>
      );
    },
    note: {
      principle: '푸시버튼(X00)에서 손을 떼도 출력 코일 Y20 자신의 a접점을 병렬로 걸어 전기를 계속 유지합니다. 정지(X01)가 뒤에 직렬로 있어 동시 입력 시 정지가 우선(Stop Priority)됩니다.',
      analogy: 'React의 useState(false) 상태를 버튼 클릭으로 true로 유지하고, 정지 버튼으로 false로 초기화하는 상태 유지 패턴입니다.',
      shortcuts: ['Shift + F5 : 자기유지 병렬 접점', 'F6 : 정지 b접점'],
      field: '컨베이어 연속 운전, 펌프·집진기 가동 등 자동화 설비 시퀀스의 가장 기본 뼈대입니다.',
      test: ['X00을 짧게 눌렀다 떼어 Y20이 유지되는지 확인하세요.', 'X01을 누르면 즉시 차단됩니다.'],
    },
  },

  // 05. 인터록 회로 (정/역회전 상호잠금)
  {
    id: 4,
    category: '2. 안전 & 상태 제어',
    title: '05. 인터록 회로 (정/역회전 상호잠금)',
    inputs: [
      { dev: 'X00', label: '정회전 (FWD)', color: 'blue' },
      { dev: 'X01', label: '역회전 (REV)', color: 'purple' },
      { dev: 'X02', label: '정지 (STOP)', color: 'rose' },
    ],
    outputs: [
      { dev: 'Y20', label: 'STF 정회전', color: 'blue' },
      { dev: 'Y21', label: 'STR 역회전', color: 'purple' },
    ],
    hasMotor: true,
    getMotor(s) {
      if (s.Y.Y20) return { mode: 'cw', speed: '0.6s', badge: 'FWD (STF)', freq: '+60.0 Hz', desc: '정회전 구동 중 (Y20 b접점이 역회전 완벽 차단)' };
      if (s.Y.Y21) return { mode: 'ccw', speed: '0.6s', badge: 'REV (STR)', freq: '-60.0 Hz', desc: '역회전 구동 중 (Y21 b접점이 정회전 완벽 차단)' };
      return { mode: 'stop', badge: 'STOP', freq: '0.0 Hz', desc: '정회전 또는 역회전 버튼을 눌러보세요.' };
    },
    scan(s) {
      s.Y.Y20 = (s.X.X00 || s.Y.Y20) && !s.X.X02 && !s.Y.Y21;
      s.Y.Y21 = (s.X.X01 || s.Y.Y21) && !s.X.X02 && !s.Y.Y20;
    },
    renderLadder(s) {
      const h = 330;
      const m0 = s.X.X00 || s.Y.Y20;
      const a0 = m0 && !s.X.X02;
      const m1 = s.X.X01 || s.Y.Y21;
      const a1 = m1 && !s.X.X02;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={55} num="0" />
          <Wire x1={36} y1={55} x2={122} y2={55} on />
          <ContactA x={140} y={55} dev="X00" label="정회전" on={s.X.X00} theme="blue" />
          <Wire x1={158} y1={55} x2={245} y2={55} on={s.X.X00} />
          <Wire x1={36} y1={125} x2={122} y2={125} on />
          <ContactA x={140} y={125} dev="Y20" label="유지" on={s.Y.Y20} theme="blue" />
          <Wire x1={158} y1={125} x2={245} y2={125} on={s.Y.Y20} />
          <Wire x1={245} y1={55} x2={245} y2={125} on={s.Y.Y20} />
          <Dot x={245} y={55} on={m0} />
          <Wire x1={245} y1={55} x2={332} y2={55} on={m0} />
          <ContactB x={350} y={55} dev="X02" label="정지" on={!s.X.X02} theme="red" />
          <Wire x1={368} y1={55} x2={492} y2={55} on={a0} />
          <ContactB x={510} y={55} dev="Y21" label="역회전 인터록" on={!s.Y.Y21} theme="amber" />
          <Wire x1={528} y1={55} x2={678} y2={55} on={s.Y.Y20} />
          <Coil x={700} y={55} dev="Y20" label="STF 정회전" on={s.Y.Y20} theme="blue" />
          <Wire x1={722} y1={55} x2={784} y2={55} on={s.Y.Y20} />

          <RungNum y={210} num="5" />
          <Wire x1={36} y1={210} x2={122} y2={210} on />
          <ContactA x={140} y={210} dev="X01" label="역회전" on={s.X.X01} theme="purple" />
          <Wire x1={158} y1={210} x2={245} y2={210} on={s.X.X01} />
          <Wire x1={36} y1={280} x2={122} y2={280} on />
          <ContactA x={140} y={280} dev="Y21" label="유지" on={s.Y.Y21} theme="purple" />
          <Wire x1={158} y1={280} x2={245} y2={280} on={s.Y.Y21} />
          <Wire x1={245} y1={210} x2={245} y2={280} on={s.Y.Y21} />
          <Dot x={245} y={210} on={m1} />
          <Wire x1={245} y1={210} x2={332} y2={210} on={m1} />
          <ContactB x={350} y={210} dev="X02" label="정지" on={!s.X.X02} theme="red" />
          <Wire x1={368} y1={210} x2={492} y2={210} on={a1} />
          <ContactB x={510} y={210} dev="Y20" label="정회전 인터록" on={!s.Y.Y20} theme="amber" />
          <Wire x1={528} y1={210} x2={678} y2={210} on={s.Y.Y21} />
          <Coil x={700} y={210} dev="Y21" label="STR 역회전" on={s.Y.Y21} theme="purple" />
          <Wire x1={722} y1={210} x2={784} y2={210} on={s.Y.Y21} />
        </svg>
      );
    },
    note: {
      principle: '동시에 켜지면 안 되는 두 출력(Y20, Y21) 앞에 서로의 b접점을 직렬로 배치합니다. 한쪽이 켜져 있는 동안 반대쪽 통로가 논리적으로 잠깁니다.',
      analogy: '멀티스레드 환경의 Mutex(상호 배제 락)로, 리소스 충돌(상간 단락/기구 충돌)을 원천 봉쇄합니다.',
      shortcuts: ['F6 : 상대 출력 b접점 삽입'],
      field: '인버터 정/역회전(STF/STR), 실린더 전진/후진, 리프트 상승/하강 등 모든 양방향 구동부의 필수 안전장치입니다.',
      test: ['X00을 눌러 정회전 중일 때 X01을 눌러도 차단되는지 확인하세요.', 'X02(정지)를 누른 후 X01을 눌러 역회전으로 전환하세요.'],
    },
  },

  // 06. 인칭/조그 + 자기유지 차단 회로
  {
    id: 5,
    category: '2. 안전 & 상태 제어',
    title: '06. 인칭/조그 + 자기유지 차단 회로',
    inputs: [
      { dev: 'X00', label: '연속 시작', color: 'emerald' },
      { dev: 'X01', label: '정지 (STOP)', color: 'rose' },
      { dev: 'X02', label: '조그 (JOG)', color: 'amber' },
    ],
    outputs: [{ dev: 'Y20', label: '모터 출력', color: 'emerald' }],
    hasMotor: true,
    getMotor(s) {
      if (!s.Y.Y20) return { mode: 'stop', badge: 'STOP', freq: '0.0 Hz', desc: 'X00(연속) 또는 X02(조그 누르고 있기)' };
      if (s.X.X02) return { mode: 'cw', speed: '1.5s', badge: 'JOG (저속)', freq: '5.0 Hz', desc: '조그 운전 중 — 손을 떼면 즉시 정지' };
      return { mode: 'cw', speed: '0.6s', badge: 'RUN (연속)', freq: '60.0 Hz', desc: '자기유지 연속 운전 중' };
    },
    scan(s) {
      if (s.prevX.X02 && !s.X.X02 && !s.X.X00) s.Y.Y20 = false;
      s.Y.Y20 = (s.X.X00 || (s.Y.Y20 && !s.X.X02) || s.X.X02) && !s.X.X01;
    },
    renderLadder(s) {
      const h = 290;
      const b1 = s.X.X00;
      const b2 = s.Y.Y20 && !s.X.X02;
      const b3 = s.X.X02;
      const merged = b1 || b2 || b3;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={56} num="0" />
          <Wire x1={36} y1={56} x2={132} y2={56} on />
          <ContactA x={150} y={56} dev="X00" label="연속 시작" on={s.X.X00} theme="green" />
          <Wire x1={168} y1={56} x2={410} y2={56} on={b1} />

          <Wire x1={36} y1={144} x2={132} y2={144} on />
          <ContactA x={150} y={144} dev="Y20" label="자기유지" on={s.Y.Y20} theme="blue" />
          <Wire x1={168} y1={144} x2={272} y2={144} on={s.Y.Y20} />
          <ContactB x={290} y={144} dev="X02" label="조그 시 차단" on={!s.X.X02} theme="amber" />
          <Wire x1={308} y1={144} x2={410} y2={144} on={b2} />

          <Wire x1={36} y1={232} x2={132} y2={232} on />
          <ContactA x={150} y={232} dev="X02" label="조그 (a)" on={s.X.X02} theme="amber" />
          <Wire x1={168} y1={232} x2={410} y2={232} on={b3} />

          <Wire x1={410} y1={56} x2={410} y2={144} on={b2 || b3} />
          <Wire x1={410} y1={144} x2={410} y2={232} on={b3} />
          <Dot x={410} y={56} on={merged} />
          <Dot x={410} y={144} on={b2 || b3} />
          <Wire x1={410} y1={56} x2={512} y2={56} on={merged} />
          <ContactB x={530} y={56} dev="X01" label="정지 (b)" on={!s.X.X01} theme="red" />
          <Wire x1={548} y1={56} x2={678} y2={56} on={s.Y.Y20} />
          <Coil x={700} y={56} dev="Y20" label="모터 출력" on={s.Y.Y20} theme="green" />
          <Wire x1={722} y1={56} x2={784} y2={56} on={s.Y.Y20} />
        </svg>
      );
    },
    note: {
      principle: 'X02(조그)를 누르면 아래쪽 a접점으로 모터가 돌지만, 동시에 2행의 X02 b접점이 자기유지 경로를 끊어 손을 떼는 순간 즉시 멈춥니다.',
      analogy: 'onMouseDown 동안만 실행되고 onMouseUp 시 즉시 해제되는 비유지(Momentary) 수동 제어입니다.',
      shortcuts: ['F5 / F6 : 동일 디바이스 a·b접점 동시 활용'],
      field: '설비 셋업 시 기구 간섭 확인, 컨베이어 미세 위치 정렬(인칭), 인버터 저속(Pr.15=5Hz) 테스트에 필수입니다.',
      test: ['X02를 꾹 누르고 있다가 떼어 즉시 정지하는지 확인하세요.', 'X00을 누르면 손을 떼도 계속 돕니다.'],
    },
  },

  // 07. SET / RST 래치 회로
  {
    id: 6,
    category: '2. 안전 & 상태 제어',
    title: '07. SET / RST 래치 회로',
    inputs: [
      { dev: 'X00', label: 'SET (켜기)', color: 'emerald' },
      { dev: 'X01', label: 'RST (끄기)', color: 'rose' },
    ],
    outputs: [{ dev: 'Y20', label: '래치 출력', color: 'emerald' }],
    scan(s) {
      if (s.X.X00) s.Y.Y20 = true;
      if (s.X.X01 || s.SM402) s.Y.Y20 = false;
    },
    renderLadder(s) {
      const h = 285;
      const sm = s.SM402 || s.fl.sm402 > 0;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={56} num="0" />
          <Wire x1={36} y1={56} x2={142} y2={56} on />
          <ContactA x={160} y={56} dev="X00" label="SET 입력" on={s.X.X00} theme="green" />
          <Wire x1={178} y1={56} x2={606} y2={56} on={s.X.X00} />
          <InstBox x={680} y={56} cmd="SET Y20" label="ON 유지 (래치)" on={s.X.X00 || s.Y.Y20} liveText={s.Y.Y20 ? 'Y20 = ON' : 'Y20 = OFF'} theme="green" />
          <Wire x1={754} y1={56} x2={784} y2={56} on={s.X.X00} />

          <RungNum y={145} num="2" />
          <Wire x1={36} y1={145} x2={142} y2={145} on />
          <ContactA x={160} y={145} dev="X01" label="RST 입력" on={s.X.X01} theme="red" />
          <Wire x1={178} y1={145} x2={606} y2={145} on={s.X.X01} />
          <InstBox x={680} y={145} cmd="RST Y20" label="강제 OFF" on={s.X.X01} theme="red" />
          <Wire x1={754} y1={145} x2={784} y2={145} on={s.X.X01} />

          <RungNum y={234} num="4" />
          <Wire x1={36} y1={234} x2={142} y2={234} on />
          <ContactA x={160} y={234} dev="SM402" label="초기화 1스캔" on={sm} theme="purple" />
          <Wire x1={178} y1={234} x2={606} y2={234} on={sm} />
          <InstBox x={680} y={234} cmd="RST Y20" label="RUN 시 초기화" on={sm} liveText={sm ? 'INIT PULSE!' : ''} theme="purple" />
          <Wire x1={754} y1={234} x2={784} y2={234} on={sm} />
        </svg>
      );
    },
    note: {
      principle: '병렬 자기유지 선 없이 SET으로 1을 쓰고 RST으로 0을 씁니다. SM402는 PLC가 RUN 될 때 딱 1스캔만 켜지는 초기화 특수 릴레이입니다.',
      analogy: 'SET은 flag = true, RST은 flag = false, SM402는 React의 useEffect(..., []) 초기화 훅과 같습니다.',
      shortcuts: ['F8 : 응용명령(SET/RST) 입력'],
      field: '알람 래치(작업자가 리셋하기 전까지 유지), 장비 기동 시 잔류 상태 일괄 초기화에 필수입니다.',
      test: ['X00을 눌러 Y20이 래치되는지 확인한 뒤, X01이나 상단 "회로 초기화"로 SM402 초기화를 확인하세요.'],
    },
  },

  // 08. 펄스 엣지 검출 (LDP / PLS)
  {
    id: 7,
    category: '2. 안전 & 상태 제어',
    title: '08. 펄스 엣지 검출 (LDP / PLS)',
    inputs: [{ dev: 'X00', label: '원버튼 토글', color: 'purple' }],
    outputs: [
      { dev: 'M0', label: '1스캔 펄스', color: 'purple' },
      { dev: 'Y20', label: '반전 출력', color: 'emerald' },
    ],
    scan(s) {
      const rise = s.X.X00 && !s.prevX.X00;
      s.M.M0 = rise;
      if (rise) {
        s.fl.p1 = 7;
        s.Y.Y20 = !s.Y.Y20;
        s.D.D0 += 1;
      }
    },
    renderLadder(s) {
      const h = 235;
      const m0 = s.M.M0 || s.fl.p1 > 0;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={62} num="0" />
          <Wire x1={36} y1={62} x2={142} y2={62} on />
          <ContactRise x={160} y={62} dev="X00" label="상승엣지 (LDP)" on={m0} theme="purple" />
          <Wire x1={178} y1={62} x2={606} y2={62} on={m0} />
          <InstBox x={680} y={62} cmd="PLS M0" label="1스캔 펄스 출력" on={m0} liveText={m0 ? '1-SCAN ON!' : `누른횟수: ${s.D.D0}`} theme="purple" />
          <Wire x1={754} y1={62} x2={784} y2={62} on={m0} />

          <RungNum y={162} num="2" />
          <Wire x1={36} y1={162} x2={142} y2={162} on />
          <ContactA x={160} y={162} dev="M0" label="1스캔 신호" on={m0} theme="purple" />
          <Wire x1={178} y1={162} x2={606} y2={162} on={m0} />
          <InstBox x={680} y={162} cmd="ALTP Y20" label="원버튼 ON/OFF" on={m0 || s.Y.Y20} liveText={s.Y.Y20 ? 'Y20 = ON' : 'Y20 = OFF'} theme="green" />
          <Wire x1={754} y1={162} x2={784} y2={162} on={m0} />
        </svg>
      );
    },
    note: {
      principle: 'PLC는 1초에 수백 번 스캔하므로, 버튼이 OFF→ON으로 바뀌는 딱 1스캔만 잡는 상승 엣지(LDP/PLS)가 없으면 숫자가 폭주하거나 램프가 고속 점멸합니다.',
      analogy: 'while 루프가 아니라 단 1회만 발동하는 onClick 이벤트 핸들러입니다.',
      shortcuts: ['Shift + F7 : 상승 엣지(LDP) 접점', 'Shift + F8 : 하강 엣지(LDF) 접점'],
      field: '원버튼 ON/OFF 토글(ALTP), 제품 수량 카운트(INCP), 로봇/바코드 리더기 통신 트리거 1회 송신에 필수입니다.',
      test: ['X00을 꾹 누르고 있어도 Y20이 딱 1번만 반전되고 D0가 1씩만 증가하는지 확인하세요.'],
    },
  },

  // 09. 온딜레이 타이머 (TON 0.1초 단위)
  {
    id: 8,
    category: '3. 타이머 & 카운터',
    title: '09. 온딜레이 타이머 (TON 0.1초 단위)',
    inputs: [
      { dev: 'X00', label: '시작 (START)', color: 'emerald' },
      { dev: 'X01', label: '정지/리셋', color: 'rose' },
    ],
    outputs: [{ dev: 'Y20', label: '3초 뒤 점등', color: 'amber' }],
    scan(s) {
      s.M.M0 = (s.X.X00 || s.M.M0) && !s.X.X01;
      const t0 = s.T.T0;
      t0.preset = 30;
      t0.coil = s.M.M0;
      if (t0.coil) {
        if (t0.acc < t0.preset) t0.acc = Math.min(t0.preset, t0.acc + 0.5);
        t0.done = t0.acc >= t0.preset;
      } else {
        t0.acc = 0;
        t0.done = false;
      }
      s.Y.Y20 = t0.done;
    },
    renderLadder(s) {
      const h = 285;
      const m = s.X.X00 || s.M.M0;
      const cur = Math.floor(s.T.T0.acc);
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={56} num="0" />
          <Wire x1={36} y1={56} x2={132} y2={56} on />
          <ContactA x={150} y={56} dev="X00" label="시작" on={s.X.X00} theme="green" />
          <Wire x1={168} y1={56} x2={260} y2={56} on={s.X.X00} />
          <Wire x1={36} y1={134} x2={132} y2={134} on />
          <ContactA x={150} y={134} dev="M0" label="자기유지" on={s.M.M0} theme="blue" />
          <Wire x1={168} y1={134} x2={260} y2={134} on={s.M.M0} />
          <Wire x1={260} y1={56} x2={260} y2={134} on={s.M.M0} />
          <Dot x={260} y={56} on={m} />
          <Wire x1={260} y1={56} x2={352} y2={56} on={m} />
          <ContactB x={370} y={56} dev="X01" label="정지" on={!s.X.X01} theme="red" />
          <Wire x1={388} y1={56} x2={510} y2={56} on={s.M.M0} />
          <Dot x={510} y={56} on={s.M.M0} />
          <Wire x1={510} y1={56} x2={678} y2={56} on={s.M.M0} />
          <Coil x={700} y={56} dev="M0" label="운전 릴레이" on={s.M.M0} theme="blue" />
          <Wire x1={722} y1={56} x2={784} y2={56} on={s.M.M0} />

          <Wire x1={510} y1={56} x2={510} y2={134} on={s.M.M0} />
          <Wire x1={510} y1={134} x2={606} y2={134} on={s.M.M0} />
          <InstBox x={680} y={134} cmd="T0 K30" label="3.0초 (0.1s×30)" on={s.M.M0} liveText={`${cur} / 30 (${(cur / 10).toFixed(1)}s)`} theme="amber" />
          <Wire x1={754} y1={134} x2={784} y2={134} on={s.M.M0} />

          <RungNum y={228} num="5" />
          <Wire x1={36} y1={228} x2={132} y2={228} on />
          <ContactA x={150} y={228} dev="T0" label="3초 완료" on={s.T.T0.done} theme="amber" />
          <Wire x1={168} y1={228} x2={678} y2={228} on={s.Y.Y20} />
          <Coil x={700} y={228} dev="Y20" label="지연 출력" on={s.Y.Y20} theme="green" />
          <Wire x1={722} y1={228} x2={784} y2={228} on={s.Y.Y20} />
        </svg>
      );
    },
    note: {
      principle: '일반 타이머(T)는 100ms(0.1초) 단위입니다. T0 K30은 3.0초를 뜻하며, 입력이 유지되는 동안 카운트하다가 도달 시 T0 접점이 ON 됩니다. 입력이 끊어지면 자동 0 리셋됩니다.',
      analogy: 'JavaScript의 setTimeout(callback, 3000) + clearTimeout() 조합과 같습니다.',
      shortcuts: ['F7 입력 후 "T0 K30" 타이핑'],
      field: '기동 전 3초 경고 부저, 센서 채터링(떨림) 필터(K2 = 0.2초), 실린더 압착 유지 시간에 쓰입니다.',
      test: ['X00을 눌러 T0가 30(3.0초)까지 증가한 뒤 Y20이 켜지는지 확인하세요.'],
    },
  },

  // 10. 플리커 & 2진수 순차 점멸
  {
    id: 9,
    category: '3. 타이머 & 카운터',
    title: '10. 플리커 & 2진수 순차 점멸 (SM412 + K1Y20)',
    initData: { D0: 8 },
    inputs: [
      { dev: 'X00', label: '초기화 (D0=8)', color: 'blue' },
      { dev: 'X01', label: '자동 점멸 ON', color: 'emerald' },
    ],
    outputs: [
      { dev: 'Y23', label: 'BIT3 (8)', color: 'rose' },
      { dev: 'Y22', label: 'BIT2 (4)', color: 'amber' },
      { dev: 'Y21', label: 'BIT1 (2)', color: 'blue' },
      { dev: 'Y20', label: 'BIT0 (1)', color: 'emerald' },
    ],
    scan(s) {
      if (s.X.X00 && !s.prevX.X00) {
        s.D.D0 = 8;
        s.fl.p1 = 5;
      }
      const smRise = s.SM412 && !s.prevSM412;
      if (s.X.X01 && smRise) {
        let next = Math.trunc(s.D.D0 / 2);
        if (next < 1) next = 8;
        s.D.D0 = next;
        s.fl.p2 = 5;
      }
      const outVal = s.X.X01 ? s.D.D0 : 0;
      s.Y.Y20 = Boolean(outVal & 1);
      s.Y.Y21 = Boolean(outVal & 2);
      s.Y.Y22 = Boolean(outVal & 4);
      s.Y.Y23 = Boolean(outVal & 8);
    },
    renderLadder(s) {
      const h = 345;
      const p1 = s.X.X00 || s.fl.p1 > 0;
      const runClk = s.X.X01 && s.SM412;
      const lt1 = s.D.D0 < 1;
      const bin = s.D.D0.toString(2).padStart(4, '0');
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={52} num="0" />
          <Wire x1={36} y1={52} x2={132} y2={52} on />
          <ContactRise x={150} y={52} dev="X00" label="초기값 설정" on={p1} theme="blue" />
          <Wire x1={168} y1={52} x2={600} y2={52} on={p1} />
          <InstBox x={678} y={52} cmd="MOV K8 D0" label="D0 = 8 (1000₂)" on={p1} liveText={`D0 = ${s.D.D0}`} theme="blue" width={156} />
          <Wire x1={756} y1={52} x2={784} y2={52} on={p1} />

          <RungNum y={140} num="3" />
          <Wire x1={36} y1={140} x2={132} y2={140} on />
          <ContactA x={150} y={140} dev="X01" label="점멸 스위치" on={s.X.X01} theme="green" />
          <Wire x1={168} y1={140} x2={292} y2={140} on={s.X.X01} />
          <ContactRise x={310} y={140} dev="SM412" label="1초 클럭 (↑)" on={runClk} theme="purple" />
          <Wire x1={328} y1={140} x2={600} y2={140} on={runClk} />
          <InstBox x={678} y={140} cmd="/ D0 K2 D0" label="8 → 4 → 2 → 1" on={runClk} liveText="1초마다 ÷ 2" theme="purple" width={156} />
          <Wire x1={756} y1={140} x2={784} y2={140} on={runClk} />

          <RungNum y={228} num="8" />
          <Wire x1={36} y1={228} x2={140} y2={228} on />
          <CompareBox x={200} y={228} expr="< D0 K1" label="1 미만이면" on={lt1} theme="amber" />
          <Wire x1={260} y1={228} x2={600} y2={228} on={lt1} />
          <InstBox x={678} y={228} cmd="MOV K8 D0" label="다시 8로 순환" on={lt1} theme="amber" width={156} />
          <Wire x1={756} y1={228} x2={784} y2={228} on={lt1} />

          <RungNum y={308} num="12" />
          <Wire x1={36} y1={308} x2={132} y2={308} on />
          <ContactA x={150} y={308} dev="X01" label="출력 허용" on={s.X.X01} theme="green" />
          <Wire x1={168} y1={308} x2={600} y2={308} on={s.X.X01} />
          <InstBox x={678} y={308} cmd="MOV D0 K1Y20" label="Y23~Y20 동시출력" on={s.X.X01} liveText={`BIN: ${bin}₂`} theme="green" width={156} />
          <Wire x1={756} y1={308} x2={784} y2={308} on={s.X.X01} />
        </svg>
      );
    },
    note: {
      principle: '교재 핵심 실습 예제입니다. SM412(1초 클럭)마다 D0를 2로 나누어 8(1000₂)→4(0100₂)→2(0010₂)→1(0001₂)로 이동시키고, K1Y20(Y20~Y23 4비트 묶음)에 바로 쏘아 순차 점멸을 만듭니다.',
      analogy: 'setInterval(..., 1000) 안에서 비트 우측 시프트(val >>= 1) 후 4개 LED 포트에 출력하는 구조입니다.',
      shortcuts: ['SM412 : 1초 클럭 특수 릴레이', 'K1Y20 : Y20~Y23 4비트 디지트 지정'],
      field: '경광등 플리커(SM412)와 2진수 비트 시프트 기반의 순차 출력/컨베이어 시프트 로직 이해의 핵심입니다.',
      test: ['X01 아래 "고정(Hold)" 체크박스를 켜면 1초마다 Y23 → Y22 → Y21 → Y20 램프가 차례로 이동합니다!'],
    },
  },

  // 11. 카운터 (C0) 및 리셋
  {
    id: 10,
    category: '3. 타이머 & 카운터',
    title: '11. 카운터 (C0) 및 리셋',
    inputs: [
      { dev: 'X00', label: '제품감지 센서', color: 'blue' },
      { dev: 'X01', label: '카운터 리셋', color: 'rose' },
    ],
    outputs: [{ dev: 'Y20', label: '3개 포장완료', color: 'emerald' }],
    scan(s) {
      const c0 = s.C.C0;
      c0.preset = 3;
      if (s.X.X00 && !s.prevX.X00) {
        if (c0.acc < c0.preset) c0.acc += 1;
        if (c0.acc >= c0.preset) c0.done = true;
      }
      if (s.X.X01) {
        c0.acc = 0;
        c0.done = false;
      }
      s.Y.Y20 = c0.done;
    },
    renderLadder(s) {
      const h = 280;
      const c0 = s.C.C0;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={56} num="0" />
          <Wire x1={36} y1={56} x2={142} y2={56} on />
          <ContactA x={160} y={56} dev="X00" label="제품 센서" on={s.X.X00} theme="blue" />
          <Wire x1={178} y1={56} x2={606} y2={56} on={s.X.X00} />
          <InstBox x={680} y={56} cmd="C0 K3" label="3개 카운터" on={s.X.X00 || c0.done} liveText={`${c0.acc} / ${c0.preset} 개`} theme="blue" />
          <Wire x1={754} y1={56} x2={784} y2={56} on={s.X.X00} />

          <RungNum y={145} num="2" />
          <Wire x1={36} y1={145} x2={142} y2={145} on />
          <ContactA x={160} y={145} dev="C0" label="카운트 완료" on={c0.done} theme="green" />
          <Wire x1={178} y1={145} x2={678} y2={145} on={s.Y.Y20} />
          <Coil x={700} y={145} dev="Y20" label="포장 완료" on={s.Y.Y20} theme="green" />
          <Wire x1={722} y1={145} x2={784} y2={145} on={s.Y.Y20} />

          <RungNum y={234} num="4" />
          <Wire x1={36} y1={234} x2={142} y2={234} on />
          <ContactA x={160} y={234} dev="X01" label="리셋 버튼" on={s.X.X01} theme="red" />
          <Wire x1={178} y1={234} x2={606} y2={234} on={s.X.X01} />
          <InstBox x={680} y={234} cmd="RST C0" label="카운터 초기화" on={s.X.X01} theme="red" />
          <Wire x1={754} y1={234} x2={784} y2={234} on={s.X.X01} />
        </svg>
      );
    },
    note: {
      principle: '카운터(C)는 입력이 OFF→ON 될 때마다 1씩 증가하며, 타이머와 달리 입력이 꺼져도 값을 기억합니다. 반드시 RST C0 명령어로 0 초기화해야 합니다.',
      analogy: '상태 변수 count++ 로 누적하다가 count >= 3 조건을 체크하고, 리셋 버튼에서 count = 0 하는 것과 같습니다.',
      shortcuts: ['F7 : C0 K3 입력', 'F8 : RST C0 입력'],
      field: '트레이 적재 수량 카운트, 박스 포장 단위 배출, 로봇 반복 픽앤플레이스 횟수 제어에 쓰입니다.',
      test: ['X00을 3번 눌러 C0가 3에 도달하며 Y20이 켜지는지 확인하고, X01로 리셋하세요.'],
    },
  },

  // 12. 순차 기동 타이머 시퀀스
  {
    id: 11,
    category: '3. 타이머 & 카운터',
    title: '12. 순차 기동 타이머 시퀀스',
    inputs: [
      { dev: 'X00', label: '라인 가동', color: 'emerald' },
      { dev: 'X01', label: '전체 정지', color: 'rose' },
    ],
    outputs: [
      { dev: 'Y20', label: '1차 모터(0s)', color: 'emerald' },
      { dev: 'Y21', label: '2차 모터(2s)', color: 'blue' },
      { dev: 'Y22', label: '3차 모터(4s)', color: 'purple' },
    ],
    scan(s) {
      s.M.M0 = (s.X.X00 || s.M.M0) && !s.X.X01;
      s.Y.Y20 = s.M.M0;
      const t0 = s.T.T0;
      t0.preset = 20;
      t0.coil = s.M.M0;
      if (t0.coil) {
        if (t0.acc < t0.preset) t0.acc = Math.min(t0.preset, t0.acc + 0.5);
        t0.done = t0.acc >= t0.preset;
      } else {
        t0.acc = 0;
        t0.done = false;
      }
      s.Y.Y21 = t0.done;
      const t1 = s.T.T1;
      t1.preset = 20;
      t1.coil = t0.done;
      if (t1.coil) {
        if (t1.acc < t1.preset) t1.acc = Math.min(t1.preset, t1.acc + 0.5);
        t1.done = t1.acc >= t1.preset;
      } else {
        t1.acc = 0;
        t1.done = false;
      }
      s.Y.Y22 = t1.done;
    },
    renderLadder(s) {
      const h = 345;
      const m = s.X.X00 || s.M.M0;
      const c0 = Math.floor(s.T.T0.acc);
      const c1 = Math.floor(s.T.T1.acc);
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={52} num="0" />
          <Wire x1={36} y1={52} x2={122} y2={52} on />
          <ContactA x={140} y={52} dev="X00" label="라인 시작" on={s.X.X00} theme="green" />
          <Wire x1={158} y1={52} x2={245} y2={52} on={s.X.X00} />
          <Wire x1={36} y1={118} x2={122} y2={118} on />
          <ContactA x={140} y={118} dev="M0" label="유지" on={s.M.M0} theme="blue" />
          <Wire x1={158} y1={118} x2={245} y2={118} on={s.M.M0} />
          <Wire x1={245} y1={52} x2={245} y2={118} on={s.M.M0} />
          <Dot x={245} y={52} on={m} />
          <Wire x1={245} y1={52} x2={332} y2={52} on={m} />
          <ContactB x={350} y={52} dev="X01" label="전체 정지" on={!s.X.X01} theme="red" />
          <Wire x1={368} y1={52} x2={520} y2={52} on={s.M.M0} />
          <Dot x={520} y={52} on={s.M.M0} />
          <Wire x1={520} y1={52} x2={678} y2={52} on={s.M.M0} />
          <Coil x={700} y={52} dev="M0" label="1차(Y20)" on={s.M.M0} theme="green" />
          <Wire x1={722} y1={52} x2={784} y2={52} on={s.M.M0} />
          <Wire x1={520} y1={52} x2={520} y2={118} on={s.M.M0} />
          <Wire x1={520} y1={118} x2={606} y2={118} on={s.M.M0} />
          <InstBox x={680} y={118} cmd="T0 K20" label="2.0초 지연" on={s.M.M0} liveText={`${c0}/20 (${(c0 / 10).toFixed(1)}s)`} theme="amber" />
          <Wire x1={754} y1={118} x2={784} y2={118} on={s.M.M0} />

          <RungNum y={205} num="5" />
          <Wire x1={36} y1={205} x2={122} y2={205} on />
          <ContactA x={140} y={205} dev="T0" label="2초 후" on={s.T.T0.done} theme="amber" />
          <Wire x1={158} y1={205} x2={520} y2={205} on={s.T.T0.done} />
          <Dot x={520} y={205} on={s.T.T0.done} />
          <Wire x1={520} y1={205} x2={678} y2={205} on={s.Y.Y21} />
          <Coil x={700} y={205} dev="Y21" label="2차 모터" on={s.Y.Y21} theme="blue" />
          <Wire x1={722} y1={205} x2={784} y2={205} on={s.Y.Y21} />
          <Wire x1={520} y1={205} x2={520} y2={265} on={s.T.T0.done} />
          <Wire x1={520} y1={265} x2={606} y2={265} on={s.T.T0.done} />
          <InstBox x={680} y={265} cmd="T1 K20" label="+2.0초 지연" on={s.T.T0.done} liveText={`${c1}/20 (${(c1 / 10).toFixed(1)}s)`} theme="purple" />
          <Wire x1={754} y1={265} x2={784} y2={265} on={s.T.T0.done} />

          <RungNum y={318} num="9" />
          <Wire x1={36} y1={318} x2={122} y2={318} on />
          <ContactA x={140} y={318} dev="T1" label="4초 후" on={s.T.T1.done} theme="purple" />
          <Wire x1={158} y1={318} x2={678} y2={318} on={s.Y.Y22} />
          <Coil x={700} y={318} dev="Y22" label="3차 모터" on={s.Y.Y22} theme="purple" />
          <Wire x1={722} y1={318} x2={784} y2={318} on={s.Y.Y22} />
        </svg>
      );
    },
    note: {
      principle: '여러 대의 대용량 모터를 동시에 켜면 돌입전류로 차단기가 떨어집니다. 타이머를 연쇄(T0→T1)로 걸어 2초 간격으로 순차 기동(Y20→Y21→Y22)합니다.',
      analogy: 'async/await로 await delay(2000)를 거쳐 단계별 서비스를 부팅하는 시퀀스입니다.',
      shortcuts: ['F7 : 코일과 타이머 병렬 출력 분기'],
      field: '다단 컨베이어 라인, 집진기+가공기+이송기 순차 가동 시 전력 피크 분산에 필수입니다.',
      test: ['X00을 1회 눌러 Y20(즉시) → Y21(2초) → Y22(4초) 순으로 점등되는지 확인하세요.'],
    },
  },

  // 13. 인버터 다단속도 바이너리 제어
  {
    id: 12,
    category: '4. 인버터 & 응용 연산',
    title: '13. 인버터 다단속도 바이너리 제어 (INCP/DECP + K1Y20)',
    inputs: [
      { dev: 'X00', label: '속도 UP (+1)', color: 'blue' },
      { dev: 'X01', label: '속도 DOWN (-1)', color: 'amber' },
      { dev: 'X02', label: '정지 (0단)', color: 'rose' },
    ],
    outputs: [
      { dev: 'Y22', label: 'RH (4)', color: 'purple' },
      { dev: 'Y21', label: 'RM (2)', color: 'blue' },
      { dev: 'Y20', label: 'RL (1)', color: 'emerald' },
    ],
    hasMotor: true,
    getMotor(s) {
      const d0 = s.D.D0;
      const freqs = [0, 10, 20, 30, 40, 45, 50, 60];
      const durs = ['0s', '2.0s', '1.4s', '1.0s', '0.75s', '0.6s', '0.45s', '0.32s'];
      const bin = d0.toString(2).padStart(3, '0');
      if (d0 === 0) return { mode: 'stop', badge: '0단 (정지)', freq: '0.0 Hz', desc: 'X00(UP)을 눌러 1~7단 바이너리 조합을 테스트하세요.' };
      return { mode: 'cw', speed: durs[d0], badge: `${d0}단 (${bin}₂)`, freq: `${freqs[d0].toFixed(1)} Hz`, desc: `RH=${(d0 >> 2) & 1}, RM=${(d0 >> 1) & 1}, RL=${d0 & 1}` };
    },
    scan(s) {
      if (s.X.X00 && !s.prevX.X00 && s.D.D0 < 7) { s.D.D0 += 1; s.fl.p1 = 5; }
      if (s.X.X01 && !s.prevX.X01 && s.D.D0 > 0) { s.D.D0 -= 1; s.fl.p2 = 5; }
      if (s.X.X02) { s.D.D0 = 0; s.fl.p3 = 5; }
      s.Y.Y20 = Boolean(s.D.D0 & 1);
      s.Y.Y21 = Boolean(s.D.D0 & 2);
      s.Y.Y22 = Boolean(s.D.D0 & 4);
    },
    renderLadder(s) {
      const h = 350;
      const d0 = s.D.D0;
      const bin = d0.toString(2).padStart(3, '0');
      const lt7 = d0 < 7;
      const gt0 = d0 > 0;
      const incOn = (s.X.X00 && lt7) || s.fl.p1 > 0;
      const decOn = (s.X.X01 && gt0) || s.fl.p2 > 0;
      const rstOn = s.X.X02 || s.fl.p3 > 0;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={52} num="0" />
          <Wire x1={36} y1={52} x2={122} y2={52} on />
          <ContactA x={140} y={52} dev="X00" label="속도 UP" on={s.X.X00} theme="blue" />
          <Wire x1={158} y1={52} x2={294} y2={52} on={s.X.X00} />
          <CompareBox x={350} y={52} expr="< D0 K7" label="7 미만" on={lt7} theme="purple" />
          <Wire x1={406} y1={52} x2={602} y2={52} on={incOn} />
          <InstBox x={678} y={52} cmd="INCP D0" label="Increment (+1)" on={incOn} liveText={`D0 = ${d0}단`} theme="blue" width={152} />
          <Wire x1={754} y1={52} x2={784} y2={52} on={incOn} />

          <RungNum y={140} num="5" />
          <Wire x1={36} y1={140} x2={122} y2={140} on />
          <ContactA x={140} y={140} dev="X01" label="속도 DOWN" on={s.X.X01} theme="amber" />
          <Wire x1={158} y1={140} x2={294} y2={140} on={s.X.X01} />
          <CompareBox x={350} y={140} expr="> D0 K0" label="0 초과" on={gt0} theme="purple" />
          <Wire x1={406} y1={140} x2={602} y2={140} on={decOn} />
          <InstBox x={678} y={140} cmd="DECP D0" label="Decrement (-1)" on={decOn} theme="amber" width={152} />
          <Wire x1={754} y1={140} x2={784} y2={140} on={decOn} />

          <RungNum y={228} num="10" />
          <Wire x1={36} y1={228} x2={122} y2={228} on />
          <ContactA x={140} y={228} dev="X02" label="정지/리셋" on={rstOn} theme="red" />
          <Wire x1={158} y1={228} x2={602} y2={228} on={rstOn} />
          <InstBox x={678} y={228} cmd="MOV K0 D0" label="0단 리셋" on={rstOn} theme="red" width={152} />
          <Wire x1={754} y1={228} x2={784} y2={228} on={rstOn} />

          <RungNum y={312} num="13" />
          <Wire x1={36} y1={312} x2={122} y2={312} on />
          <ContactA x={140} y={312} dev="SM400" label="항상 ON" on theme="green" />
          <Wire x1={158} y1={312} x2={602} y2={312} on />
          <InstBox x={678} y={312} cmd="MOV D0 K1Y20" label="RL·RM·RH 출력" on liveText={`BIN: ${bin}₂`} theme="green" width={152} />
          <Wire x1={754} y1={312} x2={784} y2={312} on />
        </svg>
      );
    },
    note: {
      principle: 'INCP(Increment Pulse)와 DECP(Decrement Pulse)로 D0를 0~7 사이에서 증감시키고, MOV D0 K1Y20으로 2진수 3비트(RH/RM/RL)를 한 번에 출력합니다. 주의: K1Y20은 Y23까지 4비트를 점유하므로 Y23은 비워두어야 합니다.',
      analogy: 'D0++ / D0-- 후 비트마스크로 인버터 3개 핀에 동시 write하는 패턴입니다.',
      shortcuts: ['F8 : INCP D0, DECP D0, MOV D0 K1Y20'],
      field: 'FREQROL-E700 인버터에서 아날로그 모듈 없이 디지털 출력 3가닥만으로 7단 속도를 제어하는 실무 단골 패턴입니다.',
      test: ['X00(UP)을 1~7회 눌러 RH(Y22)·RM(Y21)·RL(Y20) 조합과 모터 속도 변화를 확인하세요.'],
    },
  },

  // 14. 데이터 이동 · 일괄초기화
  {
    id: 13,
    category: '4. 인버터 & 응용 연산',
    title: '14. 데이터 이동 · 일괄초기화 (MOV / FMOV / ZRST)',
    inputs: [
      { dev: 'X00', label: 'MOV (D0=100)', color: 'blue' },
      { dev: 'X01', label: 'FMOV (50채움)', color: 'purple' },
      { dev: 'X02', label: 'ZRST (일괄 0)', color: 'rose' },
    ],
    outputs: [{ dev: 'Y20', label: 'D0 > 0 상태', color: 'emerald' }],
    scan(s) {
      if (s.X.X00 && !s.prevX.X00) { s.D.D0 = 100; s.fl.p1 = 5; }
      if (s.X.X01 && !s.prevX.X01) { s.D.D0 = 50; s.D.D1 = 50; s.D.D2 = 50; s.D.D3 = 50; s.fl.p2 = 5; }
      if (s.X.X02 && !s.prevX.X02) { s.D.D0 = 0; s.D.D1 = 0; s.D.D2 = 0; s.D.D3 = 0; s.fl.p3 = 5; }
      s.Y.Y20 = s.D.D0 > 0;
    },
    renderLadder(s) {
      const h = 285;
      const a0 = s.X.X00 || s.fl.p1 > 0;
      const a1 = s.X.X01 || s.fl.p2 > 0;
      const a2 = s.X.X02 || s.fl.p3 > 0;
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={56} num="0" />
          <Wire x1={36} y1={56} x2={142} y2={56} on />
          <ContactA x={160} y={56} dev="X00" label="단일 대입" on={a0} theme="blue" />
          <Wire x1={178} y1={56} x2={590} y2={56} on={a0} />
          <InstBox x={676} y={56} cmd="MOVP K100 D0" label="Move: D0 = 100" on={a0} liveText={`D0 = ${s.D.D0}`} theme="blue" width={172} />
          <Wire x1={762} y1={56} x2={784} y2={56} on={a0} />

          <RungNum y={145} num="3" />
          <Wire x1={36} y1={145} x2={142} y2={145} on />
          <ContactA x={160} y={145} dev="X01" label="배열 채움" on={a1} theme="purple" />
          <Wire x1={178} y1={145} x2={590} y2={145} on={a1} />
          <InstBox x={676} y={145} cmd="FMOVP K50 D0 K4" label="Fill Move: D0~D3" on={a1} liveText={`D0..D3 = ${s.D.D1}`} theme="purple" width={172} />
          <Wire x1={762} y1={145} x2={784} y2={145} on={a1} />

          <RungNum y={234} num="7" />
          <Wire x1={36} y1={234} x2={142} y2={234} on />
          <ContactA x={160} y={234} dev="X02" label="구간 초기화" on={a2} theme="red" />
          <Wire x1={178} y1={234} x2={590} y2={234} on={a2} />
          <InstBox x={676} y={234} cmd="ZRSTP D0 D3" label="Zone Reset: 0" on={a2} liveText="일괄 0 리셋" theme="red" width={172} />
          <Wire x1={762} y1={234} x2={784} y2={234} on={a2} />
        </svg>
      );
    },
    note: {
      principle: 'MOV(Move)는 단일 대입, FMOV(Fill Move)는 연속 구간에 같은 값 채우기, ZRST(Zone Reset)는 지정 구간을 한 번에 0(OFF)으로 초기화합니다.',
      analogy: 'MOV는 d0 = 100, FMOV는 arr.fill(50), ZRST는 arr.fill(0) / 상태 일괄 리셋입니다.',
      shortcuts: ['F8 : MOVP / FMOVP / ZRSTP (펄스 P 권장)'],
      field: '장비 원점 복귀 시 전체 상태 릴레이(M0~M100) 일괄 초기화(ZRST), 레시피 기본값 세팅에 필수입니다.',
      test: ['X00(D0=100) → X01(D0~D3 모두 50) → X02(모두 0) 순서로 아래 디바이스 모니터 값 변화를 확인하세요.'],
    },
  },

  // 15. 사칙연산 & 몫/나머지
  {
    id: 14,
    category: '4. 인버터 & 응용 연산',
    title: '15. 사칙연산 & 몫/나머지 (+P / -P / *P / /P)',
    initData: { D0: 25, D1: 4, D2: 0, D3: 0 },
    sliders: [
      { dev: 'D0', label: '피연산자 D0', min: 0, max: 100 },
      { dev: 'D1', label: '피연산자 D1', min: 1, max: 20 },
    ],
    inputs: [
      { dev: 'X00', label: '덧셈 (+P)', color: 'blue' },
      { dev: 'X01', label: '뺄셈 (-P)', color: 'amber' },
      { dev: 'X02', label: '곱셈 (*P)', color: 'purple' },
      { dev: 'X03', label: '나눗셈 (/P)', color: 'emerald' },
    ],
    outputs: [],
    scan(s) {
      if (s.X.X00 && !s.prevX.X00) { s.D.D2 = s.D.D0 + s.D.D1; s.D.D3 = 0; s.fl.p1 = 5; }
      if (s.X.X01 && !s.prevX.X01) { s.D.D2 = s.D.D0 - s.D.D1; s.D.D3 = 0; s.fl.p2 = 5; }
      if (s.X.X02 && !s.prevX.X02) { s.D.D2 = s.D.D0 * s.D.D1; s.D.D3 = 0; s.fl.p3 = 5; }
      if (s.X.X03 && !s.prevX.X03) {
        const div = s.D.D1 === 0 ? 1 : s.D.D1;
        s.D.D2 = Math.trunc(s.D.D0 / div);
        s.D.D3 = s.D.D0 % div;
        s.fl.p4 = 5;
      }
    },
    renderLadder(s) {
      const h = 350;
      const rows: { y: number; n: string; dev: string; lbl: string; on: boolean; cmd: string; sub: string; th: TagTheme }[] = [
        { y: 52, n: '0', dev: 'X00', lbl: '덧셈', on: s.X.X00 || s.fl.p1 > 0, cmd: '+P D0 D1 D2', sub: 'D2 = D0 + D1', th: 'blue' },
        { y: 138, n: '4', dev: 'X01', lbl: '뺄셈', on: s.X.X01 || s.fl.p2 > 0, cmd: '-P D0 D1 D2', sub: 'D2 = D0 - D1', th: 'amber' },
        { y: 224, n: '8', dev: 'X02', lbl: '곱셈', on: s.X.X02 || s.fl.p3 > 0, cmd: '*P D0 D1 D2', sub: '주의: D2·D3(32bit)', th: 'purple' },
        { y: 310, n: '12', dev: 'X03', lbl: '나눗셈', on: s.X.X03 || s.fl.p4 > 0, cmd: '/P D0 D1 D2', sub: '몫:D2, 나머지:D3', th: 'green' },
      ];
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          {rows.map((r) => (
            <g key={r.dev}>
              <RungNum y={r.y} num={r.n} />
              <Wire x1={36} y1={r.y} x2={142} y2={r.y} on />
              <ContactA x={160} y={r.y} dev={r.dev} label={r.lbl} on={r.on} theme={r.th} />
              <Wire x1={178} y1={r.y} x2={590} y2={r.y} on={r.on} />
              <InstBox
                x={676}
                y={r.y}
                cmd={r.cmd}
                label={r.sub}
                on={r.on}
                liveText={r.dev === 'X03' ? `몫:${s.D.D2}, 남:${s.D.D3}` : ''}
                theme={r.th}
                width={172}
              />
              <Wire x1={762} y1={r.y} x2={784} y2={r.y} on={r.on} />
            </g>
          ))}
        </svg>
      );
    },
    note: {
      principle: '사칙연산은 반드시 펄스형(+P, -P, *P, /P)을 권장합니다. 특히 곱셈(*P)은 32비트(D2+D3), 나눗셈(/P)은 D2에 몫·D3에 나머지를 저장하므로 D3에 다른 변수를 쓰면 데이터가 깨집니다!',
      analogy: 'D2 = Math.trunc(D0 / D1); D3 = D0 % D1; — 2칸 점유 규칙만 기억하면 에러를 막을 수 있습니다.',
      shortcuts: ['F8 : "+P D0 D1 D2" 처럼 기호로 바로 입력'],
      field: '트레이 적재 좌표 계산(시작 + 순번×간격), 센서 단위 환산(스케일링), 불량률(%) 산출에 필수입니다.',
      test: ['D0=25, D1=4 상태에서 X03(나눗셈)을 눌러 D2=6(몫), D3=1(나머지)이 동시 기록되는지 확인하세요.'],
    },
  },

  // 16. 비교·상하한 판정 & 공정 스텝 제어
  {
    id: 15,
    category: '4. 인버터 & 응용 연산',
    title: '16. 비교·상하한 판정(ZCP) & 공정 스텝 제어(MOV + =)',
    initData: { D0: 15, D1: 0 },
    sliders: [{ dev: 'D0', label: '센서값 D0 (양품 10~20, 경보 ≥25)', min: 0, max: 35 }],
    inputs: [
      { dev: 'X00', label: '스텝 시작(10)', color: 'emerald' },
      { dev: 'X01', label: '다음 스텝(+10)', color: 'blue' },
      { dev: 'X02', label: '스텝 초기화(0)', color: 'rose' },
    ],
    outputs: [
      { dev: 'M0', label: '미달(<10)', color: 'amber' },
      { dev: 'M1', label: '양품(10~20)', color: 'emerald' },
      { dev: 'M2', label: '초과(>20)', color: 'rose' },
      { dev: 'Y20', label: 'STEP10 공급', color: 'emerald' },
      { dev: 'Y21', label: 'STEP20 가공', color: 'blue' },
      { dev: 'Y22', label: 'STEP30 배출', color: 'purple' },
      { dev: 'Y23', label: 'D0≥25 경보', color: 'rose' },
    ],
    scan(s) {
      s.M.M0 = s.D.D0 < 10;
      s.M.M1 = s.D.D0 >= 10 && s.D.D0 <= 20;
      s.M.M2 = s.D.D0 > 20;
      s.Y.Y23 = s.D.D0 >= 25;

      if (s.X.X00 && !s.prevX.X00 && s.D.D1 === 0) s.D.D1 = 10;
      if (s.X.X01 && !s.prevX.X01) {
        if (s.D.D1 === 10) s.D.D1 = 20;
        else if (s.D.D1 === 20) s.D.D1 = 30;
        else if (s.D.D1 === 30) s.D.D1 = 0;
      }
      if (s.X.X02) s.D.D1 = 0;

      s.Y.Y20 = s.D.D1 === 10;
      s.Y.Y21 = s.D.D1 === 20;
      s.Y.Y22 = s.D.D1 === 30;
    },
    renderLadder(s) {
      const h = 380;
      const ge25 = s.D.D0 >= 25;
      const d1 = s.D.D1;
      const go10 = s.X.X00 && d1 === 0;
      const steps: { y: number; n: string; expr: string; on: boolean; dev: string; th: TagTheme }[] = [
        { y: 266, n: '13', expr: '= D1 K10', on: d1 === 10, dev: 'Y20', th: 'green' },
        { y: 312, n: '16', expr: '= D1 K20', on: d1 === 20, dev: 'Y21', th: 'blue' },
        { y: 354, n: '19', expr: '= D1 K30', on: d1 === 30, dev: 'Y22', th: 'purple' },
      ];
      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={48} num="0" />
          <Wire x1={36} y1={48} x2={122} y2={48} on />
          <ContactA x={140} y={48} dev="SM400" label="상시 감시" on theme="green" />
          <Wire x1={158} y1={48} x2={578} y2={48} on />
          <InstBox x={672} y={48} cmd="ZCP K10 K20 D0 M0" label="M0:<10 M1:10~20 M2:>20" on liveText={`D0 = ${s.D.D0}`} theme="purple" width={188} />
          <Wire x1={766} y1={48} x2={784} y2={48} on />

          <RungNum y={122} num="5" />
          <Wire x1={36} y1={122} x2={132} y2={122} on />
          <CompareBox x={194} y={122} expr=">= D0 K25" label="25 이상 경보" on={ge25} theme="red" width={124} />
          <Wire x1={256} y1={122} x2={678} y2={122} on={ge25} />
          <Coil x={700} y={122} dev="Y23" label="과열 경보" on={ge25} theme="red" />
          <Wire x1={722} y1={122} x2={784} y2={122} on={ge25} />

          <RungNum y={198} num="9" />
          <Wire x1={36} y1={198} x2={132} y2={198} on />
          <CompareBox x={190} y={198} expr="= D1 K0" label="대기 상태" on={d1 === 0} theme="slate" width={116} />
          <Wire x1={248} y1={198} x2={332} y2={198} on={d1 === 0} />
          <ContactA x={350} y={198} dev="X00" label="스텝 시작" on={s.X.X00} theme="green" />
          <Wire x1={368} y1={198} x2={598} y2={198} on={go10} />
          <InstBox x={676} y={198} cmd="MOV K10 D1" label="STEP 10 진입" on={go10} liveText={`STEP D1 = ${d1}`} theme="green" width={156} />
          <Wire x1={754} y1={198} x2={784} y2={198} on={go10} />

          {steps.map((st) => (
            <g key={st.dev}>
              <RungNum y={st.y} num={st.n} />
              <Wire x1={36} y1={st.y} x2={132} y2={st.y} on />
              <CompareBox x={190} y={st.y} expr={st.expr} label="" on={st.on} theme={st.th} width={116} />
              <Wire x1={248} y1={st.y} x2={678} y2={st.y} on={st.on} />
              <Coil x={700} y={st.y} dev={st.dev} label="" on={st.on} theme={st.th} />
              <Wire x1={722} y1={st.y} x2={784} y2={st.y} on={st.on} />
            </g>
          ))}
        </svg>
      );
    },
    note: {
      principle: 'ZCP(Zone Compare)는 1줄로 미달(M0)·양품(M1)·초과(M2) 3개 비트를 판정합니다. 아래 스텝 제어는 D1에 0→10→20→30을 넣어 출력을 깔끔히 분리하는 현업 표준 상태 머신(Step Sequence)입니다.',
      analogy: 'switch (step) { case 10: ... case 20: ... } 구조이며, 10단위로 띄워두면 추후 15번 공정을 끼워 넣기 쉽습니다.',
      shortcuts: ['F5 입력 후 "= D1 K10" / ">= D0 K25" 비교 접점 작성'],
      field: '2차전지 셀 무게/전압 양품 판정(ZCP) 및 협동로봇 연동 자동화 라인의 단계별 시퀀스 제어에 가장 많이 씁니다.',
      test: ['슬라이더로 D0를 움직여 M0→M1→M2→Y23(경보) 변화를 보고, X00·X01로 스텝(10→20→30)을 넘겨보세요.'],
    },
  },

  // 17. 단일 점등 시프트 (MOV K1·K2·K4·K8 K1Y20)
  {
    id: 16,
    category: '5. 실전 비교 응용',
    title: '17. 단일 점등 시프트 (MOV K1·K2·K4·K8 K1Y20)',
    inputs: [
      { dev: 'X00', label: '다음 램프 (+)', color: 'blue' },
      { dev: 'X01', label: '이전 램프 (-)', color: 'amber' },
      { dev: 'X02', label: '전체 초기화 (K0)', color: 'rose' },
    ],
    outputs: [
      { dev: 'Y20', label: '값 1 (K1)', color: 'rose' },
      { dev: 'Y21', label: '값 2 (K2)', color: 'rose' },
      { dev: 'Y22', label: '값 4 (K4)', color: 'rose' },
      { dev: 'Y23', label: '값 8 (K8)', color: 'rose' },
    ],
    scan(s) {
      const applyK = (k: number) => {
        s.D.D0 = k;
        s.Y.Y20 = Boolean(k & 1);
        s.Y.Y21 = Boolean(k & 2);
        s.Y.Y22 = Boolean(k & 4);
        s.Y.Y23 = Boolean(k & 8);
      };

      if (s.X.X00 && !s.prevX.X00) {
        let branch: number | null = null;
        if (s.Y.Y22) {
          applyK(8);
          branch = 1;
        } else if (s.Y.Y21) {
          applyK(4);
          branch = 2;
        } else if (s.Y.Y20) {
          applyK(2);
          branch = 3;
        } else if (!s.Y.Y20 && !s.Y.Y21 && !s.Y.Y22 && !s.Y.Y23) {
          applyK(1);
          branch = 4;
        }
        s.shiftPulse = { block: 'X00', branch, ticks: 9 };
      }

      if (s.X.X01 && !s.prevX.X01) {
        let branch: number | null = null;
        if (s.Y.Y20) {
          applyK(0);
          branch = 1;
        } else if (s.Y.Y21) {
          applyK(1);
          branch = 2;
        } else if (s.Y.Y22) {
          applyK(2);
          branch = 3;
        } else if (s.Y.Y23) {
          applyK(4);
          branch = 4;
        }
        s.shiftPulse = { block: 'X01', branch, ticks: 9 };
      }

      if (s.X.X02 && !s.prevX.X02) {
        applyK(0);
        s.shiftPulse = { block: null, branch: null, ticks: 0 };
      }
    },
    renderLadder(s) {
      const h = 690;
      const Y = s.Y;
      const pBlock = s.shiftPulse.ticks > 0 ? s.shiftPulse.block : null;
      const pBranch = s.shiftPulse.ticks > 0 ? s.shiftPulse.branch : null;

      const x0Pulse = pBlock === 'X00';
      const x1Pulse = pBlock === 'X01';
      const busX = 166;
      const b1Y = [68, 138, 208, 278];
      const b2Y = [388, 458, 528, 598];

      const b1E1 = x0Pulse && pBranch === 1;
      const b1E2 = x0Pulse && pBranch === 2;
      const b1E3 = x0Pulse && pBranch === 3;
      const b1E4 = x0Pulse && pBranch === 4;

      const b2E1 = x1Pulse && pBranch === 1;
      const b2E2 = x1Pulse && pBranch === 2;
      const b2E3 = x1Pulse && pBranch === 3;
      const b2E4 = x1Pulse && pBranch === 4;

      const b2Rows: { y: number; dev: keyof SimState['Y']; cmd: string; lbl: string; exec: boolean; th: TagTheme }[] = [
        { y: b2Y[0], dev: 'Y20', cmd: 'MOV K0 K1Y20', lbl: '0000₂ → 전체 OFF', exec: b2E1, th: 'red' },
        { y: b2Y[1], dev: 'Y21', cmd: 'MOV K1 K1Y20', lbl: '0001₂ → Y20만 ON', exec: b2E2, th: 'amber' },
        { y: b2Y[2], dev: 'Y22', cmd: 'MOV K2 K1Y20', lbl: '0010₂ → Y21만 ON', exec: b2E3, th: 'amber' },
        { y: b2Y[3], dev: 'Y23', cmd: 'MOV K4 K1Y20', lbl: '0100₂ → Y22만 ON', exec: b2E4, th: 'amber' },
      ];

      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <text x="52" y="28" fontSize="11" fontWeight="700" fill="#004ac6">
            ■ Block 1 : 정방향 단일 점등 시프트 (X00 1회 클릭마다 OFF → Y20 → Y21 → Y22 → Y23)
          </text>

          <RungNum y={b1Y[0]} num="0" />
          <Wire x1={36} y1={b1Y[0]} x2={92} y2={b1Y[0]} on />
          <ContactRise x={110} y={b1Y[0]} dev="X00" label="다음 (+)" on={x0Pulse} theme="blue" />
          <Wire x1={128} y1={b1Y[0]} x2={busX} y2={b1Y[0]} on={x0Pulse} />

          <Wire x1={busX} y1={b1Y[0]} x2={busX} y2={b1Y[1]} on={x0Pulse && (pBranch ?? 0) >= 2} />
          <Wire x1={busX} y1={b1Y[1]} x2={busX} y2={b1Y[2]} on={x0Pulse && (pBranch ?? 0) >= 3} />
          <Wire x1={busX} y1={b1Y[2]} x2={busX} y2={b1Y[3]} on={x0Pulse && pBranch === 4} />
          <Dot x={busX} y={b1Y[0]} on={x0Pulse} />
          <Dot x={busX} y={b1Y[1]} on={x0Pulse && (pBranch ?? 0) >= 2} />
          <Dot x={busX} y={b1Y[2]} on={x0Pulse && (pBranch ?? 0) >= 3} />

          <Wire x1={busX} y1={b1Y[0]} x2={212} y2={b1Y[0]} on={b1E1} />
          <ContactA x={230} y={b1Y[0]} dev="Y22" label="" on={Y.Y22 || b1E1} theme="blue" />
          <Wire x1={248} y1={b1Y[0]} x2={590} y2={b1Y[0]} on={b1E1} />
          <InstBox x={674} y={b1Y[0]} cmd="MOV K8 K1Y20" label="1000₂ → Y23만 ON" on={b1E1} theme="blue" width={168} />
          <Wire x1={758} y1={b1Y[0]} x2={784} y2={b1Y[0]} on={b1E1} />

          <Wire x1={busX} y1={b1Y[1]} x2={212} y2={b1Y[1]} on={b1E2} />
          <ContactA x={230} y={b1Y[1]} dev="Y21" label="" on={Y.Y21 || b1E2} theme="blue" />
          <Wire x1={248} y1={b1Y[1]} x2={590} y2={b1Y[1]} on={b1E2} />
          <InstBox x={674} y={b1Y[1]} cmd="MOV K4 K1Y20" label="0100₂ → Y22만 ON" on={b1E2} theme="blue" width={168} />
          <Wire x1={758} y1={b1Y[1]} x2={784} y2={b1Y[1]} on={b1E2} />

          <Wire x1={busX} y1={b1Y[2]} x2={212} y2={b1Y[2]} on={b1E3} />
          <ContactA x={230} y={b1Y[2]} dev="Y20" label="" on={Y.Y20 || b1E3} theme="blue" />
          <Wire x1={248} y1={b1Y[2]} x2={590} y2={b1Y[2]} on={b1E3} />
          <InstBox x={674} y={b1Y[2]} cmd="MOV K2 K1Y20" label="0010₂ → Y21만 ON" on={b1E3} theme="blue" width={168} />
          <Wire x1={758} y1={b1Y[2]} x2={784} y2={b1Y[2]} on={b1E3} />

          <Wire x1={busX} y1={b1Y[3]} x2={212} y2={b1Y[3]} on={b1E4} />
          <ContactB x={230} y={b1Y[3]} dev="Y20" label="" on={!Y.Y20 || b1E4} theme="red" />
          <Wire x1={248} y1={b1Y[3]} x2={302} y2={b1Y[3]} on={b1E4} />
          <ContactB x={320} y={b1Y[3]} dev="Y21" label="" on={!Y.Y21 || b1E4} theme="red" />
          <Wire x1={338} y1={b1Y[3]} x2={392} y2={b1Y[3]} on={b1E4} />
          <ContactB x={410} y={b1Y[3]} dev="Y22" label="" on={!Y.Y22 || b1E4} theme="red" />
          <Wire x1={428} y1={b1Y[3]} x2={482} y2={b1Y[3]} on={b1E4} />
          <ContactB x={500} y={b1Y[3]} dev="Y23" label="" on={!Y.Y23 || b1E4} theme="red" />
          <Wire x1={518} y1={b1Y[3]} x2={590} y2={b1Y[3]} on={b1E4} />
          <InstBox x={674} y={b1Y[3]} cmd="MOV K1 K1Y20" label="0001₂ → 초기 진입" on={b1E4} theme="green" width={168} />
          <Wire x1={758} y1={b1Y[3]} x2={784} y2={b1Y[3]} on={b1E4} />

          <line x1="52" y1="334" x2="770" y2="334" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="5 5" />

          <text x="52" y="354" fontSize="11" fontWeight="700" fill="#b45309">
            ■ Block 2 : 역방향 단일 점등 시프트 (X01 1회 클릭마다 Y23 → Y22 → Y21 → Y20 → OFF)
          </text>

          <RungNum y={b2Y[0]} num="20" />
          <Wire x1={36} y1={b2Y[0]} x2={92} y2={b2Y[0]} on />
          <ContactRise x={110} y={b2Y[0]} dev="X01" label="이전 (-)" on={x1Pulse} theme="amber" />
          <Wire x1={128} y1={b2Y[0]} x2={busX} y2={b2Y[0]} on={x1Pulse} />

          <Wire x1={busX} y1={b2Y[0]} x2={busX} y2={b2Y[1]} on={x1Pulse && (pBranch ?? 0) >= 2} />
          <Wire x1={busX} y1={b2Y[1]} x2={busX} y2={b2Y[2]} on={x1Pulse && (pBranch ?? 0) >= 3} />
          <Wire x1={busX} y1={b2Y[2]} x2={busX} y2={b2Y[3]} on={x1Pulse && pBranch === 4} />
          <Dot x={busX} y={b2Y[0]} on={x1Pulse} />
          <Dot x={busX} y={b2Y[1]} on={x1Pulse && (pBranch ?? 0) >= 2} />
          <Dot x={busX} y={b2Y[2]} on={x1Pulse && (pBranch ?? 0) >= 3} />

          {b2Rows.map((br) => (
            <g key={br.dev}>
              <Wire x1={busX} y1={br.y} x2={212} y2={br.y} on={br.exec} />
              <ContactA x={230} y={br.y} dev={br.dev} label="" on={Y[br.dev] || br.exec} theme={br.th} />
              <Wire x1={248} y1={br.y} x2={590} y2={br.y} on={br.exec} />
              <InstBox x={674} y={br.y} cmd={br.cmd} label={br.lbl} on={br.exec} theme={br.th} width={168} />
              <Wire x1={758} y1={br.y} x2={784} y2={br.y} on={br.exec} />
            </g>
          ))}

          <RungNum y={662} num="36" />
          <Wire x1={36} y1={662} x2={630} y2={662} on={false} />
          <rect x="630" y="649" width="88" height="26" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
          <text x="674" y="666" textAnchor="middle" fontSize="11.5" fontWeight="700" fontFamily="ui-monospace, monospace" fill="#0b1c30">
            END
          </text>
          <Wire x1={718} y1={662} x2={784} y2={662} on={false} />
        </svg>
      );
    },
    note: {
      principle: 'PLC는 위에서 아래(Top→Bottom)로 스캔합니다. Block 1에서 Y22→K8을 맨 위에, Y20→K2를 아래에 역순 배치해야 1스캔 안에 Y20→Y21→Y22→Y23이 연쇄 실행되는 버그를 막을 수 있습니다.',
      analogy: '누적 점등(K1→K3→K7→K15)과 달리 단일 점등(K1→K2→K4→K8)은 딱 1개 비트만 1이 되므로, 초기 진입 시 b접점 4개 직렬로 전체 소등 상태만 걸러냅니다.',
      shortcuts: ['Shift+F7 : 상승 엣지(|↑|) 접점', 'F8 : MOV K8 K1Y20'],
      field: '스캔 순서(Top→Bottom)의 중요성과 2진수 가중치(1·2·4·8)를 체화하는 핵심 실습이며, 실제 유지보수는 18번(INCP/DECP) 방식이 더 유리합니다.',
      test: ['X00을 4번 눌러 K1→K2→K4→K8로 램프가 1개씩 이동하는 것을 보고, 실제 실행된 분기가 0.45초간 파랗게 켜지는지 확인하세요.'],
    },
  },

  // 18. 순차 점등·소등 (INCP/DECP 실무 정석)
  {
    id: 17,
    category: '5. 실전 비교 응용',
    title: '18. 순차 점등·소등 (INCP/DECP 실무 정석)',
    inputs: [
      { dev: 'X00', label: '점등 +1', color: 'blue' },
      { dev: 'X01', label: '소등 -1', color: 'amber' },
      { dev: 'X02', label: '전체 리셋', color: 'rose' },
    ],
    outputs: [
      { dev: 'Y20', label: '램프 1 (≥1)', color: 'rose' },
      { dev: 'Y21', label: '램프 2 (≥2)', color: 'rose' },
      { dev: 'Y22', label: '램프 3 (≥3)', color: 'rose' },
      { dev: 'Y23', label: '램프 4 (≥4)', color: 'rose' },
    ],
    scan(s) {
      if (s.X.X00 && !s.prevX.X00 && s.D.D0 < 4) {
        s.D.D0 += 1;
        s.fl.p1 = 5;
      }
      if (s.X.X01 && !s.prevX.X01 && s.D.D0 > 0) {
        s.D.D0 -= 1;
        s.fl.p2 = 5;
      }
      if (s.X.X02) {
        s.D.D0 = 0;
        s.fl.p3 = 5;
      }
      s.Y.Y20 = s.D.D0 >= 1;
      s.Y.Y21 = s.D.D0 >= 2;
      s.Y.Y22 = s.D.D0 >= 3;
      s.Y.Y23 = s.D.D0 >= 4;
    },
    renderLadder(s) {
      const h = 620;
      const d0 = s.D.D0;
      const lt4 = d0 < 4;
      const gt0 = d0 > 0;
      const incOn = (s.X.X00 && lt4) || s.fl.p1 > 0;
      const decOn = (s.X.X01 && gt0) || s.fl.p2 > 0;
      const movOn = s.X.X02 || s.fl.p3 > 0;

      const LiveD0Badge = ({ x, y, on }: { x: number; y: number; on: boolean }) => (
        <g>
          <rect x={x - 24} y={y + 18} width="48" height="17" rx="3" fill={on ? '#004ac6' : '#e2e8f0'} />
          <text
            x={x}
            y={y + 30}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="ui-monospace, monospace"
            fill={on ? '#ffffff' : '#334155'}
          >
            D0:{d0}
          </text>
        </g>
      );

      return (
        <svg viewBox={`0 0 820 ${h}`} className="w-full min-w-[660px] h-auto block">
          <LadderRails height={h} />
          <RungNum y={54} num="0" />
          <Wire x1={36} y1={54} x2={122} y2={54} on />
          <ContactA x={140} y={54} dev="X00" label="점등 +1" on={s.X.X00} theme="blue" />
          <Wire x1={158} y1={54} x2={278} y2={54} on={s.X.X00} />
          <CompareBox x={342} y={54} expr="< D0 K4" label="" on={lt4} theme="blue" width={128} />
          <LiveD0Badge x={342} y={54} on={lt4} />
          <Wire x1={406} y1={54} x2={598} y2={54} on={incOn} />
          <InstBox x={674} y={54} cmd="INCP D0" label="1스캔 +1" on={incOn} liveText={`D0 = ${d0}`} theme="blue" width={152} />
          <Wire x1={750} y1={54} x2={784} y2={54} on={incOn} />

          <RungNum y={132} num="5" />
          <Wire x1={36} y1={132} x2={122} y2={132} on />
          <ContactA x={140} y={132} dev="X01" label="소등 -1" on={s.X.X01} theme="amber" />
          <Wire x1={158} y1={132} x2={278} y2={132} on={s.X.X01} />
          <CompareBox x={342} y={132} expr="> D0 K0" label="" on={gt0} theme="amber" width={128} />
          <LiveD0Badge x={342} y={132} on={gt0} />
          <Wire x1={406} y1={132} x2={598} y2={132} on={decOn} />
          <InstBox x={674} y={132} cmd="DECP D0" label="1스캔 -1" on={decOn} theme="amber" width={152} />
          <Wire x1={750} y1={132} x2={784} y2={132} on={decOn} />

          <RungNum y={210} num="10" />
          <Wire x1={36} y1={210} x2={122} y2={210} on />
          <ContactA x={140} y={210} dev="X02" label="전체 리셋" on={s.X.X02} theme="red" />
          <Wire x1={158} y1={210} x2={598} y2={210} on={movOn} />
          <InstBox x={674} y={210} cmd="MOV K0 D0" label="0 초기화" on={movOn} theme="red" width={152} />
          <Wire x1={750} y1={210} x2={784} y2={210} on={movOn} />

          <line x1="52" y1="256" x2="770" y2="256" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="4 4" />
          <text x="56" y="272" fontSize="10.5" fontWeight="700" fill="#575e6e">
            ▼ 출력 램프 비교 구간 (D0 값에 따라 순차 누적 점등 — 2진수 암산 불필요)
          </text>

          {[
            { y: 314, step: '13', k: 'K1', dev: 'Y20', lbl: '램프 1', on: s.Y.Y20 },
            { y: 386, step: '16', k: 'K2', dev: 'Y21', lbl: '램프 2', on: s.Y.Y21 },
            { y: 458, step: '19', k: 'K3', dev: 'Y22', lbl: '램프 3', on: s.Y.Y22 },
            { y: 530, step: '22', k: 'K4', dev: 'Y23', lbl: '램프 4', on: s.Y.Y23 },
          ].map((lr) => (
            <g key={lr.dev}>
              <RungNum y={lr.y} num={lr.step} />
              <Wire x1={36} y1={lr.y} x2={132} y2={lr.y} on />
              <CompareBox x={198} y={lr.y} expr={`>= D0 ${lr.k}`} label="" on={lr.on} theme="blue" width={132} />
              <LiveD0Badge x={198} y={lr.y} on={lr.on} />
              <Wire x1={264} y1={lr.y} x2={678} y2={lr.y} on={lr.on} />
              <Coil x={700} y={lr.y} dev={lr.dev} label={lr.lbl} on={lr.on} theme="red" />
              <Wire x1={722} y1={lr.y} x2={784} y2={lr.y} on={lr.on} />
            </g>
          ))}

          <RungNum y={592} num="25" />
          <Wire x1={36} y1={592} x2={630} y2={592} on={false} />
          <rect x="630" y="579" width="88" height="26" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
          <text x="674" y="596" textAnchor="middle" fontSize="11.5" fontWeight="700" fontFamily="ui-monospace, monospace" fill="#0b1c30">
            END
          </text>
          <Wire x1={718} y1={592} x2={784} y2={592} on={false} />
        </svg>
      );
    },
    note: {
      principle: '17번처럼 2진수(K1·K3·K7·K15)를 암산하거나 스캔 순서 트릭을 쓸 필요가 없습니다. 상·하한 가드([< D0 K4], [> D0 K0])로 안전하게 D0를 증감시키고, [>= D0 K1..K4]로 풀어쓰는 것이 현업 표준입니다.',
      analogy: 'count 상태를 0~4로 제한(clamp)하고, UI 컴포넌트에서 count >= 1, count >= 2 로 선언적으로 렌더링하는 것과 같습니다.',
      shortcuts: ['F8 : < D0 K4, INCP D0, >= D0 K1 그대로 입력'],
      field: '램프가 10개로 늘어나도 아래에 [>= D0 K5] 한 줄만 복사하면 끝납니다. 새벽 보전 시 누구나 3초 만에 이해하는 최고의 유지보수 코드입니다.',
      test: ['X00을 꾹 누르고 있어도 INCP 덕분에 D0가 딱 1씩만 올라가고, 4에서 상한 가드로 안전하게 멈추는지 확인하세요.'],
    },
  },
];

export function createFreshSim(idx: number): SimState {
  const c = CIRCUITS[idx];
  const base: SimState = {
    X: { X00: false, X01: false, X02: false, X03: false },
    prevX: { X00: false, X01: false, X02: false, X03: false },
    Y: { Y20: false, Y21: false, Y22: false, Y23: false },
    M: { M0: false, M1: false, M2: false },
    T: {
      T0: { acc: 0, preset: 30, done: false, coil: false },
      T1: { acc: 0, preset: 20, done: false, coil: false },
    },
    C: { C0: { acc: 0, preset: 3, done: false } },
    D: { D0: 0, D1: 0, D2: 0, D3: 0 },
    SM400: true,
    SM402: true,
    SM412: false,
    prevSM412: false,
    clockTick: 0,
    fl: { sm402: 8, p1: 0, p2: 0, p3: 0, p4: 0 },
    shiftPulse: { block: null, branch: null, ticks: 0 },
  };
  if (c && c.initData) {
    base.D = { ...base.D, ...c.initData };
  }
  return base;
}
