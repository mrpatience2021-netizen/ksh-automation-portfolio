// ============================================================================
// /plc 3-Pillar Workspace 통합 데이터 (Lab · Reference · Field Log)
// 추후 Reference 이미지(public/images/ref/)나 Issue Log 현장 사진(public/images/proof/)을
// 추가한 뒤 각 항목의 image / thumbnail 경로만 입력하면 썸네일과 라이트박스가 자동 활성화됩니다.
// ============================================================================

export const PLC_VISUAL_GUIDE_PDF = {
  title: 'MELSEC PLC 핵심 원리 & 현장 실무 시각 교본',
  subtitle: 'Q06UDEH · GX Works2/3 · 5 Pages Visual Reference',
  url: '/docs/melsec-plc-visual-guide.pdf',
  filename: 'melsec-plc-visual-guide.pdf',
} as const;

export interface ReferenceCardItem {
  id: string;
  badge: string;
  title: string;
  lead: string;
  /** public/images/ref/ 에 실제 이미지 파일을 넣고 경로를 입력하면 상단 시각 이미지 + 라이트박스 확대가 자동 표시됩니다. */
  image?: string;
  imageCaption?: string;
  bullets: { label: string; text: string }[];
  callout?: { title: string; body: string; tone: 'blue' | 'amber' | 'purple' };
  tags: string[];
}

export type TopCommandGroupKey =
  | '전체'
  | '1. 비교'
  | '2. 연산·카운트'
  | '3. 데이터 전송'
  | '4. 일괄 리셋'
  | '5. 시프트'
  | '6. 특수모듈';

export interface TopCommandGroupSummary {
  key: Exclude<TopCommandGroupKey, '전체'>;
  commands: string;
  analogy: string;
  fieldUse: string;
}

export interface PlcCommandEntry {
  group: Exclude<TopCommandGroupKey, '전체'>;
  cmd: string;
  full: string;
  syntax: string;
  analogy: string;
  caution: string;
}

export interface BinaryRow {
  k: number;
  bin: string;
  bits: [number, number, number, number];
  formula: string;
  isSingle: boolean;
  isCumulative: boolean;
  isInverter: boolean;
  tags: { text: string; tone: 'slate' | 'blue' | 'emerald' | 'purple' }[];
}

export interface OptimizationGuide {
  num: string;
  title: string;
  standardCmd: string;
  standardReason: string;
  compactCmd: string;
  risk: string;
}

export interface DeviceMapEntry {
  dev: string;
  name: string;
  radix: string;
  range: string;
  tone: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'sky' | 'slate' | 'orange';
  desc: string;
}

export interface CommissioningPhase {
  id: string;
  phase: string;
  title: string;
  items: string[];
}

export interface TroubleshootingItem {
  id: string;
  cat: 'MELSEC PLC' | '인버터' | '협동로봇' | 'ROS 2';
  equip: string;
  symptom: string;
  cause: string;
  action: string;
}

export interface FieldIssueLogItem {
  id: string;
  no: string;
  date: string;
  statusBadge: string;
  equip: string;
  issue: string;
  cause: string;
  fix: string;
  tags: string[];
  /** 추후 현장 사진(예: '/images/proof/plc-issue-01.jpg')을 넣으면 72x48 썸네일 + 라이트박스가 자동 표시됩니다. */
  thumbnail?: string;
}

