---
name: portfolio-sync
description: >-
  Use this skill when adding a new flagship lab, simulator, or live web app,
  changing section routes or hash deep-links, or when the user asks to audit
  or synchronize changes across the portfolio website without over-editing
  unrelated pages.
---

# Portfolio Cross-Page Sync & Relevance Audit

포트폴리오 웹앱(`ksh-automation-portfolio`)에 의미 있는 변경이 발생했을 때, **기계적 정합성 검증**과 **관련성 판정(Relevance Audit)**을 거쳐 꼭 필요한 곳만 최소 범위로 동기화하는 표준 절차입니다.

## 1. 5대 동기화 체크포인트 (전부 고치는 게 아니라 "관련 있는 것만" 선별)

| # | 체크포인트 | 파일 경로 | 언제 관련이 있는가? |
| - | --- | --- | --- |
| 1 | 메인 허브(`/`) 대표 카드 & 하단 3개 슬림 타일 | `data/site.ts` | 해당 섹터의 **대표(1순위) 랩·웹앱**이 새로 생겼거나 슬림 타일 딥링크(`#hash`)가 바뀔 때 |
| 2 | `/ai` → `자체 제작 툴 & 웹앱` 아카이브 | `src/data/aiData.ts` (`CUSTOM_TOOLS_ARCHIVE`) | 직접 개발한 **독립 인터랙티브 툴·시뮬레이터·웹앱**이 새로 추가될 때 |
| 3 | `/profile` 스펙 모달 & 경력 타임라인 증빙 | `src/data/profileData.ts` (`proofs`) | 이력서 증빙 카드에 걸린 링크(`/plc`, `/robotics`, `/ai`)의 대표 내용·해시가 갱신될 때 |
| 4 | 인쇄용 이력서·기술 리포트 PDF 모달 | `src/components/ResumePdfModal.tsx` | 핵심 경력·대표 기술 스택 요약이 크게 바뀔 때 |
| 5 | A4 QR 안내서 PDF | `public/docs/ksh-portfolio-qr-sheet.pdf` | 메인 URL 변경 또는 4대 섹터 요약 문구를 공식 인쇄물에도 반영할 필요가 있을 때 |

## 2. 실행 절차 (Strict Relevance-First Workflow)

1. **기계적 정적 검증 먼저 실행 (100% 자동)**
   ```powershell
   npm.cmd run verify
   ```
   - 깨진 내부 라우트, 대상 페이지에 없는 `#hash` 딥링크, 누락된 `public/docs` 파일, Tailwind v3 비표준 투명도, Git 원격(AIN 격리)을 기계적으로 검출합니다.
2. **변경 등급 판정 (Level 1 / 2 / 3)**
   - **Level 1** (오타·스타일·버그·기존 탭 내 로그 1건 추가): 타 페이지 수정 없이 **즉시 종료**.
   - **Level 2** (서브 탭/해시/파일 경로 변경): `npm.cmd run verify`에서 검출된 깨진 링크만 수정.
   - **Level 3** (신규 대표 랩·시뮬레이터·라이브 웹앱 추가): 5대 체크포인트 중 **실제 관련이 있는 항목만** 추려냅니다.
3. **영향도 브리핑 (Dry-Run First)**
   - 사용자가 "바로 다 동기화해 줘"라고 명시하지 않았다면, 먼저 아래 형식으로 **관련 항목 vs 미수정 항목**을 짧게 보고하고 확인받습니다:
     - **수정 대상**: 파일명 — 수정 이유 (1줄)
     - **미수정 유지**: 파일명 — 관련 없음 / 현 상태 유지 사유
4. **최소 범위 수정 & 최종 3단 검증**
   - 승인된 항목만 기존 디자인 톤(3-톤 서피스)을 유지해 수정한 뒤, 아래 명령으로 최종 검증합니다:
   ```powershell
   npm.cmd run verify; if ($LASTEXITCODE -eq 0) { npx.cmd tsc --noEmit }; if ($LASTEXITCODE -eq 0) { npm.cmd run build }
   ```
