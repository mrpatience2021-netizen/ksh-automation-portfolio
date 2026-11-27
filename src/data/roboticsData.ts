import type { PdfDocConfig } from '@/components/workspace/WorkspaceMedia';

export interface IoHandshakeRow {
  dir: 'PLC → 로봇' | '로봇 → PLC';
  plc: string;
  robot: string;
  name: string;
  signalType: 'Control' | 'Safety' | 'Recipe' | 'Feedback' | 'Alarm';
  desc: string;
  simKey: 'Y20' | 'Y21' | 'Y22' | 'Y23' | 'X00' | 'X01' | 'X02';
}

export interface LuaScriptEntry {
  id: string;
  filename: string;
  badge: string;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
  code: string;
}

export interface RoboticsConceptCard {
  id: string;
  stepNo: string;
  badge: string;
  title: string;
  analogyTitle: string;
  analogy: string;
  points: string[];
  takeaway: string;
  tags: string[];
  /** 추후 public/images/ref/ 에 도식 이미지를 넣고 경로를 지정하면 자동 표시됩니다. */
  image?: string;
  imageCaption?: string;
}

export interface RoboticsQuickNote {
  id: string;
  category: 'PLC 연동·안전' | 'ROS 2 아키텍처' | '현장 진단';
  title: string;
  summary: string;
  takeaway: string;
  updatedAt: string;
}

export interface CliCheatItem {
  id: string;
  group: 'ROS 2 기본 & 노드' | 'TF2 & URDF 검증' | 'Rosbag2 현장 녹화' | 'WSL2 · Linux 환경';
  command: string;
  purpose: string;
  tip?: string;
}

export interface TeachingCaseStudy {
  id: string;
  date: string;
  status: string;
  category: string;
  title: string;
  symptom: string;
  rootCause: string;
  solution: string;
  resultMetric: string;
  tags: string[];
  /** 추후 public/images/robotics/ 에 현장 사진·티칭 캡처를 추가하고 경로를 연결하세요. */
  thumbnail?: string;
  thumbnailCaption?: string;
}

export interface RobotAlarmEntry {
  id: string;
  code: string;
  category: '기구학 · 특이점' | '안전 · I/O' | 'ROS 2 · Rosbag2' | '그리퍼 · TCP';
  symptom: string;
  cause: string;
  action: string;
  prevention: string;
}

/**
 * 추후 public/docs/ 에 로보틱스 시각 교본 PDF를 추가한 뒤 url을 채우면
 * Reference 상단 바에 '[📄 로보틱스 교본 PDF 보기]' 버튼과 모달 뷰어가 자동 활성화됩니다.
 */
export const ROBOTICS_VISUAL_GUIDE_PDF: PdfDocConfig = {
  title: '브릴스 협동로봇 & ROS 2 핵심 실무 교본',
  subtitle: 'I/O Handshake · Lua Control · URDF/TF2 · Rosbag2 Diagnostics',
  // url: '/docs/brills-robotics-visual-guide.pdf',
  url: '',
  filename: 'brills-robotics-visual-guide.pdf',
};