// ============================================================================
// Pillar 2-1. Reference: PLC 원리 & 구조 (비주얼 퍼스트 카드 3종)
// ============================================================================
export const PLC_REFERENCE_CARDS: ReferenceCardItem[] = [
  {
    id: 'ref-scan-cycle',
    badge: '01 · PLC CORE PRINCIPLE',
    title: 'PLC 동작 원리 — 스캔 타임(Scan Time) & X · Y · M',
    lead: '과거 릴레이 시퀀스(물리 배선·병렬 동시 동작)와 달리 PLC는 Step 0부터 END까지 위→아래 직렬 스캔을 1초에 수백~수천 번 반복하는 초고속 로봇 비서입니다.',
    // image: '/images/ref/plc-scan-cycle.jpg',
    imageCaption: '그림 1. PLC 스캔 타임 3단계 순환 구조 (입력 스캔 X → 순차 연산 → 출력 갱신 Y)',
    bullets: [
      {
        label: '시퀀스(병렬) vs PLC(직렬 스캔)',
        text: '전선을 뜯어고치는 대신 PC 래더 프로그램만 수정해 로직을 즉시 반영하고, F3 모니터로 전류 흐름을 실시간 추적합니다.',
      },
      {
        label: '접점(Read) & 코일(Write) · 3대 디바이스',
        text: 'X(입력: 눈과 귀·센서/버튼) → M(내부 릴레이: 머릿속 메모장·상태 플래그) → Y(출력: 손과 발·모터/MC/밸브).',
      },
      {
        label: '이중 코일(Double Coil) 금지',
        text: '동일 출력(Y20)을 두 줄에 쓰면 위→아래 스캔 특성상 마지막 줄 결과만 살아남으므로 최종 출력 코일은 반드시 1곳만 작성합니다.',
      },
      {
        label: '펄스 명령어(INCP) 필수 이유',
        text: '버튼을 0.5초만 눌러도 PLC는 수백 스캔을 돌므로, 일반 INC 대신 상승 엣지 펄스(P)로 1회만 실행되게 막습니다.',
      },
    ],
    callout: {
      title: '스캔 사이클 3단계 공식',
      body: '① 입력 스캔(X 상태 일괄 읽기) → ② Step 0 ~ END 순차 연산 → ③ 출력 갱신(Y 일괄 쓰기) 무한 반복',
      tone: 'blue',
    },
    tags: ['직렬 스캔 0→END', 'X·Y·M 3대 디바이스', '이중 코일 금지', 'INCP 상승 엣지'],
  },
  {
    id: 'ref-write-verify',
    badge: '02 · ONLINE OPERATION & CS',
    title: '온라인 데이터 조작 & 대조 — Write (Select All) & Verify',
    lead: '현장 시운전과 유지보수(CS)에서 노트북(GX Works2/3)을 설비 CPU에 연결할 때 반드시 지켜야 하는 다운로드·대조 2대 철칙입니다.',
    // image: '/images/ref/plc-write-verify.jpg',
    imageCaption: '그림 2. GX Works ↔ PLC CPU 온라인 데이터 전송(Select All) 및 Verify 대조 흐름',
    bullets: [
      {
        label: 'Write to PLC — Select All 절대 원칙',
        text: '프로그램(코드)만 넣으면 CPU가 I/O 슬롯 지도(파라미터)를 몰라 2501 에러가 뜹니다. 반드시 Parameter + Program 일괄 선택(Select All) 후 CPU 스위치를 RESET → RUN 복귀.',
      },
      {
        label: 'Verify with PLC — 현장 CS 틀린 그림 찾기',
        text: '설비가 평소와 다르게 오동작할 때 [Online] → [Verify with PLC]로 정상 백업본과 현재 CPU 로직을 스텝 단위 비교해 임의 수정 구간을 1초 만에 찾아냅니다.',
      },
      {
        label: '런중 쓰기(Online Edit · Shift+F3)',
        text: '가동 중인 라인을 멈추지 않고 미세 타이머·카운터 값을 수정할 때 Shift+F3 → 수정 → F4(변환) / Shift+F4로 안전 반영합니다.',
      },
    ],
    callout: {
      title: '현장 CS 실수 방지 루틴',
      body: '접속 즉시 원본 PLC Read 백업 → Verify 대조로 변경점 파악 → 수정 후 Select All Write → CPU RESET → RUN 확인',
      tone: 'amber',
    },
    tags: ['Write (Select All)', 'Verify with PLC', 'RESET → RUN', 'Shift+F3 런중 쓰기'],
  },
  {
    id: 'ref-structure-4',
    badge: '03 · PROGRAM ARCHITECTURE & LOGGING',
    title: '실무 프로그램 구조화 4대 개념 & 데이터 로깅 확장',
    lead: '설비 규모가 커져 래더가 수천 줄로 길어질 때, 유지보수성과 협업 효율을 확보하는 현업 표준 4대 구조화 전략과 엑셀 자동 로깅 연계입니다.',
    // image: '/images/ref/plc-structure-4.jpg',
    imageCaption: '그림 3. 대규모 자동화 설비를 위한 PLC 프로그램 구조화 4대 전략 (Label · FB · Multiple Programs · SFC)',
    bullets: [
      {
        label: '1. Global / Local 라벨 (이름표 코딩)',
        text: 'X0·D100 대신 Start_Btn·Motor_Speed처럼 직관적 이름표로 작성하고, 공용(Global)과 파일 전용(Local)을 분리합니다.',
      },
      {
        label: '2. Function Block (FB · 검증된 로직 재사용)',
        text: '동일 모터 10대·실린더 20대를 반복 코딩하지 않고 검증된 1개 블록(FB)을 캡슐화해 입출력 핀만 바꿔 휴먼 에러를 차단합니다.',
      },
      {
        label: '3. Multiple Programs & 4. SFC 순서도',
        text: 'INIT / AUTO / MANUAL / ALARM 목적별 파일 분할과 현재 단계(Step) 로직만 실행하는 SFC로 복잡한 인터록을 단순화합니다.',
      },
      {
        label: '데이터 로깅 — MX Component / MX Sheet',
        text: 'PLC 내부 데이터 레지스터(D)와 알람 비트를 엑셀(Excel)로 실시간 자동 수집해 설비 가동률·장애 트렌드 예방 정비 리포트로 연계합니다.',
      },
    ],
    callout: {
      title: '면접·실무 핵심 포인트',
      body: 'Global/Local 라벨 + Function Block + Multiple Programs + SFC 조합으로 스파게티 래더를 구조화하고, MX Component/MX Sheet로 현장 데이터를 자산으로 축적합니다.',
      tone: 'purple',
    },
    tags: ['Global/Local 라벨', 'Function Block', 'Multiple Programs', 'SFC 순서도', 'MX Component · MX Sheet'],
  },
];

