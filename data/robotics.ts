export interface IoHandshakeRow {
  dir: 'PLC → 로봇' | '로봇 → PLC';
  plc: string;
  robot: string;
  name: string;
  signalType: 'Control' | 'Safety' | 'Recipe' | 'Feedback' | 'Alarm';
  desc: string;
}

export interface Ros2LabModule {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  keyTopics: string[];
  details: string[];
}

export interface RoboticsNote {
  id: string;
  category: '협동로봇 기구학' | 'PLC 연동·안전' | 'ROS 2 아키텍처' | '현장 진단';
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

export const IO_HANDSHAKE_DATA: IoHandshakeRow[] = [
  {
    dir: 'PLC → 로봇',
    plc: 'Y20',
    robot: 'DI_0',
    name: '작업 시작 (Start)',
    signalType: 'Control',
    desc: '컨베이어 정위치 감지 및 인터록 정상 시 ON. 로봇 Busy 회신 시 OFF.',
  },
  {
    dir: 'PLC → 로봇',
    plc: 'Y21',
    robot: 'DI_1',
    name: '비상 정지 (EMG)',
    signalType: 'Safety',
    desc: 'b접점(Fail-Safe) 결선 필수. 단선 또는 차단 시 로봇 모션 즉시 정지.',
  },
  {
    dir: 'PLC → 로봇',
    plc: 'Y22',
    robot: 'DI_2',
    name: '레시피 선택 (Recipe)',
    signalType: 'Recipe',
    desc: '품종 A(OFF) / 품종 B(ON) 분기. 다품종 시 2진수 조합(K1Y22) 확장.',
  },
  {
    dir: 'PLC → 로봇',
    plc: 'Y23',
    robot: 'DI_3',
    name: '완료 확인 (Ack)',
    signalType: 'Control',
    desc: 'PLC가 로봇 완료 신호(X00)를 정상 수신했음을 통보(누락 방지).',
  },
  {
    dir: '로봇 → PLC',
    plc: 'X00',
    robot: 'DO_0',
    name: '작업 완료 (Done)',
    signalType: 'Feedback',
    desc: '1사이클 종료 시 ON. 최소 300ms 유지 또는 PLC Ack 수신 후 OFF.',
  },
  {
    dir: '로봇 → PLC',
    plc: 'X01',
    robot: 'DO_1',
    name: '동작 중 (Busy)',
    signalType: 'Feedback',
    desc: '로봇 구동 중 ON 유지. PLC가 컨베이어 중복 투입을 막는 인터록으로 사용.',
  },
  {
    dir: '로봇 → PLC',
    plc: 'X02',
    robot: 'DO_2',
    name: '로봇 알람 (Alarm)',
    signalType: 'Alarm',
    desc: '충돌 감지·특이점·리미트 초과 시 ON. PLC 상위 라인 정지 및 경광등 점등.',
  },
];

export const BRILLS_LUA_SNIPPET = `-- [Brills Cobot Standard Handshake Loop] Pick & Place 표준 골격
local P_HOME  = {0, 90, 90, 90, -90, 0}       -- 안전 대기 자세 (관절각)
local P_PICK  = {450, 120, 180, 180, 0, 0}    -- 픽업 목표 좌표 (TCP)
local P_PLACE = {450, 220, 180, 180, 0, 0}    -- 적재 목표 좌표 (TCP)

moveJ(P_HOME, 40, 40)
set_do(0, 0); set_do(1, 0)                    -- Done / Busy 초기화

::MAIN_LOOP::
  if get_di(1) == 0 then                      -- DI_1(EMG b접점) 차단 감지
    set_do(2, 1); sleep(0.1)                  -- PLC로 알람 회신 후 루프 대기
    goto MAIN_LOOP
  end

  if get_di(0) == 1 then                      -- PLC 작업 시작(Y20) 수신
    set_do(1, 1)                              -- Busy ON (컨베이어 인터록)
    moveJ(pose_trans(P_PICK, {0,0,80,0,0,0}), 50, 50)   -- 상공 접근(특이점 회피)
    moveL(P_PICK, 20, 20)                               -- 수직 직선 하강(LIN)
    gripper_close(); sleep(0.3)
    moveL(pose_trans(P_PICK, {0,0,80,0,0,0}), 30, 30)   -- 수직 상승
    moveJ(pose_trans(P_PLACE, {0,0,80,0,0,0}), 50, 50)  -- 적재 상공 이동
    moveL(P_PLACE, 20, 20)                              -- 수직 하강 적재
    gripper_open(); sleep(0.3)
    moveJ(P_HOME, 50, 50)

    set_do(1, 0)                              -- Busy OFF
    set_do(0, 1)                              -- 작업 완료(Done) 송신
    wait_di(3, 1, 3.0)                        -- PLC Ack(DI_3) 최대 3초 대기
    set_do(0, 0)                              -- 핸드셰이크 종료
  end
  sleep(0.05)                                 -- CPU 점유율 보호
goto MAIN_LOOP`;

export const ROS2_LAB_MODULES: Ros2LabModule[] = [
  {
    id: 'urdf-tf2',
    badge: 'MODULE 01 · MODELING',
    title: 'URDF / Xacro & TF2 좌표계 트리',
    subtitle: 'REP-105 표준 좌표 프레임 브로드캐스팅 및 조인트 트리 검증',
    keyTopics: ['map → odom → base_link → tool0', 'robot_state_publisher', 'view_frames'],
    details: [
      '차동구동 AMR 및 6축 협동로봇 링크·조인트 구조를 Xacro 매크로로 모듈화',
      'Static TF(센서 장착 오프셋)와 Dynamic TF(관절 엔코더) 분리 검증',
      'RViz2에서 TCP(Tool Center Point) 기준축 X(적)/Y(녹)/Z(청) 실시간 정렬 확인',
    ],
  },
  {
    id: 'ik-fsm',
    badge: 'MODULE 02 · MOTION & FSM',
    title: 'IK · 특이점 회피 5단계 Pick & Place',
    subtitle: 'MoveJ(관절 보간) + MoveL(직선 보간) 하이브리드 궤적과 장애물 우회 FSM',
    keyTopics: ['1.Home → 2.Approach', '3.Linear Pick → 4.Retract', '5.Place & Ack'],
    details: [
      '역기구학(IK) 다중 해 중 관절 변위가 최소화되는 안전 자세 선택',
      '장거리 경유는 MoveJ로 특이점(5축 정렬)을 원천 회피, 픽업/적재 80mm 구간만 pose_trans + MoveL 적용',
      '상태 머신(FSM) 기반 각 단계 진입 조건·타임아웃·EMG 인터록 분리 설계',
    ],
  },
  {
    id: 'rosbag2',
    badge: 'MODULE 03 · FIELD DIAGNOSTICS',
    title: 'Rosbag2 4대 필수 토픽 현장 오류 재현',
    subtitle: '디스크 폭주를 막는 선별 녹화 전략과 오프라인 RViz2 100% 재현',
    keyTopics: ['/tf', '/tf_static', '/odom', '/joint_states'],
    details: [
      'ros2 bag record -a 대신 필수 4대 경량 토픽만 선별 녹화해 장시간 현장 주행에도 디스크 안정성 유지',
      '간헐적 충돌·추종 오차 발생 시 시뮬레이션 PC에서 백 파일 0.5x 슬로우 재생 분석',
      'PLC 시운전 로그와 타임스탬프 대조해 기구/제어 원인 교차 검증',
    ],
  },
];

// 추후 로보틱스 학습 노트를 여기에 자유롭게 추가하세요.
export const ROBOTICS_CONCEPT_NOTES: RoboticsNote[] = [
  {
    id: 'rn-1',
    category: '협동로봇 기구학',
    title: 'MoveJ(PTP) vs MoveL(LIN) 선택 기준과 특이점 회피 공식',
    summary:
      'MoveJ는 각 관절이 동시에 목표각으로 회전하므로 빠르고 특이점이 없지만 궤적이 곡선입니다. MoveL은 TCP가 직선으로 이동하지만 5축이 0°에 가까워지면 자코비안 행렬식이 0에 수렴하며 관절 속도가 폭주(Singularity)합니다.',
    takeaway: '장거리 이동은 무조건 MoveJ, 워크피스 수직 접근·이탈(±80mm) 구간만 pose_trans + MoveL 조합 사용.',
    updatedAt: '2026.11',
  },
  {
    id: 'rn-2',
    category: 'PLC 연동·안전',
    title: '2-Way I/O 핸드셰이크에서 Ack(확인) 신호가 필수인 이유',
    summary:
      '로봇이 작업 완료(DO_0)를 짧게 쏘고 끝나면 PLC 스캔 타이밍이나 통신 노이즈로 누락될 수 있고, 너무 길게 유지하면 다음 사이클이 중복 트리거됩니다.',
    takeaway: '로봇 Done ON → PLC LDP 수신 후 Ack(Y23) 회신 → 로봇 Done OFF(최대 3초 타임아웃) 4단계 악수 구조 표준화.',
    updatedAt: '2026.11',
  },
  {
    id: 'rn-3',
    category: 'PLC 연동·안전',
    title: 'EMG(비상정지) b접점(NC) Fail-Safe 배선 원칙',
    summary:
      '비상정지 라인을 a접점(NO)으로 구성하면 현장 케이블이 단선되어도 로봇이 정상 상태로 오인합니다. 평상시 DC 24V가 흐르는 b접점(get_di(1) == 1 정상, 0 차단)으로 설계해야 단선 즉시 정지합니다.',
    takeaway: '하드웨어 안전 릴레이 차단 + Lua 루프 내 get_di(1) == 0 이중 감시로 안전 계층 확보.',
    updatedAt: '2026.11',
  },
  {
    id: 'rn-4',
    category: 'ROS 2 아키텍처',
    title: 'Topic · Service · Action 통신 패턴 선택 가이드',
    summary:
      '연속 센서 스트림(/joint_states, /odom)은 비동기 Topic, 즉시 응답 설정/트리거는 동기 Service, 모션 실행처럼 시간이 걸리고 중간 피드백·취소가 필요한 작업은 Action을 사용합니다.',
    takeaway: '협동로봇 Pick & Place 지령은 진행률 피드백과 비상 취소가 가능한 Action 서버 구조가 정석.',
    updatedAt: '2026.11',
  },
  {
    id: 'rn-5',
    category: '현장 진단',
    title: 'TCP(Tool Center Point) 4점 캘리브레이션 정밀도 확보',
    summary:
      '그리퍼 끝단 오프셋(Z축 길이 및 무게중심 페이로드)이 부정확하면 회전(Rx/Ry/Rz) 시 끝단이 틀어지며 픽업 위치 편차가 누적됩니다.',
    takeaway: '툴 교체 후 반드시 4점 티칭으로 TCP 오차 ±0.2mm 이내 검증 및 페이로드(kg) 재입력.',
    updatedAt: '2026.11',
  },
];

// 추후 WSL2 / ROS 2 CLI 명령어를 여기에 추가하세요.
export const ROS2_CLI_CHEATSHEET: CliCheatItem[] = [
  {
    id: 'cli-1',
    group: 'ROS 2 기본 & 노드',
    command: 'source /opt/ros/jazzy/setup.bash && source ~/ros2_ws/install/setup.bash',
    purpose: 'ROS 2 환경 및 워크스페이스 오버레이 활성화',
    tip: '~/.bashrc 하단에 등록해 터미널 실행 시 자동 로드',
  },
  {
    id: 'cli-2',
    group: 'ROS 2 기본 & 노드',
    command: 'colcon build --symlink-install --packages-select my_robot_pkg',
    purpose: '특정 패키지 빠른 증분 빌드 (Python 수정 시 재빌드 최소화)',
  },
  {
    id: 'cli-3',
    group: 'ROS 2 기본 & 노드',
    command: 'ros2 topic list -t && ros2 topic hz /joint_states',
    purpose: '활성 토픽 메시지 타입 확인 및 발행 주기(Hz) 실시간 진단',
  },
  {
    id: 'cli-4',
    group: 'TF2 & URDF 검증',
    command: 'ros2 run tf2_tools view_frames',
    purpose: '전체 TF2 좌표계 트리 PDF 생성 (끊어진 프레임 즉시 탐색)',
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
    purpose: 'Xacro 변환 및 URDF 링크/조인트 구문 오류 사전 검증',
  },
  {
    id: 'cli-7',
    group: 'Rosbag2 현장 녹화',
    command: 'ros2 bag record -o field_diag /tf /tf_static /odom /joint_states',
    purpose: '현장 오류 재현용 필수 4대 경량 토픽 선별 녹화',
    tip: '-a(전체 녹화)는 카메라 이미지로 디스크가 폭주하므로 금지!',
  },
  {
    id: 'cli-8',
    group: 'Rosbag2 현장 녹화',
    command: 'ros2 bag play field_diag --rate 0.5 --loop',
    purpose: '녹화된 현장 오류 구간을 0.5배속 반복 재생하며 RViz2 정밀 분석',
  },
  {
    id: 'cli-9',
    group: 'WSL2 · Linux 환경',
    command: 'export ROS_DOMAIN_ID=42 && export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp',
    purpose: '실습실/현장 멀티 로봇 간 DDS 도메인 격리 및 통신 안정화',
  },
  {
    id: 'cli-10',
    group: 'WSL2 · Linux 환경',
    command: 'wsl --list --verbose',
    purpose: 'Windows PowerShell에서 WSL2 배포판 상태 및 버전 확인',
  },
];