// ============================================================================
// PILLAR 1: LAB — PLC ↔ 로봇 7신호 표준 I/O 핸드셰이크 매핑표
// ============================================================================
export const IO_HANDSHAKE_DATA: IoHandshakeRow[] = [
  {
    dir: 'PLC → 로봇',
    plc: 'Y20',
    robot: 'DI_0',
    name: '작업 시작 (Start)',
    signalType: 'Control',
    desc: '컨베이어 정위치 감지 및 인터록 정상 시 ON. 로봇 Busy(X01) 회신 수신 시 OFF.',
    simKey: 'Y20',
  },
  {
    dir: 'PLC → 로봇',
    plc: 'Y21',
    robot: 'DI_1',
    name: '비상 정지 (EMG b접점)',
    signalType: 'Safety',
    desc: 'b접점(NC · Fail-Safe) 결선 필수. 평상시 24V ON, 단선 또는 차단(0) 시 즉시 정지.',
    simKey: 'Y21',
  },
  {
    dir: 'PLC → 로봇',
    plc: 'Y22',
    robot: 'DI_2',
    name: '레시피 선택 (Recipe)',
    signalType: 'Recipe',
    desc: '품종 A(OFF) / 품종 B(ON) 분기. 다품종 라인에서는 2진수 조합(K1Y22)으로 확장.',
    simKey: 'Y22',
  },
  {
    dir: 'PLC → 로봇',
    plc: 'Y23',
    robot: 'DI_3',
    name: '완료 확인 (Ack)',
    signalType: 'Control',
    desc: 'PLC가 로봇 완료 신호(X00/DO_0)를 정상 수신했음을 통보해 사이클 누락·중복 방지.',
    simKey: 'Y23',
  },
  {
    dir: '로봇 → PLC',
    plc: 'X00',
    robot: 'DO_0',
    name: '작업 완료 (Done)',
    signalType: 'Feedback',
    desc: '1사이클 종료 시 ON. PLC Ack(Y23) 수신 또는 최소 300ms~3초 타임아웃 확인 후 OFF.',
    simKey: 'X00',
  },
  {
    dir: '로봇 → PLC',
    plc: 'X01',
    robot: 'DO_1',
    name: '동작 중 (Busy)',
    signalType: 'Feedback',
    desc: '로봇 구동 중 ON 유지. PLC가 컨베이어 중복 투입을 막는 인터록 접점으로 사용.',
    simKey: 'X01',
  },
  {
    dir: '로봇 → PLC',
    plc: 'X02',
    robot: 'DO_2',
    name: '로봇 알람 (Alarm)',
    signalType: 'Alarm',
    desc: 'EMG 차단·충돌 감지·특이점·조인트 리미트 초과 시 ON. 상위 라인 정지 및 경광등 점등.',
    simKey: 'X02',
  },
];

