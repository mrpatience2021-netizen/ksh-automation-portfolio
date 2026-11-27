export interface ProofItem {
  title: string;
  subtitle?: string;
  /** 추후 public/images/proof/ 에 캡처 이미지를 넣고 경로(예: '/images/proof/sample.jpg')만 추가하면 72x48 썸네일과 라이트박스가 자동 활성화됩니다. */
  thumbnail?: string;
  href?: string;
  external?: boolean;
}

export interface SectorLink {
  label: string;
  href: string;
}

export interface HrProfileInfo {
  nameKr: string;
  nameEn: string;
  photoSrc: string;
  positioning: string;
  location: string;
  phone: string;
  email: string;
  experienceTotal: string;
  metrics: {
    id: string;
    value: string;
    label: string;
    sublabel: string;
  }[];
}

export type SpecIconKey =
  | 'graduation'
  | 'cpu'
  | 'terminal'
  | 'languages'
  | 'globe'
  | 'badgeCheck'
  | 'bookOpen'
  | 'trophy';

export interface SpecDetailLine {
  title: string;
  meta?: string;
  desc?: string;
}

export interface SpecTileItem {
  id: string;
  icon: SpecIconKey;
  title: string;
  keyword: string;
  /** 메인(/)의 3대 시그니처 표면 톤 계승: dark(#213145) | blue(#dce9ff) | lavender(#e9ddff) | silver(#eff4ff) */
  surface: 'dark' | 'blue' | 'lavender' | 'silver';
  modalSubtitle: string;
  details: SpecDetailLine[];
  tags: string[];
  proofs?: ProofItem[];
  sectorLinks?: SectorLink[];
}

export type CareerFilterKey = 'all' | 'automation' | 'global';

export interface CareerTimelineItem {
  id: string;
  period: string;
  title: string;
  org: string;
  track: 'automation' | 'global';
  trackLabel: string;
  summary: string;
  highlights: string[];
  tags: string[];
  /** 증빙 항목이 비어 있거나 생략되면 증빙 영역 자체를 렌더링하지 않습니다. */
  proofs?: ProofItem[];
}

export interface SkillProofCategory {
  id: string;
  title: string;
  subtitle: string;
  accent: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
  items: string[];
}

// ============================================================================
// Zone 1. 상단 인사 카드 (HR Profile Card)
// ============================================================================
export const HR_PROFILE: HrProfileInfo = {
  nameKr: '김성현',
  nameEn: 'Ricky Kim',
  photoSrc: '/images/profile-main.jpg',
  positioning: '11년 9개월 글로벌 현장·EPC·ERP 실무에 PLC·협동로봇·AI를 결합한 자동화 엔지니어',
  location: '충남 천안 쌍용동 · 국내/해외 출장 가능',
  phone: '010-6467-8463',
  email: 'mr_patience@naver.com',
  experienceTotal: '총 경력 11년 9개월 + 자동화 집중',
  metrics: [
    {
      id: 'revenue',
      value: '연 80억+',
      label: '하나골프 베트남·라오스 매출 핸들링',
      sublabel: '하나허브 ERP · GDS · DMC 총괄',
    },
    {
      id: 'epc',
      value: '60 → 180명',
      label: 'KITCO 외국 선주사 EPC 3배 확장',
      sublabel: '거제지사 팀장 · 9+ 대형 해양플랜트',
    },
    {
      id: 'overseas',
      value: '3개국 7년+',
      label: '베트남·필리핀·홍콩 현장 운영',
      sublabel: '비즈니스 영어 · 베트남어 회화',
    },
  ],
};

