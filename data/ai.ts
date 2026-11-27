export interface AinGolfModule {
  id: string;
  tier: 'B2C' | 'PRESENTATION' | 'SAAS' | 'ADMIN ERP';
  title: string;
  desc: string;
  highlights: string[];
}

export interface CloudCredential {
  id: string;
  org: string;
  title: string;
  duration: string;
  tags: string[];
  summary: string;
  otBridge: string;
}

export interface OsmuStage {
  step: string;
  title: string;
  tools: string[];
  desc: string;
}

export interface ProductivityCapability {
  id: string;
  badge: string;
  title: string;
  tools: string[];
  desc: string;
}

export const AIN_GOLF_SHOWCASE = {
  title: 'AIN GOLF 하이엔드 골프 플랫폼 MVP',
  url: 'https://ain-golf-mvp-azu2.vercel.app/',
  domainDisplay: 'ain-golf-mvp-azu2.vercel.app',
  stack: ['Next.js App Router', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel Live'],
  tagline: '바이브코딩과 AI 툴을 활용해 기획·설계·배포까지 독학으로 구현한 풀스택 골프 커머스 & SaaS 프로토타입',
  modules: [
    {
      id: 'b2c',
      tier: 'B2C',
      title: '고객용 상품 탐색 & 실시간 견적기',
      desc: '베트남·해외 하이엔드 골프장 코스 조합, 인원·숙박·항공 옵션을 실시간으로 계산하는 고객 맞춤형 견적 UI.',
      highlights: ['지역/코스 필터링', '인원별 단가 자동 산출', '모바일 우선 UX'],
    },
    {
      id: 'top3',
      tier: 'PRESENTATION',
      title: '총무용 Top 3 비교 발표 모드',
      desc: '동호회·기업 행사 총무가 회원들에게 후보 3개 골프 일정을 한눈에 비교·공유할 수 있는 프레젠테이션 뷰.',
      highlights: ['핵심 스펙 3안 병렬 비교', '의사결정 리드타임 단축', '공유 최적화 레이아웃'],
    },
    {
      id: 'saas',
      tier: 'SAAS',
      title: '골프장 파트너 SaaS 드래그 요금 캔버스',
      desc: '성수기·비수기·티타임별 요금과 프로모션을 캘린더 캔버스 위에서 직관적으로 드래그 설정하는 B2B 요금 관리 도구.',
      highlights: ['드래그 기간 요금 매트릭스', '시즌별 동적 마진 제어', '즉시 견적기 반영'],
    },
    {
      id: 'admin',
      tier: 'ADMIN ERP',
      title: '운영자 어드민 ERP 대시보드',
      desc: '하나허브 ERP 실무 경험을 녹여낸 예약 상태 추적, 원가·수익 정산 및 고객 문의 파이프라인 통합 관리.',
      highlights: ['예약·확정 스테이지 관리', '원가/마진 시뮬레이션', 'Supabase 데이터 연동'],
    },
  ] as AinGolfModule[],
};

export const CLOUD_AI_CREDENTIALS: CloudCredential[] = [
  {
    id: 'gcp-deep',
    org: 'Google Cloud Platform',
    title: 'GCP 심화 실무 과정 수료 (36시간)',
    duration: '36 Hours Intensive',
    tags: ['BigQuery', 'Vertex AI', 'Cloud Web Build', 'Data Pipeline'],
    summary:
      'GCP 클라우드 웹 빌드 아키텍처, BigQuery 기반 대규모 데이터 분석, Vertex AI 환경에서의 생성형 AI 모델 학습·배포 파이프라인 실습 이수.',
    otBridge: '향후 제조 현장 PLC/로봇 설비 데이터를 Ignition SCADA·클라우드 BigQuery로 적재하고 예지보전 AI로 확장하는 핵심 기반.',
  },
  {
    id: 'ai-leader',
    org: 'Google Skills',
    title: 'Google Skills AI Leader 교육 수료',
    duration: 'AI Strategy & Execution',
    tags: ['Generative AI', 'AI Workflow', 'Prompt Engineering', 'Business Case'],
    summary:
      '생성형 AI의 비즈니스 도입 전략, 프롬프트 엔지니어링 설계, 현장 업무 자동화 및 거버넌스 프레임워크 수료.',
    otBridge: '현장 CS 트러블슈팅 진단 프롬프트 표준화 및 자동화 기술 리포트 작성 효율 극대화.',
  },
];

export const OSMU_PIPELINE: {
  headline: string;
  metric: string;
  channels: string[];
  stages: OsmuStage[];
} = {
  headline: 'AI 기반 OSMU 쇼츠 4개월 매일 1건 실행 파이프라인',
  metric: '120일+ 무중단 연속 발행 (One Source Multi Use)',
  channels: ['YouTube Shorts', 'Instagram Reels', 'TikTok', 'Naver Clip', 'Threads'],
  stages: [
    {
      step: 'STEP 01',
      title: '주제 리서치 & AI 대본 구조화',
      tools: ['LLM Prompting', 'Hook 템플릿'],
      desc: '3초 훅(Hook) → 핵심 인사이트 → 행동 유도(CTA) 구조로 쇼츠 전용 스크립트를 일일 루틴으로 빠르게 초안 작성.',
    },
    {
      step: 'STEP 02',
      title: 'TTS 음성 합성 & 자동 자막 편집',
      tools: ['AI TTS', 'Vrew', 'CapCut'],
      desc: 'AI 파운데이션 보이스 생성, Vrew 기반 컷 편집·자막 자동화, CapCut 템플릿으로 숏폼 제작 시간 70% 단축.',
    },
    {
      step: 'STEP 03',
      title: '5대 채널 원소스 멀티유즈(OSMU) 배포',
      tools: ['YouTube', 'Instagram', 'TikTok', 'Naver', 'Threads'],
      desc: '단일 마스터 영상을 5개 플랫폼 포맷과 해시태그 전략에 맞춰 동시 발행하며 노출 데이터 수집.',
    },
    {
      step: 'STEP 04',
      title: '4개월 매일 1건 꾸준함의 증명',
      tools: ['일일 체크리스트', '성과 회고'],
      desc: '아이디어에 그치지 않고 4개월 이상 하루도 빠짐없이 실행·개선한 집요한 자기 주도 실행력 검증.',
    },
  ],
};

export const PRODUCTIVITY_CAPABILITIES: ProductivityCapability[] = [
  {
    id: 'ir-pitch',
    badge: 'IR & PROPOSAL',
    title: 'IR 피칭 · 고객사 기술 제안서 설계',
    tools: ['IR Deck', '기술 보고서', '시운전 완료 리포트'],
    desc: '복잡한 PLC·협동로봇·ERP 기술 아키텍처를 비전공 고객사·임원진도 3분 안에 이해할 수 있는 비즈니스 언어와 시각 구조로 설득.',
  },
  {
    id: 'miricanvas',
    badge: 'VISUAL DESIGN',
    title: '미리캔버스 (중급 이상) 신속 시각화',
    tools: ['미리캔버스', '상세페이지', '인포그래픽'],
    desc: '제안서 표지, 제품/설비 비교 인포그래픽, 스마트스토어 상세페이지 및 홍보 콘텐츠를 외주 없이 즉각 제작.',
  },
  {
    id: 'msoffice',
    badge: 'OFFICE & DATA',
    title: 'MS Office (엑셀 · PPT) 실무 자동화',
    tools: ['Excel 원가·I/O 맵', 'PowerPoint', 'ERP 데이터 가공'],
    desc: '연 80억 원가·수익 정산 시트, 180명 페이롤 관리표, PLC I/O 메모리 맵 엑셀 문서화 및 경영진 보고용 PPT 숙련 활용.',
  },
];
