// ────────────────────────────────────────────────────────────────
// 앱(mobile-app)의 크라이스트 테스트 원본 데이터를 웹용 JSON으로 추출.
//   - 질문 ko/en (앱과 동일 파일 그대로)
//   - 64개 코드를 getTypeDetails 캐스케이드로 미리 해석 → 대표 인물 + 잔잔한 결과
//   - 인물 투명 PNG를 웹용 webp(512px)로 최적화 복사
// 로컬에서 1회 실행 후 산출물(lib/christTestData.json, public/ct/*.webp)을 커밋한다.
// 재실행: node scripts/build_christ_test_data.mjs
// ────────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DATA = path.resolve(__dirname, '../../mobile-app/src/data');
const APP_IMG = path.resolve(__dirname, '../../mobile-app/assets/characters_transparent');
const OUT_Q = path.resolve(__dirname, '../lib/ctQuestions.json');
const OUT_R = path.resolve(__dirname, '../lib/ctResults.json');
const OUT_IMG = path.resolve(__dirname, '../public/ct');

// 문자열/이스케이프를 인식하는 괄호 매처로 리터럴 추출
function extractLiteral(src, declRegex, openChar) {
  const m = src.match(declRegex);
  if (!m) throw new Error('선언을 못 찾음: ' + declRegex);
  let i = src.indexOf(openChar, m.index + m[0].length);
  if (i < 0) throw new Error('여는 괄호 없음: ' + openChar);
  const closeChar = openChar === '[' ? ']' : '}';
  let depth = 0, inStr = false, quote = '', esc = false;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; quote = c; continue; }
    if (c === openChar) depth++;
    else if (c === closeChar) { depth--; if (depth === 0) return src.slice(i, j + 1); }
  }
  throw new Error('닫는 괄호를 못 찾음');
}

function evalLiteral(literal) {
  // 신뢰된 로컬 소스 → Function으로 JS 리터럴 평가 (unquoted key/trailing comma 허용)
  return new Function('return (' + literal + ');')();
}

function loadArray(file, name) {
  const src = fs.readFileSync(path.join(APP_DATA, file), 'utf8');
  return evalLiteral(extractLiteral(src, new RegExp('export const ' + name + '\\b[^=]*='), '['));
}
function loadObject(file, name) {
  const src = fs.readFileSync(path.join(APP_DATA, file), 'utf8');
  return evalLiteral(extractLiteral(src, new RegExp('export const ' + name + '\\b[^=]*='), '{'));
}

// ── 원본 로드 ──
const questionsKo = loadArray('questions.ts', 'questions');
const questionsEn = loadArray('questions_en.ts', 'questions_en');
const ANALYSIS = loadArray('analysisData.ts', 'NEW_ANALYSIS_DATA');
const SOFT = loadObject('softResultData.ts', 'SOFT_RESULTS');
const REP = loadObject('typesData.ts', 'REPRESENTATIVE_BY_CODE');
const SOFT_LIST = Object.values(SOFT);

console.log(`로드: 질문 ko=${questionsKo.length} en=${questionsEn.length}, 분석=${ANALYSIS.length}, 잔잔한결과=${SOFT_LIST.length}, 대표=${Object.keys(REP).length}`);

// ── getTypeDetails 해석 캐스케이드 이식 (typesData.ts와 동일) ──
function findExact(c) {
  const rep = REP[c];
  if (rep) {
    const m = ANALYSIS.find((d) => d.code === c && d.model === rep);
    if (m) return m;
  }
  return ANALYSIS.find((d) => d.code === c);
}
function resolveEntry(rawCode) {
  const code = rawCode.toUpperCase();
  let data = findExact(code);
  if (!data && code.length >= 4 && (code[2] === 'S' || code[2] === 'H')) {
    data = findExact(code.slice(0, 2) + 'V' + code.slice(3));
  }
  if (!data) data = ANALYSIS.find((d) => d.code.startsWith(code.slice(0, 4)));
  if (!data && code.length >= 4) data = ANALYSIS.find((d) => d.code.startsWith(code.slice(0, 2) + 'V' + code[3]));
  if (!data && code.length >= 2) data = ANALYSIS.find((d) => d.code.startsWith(code.slice(0, 2)));
  return data || null;
}
function softFor(entry) {
  if (!entry) return null;
  return (
    SOFT_LIST.find((e) => e.code === entry.code && e.model === entry.model) ||
    SOFT_LIST.find((e) => e.code === entry.code) ||
    null
  );
}

// ── 64개 코드 전개 (getTypeCode 산출 문자 집합) ──
const AXES = [['P', 'E'], ['T', 'G'], ['V', 'S'], ['I', 'U'], ['D', 'B'], ['W', 'M']];
const codes = [];
for (const c of AXES[0]) for (const h of AXES[1]) for (const s of AXES[2]) for (const r of AXES[3]) for (const i of AXES[4]) for (const t of AXES[5]) {
  codes.push(`${c}${h}${s}${r}-${i}${t}`);
}