// ============================================================================
// Zone 2. 정밀 스펙 벤토 그리드 (4열 × 2행 = 8개 타일 → 클릭 시 글라스 모달)
// ============================================================================
export const SPEC_TILES: SpecTileItem[] = [
  {
    id: 'education-training',
    icon: 'graduation',
    title: '학습 · 수료',
    keyword: '자동화 · AI 집중',
    surface: 'dark',
    modalSubtitle: 'PLC·협동로봇 제어 실무와 클라우드 AI 심화 교육 이수 내역',
    details: [
      {
        title: '브릴스 협동로봇 제어 자동화 테크니션 과정',
        meta: '2026.11 – 2026.12 · 대한상공회의소 충남인력개발원',
        desc: 'MELSEC Q06UDEH PLC, FR-E700 인버터, 브릴스 6축 협동로봇(Lua), ROS 2, HMI(GT Designer3) 실무 집중 훈련',
      },
      {
        title: 'Google Cloud (GCP) AI 심화 과정 수료',
        meta: '36시간 집중 실습',
        desc: 'GCP 웹 빌드, BigQuery 데이터 파이프라인, Vertex AI 생성형 모델 환경 학습 및 실습',
      },
      {
        title: 'Google Skills AI Leader 수료',
        meta: 'AI 실행 전략 & 워크플로우',
        desc: '프롬프트 엔지니어링 기반 업무 자동화 및 현장 진단 워크플로우 설계 역량 검증',
      },
    ],
    tags: ['브릴스 협동로봇 과정', 'GCP AI 심화 36h', 'Google Skills AI Leader'],
    proofs: [
      {
        title: 'MELSEC Q06UDEH 18종 래더 시뮬레이터 & 시운전 랩',
        subtitle: '직접 구현한 PLC 인터랙티브 검증 도구',
        href: '/plc',
      },
      {
        title: '브릴스 Lua 핸드셰이크 & ROS 2 아키텍처 랩',
        subtitle: 'I/O 매핑 · 특이점 회피 · Rosbag2 진단 정리',
        href: '/robotics',
      },
    ],
    sectorLinks: [
      { label: 'PLC 랩 보기', href: '/plc' },
      { label: '로보틱스 랩 보기', href: '/robotics' },
    ],
  },
  {
    id: 'job-skills',
    icon: 'cpu',
    title: '직무 스킬',
    keyword: 'PLC · 로봇 · ROS 2',
    surface: 'blue',
    modalSubtitle: '제조 자동화 제어·구동·로봇 티칭·시운전 핵심 하드웨어/소프트웨어 스택',
    details: [
      {
        title: 'Mitsubishi MELSEC Q06UDEH (GX Works2 / 3)',
        meta: '래더 제어 · F3 모니터 · 런중 수정',
        desc: '자기유지·정역 인터록·K1Y20 바이너리 다단 출력·ZCP 범위 판정·스텝 시퀀스 설계 및 트러블슈팅',
      },
      {
        title: 'FREQROL-E700 인버터 제어',
        meta: 'Pr.79 EXT/혼합 · 드라이 컨택 · 노이즈 대응',
        desc: 'STF/STR/RH·RM·RL 7단 속도 제어, 동력·신호선 분리 및 실드 1점 접지 노이즈 진단',
      },
      {
        title: '브릴스 협동로봇 (Lua) & ROS 2 (Jazzy / Humble)',
        meta: '2-Way I/O 핸드셰이크 · URDF/TF2 · Rosbag2',
        desc: '::MAIN_LOOP:: 순차 제어, MoveJ/MoveL 특이점 회피, 필수 4대 토픽 기반 현장 오류 오프라인 재현',
      },
      {
        title: 'GT Designer3 (HMI 작화)',
        meta: 'GOT 산업용 패널 UI/UX',
        desc: 'PLC 디바이스(M·Y·D) 1:1 매칭 기반 직관적 운전·알람 화면 설계',
      },
    ],
    tags: ['MELSEC Q06UDEH', 'GX Works2/3', 'FR-E700', 'Brills Lua', 'ROS 2', 'GT Designer3'],
    sectorLinks: [
      { label: 'PLC 랩 보기', href: '/plc' },
      { label: '로보틱스 랩 보기', href: '/robotics' },
    ],
  },
  {
    id: 'os-tools-build',
    icon: 'terminal',
    title: 'OS · 툴 · 빌드',
    keyword: 'Linux · ERP · 웹앱',
    surface: 'lavender',
    modalSubtitle: '개발 환경, 풀스택 웹 빌드, 기업 ERP·GDS 및 비즈니스 생산성 툴',
    details: [
      {
        title: 'Ubuntu (WSL2) & 풀스택 웹 프로토타이핑',
        meta: 'Next.js · Supabase · Vercel',
        desc: 'WSL2 리눅스 ROS 2 개발 환경 구축 및 AI 협업으로 AIN GOLF MVP 기획~실배포 독학 완수',
      },
      {
        title: '기업 ERP & 글로벌 항공 GDS',
        meta: '하나허브 ERP · TOPAS · Sabre',
        desc: '연 80억 규모 상품 코드·예약·정산 매칭 및 항공 하드블럭 PNR/수익 실무 운영',
      },
      {
        title: '오피스 · 시각화 · AI 콘텐츠 파이프라인',
        meta: 'MS Office · 미리캔버스 · CapCut',
        desc: '엑셀 원가/페이롤/I/O 맵 작성, IR 피칭 제안서, 미리캔버스 시각화 및 CapCut·Vrew OSMU 쇼츠 제작',
      },
    ],
    tags: ['Ubuntu (WSL2)', 'Next.js / Supabase / Vercel', '하나허브 ERP', 'GDS (TOPAS·Sabre)', 'MS Office', '미리캔버스', 'CapCut'],
    proofs: [
      {
        title: 'AIN GOLF 하이엔드 골프 플랫폼 MVP (Vercel Live)',
        subtitle: 'B2C 견적기 · Top 3 발표 · SaaS 요금 캔버스 · Admin ERP',
        href: 'https://ain-golf-mvp-azu2.vercel.app/',
        external: true,
      },
    ],
    sectorLinks: [{ label: 'AI·빌드 쇼케이스 보기', href: '/ai' }],
  },
  {
    id: 'languages',
    icon: 'languages',
    title: '어학 역량',
    keyword: '영어 · 베트남어',
    surface: 'silver',
    modalSubtitle: '외국 선주사 PM 전담·컨벤션 통역·해외 6년+ 실무로 검증된 글로벌 커뮤니케이션',
    details: [
      {
        title: '비즈니스 영어 (실무·통역·협상)',
        meta: '외국 선주사 전담 · 컨벤션 통역 · 미 2사단 파견',
        desc: 'Chevron·Total·BP 등 글로벌 오일 메이저 PM팀 커뮤니케이션, 홍콩·베트남 비즈니스 컨벤션 통역, 미 2사단 통역 파견 근무(5개월)',
      },
      {
        title: '베트남어 일상 / 업무 회화',
        meta: '현지 6년+ 거주 및 현장 총괄',
        desc: '다낭·나트랑·달랏 현지 파트너사·매장 POS 셋업·돌발 현장 이슈를 직접 소통하며 통제',
      },
    ],
    tags: ['비즈니스 영어', '외국 선주사 PM 소통', '미 2사단 통역 5개월', '베트남어 회화', '컨벤션 통역'],
  },
  {
    id: 'overseas-experience',
    icon: 'globe',
    title: '해외 경험',
    keyword: '3개국 7년+ 체류',
    surface: 'blue',
    modalSubtitle: '베트남·필리핀·홍콩 3개국 장기 체류 및 현지 사업·현장 운영 총괄',
    details: [
      {
        title: '베트남 (다낭 · 나트랑 · 달랏 — 6년+ 체류)',
        meta: '현지가이드 실장 · 갤러리아 POS 셋업 · 현지 사업 운영',
        desc: '하나투어 베트남 VIP·기업 단체 영어 통역 및 일정 총괄, 다낭 갤러리아 매장 POS 시스템 셋업 및 현지 운영',
      },
      {
        title: '필리핀 세부 (2년 체류)',
        meta: 'VIP / 골프 전담 가이드 팀장',
        desc: '현지 가이드 팀 리딩, 영어 현장 운영 및 고객 만족도 관리',
      },
      {
        title: '홍콩 (1년 체류)',
        meta: 'MHtour Hong Kong · 컨벤션 통역',
        desc: '글로벌 박람회·컨벤션 참가 한국 기업 바이어/셀러 통역 및 VIP 비즈니스 세일즈 운영',
      },
    ],
    tags: ['베트남 6년+', '필리핀 세부 2년', '홍콩 1년', '해외 셋업 출장 즉시 대응'],
  },
  {
    id: 'certifications',
    icon: 'badgeCheck',
    title: '자격증',
    keyword: '공인 자격 5종',
    surface: 'lavender',
    modalSubtitle: '항공·관광 실무 공인 자격 및 고강도 현장 체력을 뒷받침하는 전문 자격',
    details: [
      {
        title: 'TOPAS 항공 예약 골드 자격',
        meta: '글로벌 항공 GDS 예약·발권 실무',
      },
      {
        title: '관광종사원 공인 자격 2종',
        meta: '국내여행안내원 · 국내숙박종사원',
      },
      {
        title: '무에타이 1단 (대한무에타이협회)',
        meta: '고강도 현장 근무·장기 해외 출장을 버티는 기초 체력',
      },
      {
        title: 'PADI 오픈워터 다이버',
        meta: '수중 환경 침착 대응 및 안전 수칙 준수',
      },
    ],
    tags: ['TOPAS 예약 골드', '국내여행안내원', '국내숙박종사원', '무에타이 1단', 'PADI 오픈워터'],
  },
  {
    id: 'education-military',
    icon: 'bookOpen',
    title: '학력 · 병역',
    keyword: "Taylor's · 육군 병장",
    surface: 'silver',
    modalSubtitle: '글로벌 경영학 수학, 관광 특성화 학력 및 미 2사단 통역 파견 병역 이력',
    details: [
      {
        title: "Taylor's University — ADP 경영학",
        meta: '2003 – 2005 · 글로벌 비즈니스 영어 환경 수학',
        desc: '말레이시아 Taylor’s University 미국대학편입과정(ADP) 경영학 수학으로 실전 영문 커뮤니케이션 기반 확립',
      },
      {
        title: '한국관광고등학교 졸업',
        meta: '2003년 졸업',
        desc: '외국어·서비스·관광 실무 및 공인 자격 취득',
      },
      {
        title: '대한민국 육군 병장 만기 제대',
        meta: '2006 – 2008 · 미 2사단 통역 파견 근무(5개월)',
        desc: '군 복무 중 미군 부대 통역 파견으로 실전 영어 통역과 조직 적응력 입증',
      },
    ],
    tags: ["Taylor's Univ. ADP 경영학", '한국관광고 졸업', '육군 병장 만기 제대', '미 2사단 통역 5개월'],
  },
  {
    id: 'awards-strengths',
    icon: 'trophy',
    title: '수상 · 강점',
    keyword: '리더십 · 스피치',
    surface: 'dark',
    modalSubtitle: '현장 셋업 팀워크, 고객사 브리핑 전달력, 흔들리지 않는 멘탈의 원천',
    details: [
      {
        title: '배구선수 6년 · 주장 (우승 1회 · 준우승 2회)',
        meta: '팀 리더십 & 목표 집념',
        desc: '팀이 흔들릴 때 중심을 잡는 주장 경험을 통해 현장 셋업 팀플레이와 위기 돌파력 체화',
      },
      {
        title: '경상남도 영어말하기 대회 은상',
        meta: '교내 · 거제도 최우수 수상',
        desc: '조기부터 다져온 영어 스피치 감각이 외국 선주사 PM 핸들링과 글로벌 커뮤니케이션 역량으로 확장',
      },
      {
        title: '평택시 청소년 가요제 금상',
        meta: '무대 장악력 & PT 전달력',
        desc: '다수의 청중과 VIP 앞에서도 긴장하지 않고 기술·비즈니스 핵심을 설득력 있게 전달하는 스피치 강점',
      },
    ],
    tags: ['배구 주장 6년', '우승 1 · 준우승 2', '경남 영어말하기 은상', '평택시 가요제 금상'],
  },
];