// ============================================================================
// PILLAR 1: LAB — 브릴스 Lua 제어 스크립트 아카이브 (카드 추가 확장형)
// ============================================================================
export const LUA_SCRIPT_ARCHIVE: LuaScriptEntry[] = [
  {
    id: 'brills-main-loop',
    filename: 'brills_handshake_loop.lua',
    badge: 'STANDARD LOOP · VERIFIED',
    title: '::MAIN_LOOP:: Pick & Place + PLC 2-Way 핸드셰이크 표준 루프',
    date: '2026.11',
    summary:
      'EMG b접점 상시 감시, 장거리 moveJ + 수직 80mm pose_trans/moveL 특이점 회피, wait_di(3, 1, 3.0) Ack 타임아웃까지 포함한 현장 표준 골격입니다.',
    highlights: [
      'get_di(1) == 0 b접점 비상정지 최우선 인터록',
      'pose_trans(P_PICK, {0,0,80,0,0,0}) 상공 접근 오프셋',
      'wait_di(3, 1, 3.0) PLC 완료 확인(Ack) 타임아웃 보호',
    ],
    code: `-- [Brills Cobot Standard Handshake Loop] Pick & Place 표준 골격
local P_HOME  = {0, 90, 90, 90, -90, 0}       -- 안전 대기 자세 (관절각)
local P_PICK  = {450, 120, 180, 180, 0, 0}    -- 픽업 목표 좌표 (TCP)
local P_PLACE = {450, 220, 180, 180, 0, 0}    -- 적재 목표 좌표 (TCP)

moveJ(P_HOME, 40, 40)
set_do(0, 0); set_do(1, 0); set_do(2, 0)      -- Done / Busy / Alarm 초기화

::MAIN_LOOP::
  if get_di(1) == 0 then                      -- DI_1(EMG b접점) 차단 감지
    set_do(1, 0); set_do(0, 0)                -- Busy / Done 즉시 해제
    set_do(2, 1); sleep(0.1)                  -- PLC로 알람(X02) 회신 후 대기
    goto MAIN_LOOP
  end
  set_do(2, 0)                                -- 정상 복귀 시 알람 해제

  if get_di(0) == 1 then                      -- PLC 작업 시작(Y20) 수신
    set_do(1, 1)                              -- Busy ON (컨베이어 인터록)
    moveJ(pose_trans(P_PICK, {0,0,80,0,0,0}), 50, 50)   -- 상공 접근(특이점 회피)
    moveL(P_PICK, 20, 20)                               -- 수직 직선 하강(LIN)
    gripper_close(); sleep(0.3)
    moveL(pose_trans(P_PICK, {0,0,80,0,0,0}), 30, 30)   -- 수직 상승
    moveJ(pose_trans(P_PLACE, {0,0,80,0,0,0}), 50, 50)  -- 적재 상공 이동
    moveL(P_PLACE, 20, 20)                              -- 수직 하강 적재
    gripper_open(); sleep(0.3)
    moveL(pose_trans(P_PLACE, {0,0,80,0,0,0}), 30, 30)  -- 수직 이탈
    moveJ(P_HOME, 50, 50)

    set_do(1, 0)                              -- Busy OFF
    set_do(0, 1)                              -- 작업 완료(Done · X00) 송신
    wait_di(3, 1, 3.0)                        -- PLC Ack(DI_3 · Y23) 최대 3초 대기
    set_do(0, 0)                              -- 핸드셰이크 정상 종료
  end
  sleep(0.05)                                 -- CPU 점유율 보호 (50ms)
goto MAIN_LOOP`,
  },
  {
    id: 'brills-recipe-branch',
    filename: 'brills_recipe_branch.lua',
    badge: 'EXTENSION TEMPLATE',
    title: 'DI_2(Y22) 품종 레시피 분기 & 3×2 팔레타이징 오프셋 서브루틴',
    date: '2026.11',
    summary:
      'PLC 레시피 신호(Y22/DI_2)에 따라 품종 A/B 적재 좌표와 그리퍼 폭을 분기하고, 행·열 루프 인덱스로 pose_trans 오프셋을 자동 계산하는 확장 템플릿입니다.',
    highlights: [
      'get_di(2) 품종 A(0) / 품종 B(1) 분기 로직',
      '기준점 1점 티칭 + pose_trans 격자 오프셋 계산',
      '사이클 완료 후 인덱스 자동 초기화',
    ],
    code: `-- [Brills Extension] DI_2 레시피 분기 + 격자 적재 오프셋 계산
local P_BASE_A = {420, 200, 180, 180, 0, 0}   -- 품종 A 기준 적재점
local P_BASE_B = {420, -180, 180, 180, 0, 0}  -- 품종 B 기준 적재점
local PITCH_X, PITCH_Y = 65, 65               -- 트레이 셀 간격 (mm)

local function calc_slot_pose(base_pose, idx)
  local col = idx % 3                         -- 0, 1, 2 (3열)
  local row = math.floor(idx / 3) % 2         -- 0, 1    (2행)
  return pose_trans(base_pose, {col * PITCH_X, row * PITCH_Y, 0, 0, 0, 0})
end

local function select_target(slot_idx)
  if get_di(2) == 1 then                      -- Y22 ON: 품종 B 선택
    return calc_slot_pose(P_BASE_B, slot_idx)
  else                                        -- Y22 OFF: 품종 A 선택
    return calc_slot_pose(P_BASE_A, slot_idx)
  end
end`,
  },
];