const results = {};
const usedIds = new Set();
let missingSoft = 0;
for (const code of codes) {
  const e = resolveEntry(code);
  const s = softFor(e);
  if (!e) { console.warn('해석 실패:', code); continue; }
  if (!s) missingSoft++;
  usedIds.add(e.id);
  results[code] = {
    id: e.id,
    model: e.model,
    model_en: e.model_en || e.model,
    title: e.title || '',
    title_en: e.title_en || e.title || '',
    verse: e.verse || '',
    verse_en: e.verse_en || e.verse || '',
    reference: e.reference || '',
    reference_en: e.reference_en || e.reference || '',
    reveal: s?.reveal || '',
    comfort: s?.comfort || '',
    god: s?.god || '',
    prayer: s?.prayer || '',
    reveal_en: s?.reveal_en || s?.reveal || '',
    comfort_en: s?.comfort_en || s?.comfort || '',
    god_en: s?.god_en || s?.god || '',
    prayer_en: s?.prayer_en || s?.prayer || '',
  };
}
console.log(`코드 해석: ${Object.keys(results).length}/64, 잔잔한결과 없음=${missingSoft}, 고유 인물이미지=${usedIds.size}`);

// 질문은 화면 렌더에 필요한 필드만 (verbatim)
const trimQ = (q) => ({
  id: q.id, category: q.category, type: q.type, question: q.question,
  options: q.options || null, leftLabel: q.leftLabel || null, rightLabel: q.rightLabel || null,
});

fs.mkdirSync(path.dirname(OUT_Q), { recursive: true });
fs.writeFileSync(OUT_Q, JSON.stringify({ ko: questionsKo.map(trimQ), en: questionsEn.map(trimQ) }));
fs.writeFileSync(OUT_R, JSON.stringify(results));
console.log('JSON 저장:', `질문 ${(fs.statSync(OUT_Q).size / 1024).toFixed(0)}KB · 결과 ${(fs.statSync(OUT_R).size / 1024).toFixed(0)}KB`);

// ── 인물 이미지 웹 최적화 (512px webp) ──
fs.mkdirSync(OUT_IMG, { recursive: true });
let imgOk = 0;
for (const id of usedIds) {
  const src = path.join(APP_IMG, `char_${String(id).padStart(3, '0')}.png`);
  const dst = path.join(OUT_IMG, `${id}.webp`);
  if (!fs.existsSync(src)) { console.warn('이미지 없음:', src); continue; }
  await sharp(src).resize(512, 512, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(dst);
  // OG 카드(next/og · Satori)는 webp 미지원 → PNG(투명, 크림 배경 위 합성)도 생성
  await sharp(src).resize(420, 420, { fit: 'inside', withoutEnlargement: true }).png({ quality: 90 }).toFile(path.join(OUT_IMG, `${id}.png`));
  imgOk++;
}
console.log(`이미지 최적화: ${imgOk}/${usedIds.size} → public/ct/*.webp`);

// ── OG 카드(카톡/SNS 미리보기) 정적 생성 (1200×630 jpg) ──
// next/og(@vercel/og)가 Windows에서 깨지고 런타임 렌더도 무거우므로, 빌드시 sharp로 미리 굽는다.
// 라틴 텍스트만(한글 이름/문구는 페이지 og:title·description으로 전달) → 폰트 임베드로 어디서든 동일.
const OG_DIR = path.join(OUT_IMG, 'og');
fs.mkdirSync(OG_DIR, { recursive: true });
const FONT_TTF = path.join(__dirname, '../node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf');
const fontB64 = fs.existsSync(FONT_TTF) ? fs.readFileSync(FONT_TTF).toString('base64') : null;
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let ogOk = 0;
for (const [code, r] of Object.entries(results)) {
  const src = path.join(OUT_IMG, `${r.id}.png`);
  if (!fs.existsSync(src)) continue;
  const name = r.model_en || 'Christ Test';
  const nameSize = name.length > 15 ? 46 : name.length > 10 ? 62 : 84;
  const face = await sharp(src).resize(380, 420, { fit: 'inside', withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
  const fx = Math.round(284 - face.info.width / 2);
  const fy = Math.round(315 - face.info.height / 2);
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><style>@font-face{font-family:'N';src:url(data:font/ttf;base64,${fontB64})}</style></defs>
    <rect width="1200" height="630" fill="#FAF7F0"/>
    <rect x="64" y="64" width="440" height="502" rx="44" fill="#FBF7EF" stroke="#EBF7FE" stroke-width="2"/>
    <text x="560" y="250" font-family="N" font-size="26" font-weight="700" letter-spacing="4" fill="#0284C7">CHRIST TEST</text>
    <text x="560" y="${name.length > 10 ? 330 : 345}" font-family="N" font-size="${nameSize}" font-weight="700" fill="#1E293B">${xml(name)}</text>
    <text x="560" y="405" font-family="N" font-size="29" fill="#64748B">Which Bible figure are you?</text>
    <rect x="560" y="470" width="176" height="58" rx="29" fill="#38BDF8"/>
    <text x="648" y="508" font-family="N" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle">soluma</text>
    <text x="758" y="508" font-family="N" font-size="22" font-weight="700" letter-spacing="3" fill="#94A3B8">${xml(code)}</text>
  </svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: face.data, left: fx, top: fy }])
    .jpeg({ quality: 82 })
    .toFile(path.join(OG_DIR, `${code}.jpg`));
  ogOk++;
}
console.log(`OG 카드: ${ogOk}/${Object.keys(results).length} → public/ct/og/*.jpg`);
console.log('완료.');