// ============================================================================
// Pillar 2-2. Reference: 현장 빈출 명령어 Top 20 (6대 그룹 압축)
// ============================================================================
export const TOP_COMMAND_GROUPS: TopCommandGroupSummary[] = [
  {
    key: '1. 비교',
    commands: '=, >, >=, <, <=, <>, ZCP',
    analogy: '심판의 저울 (조건 크기 판정)',
    fieldUse: '목표 수량(K100) 도달, 온도·압력 상하한(ZCP) 양품/경보 판정',
  },
  {
    key: '2. 연산·카운트',
    commands: '+P, -P, *P, /P, INC, INCP, DECP',
    analogy: '계산기 & 계수기 (수치 증감)',
    fieldUse: '컨베이어 통과 수량 집계(반드시 INCP), 트레이 좌표 및 불량률 연산',
  },
  {
    key: '3. 데이터 전송',
    commands: 'MOV, BMOV, FMOV, DMOV',
    analogy: '복사·붙여넣기 (1칸 / 묶음 / 도배)',
    fieldUse: '인버터 다단속도(MOV K5 K1Y20), 레시피 복사(BMOV), 0 일괄 채움(FMOV)',
  },
  {
    key: '4. 일괄 리셋',
    commands: 'BKRST, ZRST, RST, SET, PLS, ALTP',
    analogy: '전체 소등 스위치 (비트 일괄 초기화)',
    fieldUse: '비상정지·사이클 종료 시 M0~M20 상태 플래그 일괄 0 초기화',
  },
  {
    key: '5. 시프트',
    commands: 'SFL, SFR, SFTL, SFTR, DECO',
    analogy: '에스컬레이터 이동 (옆 칸으로 밀기)',
    fieldUse: '물류 컨베이어 비전 불량품 위치 추적(트래킹) 후 배출구 정확 배출',
  },
  {
    key: '6. 특수모듈',
    commands: 'FROM, TO, FLT, INT',
    analogy: '옆 부서 쪽지 교환 (가져오기/보내기)',
    fieldUse: '아날로그(온도·압력) 및 서보 위치결정 모듈 버퍼 메모리 읽기/쓰기',
  },
];