// ============================================================================
// PILLAR 2: REFERENCE — 비전공자 눈높이 핵심 개념 노트 4대 카드
// ============================================================================
export const ROBOTICS_CONCEPT_CARDS: RoboticsConceptCard[] = [
  {
    id: 'fk-ik-singularity',
    stepNo: 'CONCEPT 01',
    badge: 'KINEMATICS · SINGULARITY',
    title: 'FK vs IK & 특이점(Singularity) 회피',
    analogyTitle: '쉬운 비유: 어깨·팔꿈치 각도 → 손끝 위치(FK) vs 컵 잡기 위해 관절 꺾기(IK)',
    analogy:
      '정기구학(FK)은 "어깨 30°·팔꿈치 60° 굽히면 손끝이 어디 있지?"를 계산하는 단답 문제이고, 역기구학(IK)은 "저 컵을 잡으려면 6개 관절을 몇 도로 꺾어야 하지?"를 역산하는 다중 해 문제입니다.',
    points: [
      '역기구학(IK)은 같은 손끝 좌표(TCP)에도 여러 관절 조합(Elbow Up/Down 등)이 존재해 경로 연속성이 핵심입니다.',
      '손목 5축이 0°로 일직선 정렬되면 자코비안 행렬식이 0에 수렴해 4·6축이 순간 폭주하는 특이점(Singularity) 알람이 발생합니다.',
      '현장 해법: 5축 각도가 0°를 관통하지 않도록 툴 진입각을 ±10° 기울이거나 경유 구간을 MoveJ로 분리합니다.',
    ],
    takeaway: 'IK 해가 꼬이는 장거리 직선 주행을 피하고, 5축 일직선 정렬 구간을 구조적으로 회피하는 것이 무정지 티칭의 핵심.',
    tags: ['Forward Kinematics', 'Inverse Kinematics', '5축 특이점 회피', 'Jacobian'],
    // image: '/images/ref/robotics-fk-ik.jpg',
    imageCaption: '6축 협동로봇 FK/IK 구조 및 5축 특이점 구간 도식',
  },
  {
    id: 'movej-movel-posetrans',
    stepNo: 'CONCEPT 02',
    badge: 'MOTION INTERPOLATION',
    title: '관절 보간 moveJ(PTP) vs 직선 보간 moveL(LIN) & pose_trans',
    analogyTitle: '쉬운 비유: 고속도로 장거리 이동(moveJ) + 주차장 수직 진입(moveL)',
    analogy:
      'moveJ는 6개 관절이 각자 편한 속도로 동시에 목표각에 도달하는 고속도로 이동(곡선 궤적·특이점 없음)이고, moveL은 좁은 지그 안으로 수직 꽂아 넣는 주차장 직선 진입입니다.',
    points: [
      'moveJ(PTP): 관절 공간 보간으로 속도가 빠르고 특이점이 전혀 없으나, TCP 궤적이 미세한 호(Arc)를 그립니다.',
      'moveL(LIN): 직교 공간 직선 보간으로 핀 삽입·픽업 정밀도가 필수인 ±80mm 구간에만 제한적으로 사용합니다.',
      'pose_trans(P_TARGET, {0,0,80,0,0,0}): 기준점 1곳만 정밀 티칭하면 상공 접근·이탈 좌표를 상대 오프셋으로 자동 산출해 티칭 유지보수를 절반 이하로 줄입니다.',
    ],
    takeaway: '공식: "장거리 이동은 무조건 moveJ → 워크피스 상공 ±80mm 수직 접근/이탈만 pose_trans + moveL".',
    tags: ['moveJ (PTP)', 'moveL (LIN)', 'pose_trans 80mm', '하이브리드 궤적'],
    // image: '/images/ref/robotics-movej-movel.jpg',
    imageCaption: 'MoveJ 장거리 경유와 MoveL 80mm 수직 접근 하이브리드 궤적 비교',
  },
  {
    id: 'urdf-xacro-tf2',
    stepNo: 'CONCEPT 03',
    badge: 'ROS 2 MODELING · TF2',
    title: 'URDF · Xacro 모델링 & TF2 좌표계 트리',
    analogyTitle: '쉬운 비유: 로봇 뼈대 설계도(URDF)와 실시간 관절 GPS 족보(TF2)',
    analogy:
      'URDF/Xacro가 로봇의 뼈(Link)와 관절(Joint)을 정의한 설계도라면, TF2는 공장 바닥(map)부터 로봇 팔 끝단(tool0)까지 모든 좌표계의 상대 위치를 밀리초 단위로 추적하는 GPS 족보입니다.',
    points: [
      'REP-105 표준 트리: map → odom → base_link → link_1..6 → tool0 체인이 단 하나라도 끊어지면 경로 계획이 실패합니다.',
      'Xacro 매크로로 반복되는 링크·관성·충돌체(Collision) 정의를 변수화해 유지보수성을 확보합니다.',
      'Static TF(카메라·센서 고정 브래킷)와 Dynamic TF(엔코더 관절각)를 분리 발행하고 view_frames·tf2_echo로 검증합니다.',
    ],
    takeaway: 'RViz2에서 좌표축(X적/Y녹/Z청)이 틀어지거나 끊어지면 코드보다 먼저 ros2 run tf2_tools view_frames로 족보부터 확인.',
    tags: ['URDF / Xacro', 'TF2 Tree', 'REP-105', 'robot_state_publisher'],
    // image: '/images/ref/robotics-tf2-tree.jpg',
    imageCaption: 'ROS 2 REP-105 표준 TF2 좌표계 계층 구조',
  },
  {
    id: 'pick-place-fsm',
    stepNo: 'CONCEPT 04',
    badge: 'STATE MACHINE · FSM',
    title: '5단계 Pick & Place 상태머신(FSM)',
    analogyTitle: '쉬운 비유: 순서를 건너뛰지 않는 공정 체크리스트',
    analogy:
      '단순 delay 나열 코드가 눈 감고 춤추기라면, FSM은 "상공 도착 확인 → 하강 → 그립 센서 확인 → 상승 → 적재 → PLC Ack 확인"처럼 조건을 통과해야 다음 단계로 넘어가는 안전 체인입니다.',
    points: [
      '1. IDLE/HOME(PLC Start & EMG b접점 감시) → 2. APPROACH(moveJ 80mm 상공 진입) → 3. PICK(moveL 수직 하강·그립·상승).',
      '4. PLACE(moveJ 적재 상공 → moveL 하강·언그립·이탈) → 5. DONE & ACK(Busy OFF, Done ON → PLC Y23 Ack 3초 대기).',
      '모든 상태 진입 전 EMG b접점(get_di(1) == 0)과 타임아웃 예외를 공통 인터록으로 감싸 현장 오동작을 원천 차단합니다.',
    ],
    takeaway: '상태(State)와 전이 조건(Guard)을 분리해 두면 현장 트러블슈팅 시 어느 단계에서 멈췄는지 10초 안에 특정 가능.',
    tags: ['5-Step FSM', 'Guard Interlock', 'Ack Timeout', 'Fail-Safe'],
    // image: '/images/ref/robotics-fsm-5step.jpg',
    imageCaption: '5단계 협동로봇 Pick & Place 상태전이도(FSM)',
  },
];