// ============================================================================
// Zone 3. 전체 경력 & 프로젝트 타임라인 (2009–2026)
// (부정적 퇴사 사유, 연봉 금액, 학점 등 감점 요소 일절 미표기)
// ============================================================================
export const CAREER_TIMELINE: CareerTimelineItem[] = [
  {
    id: 'brills-2026',
    period: '2026.11 – 2026.12',
    title: '브릴스 협동로봇 제어 자동화 테크니션 과정',
    org: '대한상공회의소 충남인력개발원',
    track: 'automation',
    trackLabel: '자동화 · AI · 빌드',
    summary:
      'MELSEC Q06UDEH PLC, FR-E700 인버터, 브릴스 6축 협동로봇(Lua), ROS 2, GT Designer3(HMI) 실무 집중 과정',
    highlights: [
      'GX Works2/3 기반 18종 실전 래더(자기유지·정역 인터록·K1Y20 바이너리·ZCP·스텝 시퀀스) 직접 설계 및 50ms 스캔 시뮬레이터 구현',
      'FR-E700 인버터 Pr.79 EXT/혼합 제어, 드라이 컨택 배선, PWM 노이즈 분리·편단 접지 시운전 트러블슈팅 체계화',
      '브릴스 협동로봇 ↔ PLC 2-Way I/O 핸드셰이크 Lua(::MAIN_LOOP::) 작성 및 ROS 2(URDF/TF2·Rosbag2 4대 토픽) 진단 구축',
    ],
    tags: ['MELSEC Q06UDEH', 'FR-E700', 'Brills Lua', 'ROS 2', 'GT Designer3'],
    proofs: [
      {
        title: 'PLC 랩 — 18종 래더 시뮬레이터 · 시운전 DB',
        subtitle: 'GX Works2/3 실시간 시뮬레이터 및 Field Issue Log',
        href: '/plc',
      },
      {
        title: '로보틱스 랩 — I/O 핸드셰이크 · Lua · ROS 2',
        subtitle: '표준 매핑표 및 특이점 회피 코드 뷰어',
        href: '/robotics',
      },
    ],
  },
  {
    id: 'ain-golf-2025',
    period: '2025.12 – 2026.03',
    title: 'AIN GOLF MVP 독학 개발·배포 & GCP AI 심화',
    org: '풀스택 웹 빌드 프로젝트 / Google Cloud Platform',
    track: 'automation',
    trackLabel: '자동화 · AI · 빌드',
    summary:
      'Next.js·Supabase·Vercel 기반 하이엔드 골프 플랫폼 MVP 기획~실배포 독학 완수 및 GCP AI 심화(36h)·Google Skills AI Leader 수료',
    highlights: [
      '고객용 B2C 실시간 견적기, 총무용 Top 3 비교 발표 모드, 골프장 파트너 SaaS 드래그 요금 캔버스, 어드민 ERP까지 4계층 구현',
      'Google Cloud(GCP) 심화 36시간 과정(BigQuery·Vertex AI·웹 빌드) 및 Google Skills AI Leader 이수로 OT/SCADA 클라우드 연동 기반 확보',
    ],
    tags: ['Next.js', 'Supabase', 'Vercel Live', 'GCP BigQuery/Vertex AI', 'AI Leader'],
    proofs: [
      {
        title: 'AI·빌드 — AIN GOLF 아키텍처 상세 분석',
        subtitle: 'B2C · Top 3 발표 · SaaS · Admin ERP 구조',
        href: '/ai#ain-golf',
      },
      {
        title: 'AIN GOLF MVP 라이브 서비스 바로가기',
        subtitle: 'ain-golf-mvp-azu2.vercel.app',
        href: 'https://ain-golf-mvp-azu2.vercel.app/',
        external: true,
      },
    ],
  },
  {
    id: 'osmu-2026',
    period: '2026',
    title: 'AI OSMU 쇼츠 채널 (썰푸는 상점 @ssulshop) 4개월 매일 실행',
    org: 'AI 콘텐츠 자동화 파이프라인 프로젝트',
    track: 'automation',
    trackLabel: '자동화 · AI · 빌드',
    summary:
      'TTS·Vrew·CapCut 등 AI 파운데이션 툴 파이프라인을 구축해 5대 숏폼 채널에 4개월 이상 하루도 빠짐없이 매일 1건 발행한 실행력',
    highlights: [
      '기획·대본 프롬프팅 → AI 보이스(TTS) → Vrew 자동 자막·컷 편집 → CapCut 마스터링으로 제작 리드타임 70% 단축',
      '유튜브 쇼츠·인스타 릴스·틱톡·네이버 클립·스레드 5대 채널 원소스 멀티유즈(OSMU) 무중단 일일 루틴 검증',
    ],
    tags: ['썰푸는 상점 @ssulshop', 'OSMU 5대 채널', '4개월 매일 1건', 'AI 파이프라인'],
    proofs: [
      {
        title: 'AI·빌드 — OSMU 4단계 자동화 파이프라인 요약',
        subtitle: '120일+ 연속 발행 워크플로우 보기',
        href: '/ai#shorts',
      },
    ],
  },
  {
    id: 'hanagolf-2024',
    period: '2024.07 – 2026.03',
    title: '(주)하나골프 과장 — 베트남·라오스 총괄',
    org: '(주)하나골프 (하나투어 해외골프)',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      '베트남·라오스 전지역 연 80억 매출 물량 핸들링, 하나허브 ERP 정산, GDS(TOPAS·Sabre) 항공 하드블럭 및 DMC 총괄',
    highlights: [
      '베트남·라오스 주력 골프 상품 연 80억 규모 운영 및 현지 DMC 계약·확정 매칭 총괄',
      '하나허브 ERP 코드·예약·보험 관리와 GDS(TOPAS·Sabre) PNR/항공 하드블럭 좌석 수익 최적화',
      'MD 협업 신규 상품 기획 및 기업 인센티브 단체 원가·수익 총괄 견적 산출',
    ],
    tags: ['연 80억 매출 핸들링', '하나허브 ERP', 'GDS TOPAS·Sabre', 'DMC 총괄'],
  },
  {
    id: 'danang-commerce-2020',
    period: '2020.03 – 2024.02',
    title: '해외 현지 사업(다낭 갤러리아 POS 셋업·모스트커피) & 디지털 커머스·유튜브 메타박스',
    org: '베트남 다낭 현지 사업 / 스마트스토어 · 유튜브 메타박스',
    track: 'automation',
    trackLabel: '자동화 · AI · 빌드',
    summary:
      '베트남 다낭 갤러리아 POS 시스템 셋업·매장 총괄, 모스트커피 판매사 운영, 스마트스토어 및 유튜브 채널 메타박스 기획·운영',
    highlights: [
      '베트남 다낭 갤러리아 현지 매장 POS 시스템 셋업 및 현장 운영 총괄',
      '모스트커피 판매사 운영 및 온라인 스마트스토어 상품 소싱·상세페이지 마케팅 직접 실행',
      '유튜브 채널 메타박스 기획·편집·운영을 통해 디지털 미디어 및 AI 콘텐츠 제작 역량 내재화',
    ],
    tags: ['다낭 갤러리아 POS 셋업', '모스트커피', '스마트스토어', '유튜브 메타박스'],
    proofs: [
      {
        title: 'AI·빌드 — 콘텐츠·미디어 제작 파이프라인',
        subtitle: '유튜브 메타박스 & OSMU 쇼츠 실행 아카이브',
        href: '/ai#youtube',
      },
    ],
  },
  {
    id: 'hanatour-vn-2017',
    period: '2017.03 – 2020.03',
    title: '하나투어 베트남 랜드사 현지가이드 실장',
    org: '하나투어 베트남 (다낭 · 나트랑 · 달랏)',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      '기업 VIP·비즈니스 팀 영어 통역 전담, 대규모 단체 일정 통제 및 연 억대 실적 달성',
    highlights: [
      'VIP·기업 인센티브·컨벤션 바이어/셀러 영어·베트남어 현장 통역 및 행사 총괄',
      '현지 돌발 상황(항공 지연·긴급 병원 수행 등) 즉각 위기 대응으로 높은 고객 신뢰와 연 억대 실적 기록',
    ],
    tags: ['VIP 영어 통역', '연 억대 실적', '대규모 현장 통제', '베트남 3개 거점'],
  },
  {
    id: 'fatman-2016',
    period: '2016.06 – 2017.03',
    title: '팻맨 해외영업 매니저 (수출입·유통 총괄)',
    org: '팻맨 (글로벌 무역상사)',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      '8개국 글로벌 브랜드 소싱·독점계약, 신용장(L/C)·통관·OEM 및 이마트·GS·쿠팡 온/오프라인 입점 총괄',
    highlights: [
      '미국·네덜란드·아일랜드·일본(이나바) 등 8개국 글로벌 파트너사 직접 소싱 및 독점 수입 계약 체결',
      'L/C 개설, 포워딩, 통관, 바코딩, OEM 패키지 조율부터 이마트·GS·쿠팡 온/오프라인 입점 및 마케팅까지 A to Z 수행',
    ],
    tags: ['8개국 소싱·독점계약', 'L/C · 통관 · OEM', '이마트·GS·쿠팡 입점'],
  },
  {
    id: 'brain202-2016',
    period: '2016.01 – 2016.05',
    title: 'Brain202 IT 채용 컨설턴트 (대기업 헤드헌팅)',
    org: 'Brain202 (삼성동)',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      '삼성SDS·현대카드 등 대기업 IT 핵심 인재 영문 서칭·직무 분석 및 H사 임원면접·최종합격 성사',
    highlights: [
      '삼성SDS·현대카드·금호타이어 등 대기업 IT/기술 직무 분석 및 링크드인 기반 핵심 후보자 발굴',
      '후보자 인터뷰 코칭, 임원면접 에스코트 및 최종 합격·처우 조율 성사',
    ],
    tags: ['삼성SDS·현대카드', 'IT 헤드헌팅', 'H사 최종합격 성사'],
  },
  {
    id: 'bs-2015',
    period: '2015.02 – 2015.10',
    title: '(주)BS 울산 중공업 인력 아웃소싱 창업',
    org: '(주)BS 법인 설립',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      '울산 중공업 외국인 PM팀 작업 인력 아웃소싱 법인 설립 총괄 및 1,500명 영문 이력서 DB 구축',
    highlights: [
      '외국인 PM팀 현장 작업 인력 공급을 위한 법인 설립, 행정·자산 관리 및 운영 체계 구축',
      '중공업 전 분야 작업자 1,500여 명 이력서 DB 영문 번역·표준화 리빌딩 완료',
    ],
    tags: ['법인 설립 창업', '울산 중공업', '1,500명 영문 이력서 DB'],
  },
  {
    id: 'mhtour-hk-2014',
    period: '2014.01 – 2014.11',
    title: 'MHtour Hong Kong 현지가이드 · 컨벤션 통역',
    org: 'MHtour Hong Kong',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      '홍콩 글로벌 박람회·컨벤션 참가 한국 기업 영어 통역 및 VIP 비즈니스 단체 운영',
    highlights: [
      '홍콩 국제 컨벤션 참가 바이어/셀러 비즈니스 영어 통역 및 미팅 지원',
      'VIP 단체 맞춤형 일정 기획 및 현지 세일즈 운영',
    ],
    tags: ['홍콩 현지 운영', '컨벤션 영어 통역', 'VIP 비즈니스'],
  },
  {
    id: 'kitco-2012',
    period: '2012.07 – 2013.12',
    title: 'KITCO (현 AirswiftKitco) 맨파워팀 팀장 · 거제지사 팀장',
    org: 'KITCO (현대·삼성·대우 조선소 EPC)',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      'Chevron·Total·BP·Inpex 등 외국 선주사 9+ 대형 EPC 프로젝트 전담 및 파견 페이롤 60명 → 180명 3배 확장',
    highlights: [
      '현대중공업·삼성중공업·대우조선해양 내 글로벌 오일 메이저(Chevron·Total E&P·BP·Inpex·RasGas·NOV) 선주사 PM팀 전담 관리',
      '재직 기간 파견 인력 페이롤 60명 → 180명(3배) 확장 달성 및 거제지사 팀장 발령·조직 리딩',
      '외국인 핵심 엔지니어 채용, 비자·숙소·교육·생활 리로케이션 및 입사 관리 A to Z 총괄',
    ],
    tags: ['페이롤 60→180명', '거제지사 팀장', 'Chevron·Total·BP·Inpex', '9+ EPC 프로젝트'],
  },
  {
    id: 'cebu-daewoo-2009',
    period: '2009.07 – 2012.02',
    title: '필리핀 세부 현지가이드 팀장 / 대우자동차판매',
    org: '세부 랜드사 (2010.03–2012.02) · 대우자동차판매 (2009.07–2010.01)',
    track: 'global',
    trackLabel: '글로벌 EPC · 무역 · ERP',
    summary:
      '필리핀 세부 VIP·골프 가이드 팀장 2년 리딩 및 대우자동차판매 신차 영업 월 최고 6대 실적 달성',
    highlights: [
      '필리핀 세부 현지 VIP/골프 가이드 팀 리딩(2년)으로 영어 현장 운영 및 리더십 기초 확립',
      '대우자동차판매 신차 영업 직무에서 월 최고 6대 판매 실적으로 대면 세일즈 역량 검증',
    ],
    tags: ['세부 가이드 팀장 2년', '신차 영업 월 최고 6대', '현장 영업력'],
  },
];