export const PLC_TOP_COMMANDS: PlcCommandEntry[] = [
  // 1. 비교
  { group: '1. 비교', cmd: '= <> > >= < <=', full: 'Compare Contact', syntax: '[ >= D0 K100 ]', analogy: 'if (D0 >= 100)', caution: '래더 입력 접점 자리에 바로 배치. 32비트 비교는 앞에 D 붙임(D>=).' },
  { group: '1. 비교', cmd: 'ZCP', full: 'Zone Compare', syntax: 'ZCP K10 K20 D0 M0', analogy: '상·하한 범위 판정', caution: '하한(K10) ≤ 상한(K20) 준수. M0(미만), M1(양품), M2(초과) 3비트 자동 점유.' },
  // 2. 연산·카운트
  { group: '2. 연산·카운트', cmd: '+P / -P', full: 'Add / Subtract (Pulse)', syntax: '+P D0 D1 D2', analogy: 'D2 = D0 + D1', caution: '펄스형(P) 미사용 시 스캔마다 무한 가산되므로 반드시 P 접미사 권장!' },
  { group: '2. 연산·카운트', cmd: '*P / /P', full: 'Multiply / Divide', syntax: '/P D0 K10 D2', analogy: '몫=D2, 나머지=D3', caution: '⚠️ 곱셈(*P) 32비트·나눗셈(/P) 몫/나머지로 D2·D3 연속 2칸 점유! D3 충돌 주의.' },
  { group: '2. 연산·카운트', cmd: 'INC / INCP', full: 'Increment', syntax: 'INCP D0', analogy: 'D0++ (1스캔)', caution: '컨베이어 수량 카운트 시 99% 펄스형 INCP 사용 (수량 폭주 방지).' },
  { group: '2. 연산·카운트', cmd: 'DEC / DECP', full: 'Decrement', syntax: 'DECP D0', analogy: 'D0-- (1스캔)', caution: '0 이하 언더플로우 방지를 위해 앞에 [> D0 K0] 비교 조건 병행.' },
  // 3. 데이터 전송
  { group: '3. 데이터 전송', cmd: 'MOV / MOVP', full: 'Move', syntax: 'MOV K5 K1Y20', analogy: 'D0 = 100 / 다단속도', caution: '16비트 단일 대입. 큰 숫자는 DMOV(32비트 2칸 점유) 사용.' },
  { group: '3. 데이터 전송', cmd: 'BMOV', full: 'Block Move', syntax: 'BMOV D0 D100 K10', analogy: '배열 구간 복사', caution: 'D0~D9(10개)를 D100~D109로 통째 복사. 다품종 레시피 전환에 활용.' },
  { group: '3. 데이터 전송', cmd: 'FMOV', full: 'Fill Move', syntax: 'FMOV K0 D0 K50', analogy: 'Array.fill(0)', caution: '동일 상수를 지정 개수만큼 일괄 도배. 레지스터 구간 초기화에 필수.' },
  // 4. 일괄 리셋
  { group: '4. 일괄 리셋', cmd: 'BKRST', full: 'Block Reset', syntax: 'BKRST M0 K20', analogy: '연속 비트 일괄 OFF', caution: 'Q시리즈 표준 비트 일괄 리셋. 비상정지·사이클 종료 시 M0부터 20개 일괄 OFF.' },
  { group: '4. 일괄 리셋', cmd: 'ZRST', full: 'Zone Reset', syntax: 'ZRST M0 M100', analogy: '구간 일괄 초기화', caution: '시작~끝 구간(M/Y/T/C/D)을 한 방에 OFF/0 리셋. 메모리 맵 충돌 주의.' },
  { group: '4. 일괄 리셋', cmd: 'SET / RST', full: 'Set / Reset', syntax: 'SET Y20 / RST C0', analogy: 'true / false 래치', caution: '알람 래치 및 카운터(C) 초기화. 카운터는 전원이 유지되므로 반드시 RST 필요.' },
  { group: '4. 일괄 리셋', cmd: 'PLS / ALTP', full: 'Pulse / Alternate', syntax: 'PLS M0 / ALTP Y20', analogy: 'onClick / 토글 반전', caution: 'PLS는 상승 엣지 1스캔 펄스, ALTP는 원버튼 ON/OFF 토글(고속 점멸 방지).' },
  // 5. 시프트
  { group: '5. 시프트', cmd: 'SFL / SFR', full: 'Bit Shift Left / Right', syntax: 'SFLP M0 K16', analogy: '에스컬레이터 1칸 이동', caution: '물류 컨베이어 비전 불량품 트래킹. 반드시 펄스형(P)으로 1스캔당 1칸만 이동.' },
  { group: '5. 시프트', cmd: 'SFTL / SFTR', full: 'Shift Left / Right (N-bit)', syntax: 'SFTLP X0 M0 K10 K1', analogy: '입력 포함 비트 시프트', caution: '외부 센서(X0) 상태를 M0~M9 버퍼에 1비트씩 밀어 넣으며 공정 추적.' },
  { group: '5. 시프트', cmd: 'DECO', full: 'Decode', syntax: 'DECO D0 M0 K3', analogy: '숫자 → 비트 분기', caution: 'D0 값(0~7)에 해당하는 번째 비트(M0~M7) 1개만 ON. 보전 추적성 주의.' },
  // 6. 특수모듈
  { group: '6. 특수모듈', cmd: 'FROM', full: 'Read Buffer Memory', syntax: 'FROM H0 K11 D0 K1', analogy: '특수모듈 값 가져오기', caution: '아날로그(온도·압력)나 서보 모듈의 버퍼 메모리 값을 CPU D레지스터로 수신.' },
  { group: '6. 특수모듈', cmd: 'TO', full: 'Write Buffer Memory', syntax: 'TO H0 K0 H0001 K1', analogy: '특수모듈 설정 보내기', caution: 'CPU에서 아날로그 출력·서보 위치결정 모듈 버퍼 메모리로 제어 파라미터 송신.' },
  { group: '6. 특수모듈', cmd: 'FLT / INT', full: 'Float / Integer', syntax: 'FLT D0 D10', analogy: 'parseFloat / trunc', caution: '실수(Float)는 32비트 2칸 점유(D10+D11). 아날로그 센서 단위 스케일링용.' },
];