export const ROBOTICS_QUICK_NOTES: RoboticsQuickNote[] = [
  {
    id: 'rn-ack',
    category: 'PLC 연동·안전',
    title: '2-Way I/O 핸드셰이크에서 Ack(확인) 신호가 필수인 이유',
    summary:
      '로봇이 완료(DO_0)를 짧게 쏘면 PLC 스캔 타이밍에 누락될 수 있고, 길게 유지하면 다음 사이클이 중복 트리거됩니다.',
    takeaway: 'Done ON → PLC LDP 수신 → Ack(Y23) 회신 → Done OFF (최대 3초 타임아웃) 4단계 악수 표준화.',
    updatedAt: '2026.11',
  },
  {
    id: 'rn-emg',
    category: 'PLC 연동·안전',
    title: 'EMG(비상정지) b접점(NC) Fail-Safe 배선 원칙',
    summary:
      'a접점(NO) 구성 시 케이블 단선을 정상으로 오인합니다. 평상시 24V가 흐르는 b접점(get_di(1) == 1 정상, 0 차단)으로 설계해야 단선 즉시 정지합니다.',
    takeaway: '하드웨어 안전 릴레이 차단 + Lua 루프 내 get_di(1) == 0 이중 감시 계층 적용.',
    updatedAt: '2026.11',
  },
  {
    id: 'rn-comm',
    category: 'ROS 2 아키텍처',
    title: 'Topic · Service · Action 통신 패턴 선택 가이드',
    summary:
      '연속 스트림(/joint_states)은 Topic, 단발 설정은 Service, 진행 피드백·비상 취소가 필요한 모션 지령은 Action을 사용합니다.',
    takeaway: '협동로봇 Pick & Place 작업 지령은 중간 피드백과 Cancel이 가능한 Action 서버 구조가 정석.',
    updatedAt: '2026.11',
  },
  {
    id: 'rn-tcp',
    category: '현장 진단',
    title: 'TCP(Tool Center Point) 4점 캘리브레이션 & 페이로드 검증',
    summary:
      '그리퍼 끝단 오프셋(Z 길이)과 페이로드(kg)가 부정확하면 자세 회전(Rx/Ry/Rz) 시 끝단이 틀어지고 충돌 알람이 오작동합니다.',
    takeaway: '툴 교체 후 4점 티칭으로 TCP 오차 ±0.2mm 이내 검증 및 그리퍼+워크피스 총 중량 입력.',
    updatedAt: '2026.11',
  },
];

