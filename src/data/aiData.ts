import type { PdfDocConfig } from '@/components/workspace/WorkspaceMedia';

export interface AinGolfModule {
  id: string;
  tier: 'B2C' | 'PRESENTATION' | 'SAAS & ERP';
  shortLabel: string;
  title: string;
  desc: string;
  highlights: string[];
}

export interface CustomToolProject {
  id: string;
  badge: string;
  status: string;
  title: string;
  summary: string;
  stack: string[];
  features: string[];
  href?: string;
  hrefLabel?: string;
  external?: boolean;
  /** 추후 public/images/ai/ 에 캡처 추가 시 자동 노출됩니다. */
  thumbnail?: string;
  thumbnailCaption?: string;
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

export interface OtCloudRoadmapStep {
  step: string;
  layer: string;
  title: string;
  tech: string;
  desc: string;
}

export interface OsmuStage {
  step: string;
  title: string;
  tools: string[];
  desc: string;
}

export interface MediaIrArchiveItem {
  id: string;
  date: string;
  status: string;
  badge: string;
  title: string;
  summary: string;
  highlights: string[];
  tools: string[];
  /** 추후 public/images/ai/ 에 증빙 캡처 추가 시 자동 표시됩니다. */
  thumbnail?: string;
  thumbnailCaption?: string;
  linkUrl?: string;
  linkLabel?: string;
}

/**
 * 추후 public/docs/ 에 AI·클라우드/프로젝트 포트폴리오 리포트 PDF를 넣고 url을 채우면
 * Reference 상단 바에 PDF 뷰어 버튼이 자동 활성화됩니다.
 */
export const AI_REFERENCE_PDF: PdfDocConfig = {
  title: 'AI 워크플로우 · 클라우드 아키텍처 기술 노트',
  subtitle: 'GCP AI Intensive · Vertex AI · OSMU Automation Pipeline',
  url: '',
  filename: 'ai-workflow-architecture-guide.pdf',
};

// ============================================================================
// PILLAR 1: LAB — AIN GOLF MVP 라이브 쇼케이스 & 자체 제작 툴
// ============================================================================
export const AIN_GOLF_SHOWCASE = {
  title: 'AIN GOLF 하이엔드 골프 플랫폼 MVP',
  url: 'https://ain-golf-mvp-azu2.vercel.app/',
  domainDisplay: 'ain-golf-mvp-azu2.vercel.app',
  period: '2025.12 – 2026.03',
  stack: ['Next.js App Router', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel Live'],
  tagline:
    '비개발자 배경에서 AI 협업(바이브코딩)으로 기획·DB 스키마·UI·배포까지 끝까지 완수한 풀스택 골프 커머스 & B2B SaaS 라이브 프로토타입',
  /** 추후 public/images/ai/ain-golf-preview.jpg 추가 시 쇼케이스 카드에 자동 표시됩니다. */
  thumbnail: '',
  thumbnailCaption: 'AIN GOLF MVP 라이브 화면 캡처',
  modules: [
    {
      id: 'b2c',
      tier: 'B2C',
      shortLabel: 'B2C 상품 · 견적기',
      title: '고객용 상품 탐색 & 실시간 견적기',
      desc: '베트남·해외 하이엔드 골프장 코스 조합, 인원·숙박·항공 옵션을 실시간으로 계산하는 고객 맞춤형 견적 UI.',
      highlights: ['지역/코스 조건 필터링', '인원·시즌별 단가 자동 산출', '모바일 우선 UX'],
    },
    {
      id: 'top3',
      tier: 'PRESENTATION',
      shortLabel: '총무용 Top 3 발표',
      title: '총무용 Top 3 비교 발표 모드',
      desc: '동호회·기업 행사 총무가 회원들에게 후보 3개 골프 일정을 한눈에 비교·공유해 의사결정 리드타임을 단축하는 발표 전용 뷰.',
      highlights: ['핵심 스펙 3안 병렬 비교', '견적·일정 원페이지 브리핑', '단톡방 공유 최적화'],
    },
    {
      id: 'saas-erp',
      tier: 'SAAS & ERP',
      shortLabel: 'SaaS 캔버스 & ERP',
      title: '골프장 SaaS 드래그 요금 캔버스 & Admin ERP',
      desc: '하나허브 ERP 실무 경험을 녹여낸 B2B 드래그 기간 요금 캔버스와 예약·원가·마진·고객 문의를 통합 추적하는 운영자 Admin ERP.',
      highlights: ['캘린더 드래그 동적 요금 제어', '예약·확정·원가 마진 시뮬레이션', 'Supabase 실시간 DB 연동'],
    },
  ] as AinGolfModule[],
};

export const CUSTOM_TOOLS_ARCHIVE: CustomToolProject[] = [
  {
    id: 'melsec-plc-hub',
    badge: 'LIVE ENGINEERING TOOL',
    status: '운영 중 · v1.5',
    title: 'MELSEC PLC 18종 학습 허브 & 현장 CS 툴킷',
    summary:
      '실물 PLC 장비 없이도 브라우저에서 50ms 스캔 주기로 18종 실전 래더(자기유지·정역 인터록·K1Y20 다단 출력·ZCP·스텝 시퀀스)를 직접 조작·검증하고 현장 트러블슈팅 DB와 PDF 교본을 즉시 조회하는 엔지니어링 웹앱.',
    stack: ['Next.js 15', 'TypeScript', '50ms Scan Engine', 'SVG Ladder Renderer', 'Tailwind CSS'],
    features: [
      '18종 실전 래더 인터랙티브 시뮬레이터 & 실시간 디바이스 모니터(X/Y/M/T/C/D)',
      'K1Y20 4-Bit 바이너리 ↔ 10진수 ↔ FR-E700 7단 속도 변환기',
      '증상별 현장 트러블슈팅 DB · AI 정밀 진단 프롬프트 · 내장 PDF 교본 뷰어',
    ],
    href: '/plc',
    hrefLabel: 'PLC 랩에서 직접 실행하기',
  },
  {
    id: 'brills-handshake-sim',
    badge: 'LIVE ENGINEERING TOOL',
    status: '운영 중 · v1.0',
    title: '브릴스 협동로봇 ↔ PLC 2-Way I/O 핸드셰이크 시뮬레이터',
    summary:
      'Start(Y20), EMG b접점(Y21), Recipe(Y22), Ack(Y23) 입력에 따른 로봇 상태(IDLE→BUSY→DONE→ACK / EMG ALARM)와 7개 I/O LED 전환을 실시간 검증하는 로보틱스 랩 모듈.',
    stack: ['React State Machine', 'Brills Lua Standard Loop', 'ROS 2 CLI Archive'],
    features: [
      'b접점(NC) 비상정지 차단 시 즉시 알람(DO_2) 및 모션 정지 인터록 검증',
      '::MAIN_LOOP:: 표준 Lua 코드 및 Rosbag2 4대 토픽 진단 치트시트 통합',
    ],
    href: '/robotics',
    hrefLabel: '로보틱스 랩에서 체험하기',
  },
  {
    id: 'local-ai-rag-slot',
    badge: 'UPCOMING EXPERIMENT',
    status: '확장 슬롯 · 실험 예정',
    title: '로컬 LLM(LM Studio) 기반 현장 매뉴얼 진단 & Ignition SCADA 연동 툴',
    summary:
      '보안이 중요한 제조 현장 오프라인 환경에서 PLC·인버터·로봇 알람 매뉴얼을 로컬 LLM으로 질의하고, Ignition 웹 SCADA 태그 데이터를 대시보드로 연결하는 실험 아카이브 확장 슬롯입니다.',
    stack: ['LM Studio / Local LLM', 'Ignition SCADA', 'OPC-UA', 'BigQuery Bridge'],
    features: [
      '오프라인 공장 망에서도 동작하는 알람 코드·배선 매뉴얼 로컬 RAG 실험 예정',
      'PLC 태그(D/M/Y) → 웹 대시보드 실시간 모니터링 프로토타입 누적 예정',
    ],
  },
];

// ============================================================================
// PILLAR 2: REFERENCE — GCP 심화 & AI Leader + OT/SCADA 로드맵 + OSMU 파이프라인
// ============================================================================
export const CLOUD_AI_CREDENTIALS: CloudCredential[] = [
  {
    id: 'gcp-deep',
    org: 'Google Cloud Platform',
    title: 'GCP AI 심화 실무 과정 수료 (36시간)',
    duration: '36 Hours Intensive',
    tags: ['BigQuery', 'Vertex AI', 'Cloud Web Build', 'Data Pipeline'],
    summary:
      'GCP 클라우드 웹 빌드 아키텍처, BigQuery 기반 대규모 데이터 적재·쿼리 분석, Vertex AI 환경에서의 생성형 AI 모델 학습·추론 파이프라인 집중 실습을 수료했습니다.',
    otBridge:
      '향후 제조 현장 PLC·협동로봇 가동 데이터를 Ignition SCADA 및 BigQuery로 적재하고 Vertex AI 예지보전·품질 이상 탐지로 연결하는 핵심 기술 기반.',
  },
  {
    id: 'ai-leader',
    org: 'Google Skills',
    title: 'Google Skills AI Leader 교육 수료',
    duration: 'AI Strategy & Execution',
    tags: ['Generative AI', 'AI Workflow', 'Prompt Engineering', 'Governance'],
    summary:
      '생성형 AI의 실무 도입 전략, 구조화된 프롬프트 엔지니어링, 업무 자동화 워크플로우 설계 및 비즈니스 케이스 검증 역량을 이수했습니다.',
    otBridge:
      '현장 CS 트러블슈팅 진단 프롬프트 표준화, 시운전 완료 리포트 자동 요약, 다국어(한·영·베) 기술 커뮤니케이션 효율 극대화에 즉시 적용.',
  },
];

export const OT_CLOUD_ROADMAP: OtCloudRoadmapStep[] = [
  {
    step: 'LAYER 01',
    layer: 'FIELD OT',
    title: 'PLC · 인버터 · 협동로봇 설비 데이터 수집',
    tech: 'MELSEC Q06UDEH · FR-E700 · Brills Cobot',
    desc: '현장 I/O 상태, 사이클 타임, 알람 코드, 인버터 전류·주파수 데이터를 D 레지스터와 로깅 구조로 표준화.',
  },
  {
    step: 'LAYER 02',
    layer: 'WEB SCADA / EDGE',
    title: '웹 기반 SCADA(Ignition) & 게이트웨이 시각화',
    tech: 'Ignition SCADA · OPC-UA · MQTT · MX Sheet',
    desc: '현장 설비 태그를 OPC-UA/MQTT로 수집해 브라우저 기반 실시간 운전 현황·알람 이력 대시보드로 통합.',
  },
  {
    step: 'LAYER 03',
    layer: 'CLOUD & AI',
    title: 'GCP BigQuery 데이터 웨어하우스 & Vertex AI 진단',
    tech: 'BigQuery · Vertex AI · Next.js Web App',
    desc: '장기 설비 로그를 클라우드에 누적 분석해 반복 알람 패턴 예측 및 CS 엔지니어용 AI 진단 코파일럿으로 확장.',
  },
];

export const OSMU_PIPELINE: {
  headline: string;
  metric: string;
  channels: string[];
  stages: OsmuStage[];
} = {
  headline: 'AI 기반 원소스 멀티유즈(OSMU) 숏폼 제작 파이프라인',
  metric: '기획 → TTS → 자동편집 → 5대 채널 동시 배포',
  channels: ['YouTube Shorts', 'Instagram Reels', 'TikTok', 'Naver Clip', 'Threads'],
  stages: [
    {
      step: 'STEP 01',
      title: '기획 · 3초 훅 대본 구조화 (LLM)',
      tools: ['LLM Prompting', 'Hook 템플릿', '키워드 리서치'],
      desc: '시청 유지율을 결정하는 초반 3초 훅(Hook) → 핵심 스토리/인사이트 → 행동 유도(CTA) 구조의 대본을 표준 프롬프트로 신속 초안 작성.',
    },
    {
      step: 'STEP 02',
      title: 'AI 보이스 합성 (TTS)',
      tools: ['AI TTS', '톤·속도 튜닝'],
      desc: '주제 분위기에 맞춘 자연스러운 내레이션 음성을 생성하고 호흡·배속을 숏폼 리듬(1.1~1.2x)에 맞게 미세 조정.',
    },
    {
      step: 'STEP 03',
      title: '컷 편집 · 자동 자막 마스터링',
      tools: ['Vrew', 'CapCut Pro', '자막 프리셋'],
      desc: 'Vrew로 무음 구간 자동 컷과 자막 초안을 뽑고, CapCut Pro 템플릿·B-roll·효과음을 결합해 제작 리드타임 70% 단축.',
    },
    {
      step: 'STEP 04',
      title: '5대 플랫폼 동시 배포 & 지표 피드백',
      tools: ['YouTube', 'Instagram', 'TikTok', 'Naver', 'Threads'],
      desc: '단일 마스터 영상을 5개 플랫폼 규격·해시태그 전략에 맞춰 동시 발행하고 완시율·이탈 구간을 다음 편 대본에 즉시 반영.',
    },
  ],
};

// ============================================================================
// PILLAR 3: FIELD LOG — OSMU 쇼츠 4개월 기록 & 유튜브 · IR 피칭 아카이브
// ============================================================================
export const SHORTS_EXECUTION_LOG = {
  channelName: '썰푸는 상점',
  handle: '@ssulshop',
  period: '2026 · 4개월+ 무중단',
  status: '120일+ 매일 1건 달성',
  headline: '아이디어가 아닌 "매일 1건 무중단 실행"으로 증명한 AI 자동화 루틴',
  summary:
    '단발성 테스트에 그치지 않고, LLM·TTS·Vrew·CapCut 기반 제작 파이프라인을 직접 구축해 썰푸는 상점(@ssulshop)을 중심으로 4개월 이상 하루도 빠짐없이 5대 채널에 매일 1건씩 발행·개선했습니다.',
  /** 추후 public/images/ai/ssulshop-analytics.jpg 등 증빙 캡처 추가 시 자동 노출됩니다. */
  thumbnail: '',
  thumbnailCaption: '썰푸는 상점(@ssulshop) OSMU 실행 기록',
  channelUrl: '',
  metrics: [
    { label: '연속 실행 기간', value: '4개월+ (120일+)', desc: '하루 1건 무중단 발행 루틴' },
    { label: '동시 배포 채널', value: '5개 플랫폼', desc: '유튜브·인스타·틱톡·네이버·스레드' },
    { label: '제작 시간 절감', value: '-70% 단축', desc: 'AI 파이프라인 & 프리셋 표준화' },
  ],
  retrospectives: [
    {
      title: '집요한 실행력 = 엔지니어링의 기본 체력',
      desc: '화려한 1회성 데모보다 매일 반복 가능한 표준 공정(SOP)을 만들고 끝까지 지키는 습관이 PLC·로봇 시운전과 현장 CS에서도 그대로 통한다는 것을 체감했습니다.',
    },
    {
      title: '데이터 기반 포맷 반복 개선 (PDCA)',
      desc: '초반 3초 이탈률과 완시율 지표를 보며 훅 문장 길이, 자막 가독성, 컷 전환 템포를 매주 A/B 개선해 제작 품질을 끌어올렸습니다.',
    },
    {
      title: '툴 조합으로 병목 제거',
      desc: '수동 자막·컷 편집 병목을 Vrew + CapCut 프리셋으로 자동화함으로써 기획과 메시지 완성도에 에너지를 집중할 수 있었습니다.',
    },
  ],
};

export const MEDIA_IR_ARCHIVE: MediaIrArchiveItem[] = [
  {
    id: 'youtube-metabox',
    date: '2020 – 2024',
    status: '채널 운영 완료',
    badge: 'YOUTUBE · MEDIA',
    title: '유튜브 채널 "메타박스" 기획 · 대본 · 녹음 · 편집 총괄',
    summary:
      '해외 사업과 디지털 커머스를 병행하며 유튜브 채널 메타박스의 주제 기획, 스토리보드 대본 작성, 직접 녹음 및 영상 편집까지 전 과정을 단독 수행해 디지털 미디어 제작 감각을 내재화했습니다.',
    highlights: [
      '주제 리서치부터 대본 구조화, 보이스 녹음, 컷 편집까지 엔드투엔드 제작',
      '이후 AI 기반 OSMU 쇼츠 파이프라인(썰푸는 상점)을 빠르게 구축하는 실전 토대 확보',
    ],
    tools: ['YouTube Studio', '기획·대본·녹음', '영상 편집', '디지털 커머스'],
    // thumbnail: '/images/ai/metabox-channel.jpg',
    thumbnailCaption: '유튜브 메타박스 채널 운영 기록',
  },
  {
    id: 'ir-pitch-office',
    date: '2012 – 2026',
    status: '실무 검증',
    badge: 'IR PITCHING · OFFICE',
    title: 'IR 피칭 · 고객사 기술 제안서 · 미리캔버스 · MS Office 실무 역량',
    summary:
      '연 80억 원가·수익 정산 시트와 180명 페이롤 관리표, PLC I/O 메모리 맵까지 엑셀·PPT로 체계화하고, 미리캔버스(중급 이상)를 활용해 비전공 고객사·임원진도 3분 안에 이해하는 시각 제안서를 외주 없이 즉각 제작합니다.',
    highlights: [
      'IR 피칭 & 고객사 기술 제안서: 복잡한 자동화·ERP 구조를 비즈니스 언어로 설득',
      '미리캔버스(중급 이상): 제안서 표지, 설비 비교 인포그래픽, 상세페이지 신속 제작',
      'MS Office(Excel · PPT): 연 80억 정산, 180명 페이롤, PLC I/O 맵 및 시운전 완료 보고서',
    ],
    tools: ['IR Deck', '미리캔버스', 'Excel 정산·I/O 맵', 'PowerPoint', '시운전 리포트'],
  },
  {
    id: 'local-ai-lab-notes',
    date: '2026 · 진행 중',
    status: '실험 누적 슬롯',
    badge: 'LOCAL AI · NOTES',
    title: '로컬 AI(LM Studio) & 현장 자동화 프롬프트 실험 노트',
    summary:
      '클라우드 의존 없이 오프라인 제조 현장 PC에서도 활용할 수 있는 경량 로컬 LLM(LM Studio) 세팅과 PLC/로봇 알람 진단 프롬프트 최적화 실험을 지속적으로 기록하는 누적 아카이브입니다.',
    highlights: [
      '현장 CS 진단 프롬프트 표준화 (PLC F3 모니터 · FR-E700 · 브릴스 알람 템플릿)',
      '추후 로컬 LLM 벤치마크·매뉴얼 RAG 실험 결과를 이 리스트에 계속 누적 예정',
    ],
    tools: ['LM Studio', 'Prompt Engineering', 'Field CS SOP', 'RAG Experiment'],
  },
];