export const GX_SHORTCUT_GROUPS = [
  {
    group: '래더 편집',
    keys: [
      ['F5 / F6', 'a접점(NO) / b접점(NC) 입력'],
      ['Shift+F5 / F6', '병렬 a접점 / 병렬 b접점 입력'],
      ['F7 / F8', '출력 코일 / 응용명령(MOV, INCP, BKRST 등)'],
      ['Ctrl + F5', '코멘트 표시 ON / OFF 토글'],
    ],
  },
  {
    group: '컴파일 · 모니터 · 시뮬레이터',
    keys: [
      ['F4', '변환(컴파일) — 회색 바탕을 정상 로직으로 확정'],
      ['F2 / F3', '쓰기 모드(로직 수정) / 모니터 모드(파란 전류 확인)'],
      ['Shift + Enter', '시뮬레이션 테스트 시 커서 위치 접점 강제 ON/OFF'],
    ],
  },
  {
    group: '현장 CS 필살기 (런중 쓰기 & 대조)',
    keys: [
      ['Shift+F3 → 수정 → Shift+F4', '런중 쓰기(Online Edit): 설비 무정지 실시간 수정'],
      ['Online → Verify with PLC', 'PC 정상 백업본 vs 설비 CPU 로직 틀린 그림 찾기'],
    ],
  },
];

export const BINARY_TABLE_DATA: BinaryRow[] = Array.from({ length: 16 }, (_, k) => {
  const b3 = (k >> 3) & 1;
  const b2 = (k >> 2) & 1;
  const b1 = (k >> 1) & 1;
  const b0 = k & 1;
  const bin = `${b3}${b2}${b1}${b0}`;
  const weights: string[] = [];
  if (b3) weights.push('8');
  if (b2) weights.push('4');
  if (b1) weights.push('2');
  if (b0) weights.push('1');
  const formula = weights.length ? `${weights.join(' + ')} = ${k}` : '0 (전체 OFF)';

  const isSingle = [1, 2, 4, 8].includes(k);
  const isCumulative = [1, 3, 7, 15].includes(k);
  const isInverter = k >= 1 && k <= 7;

  const tags: BinaryRow['tags'] = [];
  if (k === 0) tags.push({ text: '전체 소등 / 정지', tone: 'slate' });
  if (isSingle) tags.push({ text: '단일 점등 (시프트)', tone: 'blue' });
  if (isCumulative) tags.push({ text: '누적 점등 (게이지)', tone: 'emerald' });
  if (isInverter) tags.push({ text: `인버터 ${k}단`, tone: 'purple' });

  return { k, bin, bits: [b3, b2, b1, b0], formula, isSingle, isCumulative, isInverter, tags };
});

export const OPTIMIZATION_GUIDES: OptimizationGuide[] = [
  {
    num: '1',
    title: '공정 스텝 분기 (D0 숫자에 따라 각 단계 실행)',
    standardCmd: '[= D0 K1] ➔ (M1), [= D0 K2] ➔ (M2) 한 줄씩 비교문 작성',
    standardReason: 'F3 모니터에서 현재 몇 번 스텝이 켜져 있는지 직관적으로 보이고, 추후 중간 공정(예: 15번) 삽입이 매우 쉽습니다.',
    compactCmd: 'DECO D0 M0 K3 (단 4스텝으로 8개 분기 처리)',
    risk: '래더에서 Ctrl+F로 (M3) 코일을 검색해도 나오지 않습니다! DECO가 내부적으로 몰래 켜기 때문에 야간 보전 시 원인 추적이 어렵습니다.',
  },
  {
    num: '2',
    title: '알람 일괄 감지 (16개 알람 중 하나라도 뜨면 부저 ON)',
    standardCmd: 'M100 ~ M115 알람 접점을 병렬(OR)로 나열 ➔ (Y20 부저)',
    standardReason: '부저가 울렸을 때 모니터 화면만 봐도 정확히 몇 번 알람 접점에 파란 불이 들어왔는지 1초 만에 파악됩니다.',
    compactCmd: '[ <> K4M100 K0 ] ➔ (Y20) (16개 비트를 숫자 1개로 묶어 비교)',
    risk: '부저가 울려도 화면엔 숫자(예: 128)만 뜹니다. 게다가 M100~M115 사이에 일반 릴레이를 실수로 끼워 넣으면 부저가 계속 울리는 버그가 터집니다.',
  },
  {
    num: '3',
    title: '구간 초기화 (장비 리셋 시 여러 디바이스 끄기)',
    standardCmd: '끌 대상이 3~5개로 적을 때는 RST M0, RST M1 개별 작성',
    standardReason: '초기화 의도가 명확히 드러나고, 실수로 엉뚱한 메모리를 건드릴 위험이 원천 차단됩니다.',
    compactCmd: 'BKRST M0 K20 / ZRST M0 M100 / FMOV K0 D0 K50',
    risk: '다른 작업자가 일괄 리셋 구간을 모르고 M50에 안전 상태 릴레이를 할당하면, 리셋할 때마다 장비가 꼬입니다. (메모리 맵 엑셀 관리 필수)',
  },
  {
    num: '4',
    title: '펄스 처리 (버튼 1회 클릭 시 1스캔만 실행)',
    standardCmd: '1줄 실행은 명령어 뒤 P(INCP/MOVP), 5줄 이상 동시 실행은 PLS M0 공통 사용',
    standardReason: '"X00을 누르면 아래 5개가 동시에 한 번 도는구나"라고 묶음 단위로 읽혀 유지보수와 스텝 효율을 동시에 잡습니다.',
    compactCmd: 'LDP X00 또는 모든 줄에 각각 P 접미사 부착',
    risk: '단독 1줄인데 굳이 PLS M0 중간 릴레이를 거치면 스텝과 메모리를 낭비하고, 반대로 10줄마다 LDP X00을 중복 쓰면 조건 수정 시 누락 위험이 커집니다.',
  },
];

