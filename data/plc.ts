export interface PlcInstruction {
  cat: '이동/초기화' | '사칙연산/증감' | '비교/판정' | '시프트/변환' | '펄스/비트';
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

export interface FieldIssueLog {
  no: string;
  date?: string;
  issue: string;
  cause: string;
  fix: string;
}

export const PLC_INSTRUCTIONS: PlcInstruction[] = [
  { cat: '이동/초기화', cmd: 'MOV', full: 'Move', syntax: 'MOV K100 D0', analogy: 'D0 = 100', caution: '16비트 단일 대입. 큰 숫자는 DMOV(32비트 2칸 점유) 사용.' },
  { cat: '이동/초기화', cmd: 'BMOV', full: 'Block Move', syntax: 'BMOV D0 D100 K10', analogy: '배열 구간 복사', caution: 'D0~D9(10개)를 D100~D109로 통째 복사. 레시피 전환에 활용.' },
  { cat: '이동/초기화', cmd: 'FMOV', full: 'Fill Move', syntax: 'FMOV K0 D0 K50', analogy: 'Array.fill(0)', caution: '동일한 상수를 지정 개수만큼 일괄 채움. 초기화 시 매우 유용.' },
  { cat: '이동/초기화', cmd: 'ZRST', full: 'Zone Reset', syntax: 'ZRST M0 M100', analogy: '구간 일괄 초기화', caution: '시작~끝 구간(M/Y/T/C/D)을 한 방에 OFF/0 리셋. 원점복귀 필수.' },
  { cat: '사칙연산/증감', cmd: '+ (ADD)', full: 'Addition', syntax: '+P D0 D1 D2', analogy: 'D2 = D0 + D1', caution: '펄스형(+P) 미사용 시 스캔마다 무한 가산됨 주의!' },
  { cat: '사칙연산/증감', cmd: '- (SUB)', full: 'Subtraction', syntax: '-P D0 D1 D2', analogy: 'D2 = D0 - D1', caution: '목표치 - 현재치 잔여 수량 계산. 음수 발생 가능(부호 있는 정수).' },
  { cat: '사칙연산/증감', cmd: '* (MUL)', full: 'Multiplication', syntax: '*P D0 K10 D2', analogy: 'D2 = D0 * 10', caution: '⚠️ 결과값이 D2와 D3 연속 2칸(32비트)을 자동 점유함! D3 충돌 주의.' },
  { cat: '사칙연산/증감', cmd: '/ (DIV)', full: 'Division', syntax: '/P D0 K10 D2', analogy: '몫=D2, 나머지=D3', caution: '⚠️ D2에 몫, D3에 나머지가 자동 저장됨! 0으로 나누기(K0) 에러 주의.' },
  { cat: '사칙연산/증감', cmd: 'INC', full: 'Increment', syntax: 'INCP D0', analogy: 'D0++', caution: '거의 99% 뒤에 P(펄스)를 붙여 INCP로 사용.' },
  { cat: '사칙연산/증감', cmd: 'DEC', full: 'Decrement', syntax: 'DECP D0', analogy: 'D0--', caution: '0 이하 언더플로우 방지를 위해 앞에 [> D0 K0] 비교 조건 병행.' },
  { cat: '비교/판정', cmd: '= <> > >= < <=', full: 'Compare Contact', syntax: '[ >= D0 K100 ]', analogy: 'if (D0 >= 100)', caution: '래더 입력 접점 자리에 바로 배치. 32비트 비교는 앞에 D 붙임(D>=).' },
  { cat: '비교/판정', cmd: 'ZCP', full: 'Zone Compare', syntax: 'ZCP K10 K20 D0 M0', analogy: '상·하한 범위 판정', caution: '하한(K10) ≤ 상한(K20) 순서 준수. M0(미만), M1(범위내), M2(초과) 3비트 점유.' },
  { cat: '시프트/변환', cmd: 'SFTL / SFTR', full: 'Shift Left / Right', syntax: 'SFTL X0 M0 K10 K1', analogy: '비트 시프트 (<< / >>)', caution: '컨베이어 위 불량품 위치 추적(트래킹) 시 펄스형(SFTLP)으로 1칸씩 이동.' },
  { cat: '시프트/변환', cmd: 'DECO', full: 'Decode', syntax: 'DECO D0 M0 K3', analogy: '숫자 → 비트 분기', caution: 'D0 값(0~7)에 해당하는 번째 비트(M0~M7) 1개만 ON.' },
  { cat: '시프트/변환', cmd: 'FLT / INT', full: 'Float / Integer', syntax: 'FLT D0 D10', analogy: 'parseFloat / trunc', caution: '실수(Float)는 32비트 2칸 점유(D10+D11). 아날로그 센서 스케일링용.' },
  { cat: '펄스/비트', cmd: 'SET / RST', full: 'Set / Reset', syntax: 'SET Y20 / RST Y20', analogy: 'Y20 = true / false', caution: '자기유지 대신 상태 래치. 카운터(C)는 반드시 RST로 초기화 필요.' },
  { cat: '펄스/비트', cmd: 'PLS / PLF', full: 'Pulse Rising / Falling', syntax: 'PLS M0', analogy: 'onClick (1-Scan)', caution: '상승(PLS) 또는 하강(PLF) 엣지에서 딱 1스캔만 M0 ON.' },
  { cat: '펄스/비트', cmd: 'ALT', full: 'Alternate', syntax: 'ALTP Y20', analogy: 'Y20 = !Y20 (토글)', caution: '원버튼 ON/OFF 반전. 반드시 펄스형(ALTP)으로 사용해야 고속 점멸 방지.' },
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
    compactCmd: 'ZRST M0 M100 / FMOV K0 D0 K50 (3~4스텝 일괄 초기화)',
    risk: '다른 작업자가 ZRST 구간을 모르고 M50에 안전 상태 릴레이를 할당하면, 리셋할 때마다 장비가 꼬입니다. (사용 시 메모리 맵 엑셀 관리 필수)',
  },
  {
    num: '4',
    title: '펄스 처리 (버튼 1회 클릭 시 1스캔만 실행)',
    standardCmd: '1줄 실행은 명령어 뒤 P(INCP/MOVP), 5줄 이상 동시 실행은 PLS M0 공통 사용',
    standardReason: '"X00을 누르면 아래 5개가 동시에 한 번 도는구나"라고 묶음 단위로 읽혀 유지보수와 스텝 효율을 동시에 잡습니다.',
    compactCmd: 'LDP X00 또는 모든 줄에 각각 P 접미사 부착',
    risk: '단독 1줄인데 굳이 PLS M0 중간 릴레이를 거치면 스텝과 메모리를 낭비하고, 반대로 10줄마다 LDP X00을 중복 쓰면 조건 수정 시 누락 위험이 커집니다.',
  },
  {
    num: '5',
    title: '원버튼 토글 (버튼 하나로 ON/OFF 반전)',
    standardCmd: '실제 현장 설비는 안전을 위해 시작(X00)과 정지(X01) 물리 버튼 분리',
    standardReason: '작업자가 현재 상태를 착각해 버튼을 눌렀을 때 장비가 의도치 않게 기동되는 안전사고를 예방합니다.',
    compactCmd: '램프 테스트 등 토글이 꼭 필요할 때는 ALTP Y20 (단 3스텝)',
    risk: '복잡한 플립플롭 자기유지 회로(10스텝 이상)보다 ALTP가 훨씬 직관적이고 가볍지만, 반드시 펄스형(P)을 붙여야 고속 점멸을 막을 수 있습니다.',
  },
];

