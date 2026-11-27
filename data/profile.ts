export interface KitcoProject {
  client: string;
  project: string;
  yard: string;
}

export interface GlobalTradeCard {
  id: string;
  badge: string;
  title: string;
  period: string;
  bullets: string[];
}

export interface BeyondItem {
  id: string;
  icon: 'trophy' | 'flame' | 'mic' | 'award' | 'compass' | 'shield';
  title: string;
  sub: string;
  desc: string;
  accent: 'amber' | 'rose' | 'blue' | 'emerald' | 'indigo' | 'slate';
}

export interface CareerEntry {
  id: string;
  period: string;
  role: string;
  org: string;
  category: '자동화·로봇' | '글로벌·ERP' | '창업·커머스' | '무역·소싱' | 'EPC·HR' | '현장·영업';
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface SkillProofCategory {
  id: string;
  title: string;
  subtitle: string;
  accent: 'blue' | 'emerald' | 'purple' | 'amber' | 'slate';
  items: string[];
}

export const IMPACT_METRICS = [
  {
    label: 'REVENUE HANDLING',
    value: '연 80억+',
    title: '하나골프 베트남·라오스 총괄',
    detail: '하나허브 ERP · GDS(TOPAS/Sabre) 항공 하드블럭 · DMC 원가/수익 정산',
  },
  {
    label: 'EPC SCALE UP',
    value: '60 → 180명',
    title: 'KITCO 외국 선주사 페이롤 3배 확장',
    detail: 'Chevron·Total·BP·Inpex 전담 · 거제지사 팀장 발령 및 조직 리딩',
  },
  {
    label: 'GLOBAL FIELD',
    value: '3개국 7년+',
    title: '베트남 · 필리핀 · 홍콩 현장 총괄',
    detail: '비즈니스 영어 · 베트남어 회화 · 대규모 VIP 및 위기 상황 즉각 통제',
  },
];

export const KITCO_PROJECTS: KitcoProject[] = [
  { client: 'Chevron', project: 'DSO Offshore / Gorgon Project', yard: '현대중공업' },
  { client: 'Total E&P', project: 'OFON Phase 2 / Egina Project', yard: '현대·삼성중공업' },
  { client: 'BP', project: 'Quad 204 & Clair Ridge', yard: '현대중공업' },
  { client: 'Inpex / RasGas', project: 'Ichthys (CDJV) / Barzan Offshore', yard: '삼성·현대중공업' },
  { client: 'NOV / GL', project: 'National Oilwell Varco / SHWE', yard: '현대·삼성·대우' },
];

export const EPC_VENTURES = [
  {
    title: '(주)BS 법인 설립 창업 (울산 중공업 아웃소싱)',
    desc: '외국인 PM팀 작업인력 아웃소싱 법인 설립 총괄. 중공업 전 분야 작업자 1,500여 명 이력서 DB 영문 번역·리빌딩 및 행정·자산 관리 체계 구축.',
  },
  {
    title: 'Brain202 IT 대기업 헤드헌팅 (삼성동)',
    desc: '삼성SDS·현대카드·금호타이어 등 대기업 직무 분석, 링크드인 영문 서칭, 인터뷰 에스코트 및 연봉 조율 성사.',
  },
];

export const GLOBAL_TRADE_CARDS: GlobalTradeCard[] = [
  {
    id: 'fatman',
    badge: '수출입 · 유통 런칭',
    title: '팻맨 (해외영업 총괄 매니저)',
    period: '2016.06 ~ 2017.03',
    bullets: [
      '미국·네덜란드·아일랜드·일본(이나바 츄르) 소싱 및 독점계약 체결',
      '신용장(L/C), 포워딩, 통관, 바코딩 및 OEM 패키지 디자인 조율',
      '이마트·GS·쿠팡 온/오프라인 입점 및 상세페이지 마케팅 총괄',
    ],
  },
  {
    id: 'hanagolf',
    badge: 'ERP · 항공 · 원가정산',
    title: '(주)하나골프 (베트남·라오스 총괄 과장)',
    period: '2024.07 ~ 2026.03',
    bullets: [
      '베트남·라오스 연 80억 규모 상품 운영 및 하나허브 ERP 확정 매칭 관리',
      'GDS(TOPAS·Sabre) PNR 작업 및 항공 하드블럭 좌석 수익 조율',
      'MD 협업 상품 기획 및 인센티브 단체 원가·수익 총괄 견적',
    ],
  },
  {
    id: 'overseas',
    badge: '해외 3개국 7년+ 현장',
    title: '베트남(거주 6년+) · 세부(2년) · 홍콩(1년)',
    period: '2010 ~ 2024',
    bullets: [
      'VIP·비즈니스·컨벤션 바이어/셀러 영어 통역 및 대규모 일정 통제',
      '베트남 다낭 갤러리아 POS 시스템 셋업 총괄 및 현지 사업 운영',
      '긴급 환자 병원 수행 등 돌발 위기 상황 현장 즉각 대응',
    ],
  },
];

export const BEYOND_ITEMS: BeyondItem[] = [
  {
    id: 'volleyball',
    icon: 'trophy',
    title: '배구선수 6년 · 주장',
    sub: '우승 1회 · 준우승 2회',
    desc: '팀이 흔들릴 때 중심을 잡는 주장 경험. 현장 셋업 팀플레이와 목표 집념의 원천.',
    accent: 'amber',
  },
  {
    id: 'muaythai',
    icon: 'flame',
    title: '무에타이 1단 · 스쿠버 오픈워터',
    sub: '대한무에타이협회 · PADI',
    desc: '고강도 현장 근무와 장기 해외 출장을 거뜬히 버티는 체력과 위기 앞의 침착함.',
    accent: 'rose',
  },
  {
    id: 'singing',
    icon: 'mic',
    title: '평택시 청소년 가요제 금상',
    sub: '가수 자격증 · 거리축제 초빙 무대',
    desc: '수많은 청중과 VIP 앞에서도 긴장하지 않는 무대 장악력과 명확한 전달력.',
    accent: 'blue',
  },
  {
    id: 'english',
    icon: 'award',
    title: '경상남도 영어말하기 대회 은상',
    sub: '교내·거제도 최우수 수상',
    desc: '어릴 적부터 다져온 영어 스피치 감각이 외국 선주사 핸들링과 글로벌 PM 역량으로 연결.',
    accent: 'emerald',
  },
  {
    id: 'army',
    icon: 'compass',
    title: '미 2사단 통역 파견 근무 (5개월)',
    sub: '육군 병장 만기 제대',
    desc: '군 복무 중 미군 부대 통역 파견을 통해 실전 영어 커뮤니케이션과 조직 적응력 검증.',
    accent: 'indigo',
  },
  {
    id: 'certs',
    icon: 'shield',
    title: '관광·항공 공인 자격 다수',
    sub: 'TOPAS 예약 골드 · 관광종사원 2종',
    desc: '한국관광고 졸업, 국내숙박종사원·국내여행안내원 및 항공 예약 골드 자격 보유.',
    accent: 'slate',
  },
];

export const CAREER_TIMELINE: CareerEntry[] = [
  {
    id: 'c-2026',
    period: '2026.10 ~ 2026.12',
    role: '브릴스 협동로봇 제어 자동화 테크니션 과정',
    org: '대한상공회의소 충남인력개발원',
    category: '자동화·로봇',
    summary: 'MELSEC Q06UDEH PLC, FR-E700 인버터, 브릴스 협동로봇(Lua), ROS 2, HMI/SCADA 실무 집중 교육',
    highlights: [
      'GX Works2/3 기반 18종 실전 래더(자기유지·인터록·K1Y20 바이너리·ZCP·스텝 제어) 설계 및 시운전',
      'FREQROL-E700 인버터 Pr.79 EXT/혼합 제어, 드라이 컨택 배선 및 PWM 노이즈·접지 트러블슈팅',
      '브릴스 6축 협동로봇 PLC↔로봇 2-Way I/O 핸드셰이크 Lua 제어 스크립트 및 ROS 2/Rosbag2 진단 구축',
    ],
    tags: ['MELSEC Q06UDEH', 'FR-E700', 'Brills Lua', 'ROS 2', 'GT Designer 3'],
  },
  {
    id: 'c-2024',
    period: '2024.07 ~ 2026.03',
    role: '골프/크루즈상품팀 과장 (베트남·라오스 총괄)',
    org: '(주)하나골프 (하나투어 해외골프)',
    category: '글로벌·ERP',
    summary: '연 80억 규모 베트남·라오스 골프 상품 운영, 하나허브 ERP, GDS(TOPAS/Sabre) 항공 하드블럭 관리 및 수익 정산',
    highlights: [
      '베트남 전지역·라오스 연 80억 매출 상품 운영 및 현지 DMC 확정·계약 핸들링',
      '하나허브 ERP 코드·예약·보험 매칭 및 GDS(TOPAS/Sabre) PNR/항공 하드블럭 좌석 최적화',
      'MD 협업 신규 상품 기획 및 기업 인센티브 단체 원가·수익 총괄 정산',
    ],
    tags: ['연 80억 핸들링', '하나허브 ERP', 'GDS TOPAS/Sabre', 'DMC 총괄'],
  },
  {
    id: 'c-2020',
    period: '2020.03 ~ 2024.02',
    role: '해외 사업 운영 & 디지털 커머스 창업 활동',
    org: '다낭 현지 사업 / 스마트스토어·유튜브',
    category: '창업·커머스',
    summary: '베트남 다낭 갤러리아 POS 셋업 및 총괄, 모스트커피 판매사, 스마트스토어 및 AI OSMU 콘텐츠 채널 운영',
    highlights: [
      '베트남 다낭 갤러리아 현지 매장 POS 시스템 셋업 및 현장 운영 총괄',
      '모스트커피 판매사 운영 및 온라인 스마트스토어·상세페이지 마케팅 직접 실행',
      'AI 파이프라인(TTS·CapCut·Vrew) 기반 5대 채널 OSMU 쇼츠 4개월 매일 1건 발행',
    ],
    tags: ['다낭 POS 셋업', '스마트스토어', 'OSMU 쇼츠', '현지 사업 총괄'],
  },
  {
    id: 'c-2017',
    period: '2017.03 ~ 2020.03',
    role: '베트남 랜드사 현지가이드 실장',
    org: '하나투어 베트남 (다낭·나트랑·달랏)',
    category: '현장·영업',
    summary: 'VIP·비즈니스 팀 영어 통역 전담, 대규모 단체 일정·위기 관리 및 컨벤션 바이어/셀러 통역',
    highlights: [
      '기업 VIP 및 인센티브 대형 행사 현장 총괄 및 영어·베트남어 양방향 통역 수행',
      '현지 병원 응급 이송·항공 지연 등 돌발 현장 위기 상황 침착 대응',
      '현지 파트너사·골프장·리조트 협상 및 실무 네트워크 구축',
    ],
    tags: ['영어·베트남어', 'VIP 의전', '현장 위기관리', '컨벤션 통역'],
  },
  {
    id: 'c-2016',
    period: '2016.06 ~ 2017.03',
    role: '해외영업 매니저 (수출입 총괄)',
    org: '팻맨 (반려동물 글로벌 무역상사)',
    category: '무역·소싱',
    summary: '미·네·아·일(이나바) 소싱 및 독점계약, L/C·통관·바코딩, 이마트·GS·쿠팡 온/오프라인 입점 총괄',
    highlights: [
      '미국·네덜란드·아일랜드·일본(이나바 츄르 등) 글로벌 브랜드 소싱 및 독점 수입 계약',
      '신용장(L/C) 개설, 포워딩, 통관, 검역, OEM 패키지 및 바코딩 A to Z 실무',
      '이마트·GS25·쿠팡 등 국내 대형 온/오프라인 유통 채널 입점 및 매출 확대',
    ],
    tags: ['글로벌 소싱', 'L/C·통관', '이마트·GS·쿠팡 입점', '독점계약'],
  },
  {
    id: 'c-2015',
    period: '2015.02 ~ 2016.05',
    role: 'IT 헤드헌팅 & 중공업 인력 아웃소싱 창업',
    org: 'Brain202 / (주)BS 법인 설립',
    category: 'EPC·HR',
    summary: '삼성SDS·현대카드 등 대기업 IT 인재 채용, 울산 중공업 외국인 PM 인력 1,500명 이력서 DB 구축',
    highlights: [
      'Brain202(삼성동): 삼성SDS·현대카드·금호타이어 IT 핵심 포지션 영문 링크드인 서칭 및 채용 성사',
      '(주)BS 법인 설립: 울산 중공업 외국인 PM팀 작업 인력 아웃소싱 체계 및 1,500명 영문 이력서 DB 구축',
    ],
    tags: ['법인 창업', 'IT 헤드헌팅', '1,500명 영문 DB', '아웃소싱'],
  },
  {
    id: 'c-2014',
    period: '2014.01 ~ 2014.11',
    role: '홍콩 현지가이드',
    org: 'MHtour Hong Kong',
    category: '현장·영업',
    summary: '컨벤션 참가사·VIP 단체 영어 통역 및 일정·세일즈 운영',
    highlights: [
      '홍콩 글로벌 박람회·컨벤션 참가 한국 기업 바이어/셀러 현장 통역 지원',
      'VIP 비즈니스 그룹 맞춤형 일정 기획 및 현지 세일즈 운영',
    ],
    tags: ['홍콩 현장', '컨벤션 통역', 'VIP 세일즈'],
  },
  {
    id: 'c-2012',
    period: '2012.07 ~ 2013.12',
    role: '맨파워팀 팀장 (거제지사 팀장)',
    org: 'KITCO (현 AirswiftKitco)',
    category: 'EPC·HR',
    summary: 'Chevron·Total·BP·Inpex 외국 선주사 전담(현대·삼성중공업), 페이롤 60명→180명 확장 및 외국인 리로케이션',
    highlights: [
      '현대·삼성·대우 조선소 내 9+ 대형 해양플랜트 EPC 외국 선주사 PM팀 전담 관리',
      '재직 기간 파견 인력 페이롤 60명 → 180명(3배) 확장 달성',
      '거제지사 팀장 발령 후 지사 조직 재정비, 직원 교육 및 외국인 숙소·비자·생활 리로케이션 총괄',
    ],
    tags: ['페이롤 60→180명', 'Chevron·Total·BP', '거제지사 팀장', 'EPC PM'],
  },
  {
    id: 'c-2009',
    period: '2009.07 ~ 2012.02',
    role: '필리핀 세부 현지가이드 팀장 / 자동차 영업',
    org: '세부 랜드사 / 대우자동차판매',
    category: '현장·영업',
    summary: '세부 VIP/골프 가이드 팀 리딩(2년), 신차 영업 월 최고 6대 판매',
    highlights: [
      '필리핀 세부 현지 VIP/골프 전담 가이드 팀장 2년 리딩 및 영어 현장 운영',
      '대우자동차판매 신차 영업 직무에서 월 최고 6대 판매 실적 달성',
    ],
    tags: ['세부 팀장 2년', '신차 영업 월 6대', '현장 영업력'],
  },
];

// 막대그래프 금지 — 실무 증명 태그 매트릭스
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