export const DEVICE_MAP: DeviceMapEntry[] = [
  { dev: 'X', name: '입력 릴레이 (Input)', radix: '16진수 (Hex)', range: 'X00 ~ X0F, X10 ~', tone: 'blue', desc: '스위치·센서 신호 수신(Read-Only). 8·9 다음이 10이 아니라 A·B·C·D·E·F로 진행됨에 주의!' },
  { dev: 'Y', name: '출력 릴레이 (Output)', radix: '16진수 (Hex)', range: 'Y20 ~ Y2F, Y30 ~', tone: 'emerald', desc: '램프·인버터·솔레노이드 구동(Write). Q06UDEH 기본 슬롯 기준 Y20부터 할당.' },
  { dev: 'M', name: '내부 릴레이 (Internal)', radix: '10진수 (Dec)', range: 'M0 ~ M8191', tone: 'purple', desc: 'PLC 내부 가상 스위치(비서의 머릿속 메모장). 자기유지·상태 플래그·HMI 버튼 연동용.' },
  { dev: 'D', name: '데이터 레지스터 (Data)', radix: '10진수 (16/32bit)', range: 'D0 ~ D12287', tone: 'amber', desc: '숫자(속도·온도·스텝·생산량) 저장. 32비트 명령어(DMOV, D+) 사용 시 연속 2칸 점유.' },
  { dev: 'T', name: '타이머 (Timer)', radix: '10진수 (0.1초)', range: 'T0 ~ T2047', tone: 'rose', desc: '설정 시간(K30 = 3.0초) 경과 시 접점 ON. 입력이 끊어지면 자동 0 초기화.' },
  { dev: 'C', name: '카운터 (Counter)', radix: '10진수 (횟수)', range: 'C0 ~ C1023', tone: 'sky', desc: '입력 상승 엣지 횟수 누적. 전원이 유지되는 한 값을 기억하므로 반드시 RST 필요.' },
  { dev: 'SM / SD', name: '특수 릴레이/레지스터', radix: '시스템 예약', range: 'SM400, SM402, SM412', tone: 'slate', desc: 'SM400(상시ON), SM402(RUN 1스캔 초기화), SM412(1초 클럭) 등 내장 시스템 변수.' },
  { dev: 'F', name: '애넌시에이터 (Alarm)', radix: '10진수 (Dec)', range: 'F0 ~ F2047', tone: 'orange', desc: 'HMI(GOT) 화면에 설비 고장/알람 메시지를 띄우기 위한 전용 에러 플래그.' },
];

export const COMMISSIONING_STEPS: CommissioningPhase[] = [
  {
    id: 'p1',
    phase: 'Phase 1',
    title: '전원 투입 전 물리 결선 점검',
    items: [
      '메인 차단기 OFF 상태에서 P24(+)/N24(-) 단락(쇼트) 여부 테스터기 확인',
      '입력 모듈 COM(S/S) 극성이 스위치 전원(P24/N24)과 반대 극성인지 확인',
      '인버터 동력선(R/S/T, U/V/W)과 PLC 24V 신호선 분리 배선 확인',
    ],
  },
  {
    id: 'p2',
    phase: 'Phase 2',
    title: '원본 백업 & 프로젝트 파라미터',
    items: [
      '기존 설비 작업 시 반드시 PLC Read로 원본 프로그램·파라미터 백업 완료',
      'GX Works2/3 CPU 기종(Q06UDEH) 및 I/O 할당(X00~, Y20~) 일치 확인',
      'F4(컴파일/변환) 에러·경고 0건 및 이중 코일 미사용 확인',
    ],
  },
  {
    id: 'p3',
    phase: 'Phase 3',
    title: 'PLC 다운로드 & CPU RUN 복귀',
    items: [
      'Online → Write to PLC 시 [Select All]로 파라미터+프로그램 일괄 전송',
      '전송 완료 후 CPU 토글 스위치 [RESET] → [RUN] 순서로 에러 클리어',
      'CPU 전면 RUN LED 녹색 점등 및 ERR LED 소등 확인',
    ],
  },
  {
    id: 'p4',
    phase: 'Phase 4',
    title: 'I/O 입출력 개별 강제 검증 (F3)',
    items: [
      '현장 스위치·센서 동작 시 PLC 입력 모듈 물리 LED 및 F3 화면 ON 일치 확인',
      '비상정지(EMG) 버튼 누를 때 b접점 차단 및 출력 즉시 정지 확인',
      '인버터 Pr.79(EXT/혼합) 설정 및 정회전(STF) 시 모터 회전 방향 확인',
    ],
  },
  {
    id: 'p5',
    phase: 'Phase 5',
    title: '무부하 시운전 & 런중 수정 마감',
    items: [
      '저속 JOG 운전으로 기구부 간섭 및 리미트 센서 정상 감지 확인',
      '미세 타이머·카운터 수정 시 런중 쓰기(Shift+F3 → 수정 → Shift+F4) 적용',
      '최종 수정본 PC 저장 및 디바이스 코멘트·버전 날짜 기록 완료',
    ],
  },
];