// ============================================================================
// 인사 카드 하단: 실무 증명 스킬 · 자격증 매트릭스 (막대그래프 금지 — 태그 형태)
// ============================================================================
export const SKILL_PROOF_MATRIX: SkillProofCategory[] = [
  {
    id: 'automation',
    title: 'Automation & Robotics',
    subtitle: '제어 · 인버터 · 협동로봇',
    accent: 'blue',
    items: [
      'MELSEC GX Works2/3 (Q06UDEH)',
      'FREQROL-E700 인버터 (Pr.79 / 다단속도)',
      'BRILS 6축 협동로봇 정밀 티칭 & Lua',
      'PLC↔로봇 2-Way I/O 핸드셰이크',
      'ROS 2 (URDF / TF2 / Rosbag2)',
      'GT Designer 3 (HMI 작화)',
      'Linux (WSL2) / 현장 노이즈·접지 진단',
    ],
  },
  {
    id: 'global',
    title: 'Global & Language',
    subtitle: '외국 선주사 · 해외 셋업',
    accent: 'emerald',
    items: [
      '영어 비즈니스 (외국 선주사 PM 전담)',
      '미 2사단 통역 파견 근무 (5개월)',
      '경상남도 영어말하기 대회 은상',
      '베트남어 일상·업무 회화',
      '베트남(6년+)·필리핀(2년)·홍콩(1년) 체류',
      '글로벌 바이어/셀러 컨벤션 통역',
    ],
  },
  {
    id: 'operations',
    title: 'EPC · Trade · ERP',
    subtitle: '매출 · 인력 · 수출입 총괄',
    accent: 'amber',
    items: [
      '하나골프 연 80억 매출 핸들링',
      'KITCO EPC 페이롤 60→180명 확장',
      '하나허브 ERP · GDS(TOPAS / Sabre)',
      '수출입 L/C · 포워딩 · 통관 · OEM',
      '이마트·GS·쿠팡 온/오프라인 입점',
      '중공업 인력 1,500명 영문 DB 구축',
    ],
  },
  {
    id: 'ai-it',
    title: 'AI · Cloud · Web Build',
    subtitle: '풀스택 MVP · AI 자동화',
    accent: 'purple',
    items: [
      'AIN GOLF MVP 독학 배포 (Next.js/Vercel)',
      'Google Cloud 심화 36h (BigQuery/Vertex AI)',
      'Google Skills AI Leader 수료',
      'AI 프롬프트 기반 현장 CS 진단',
      'AI OSMU 쇼츠 4개월 매일 1건 실행',
      'MS Office(엑셀·PPT) · 미리캔버스 IR 피칭',
    ],
  },
  {
    id: 'certs',
    title: 'Certifications & Awards',
    subtitle: '공인 자격 · 수상 · 체력',
    accent: 'slate',
    items: [
      'TOPAS 항공 예약 골드 자격',
      '국내여행안내원 · 국내숙박종사원',
      '대한무에타이협회 1단 · PADI 스쿠버 오픈워터',
      '배구선수 6년 주장 (우승 1·준우승 2)',
      '평택시 청소년 가요제 금상 (가수 자격)',
      '1종 보통 운전면허 · 한국관광고 졸업',
    ],
  },
];