// ============================================================================
// PILLAR 2: REFERENCE — WSL2 · ROS 2 CLI 치트시트
// ============================================================================
export const ROS2_CLI_GROUPS = [
  '전체',
  'ROS 2 기본 & 노드',
  'TF2 & URDF 검증',
  'Rosbag2 현장 녹화',
  'WSL2 · Linux 환경',
] as const;

export const ROS2_CLI_CHEATSHEET: CliCheatItem[] = [
  {
    id: 'cli-1',
    group: 'ROS 2 기본 & 노드',
    command: 'source /opt/ros/jazzy/setup.bash && source ~/ros2_ws/install/setup.bash',
    purpose: 'ROS 2(Jazzy/Humble) 베이스 및 로컬 워크스페이스 오버레이 활성화',
    tip: '~/.bashrc 하단에 등록해 새 터미널마다 자동 로드',
  },
  {
    id: 'cli-2',
    group: 'ROS 2 기본 & 노드',
    command: 'colcon build --symlink-install --packages-select my_robot_pkg',
    purpose: '지정 패키지 빠른 증분 빌드 (Python 스크립트 수정 시 재빌드 생략)',
  },
  {
    id: 'cli-3',
    group: 'ROS 2 기본 & 노드',
    command: 'ros2 node list && ros2 topic list -t && ros2 topic hz /joint_states',
    purpose: '활성 노드·토픽 메시지 타입 확인 및 관절 상태 발행 주기(Hz) 진단',
  },
  {
    id: 'cli-4',
    group: 'TF2 & URDF 검증',
    command: 'ros2 run tf2_tools view_frames',
    purpose: '전체 TF2 좌표계 트리 PDF 생성 (끊어진 프레임·지연 브로드캐스터 즉시 탐색)',
  },
  {
    id: 'cli-5',
    group: 'TF2 & URDF 검증',
    command: 'ros2 run tf2_ros tf2_echo base_link tool0',
    purpose: '로봇 베이스 대비 TCP(tool0) 실시간 XYZ · 쿼터니언 좌표 조회',
  },
  {
    id: 'cli-6',
    group: 'TF2 & URDF 검증',
    command: 'check_urdf <(xacro robot.urdf.xacro)',
    purpose: 'Xacro 매크로 변환 및 URDF 링크·조인트 트리 구문 오류 사전 검증',
  },
  {
    id: 'cli-7',
    group: 'Rosbag2 현장 녹화',
    command: 'ros2 bag record -o field_diag /tf /tf_static /odom /joint_states',
    purpose: '현장 오류 재현용 필수 4대 경량 토픽 선별 녹화',
    tip: '-a(전체 녹화)는 카메라 이미지로 디스크가 폭주하므로 현장 금지!',
  },
  {
    id: 'cli-8',
    group: 'Rosbag2 현장 녹화',
    command: 'ros2 bag play field_diag --rate 0.5 --loop',
    purpose: '녹화된 현장 오류 구간을 RViz2에서 0.5배속 반복 재생하며 정밀 분석',
    tip: 'RViz2 Fixed Frame을 base_link 또는 map으로 맞추고 재생',
  },
  {
    id: 'cli-9',
    group: 'WSL2 · Linux 환경',
    command: 'export ROS_DOMAIN_ID=42 && export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp',
    purpose: '실습실·현장 멀티 로봇 간 DDS 도메인 격리 및 통신 안정화',
  },
  {
    id: 'cli-10',
    group: 'WSL2 · Linux 환경',
    command: 'wsl --list --verbose',
    purpose: 'Windows PowerShell에서 Ubuntu WSL2 배포판 실행 상태 및 버전 확인',
  },
];