export const PLC_GOLDEN_RULES: [string, string][] = [
  ['1. 코일은 항상 우측에 배치', '입력/조건(접점)은 좌측, 실행 결과(코일·응용명령)는 우측 모선 앞에 둡니다.'],
  ['2. 제어 신호의 흐름은 좌→우, 상→하', 'PLC는 위에서 아래로, 왼쪽에서 오른쪽으로 순차 스캔(Scan)합니다.'],
  ['3. 이중 코일(Double Coil) 절대 금지', '동일 출력(예: Y20)을 두 줄 이상 쓰면 마지막 줄 결과만 살아남아 오작동합니다.'],
  ['4. 정/역회전·양방향 인터록 필수', 'STF/STR, 전진/후진처럼 충돌 위험이 있는 출력은 반드시 서로의 b접점을 겁니다.'],
  ['5. Auto / Manual 역류 차단', '자동·수동 모드를 겸할 때 조건이 섞이지 않도록 모드 선택 접점으로 완벽 분리합니다.'],
  ['6. 대전류 부하는 구동부 분리', 'PLC 출력 릴레이에 모터를 직결하지 않고, 중간 릴레이·전자접촉기(MC)·인버터를 거칩니다.'],
  ['7. 스캔 사이클과 펄스(P) 이해', '연산/카운트/통신 트리거는 반드시 상승 엣지(P)를 붙여 1스캔만 실행되게 합니다.'],
];

// ============================================================================
// Pillar 3. Field Log: 트러블슈팅 DB · AI 정밀 진단 프롬프트 · 시운전 Issue Log
// ============================================================================
export const TROUBLESHOOTING_DB: TroubleshootingItem[] = [
  {
    id: 'ts1',
    cat: 'MELSEC PLC',
    equip: 'Q06UDEH',
    symptom: "CPU ERR LED 점등 · 코드 2501 (CAN'T EXE. PRG.)",
    cause: '파라미터 실행 목록에 MAIN 누락 또는 I/O 슬롯 설정 불일치',
    action: 'Write 시 [Select All]로 파라미터+프로그램 일괄 다운로드 → CPU 스위치 [RESET]→[RUN] 복귀',
  },
  {
    id: 'ts2',
    cat: 'MELSEC PLC',
    equip: 'QX40 / QX80',
    symptom: '현장 스위치를 눌러도 입력(X) LED 미점등',
    cause: 'S/S(COM) 단자 결선 누락 또는 스위치와 동일 극성 연결(전위차 0V)',
    action: '테스터기로 DC 24V 전위차 확인. 싱크/소스 규칙에 따라 S/S와 스위치 전원을 반대 극성 결선',
  },
  {
    id: 'ts3',
    cat: 'MELSEC PLC',
    equip: 'GX Works2/3',
    symptom: '특정 출력(Y)이 간헐적 미동작 또는 무시됨',
    cause: '동일 출력 주소 이중 코일(Double Coil) 작성으로 하단 스캔에 덮어쓰기',
    action: 'Ctrl+F로 해당 출력 코일 중복 검색 후 내부 릴레이(M)로 분기하여 최종 출력은 1곳만 유지',
  },
  {
    id: 'ts4',
    cat: '인버터',
    equip: 'FR-E700',
    symptom: 'PLC Y20 파란 불(F3)은 켜졌으나 모터 무반응 (0.0Hz)',
    cause: '인버터 운전 모드(PU/EXT) 불일치 또는 Pr.79 파라미터 미설정',
    action: 'Pr.79를 2(EXT 전용) 또는 3(혼합)으로 설정 후 STF-SD 드라이 컨택 도통 확인',
  },
  {
    id: 'ts5',
    cat: '협동로봇',
    equip: 'Brills Cobot',
    symptom: '직선 이동(moveL) 중 특이점(Singularity) 알람 정지',
    cause: '직선 보간 경로상 손목 축 정렬 또는 최대 작업 반경 도달',
    action: '장거리·경유 이동은 moveJ로 전환하고, 픽업 직전 80mm 짧은 구간만 pose_trans + moveL 적용',
  },
  {
    id: 'ts6',
    cat: 'ROS 2',
    equip: 'Jazzy / Humble',
    symptom: '현장 간헐적 주행 오류 재현 불가 및 디스크 용량 폭주',
    cause: 'ros2 bag record -a 전체 녹화로 대용량 이미지·포인트클라우드 누적',
    action: '필수 4대 토픽(/tf, /tf_static, /odom, /joint_states)만 선별 녹화 후 RViz2 백 파일 재생',
  },
];

