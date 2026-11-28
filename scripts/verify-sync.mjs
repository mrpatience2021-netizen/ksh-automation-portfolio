import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];
const notices = [];

function readText(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

function walkFiles(dirRel, extFilter) {
  const start = path.join(ROOT, dirRel);
  if (!fs.existsSync(start)) return [];
  const results = [];
  const stack = [start];
  while (stack.length > 0) {
    const curr = stack.pop();
    for (const entry of fs.readdirSync(curr, { withFileTypes: true })) {
      const full = path.join(curr, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (extFilter.some((ext) => entry.name.endsWith(ext))) {
        results.push(path.relative(ROOT, full));
      }
    }
  }
  return results;
}

// ============================================================================
// 1. Discover valid App Router routes and supported hashes per route
// ============================================================================
const pageFiles = walkFiles('src/app', ['page.tsx']);
const routeMap = new Map(); // '/plc' -> Set<string> of valid hashes

for (const rel of pageFiles) {
  const normalized = rel.replace(/\\/g, '/');
  const routePath =
    normalized === 'src/app/page.tsx'
      ? '/'
      : '/' + normalized.replace(/^src\/app\//, '').replace(/\/page\.tsx$/, '');
  routeMap.set(routePath, new Set());
}

// Collect explicit hash router branches in each page.tsx + DOM id="..." in page & sector components
const routeComponentDirs = {
  '/': ['src/app/page.tsx'],
  '/profile': ['src/app/profile/page.tsx', ...walkFiles('src/components/profile', ['.tsx'])],
  '/plc': ['src/app/plc/page.tsx', ...walkFiles('src/components/plc', ['.tsx'])],
  '/robotics': ['src/app/robotics/page.tsx', ...walkFiles('src/components/robotics', ['.tsx'])],
  '/ai': ['src/app/ai/page.tsx', ...walkFiles('src/components/ai', ['.tsx'])],
};

for (const [route, files] of Object.entries(routeComponentDirs)) {
  const set = routeMap.get(route);
  if (!set) continue;
  for (const file of files) {
    const content = readText(file);
    if (!content) continue;
    // Match JSX id="foo"
    for (const m of content.matchAll(/\bid=["']([a-zA-Z0-9_-]+)["']/g)) {
      set.add(m[1].toLowerCase());
    }
    // Match hash router comparisons like hash === 'mission-lab' or h === 'binary'
    for (const m of content.matchAll(/\b(?:hash|h)\s*===\s*['"]([a-zA-Z0-9_-]+)['"]/g)) {
      set.add(m[1].toLowerCase());
    }
  }
}

// ============================================================================
// 2. Verify every internal href (route + #hash) in data files
// ============================================================================
const dataFiles = [
  'data/site.ts',
  'src/data/profileData.ts',
  'src/data/plcData.ts',
  'src/data/roboticsData.ts',
  'src/data/aiData.ts',
];

let checkedLinks = 0;
for (const rel of dataFiles) {
  const content = readText(rel);
  if (!content) continue;
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const m of line.matchAll(/\bhref:\s*['"](\/[^'"]*)['"]/g)) {
      const href = m[1];
      checkedLinks += 1;
      const [baseRoute, rawHash] = href.split('#');
      const normalizedBase = baseRoute || '/';
      if (!routeMap.has(normalizedBase)) {
        errors.push(`[BROKEN ROUTE] ${rel}:${idx + 1} -> "${href}" (route "${normalizedBase}" does not exist)`);
        continue;
      }
      if (rawHash) {
        const hashKey = rawHash.toLowerCase();
        const validHashes = routeMap.get(normalizedBase);
        if (!validHashes.has(hashKey)) {
          errors.push(
            `[BROKEN HASH] ${rel}:${idx + 1} -> "${href}" (hash "#${rawHash}" not handled on "${normalizedBase}")`
          );
        }
      }
    }
  });
}

// ============================================================================
// 3. Verify active local static asset paths (/docs/... & /images/...)
// ============================================================================
const OPTIONAL_FALLBACK_ASSETS = new Set(['/images/profile-main.jpg']);
let checkedAssets = 0;

for (const rel of dataFiles) {
  const content = readText(rel);
  if (!content) continue;
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const m of line.matchAll(/\b(?:url|image|thumbnail|photoSrc|heroImageLocal):\s*['"](\/(?:docs|images)\/[^'"]+)['"]/g)) {
      const assetUrl = m[1];
      checkedAssets += 1;
      const diskPath = path.join(ROOT, 'public', assetUrl.replace(/^\//, ''));
      if (!fs.existsSync(diskPath)) {
        if (OPTIONAL_FALLBACK_ASSETS.has(assetUrl)) {
          notices.push(`[FALLBACK ASSET] ${rel}:${idx + 1} -> "${assetUrl}" (미배치 — 이니셜 플레이스홀더 폴백 정상 동작)`);
        } else {
          errors.push(`[MISSING ASSET] ${rel}:${idx + 1} -> "${assetUrl}" (public 파일 없음)`);
        }
      }
    }
  });
}

// ============================================================================
// 4. Tailwind CSS v3 invalid opacity guard (/12, /92, /98 in className)
// ============================================================================
const tsxFiles = walkFiles('src', ['.tsx']);
for (const rel of tsxFiles) {
  const content = readText(rel);
  if (!content) continue;
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    // Only flag Tailwind utility opacity modifiers (e.g. bg-white/92, border-white/12)
    if (/\b(?:bg|text|border|ring|from|via|to)-[a-zA-Z0-9_\-\[\]#]+\/(?:12|92|98)\b/.test(line)) {
      errors.push(`[INVALID TAILWIND V3 OPACITY] ${rel}:${idx + 1} -> ${line.trim()}`);
    }
  });
}

// ============================================================================
// 5. Git Remote Isolation Guard (never accidentally point to AIN repo)
// ============================================================================
const gitConfig = readText('.git/config');
if (gitConfig) {
  if (/ain-golf/i.test(gitConfig)) {
    errors.push('[ISOLATION VIOLATION] .git/config contains reference to "ain-golf"! Must stay isolated.');
  }
  if (!/ksh-automation-portfolio/i.test(gitConfig)) {
    notices.push('[GIT REMOTE] origin is not pointing to ksh-automation-portfolio.');
  }
}

// ============================================================================
// Summary Output
// ============================================================================
console.log('=== Portfolio Mechanical Sync Verifier ===');
console.log(`Routes discovered: ${Array.from(routeMap.keys()).join(', ')}`);
console.log(`Internal href/hash links verified: ${checkedLinks}`);
console.log(`Active local assets verified: ${checkedAssets}`);
console.log(`TSX files scanned for Tailwind v3 opacity guard: ${tsxFiles.length}`);

if (notices.length > 0) {
  console.log('\nNotices:');
  for (const n of notices) console.log(`  - ${n}`);
}

if (errors.length > 0) {
  console.error('\nFAIL — Integrity errors found:');
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log('\nPASS — All routes, #hash deep-links, local assets, Tailwind v3 tokens, and Git isolation checks passed!');