export const DEVICE_MAP: DeviceMapEntry[] = [
  { dev: 'X', name: '입력 릴레이 (Input)', radix: '16진수 (Hex)', range: 'X00 ~ X0F, X10 ~', tone: 'blue', desc: '스위치·센서 신호 수신(Read-Only). 8·9 다음이 10이 아니라 A·B·C·D·E·F로 진행됨에 주의!' },
  { dev: 'Y', name: '출력 릴레이 (Output)', radix: '16진수 (Hex)', range: 'Y20 ~ Y2F, Y30 ~', tone: 'emerald', desc: '램프·인버터·솔레노이드 구동(Write). Q06UDEH 기본 슬롯 기준 Y20부터 할당.' },
  { dev: 'M', name: '내부 릴레이 (Internal)', radix: '10진수 (Dec)', range: 'M0 ~ M8191', tone: 'purple', desc: 'PLC 내부 가상 스위치(React의 useState). 자기유지·상태 플래그·HMI 버튼 연동용.' },
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

export const GX_SHORTCUT_GROUPS = [
  {
    group: '래더 편집',
    keys: [
      ['F5 / F6', 'a접점(NO) / b접점(NC) 입력'],
      ['Shift+F5 / F6', '병렬 a접점 / 병렬 b접점 입력'],
      ['F7 / F8', '출력 코일 / 응용명령(MOV, SET 등)'],
      ['Ctrl + F5', '코멘트 표시 ON / OFF 토글'],
    ],
  },
  {
    group: '컴파일 · 모니터 · 시뮬레이터',
    keys: [
      ['F4', '컴파일(변환) — 쓰기 전 필수!'],
      ['F3 / F2', '모니터 모드(파란 흐름) / 쓰기 모드'],
      ['Shift + Enter', '시뮬레이터에서 접점 강제 ON/OFF'],
    ],
  },
  {
    group: '현장 필살기 (런중 쓰기 & 환경설정)',
    keys: [
      ['Shift+F3 → 수정 → Shift+F4', '장비 가동 중 온라인 수정(모니터 중 쓰기)'],
      ['Tool → Options → Ladder → Comment', '래더 코멘트 박스 행×열 크기 조절'],
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

// 추후 현장 트러블슈팅 사례가 생기면 아래 배열에 객체만 추가하세요.
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

export const COMMISSIONING_LOGS: FieldIssueLog[] = [
  {
    no: '#01',
    date: '2026.11',
    issue: '로봇 1회 적재 완료 시 PLC 생산 수량(D0)이 15~20개씩 폭주',
    cause: '로봇 DO_0 신호가 300ms 유지되는 동안 일반 a접점 + INC 명령이 매 스캔 실행됨',
    fix: '상승 엣지(LDP X00) 및 펄스형 명령어(INCP D0)로 수정. 50회 연속 가동 시 오차 0건 검증 완료.',
  },
  {
    no: '#02',
    date: '2026.11',
    issue: '인버터 기동 순간 컨베이어 정위치 근접 센서 오감지 발생',
    cause: '인버터 3상 동력선과 DC 24V 센서 신호선을 동일 덕트에 혼촉 배선하여 PWM 노이즈 유입',
    fix: '동력선·신호선 20cm 이상 분리 배선 및 실드선 제어반(PLC) 측 편단(1점) 접지 적용 후 완전 소멸.',
  },
  {
    no: '#03',
    date: '2026.11',
    issue: '픽업 구역에서 적재 트레이 이동 중 로봇 특이점 알람 정지',
    cause: '장거리 수평 구간을 moveL(직선 보간)로 지령하여 5축 관절 정렬 특이점 진입',
    fix: '상공 경유 구간을 moveJ로 전환하고 픽업·적재 직전 80mm 구간만 pose_trans + moveL로 분리 안정화.',
  },
];