// ============================================================================
// PILLAR 3: FIELD LOG — 브릴스 티칭 케이스 스터디 & Rosbag2/알람 로그
// ============================================================================
export const TEACHING_CASE_STUDIES: TeachingCaseStudy[] = [
  {
    id: 'tc-singularity-80mm',
    date: '2026.11',
    status: '실습 검증',
    category: '브릴스 6축 · 모션 궤적',
    title: '장거리 moveL 특이점 알람 → moveJ + pose_trans 80mm 분리 해결',
    symptom:
      '컨베이어 픽업 지점에서 적재 트레이까지 단일 moveL 직선 이동 중 5축이 0° 부근을 통과하며 관절 속도 급증 및 특이점(Singularity) 알람 정지 발생.',
    rootCause:
      '긴 직선 구간 전체를 직교 보간(moveL)으로 강제하면서 4·6축이 동축 정렬되는 손목 특이 영역을 정면으로 관통함.',
    solution:
      '경유 구간을 관절 보간(moveJ)으로 전환하고, 픽업·적재 직전/직후 수직 80mm 구간만 pose_trans(P_TARGET, {0,0,80,0,0,0}) + moveL(20, 20)로 분리.',
    resultMetric: '연속 100사이클 특이점 알람 0건 · 사이클 타임 18% 단축',
    tags: ['moveJ / moveL 분리', 'pose_trans 80mm', '5축 특이점 회피'],
    // thumbnail: '/images/robotics/case-singularity.jpg',
    thumbnailCaption: 'MoveJ 상공 경유 및 80mm 수직 진입 경로 티칭 검증',
  },
  {
    id: 'tc-tcp-calibration',
    date: '2026.11',
    status: '실습 검증',
    category: '그리퍼 · TCP 정밀도',
    title: '그리퍼 핑거 교체 후 회전 픽업 편차 → 4점 TCP 캘리브레이션 보정',
    symptom:
      '그리퍼 핑거를 장축형으로 교체한 뒤 0° 픽업은 정상이나 90° 회전(Rz) 적재 시 워크피스 중심이 약 3.5mm 틀어지며 지그 간섭 발생.',
    rootCause:
      '컨트롤러에 이전 숏 핑거 기준 Z축 오프셋과 페이로드 무게중심(CoG)이 그대로 남아 회전 중심점이 실제 끝단과 불일치.',
    solution:
      '기준 핀 1점을 서로 다른 4가지 툴 자세로 접촉시키는 4점 TCP 캘리브레이션 재수행 및 그리퍼+워크피스 총 페이로드(kg) 재등록.',
    resultMetric: '회전 적재 편차 3.5mm → ±0.2mm 이내 수렴',
    tags: ['TCP 4점 보정', '페이로드 CoG', '지그 간섭 제거'],
    // thumbnail: '/images/robotics/case-tcp-4pt.jpg',
    thumbnailCaption: '4점 TCP 캘리브레이션 및 툴 좌표축 검증',
  },
  {
    id: 'tc-handshake-ack',
    date: '2026.11',
    status: '표준화 완료',
    category: 'PLC ↔ 로봇 I/O 연동',
    title: '완료 신호(DO_0) 누락·중복 투입 → 4단계 Done/Ack + 3초 타임아웃 적용',
    symptom:
      '로봇 완료 펄스(DO_0)를 고정 0.2초로 송출 시 PLC 통신 부하 구간에서 간헐적 신호 누락이 발생하고, 반대로 2초 유지 시 다음 사이클이 중복 기동됨.',
    rootCause:
      '단방향 타이머 기반 펄스 송출 방식이라 PLC 수신 완료 여부를 로봇이 확인할 수 없었음.',
    solution:
      '로봇 Done(DO_0) ON 유지 → PLC LDP 수신 및 Ack(Y23/DI_3) 회신 → Lua wait_di(3, 1, 3.0) 확인 즉시 Done OFF하는 2-Way 4단계 핸드셰이크 표준화.',
    resultMetric: '신호 누락 및 컨베이어 중복 투입 0건 달성',
    tags: ['2-Way Handshake', 'wait_di 3.0s', 'Busy 인터록'],
  },
];

