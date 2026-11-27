export interface NavItem {
  label: string;
  href: string;
  key: 'profile' | 'plc' | 'robotics' | 'ai';
}

export interface HeroMetric {
  id: string;
  kicker: string;
  title: string;
  href: string;
  icon: 'trending_up' | 'groups' | 'public';
}

export interface CapabilityCard {
  id: 'plc' | 'robotics' | 'ai';
  indexLabel: string;
  title: string;
  description: string;
  techSpec: string;
  href: string;
  theme: 'dark' | 'blue' | 'lavender';
  pills: { label: string; href: string; highlight?: boolean; externalArrow?: boolean }[];
}

export const SITE_META = {
  brandName: '김성현',
  englishName: 'Ricky Kim',
  roleBadge: '글로벌 자동화 아키텍트',
  year: '2026',
  portfolioBadge: 'PORTFOLIO — 2026 · ARCHITECT FINAL',
  heroIdentityKr: '김성현',
  heroIdentityEn: 'Ricky Kim',
  heroHeadline: '로봇·PLC 글로벌 자동화 전문가로의 여정.',
  heroSubtitle: '현장을 움직이는 글로벌 실무자, PLC·로봇·AI로 공정을 설계하다',
  footerSubtext: '글로벌 자동화 아키텍트 포트폴리오',
  location: '천안·아산 / 국내·해외 셋업 출장 가능',
  languages: '영어 비즈니스 · 베트남어 회화',
  experienceSummary: '글로벌 실무 11년 9개월 + 브릴스 협동로봇·MELSEC PLC 집중 과정',
  email: 'mr_patience@naver.com',
  phone: '010-6467-8463',
  // 추후 본인 프로필 사진이나 로봇 현장 사진으로 경로만 교체할 수 있습니다.
  heroImageLocal: '/images/hero-robot.jpg',
  heroImageFallback:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jm0vjcUgMpiMreEuomcY7sR59gbmvXjv5jrpLHjXmcstn4ehLfxxz-5ItS1qX8Yb504XWeqHkS6J78S1zfuBNEmARJo2J42m1zDDvkMMqsamQK7sGWVuCOtCBfG5n9PrZDadZ34-q2Nwrv6zUQPL71zj7YAqf4aHukFCasbJB03x6K2qMYZg53m5dSRQpRvTTqNVZPvGBhbG4CiypvbwRcqmivF9Wf0-HOIG8ZKy',
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: '프로필', href: '/profile', key: 'profile' },
  { label: 'PLC 랩', href: '/plc', key: 'plc' },
  { label: '로보틱스', href: '/robotics', key: 'robotics' },
  { label: 'AI·빌드', href: '/ai', key: 'ai' },
];

export const HERO_METRICS: HeroMetric[] = [
  {
    id: 'handling',
    kicker: 'HANDLING',
    title: '연 80억 매출 핸들링',
    href: '/profile#metrics',
    icon: 'trending_up',
  },
  {
    id: 'scaleup',
    kicker: 'SCALE UP',
    title: 'EPC 180명 확장',
    href: '/profile#metrics',
    icon: 'groups',
  },
  {
    id: 'global',
    kicker: 'GLOBAL ROLE',
    title: '영어·베트남어 PM',
    href: '/profile#specs',
    icon: 'public',
  },
];

export const CORE_CAPABILITIES: CapabilityCard[] = [
  {
    id: 'plc',
    indexLabel: '01. PLC 자동화',
    title: 'PLC AUTOMATION',
    description: 'MELSEC Q06UDEH 래더 제어 · FR-E700 인버터 · 현장 시운전 & CS',
    techSpec: 'MELSEC Q06UDEH · FR-E700 다단 인버터',
    href: '/plc',
    theme: 'dark',
    pills: [
      { label: '18종 시뮬레이터', href: '/plc#simulator', highlight: true },
      { label: 'K1Y20', href: '/plc#binary' },
      { label: '트러블슈팅 DB', href: '/plc#troubleshooting' },
    ],
  },
  {
    id: 'robotics',
    indexLabel: '02. 로보틱스 & ROS 2',
    title: 'ROBOTICS & ROS 2',
    description: '브릴스 협동로봇 정밀 티칭 · Lua 순차 제어 · ROS 2 아키텍처',
    techSpec: 'BRILS 6-AXIS COBOT · LUA KINEMATICS',
    href: '/robotics',
    theme: 'blue',
    pills: [
      { label: '브릴스 티칭', href: '/robotics#teaching' },
      { label: 'Lua 스크립트', href: '/robotics#lua' },
      { label: 'ROS 2 랩', href: '/robotics#ros2-cli' },
    ],
  },
  {
    id: 'ai',
    indexLabel: '03. AI & 웹 빌드',
    title: 'AI & WEB BUILD',
    description: 'AIN GOLF MVP 독학 배포 · GCP 심화 · AI 자동화 실행력',
    techSpec: 'FULL-STACK · CLOUD ARCHITECTURE',
    href: '/ai',
    theme: 'lavender',
    pills: [
      { label: 'AIN GOLF', href: '/ai#ain-golf', externalArrow: true },
      { label: 'GCP 심화', href: '/ai#gcp' },
      { label: 'OSMU 쇼츠', href: '/ai#shorts' },
    ],
  },
];
