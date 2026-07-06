// 크라이스트 테스트 웹 — 공유 로직/타입/문구 (클라이언트 안전: 질문 데이터만 import)
// 결과 데이터(ctResults.json)는 서버 컴포넌트에서만 import 한다(번들 경량화).
import questions from '../../lib/ctQuestions.json';

export type Lang = 'ko' | 'en';
export type Cat = 'C' | 'H' | 'R' | 'I' | 'S' | 'T';
export type Opt = { text: string; score: number };
export type Question = {
  id: number; category: Cat; type: 'SCENARIO' | 'AGREE_DISAGREE';
  question: string; options: Opt[] | null; leftLabel: string | null; rightLabel: string | null;
};
export type ResultData = {
  id: number; model: string; model_en: string; title: string; title_en: string;
  verse: string; verse_en: string; reference: string; reference_en: string;
  reveal: string; comfort: string; god: string; prayer: string;
  reveal_en: string; comfort_en: string; god_en: string; prayer_en: string;
};

const QUESTIONS = questions as { ko: Question[]; en: Question[] };
export const getQuestions = (lang: Lang): Question[] => QUESTIONS[lang] || QUESTIONS.ko;

// 앱(types.ts getTypeCode)과 동일 — 점수 6개 → 7자리 코드 (임계값 13)
export function getTypeCode(s: Record<Cat, number>): string {
  return [
    s.C >= 13 ? 'P' : 'E',
    s.H >= 13 ? 'T' : 'G',
    s.S >= 13 ? 'V' : 'S',
    s.R >= 13 ? 'I' : 'U',
    '-',
    s.I >= 13 ? 'D' : 'B',
    s.T >= 13 ? 'W' : 'M',
  ].join('');
}

// 결과 필드 언어 선택 헬퍼
export function pick(r: ResultData, field: 'model' | 'title' | 'verse' | 'reference' | 'reveal' | 'comfort' | 'god' | 'prayer', lang: Lang): string {
  const v = lang === 'en' ? (r as any)[field + '_en'] : (r as any)[field];
  return v || (r as any)[field] || '';
}

export const STORE = {
  deepLink: 'christ-app://christ-test',
  android: 'https://play.google.com/store/apps/details?id=com.root2christ.christapp',
  ios: 'https://apps.apple.com/app/id6779090825',
};

// 팔레트 (앱 신규 톤: 하늘/크림, 보라 없음)
export const C = {
  sky: '#38BDF8', skyDark: '#0EA5E9', skyDeep: '#0284C7',
  cream: '#FAF7F0', card: '#FBF7EF', border: '#EBF7FE',
  ink: '#1E293B', muted: '#64748B', faint: '#94A3B8', white: '#FFFFFF',
};

export const UI = {
  ko: {
    kicker: '성경인물 성향 테스트',
    title: '크라이스트 테스트',
    subtitle: '성경 속 64명의 인물 중,\n나와 가장 닮은 사람은 누구일까요?',
    meta: '약 3분 · 30문항 · 무료',
    start: '테스트 시작하기',
    intro2: '정답은 없어요. 가장 나 같은 쪽을 편하게 고르면 됩니다.',
    part: (c: string) => `Part ${c}`,
    prog: (i: number, n: number) => `${i} / ${n}`,
    agreeLeft: '① 가까움',
    agreeRight: '가까움 ④',
    back: '이전',
    calc: '결과를 준비하고 있어요…',
    are: (m: string) => `당신은 '${m}'입니다`,
    revealKicker: '오늘 당신에게',
    comfortLabel: '당신은',
    godLabel: '하나님은',
    prayerLabel: '함께 드리는 기도',
    verseLabel: '오늘의 말씀',
    share: '내 결과 공유하기',
    copied: '링크가 복사됐어요 · 붙여넣기 하세요',
    retake: '다시 하기',
    ctaTitle: '이건 시작일 뿐이에요',
    ctaBody: 'CHRIST 6차원 심층 분석과\n나와 닮은 인물의 탐구 여정은 soluma 앱에서',
    ctaBtn: 'soluma 앱에서 더 깊이 보기',
    langBtn: 'EN',
  },
  en: {
    kicker: 'Bible Character Type Test',
    title: 'Christ Test',
    subtitle: 'Among 64 figures in Scripture,\nwho are you most like?',
    meta: 'About 3 min · 30 questions · Free',
    start: 'Start the test',
    intro2: 'There are no wrong answers. Just pick what feels most like you.',
    part: (c: string) => `Part ${c}`,
    prog: (i: number, n: number) => `${i} / ${n}`,
    agreeLeft: '① closer',
    agreeRight: 'closer ④',
    back: 'Back',
    calc: 'Preparing your result…',
    are: (m: string) => `You are ${m}`,
    revealKicker: 'For you today',
    comfortLabel: 'You',
    godLabel: 'God',
    prayerLabel: 'A prayer for you',
    verseLabel: 'Today’s verse',
    share: 'Share my result',
    copied: 'Link copied — paste it anywhere',
    retake: 'Retake',
    ctaTitle: 'This is only the beginning',
    ctaBody: 'The full 6-dimension CHRIST analysis and\na reading journey with your figure await in the soluma app',
    ctaBtn: 'Go deeper in the soluma app',
    langBtn: '한국어',
  },
} as const;

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'ko';
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'ko';
}