export const ROSBAG_FEATURED_CASE = {
  date: '2026.11',
  status: '진단 표준화',
  title: 'ros2 bag record -a 디스크 폭주 이슈 → 필수 4대 경량 토픽 선별 녹화',
  problem:
    '현장 간헐적 충돌 분석을 위해 전체 토픽 녹화(-a)를 실행하자 카메라 raw 이미지(/camera/image_raw)와 포인트클라우드가 분당 수 GB씩 쌓이며 디스크 용량 고갈 및 제어 루프 지연 발생.',
  solution:
    '모션·자세·좌표 재현에 필수적인 4대 경량 토픽만 선별 녹화하고, 시뮬레이션 PC의 RViz2에서 0.5배속 루프 재생으로 충돌 직전 관절각·TF 이탈을 오프라인 100% 재현.',
  essentialTopics: ['/tf', '/tf_static', '/odom', '/joint_states'],
  command: 'ros2 bag record -o field_diag /tf /tf_static /odom /joint_states',
  replayCommand: 'ros2 bag play field_diag --rate 0.5 --loop',
  metric: '녹화 용량 95%+ 절감 · 장시간 무중단 현장 로깅 확보',
};

export const ROBOT_ALARM_DB: RobotAlarmEntry[] = [
  {
    id: 'al-1',
    code: 'ALM-SING-05',
    category: '기구학 · 특이점',
    symptom: 'moveL 직선 이동 중 급격한 손목 회전 및 Singularity 알람 정지',
    cause: '5축 관절각이 0° 근처를 통과하며 자코비안 역행렬 발산',
    action: '장거리 이동을 moveJ로 교체하고, 접근 80mm 구간만 pose_trans + moveL 적용',
    prevention: '티칭 완료 후 시뮬레이션/저속(20%) 드라이런으로 5축 각도 ±15° 이상 유지 확인',
  },
  {
    id: 'al-2',
    code: 'ALM-EMG-NC',
    category: '안전 · I/O',
    symptom: '비상정지 버튼을 누르지 않았는데 DI_1(EMG) 차단 알람 발생',
    cause: 'b접점(NC) 라인 단선, 안전 릴레이 접점 접촉 불량 또는 PLC Y21 출력 미인가',
    action: '멀티미터로 DI_1 단자 DC 24V 도통 확인 및 PLC Y21 상시 정상 출력 인터록 점검',
    prevention: 'EMG 배선 압착 터미널 이중 점검 및 HMI에 DI_1 실시간 상태 램프 표시',
  },
  {
    id: 'al-3',
    code: 'ALM-COL-TORQ',
    category: '그리퍼 · TCP',
    symptom: '빈 공간 고속 가감속 중 외력 충돌 감지(Collision Detection) 오알람',
    cause: '그리퍼+워크피스 실제 질량 또는 무게중심(CoG)이 설정값보다 무거워 토크 추정 오차 발생',
    action: '실측 페이로드(kg) 및 CoG 오프셋 재입력, 가감속 파라미터(acc) 10~20% 완화',
    prevention: '툴링 변경 체크리스트에 TCP 4점 보정 + 페이로드 실측 항목 필수화',
  },
  {
    id: 'al-4',
    code: 'ALM-ACK-TOUT',
    category: '안전 · I/O',
    symptom: '로봇이 작업 완료(DO_0) 후 다음 사이클로 넘어가지 않고 3초 대기 멈춤',
    cause: 'PLC 측에서 X00(Done) 수신 후 Y23(Ack) 회신 래더 누락 또는 배선 COM 불일치',
    action: 'GX Works2 F3 모니터로 X00 ON 여부 및 Y23 출력 조건 확인, 타임아웃 알람 분기 추가',
    prevention: '시운전 시 강제 I/O 테스트로 7개 핸드셰이크 신호 1:1 도통 사전 검증',
  },
  {
    id: 'al-5',
    code: 'ROS-TF-GAP',
    category: 'ROS 2 · Rosbag2',
    symptom: 'RViz2에서 로봇 모델이 원점에 겹치거나 TF Lookup Exception 발생',
    cause: 'robot_state_publisher 미실행, Static TF 누락, 또는 WSL2/네트워크 간 시스템 시계 불일치',
    action: 'ros2 run tf2_tools view_frames로 끊어진 부모-자식 링크 확인 후 런치 순서 보정',
    prevention: 'Rosbag2 재생 시 --clock 옵션 및 use_sim_time:=true 파라미터 통일',
  },
];