export const AI_DIAGNOSIS_PROMPT = `[현장 트러블슈팅 정밀 진단 요청]
1. 장비 구성: Mitsubishi MELSEC Q06UDEH (GX Works2) + FREQROL-E700 인버터 (STF/STR 드라이 컨택 제어)
2. 현재 증상: PLC F3 모니터상 Y20(정회전) 출력 정상 점등되나 모터가 회전하지 않으며 인버터 주파수 0.0Hz 유지.
3. 1차 점검 완료 항목:
   - [완료] GX Works2 F3 모니터 Y20 통전 및 PLC 출력 모듈 물리 LED 점등 확인
   - [완료] 인버터 단자대 STF-SD 및 PLC COM 배선 체결 상태 이상 없음
   - [완료] 인버터 Pr.79 = 2 (EXT 전용) 설정 확인
4. 미확인 항목: 다단속도(RH/RM/RL) 주파수 파라미터(Pr.4~6) 설정 여부 및 E700 알람 이력
5. 요청 사항: 위 상태에서 추가로 의심할 수 있는 파라미터 충돌, 배선/전원 이슈, 테스터기로 찍어볼 포인트를 우선순위 3가지로 짧고 명확하게 제시해 줘.`;

export const FIELD_ISSUE_LOGS: FieldIssueLogItem[] = [
  {
    id: 'issue-01',
    no: '#01',
    date: '2026.11',
    statusBadge: '2026.11 · 검증 완료',
    equip: 'Q06UDEH ↔ Brills Cobot',
    issue: '로봇 1회 적재 완료 시 PLC 생산 수량(D0)이 15~20개씩 폭주',
    cause: '로봇 DO_0 신호가 300ms 유지되는 동안 일반 a접점 + INC 명령이 매 스캔 실행됨',
    fix: '상승 엣지(LDP X00) 및 펄스형 명령어(INCP D0)로 수정. 50회 연속 가동 시 오차 0건 검증 완료.',
    tags: ['LDP X00', 'INCP D0', '스캔 폭주 해결'],
    // thumbnail: '/images/proof/plc-issue-01.jpg',
  },
  {
    id: 'issue-02',
    no: '#02',
    date: '2026.11',
    statusBadge: '2026.11 · 검증 완료',
    equip: 'FR-E700 + DC24V 근접 센서',
    issue: '인버터 기동 순간 컨베이어 정위치 근접 센서 오감지 발생',
    cause: '인버터 3상 동력선과 DC 24V 센서 신호선을 동일 덕트에 혼촉 배선하여 PWM 노이즈 유입',
    fix: '동력선·신호선 20cm 이상 분리 배선 및 실드선 제어반(PLC) 측 편단(1점) 접지 적용 후 완전 소멸.',
    tags: ['PWM 노이즈', '20cm 이격', '실드 편단 접지'],
    // thumbnail: '/images/proof/plc-issue-02.jpg',
  },
  {
    id: 'issue-03',
    no: '#03',
    date: '2026.11',
    statusBadge: '2026.11 · 검증 완료',
    equip: 'Brills 6-Axis Cobot',
    issue: '픽업 구역에서 적재 트레이 이동 중 로봇 특이점 알람 정지',
    cause: '장거리 수평 구간을 moveL(직선 보간)로 지령하여 5축 관절 정렬 특이점 진입',
    fix: '상공 경유 구간을 moveJ로 전환하고 픽업·적재 직전 80mm 구간만 pose_trans + moveL로 분리 안정화.',
    tags: ['MoveJ / MoveL', 'pose_trans', '특이점 회피'],
    // thumbnail: '/images/proof/plc-issue-03.jpg',
  },
];
