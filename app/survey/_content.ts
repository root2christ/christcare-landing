// soluma 목회자 자문 설문 — 84문항 본설문 + 크라이스트 테스트 30문항 검증
// 원본: soluma_prelaunch_clean.txt (289~888줄) + mobile-app/src/data/questions_3040.ts
// ⚠️ 원문 그대로. 임의 축약/생략 금지.

// ───────────── 본설문 84문항 ─────────────
export type FieldKind = 'radio' | 'checkbox' | 'text';

export interface SurveyQuestion {
  id: string;          // 'q8', 'q9' ... (문항 번호 기반)
  no: number;          // 원문 문항 번호 (1~84)
  label?: string;      // 보조 라벨 (예: '기도제목 기능')
  question: string;    // 문항 본문
  kind: FieldKind;     // radio(단일) / checkbox(복수) / text(서술형)
  options?: string[];  // 객관식 선택지 (원문 □ 항목 그대로)
  freeText?: boolean;  // 객관식 아래 "자유의견" 입력칸 노출 여부
}

export interface SurveySection {
  id: string;          // 'I', 'II' ...
  title: string;       // 'Ⅰ. 기본 정보' 등
  questions: SurveyQuestion[];
}

// 자유의견(=freeText) 답변 키: `${id}__free`
export const FREE_SUFFIX = '__free';

export const SURVEY_SECTIONS: SurveySection[] = [
  // ─────────── Ⅱ. ROOT 비전 및 재단 방향 (8~15) ───────────
  // (Ⅰ.기본정보 1~7은 별도 기본정보 폼에서 처리)
  {
    id: 'II',
    title: 'Ⅱ. ROOT 비전 및 재단 방향',
    questions: [
      {
        id: 'q8', no: 8,
        question: 'ROOT가 추구하는 "하나님께 뿌리를 두고 사람을 살리는 기업"이라는 비전에 공감하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 공감', '공감', '보통', '다소 우려', '우려'],
      },
      {
        id: 'q9', no: 9,
        question: '기독교 플랫폼 기업이 한국교회에 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q10', no: 10,
        question: 'ROOT의 비영리재단 설립 방향에 대해 어떻게 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 긍정적', '긍정적', '보통', '우려됨', '매우 우려됨'],
      },
      {
        id: 'q11', no: 11,
        question: '재단이 가장 먼저 지원해야 할 사역은 무엇입니까?',
        kind: 'radio', freeText: true,
        options: ['비자립교회 지원', '국내선교', '해외선교', '목회자 가정 지원', '선교사 가정 지원', '다음세대 장학사업', '긴급구제사역', '기타'],
      },
      {
        id: 'q12', no: 12,
        question: 'ROOT가 가장 우선적으로 해야 할 사역은 무엇이라고 생각하십니까?',
        kind: 'text',
      },
      {
        id: 'q13', no: 13,
        question: '현재 한국교회가 가장 필요로 하는 것은 무엇이라고 생각하십니까?',
        kind: 'text',
      },
      {
        id: 'q14', no: 14,
        question: '재단 운영 시 가장 중요한 가치는 무엇이라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['투명성', '공정성', '지속 가능성', '선교 중심성', '전문성'],
      },
      {
        id: 'q15', no: 15,
        question: 'ROOT를 위한 조언이나 제안이 있다면 자유롭게 작성해 주십시오.',
        kind: 'text',
      },
    ],
  },

  // ─────────── Ⅲ. SOLUMA 플랫폼 전체 평가 (16~22) ───────────
  {
    id: 'III',
    title: 'Ⅲ. SOLUMA 플랫폼 전체 평가',
    questions: [
      {
        id: 'q16', no: 16,
        question: 'SOLUMA의 전체 방향성에 공감하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 공감', '공감', '보통', '우려됨', '매우 우려됨'],
      },
      {
        id: 'q17', no: 17,
        question: '목회 현장에서 실제 활용 가능성이 있다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 높음', '높음', '보통', '낮음', '매우 낮음'],
      },
      {
        id: 'q18', no: 18,
        question: '솔루마가 가장 도움이 될 대상은 누구라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['청소년', '청년', '장년', '새신자', '리더', '사역자', '전 세대'],
      },
      {
        id: 'q19', no: 19,
        question: '청년 정착 및 공동체 활성화에 도움이 될 것이라 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q20', no: 20,
        question: '다음세대 신앙교육에 도움이 될 것이라 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q21', no: 21,
        question: '목회 현장에서 가장 필요한 디지털 사역은 무엇입니까?',
        kind: 'text',
      },
      {
        id: 'q22', no: 22,
        question: '솔루마 전체에 대한 의견을 자유롭게 작성해 주십시오.',
        kind: 'text',
      },
    ],
  },

  // ─────────── Ⅳ. 크라이스트 테스트 검증 (23~37) ───────────
  {
    id: 'IV',
    title: 'Ⅳ. 크라이스트 테스트 검증',
    questions: [
      {
        id: 'q23', no: 23,
        question: '신앙적 성향 분석이라는 개념에 대해 어떻게 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 긍정적', '긍정적', '보통', '우려됨', '매우 우려됨'],
      },
      {
        id: 'q24', no: 24,
        question: '크라이스트 테스트가 신앙 성장에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '부족함', '도움 안됨'],
      },
      {
        id: 'q25', no: 25,
        question: '새가족 교육에 활용 가능하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 가능', '가능', '보통', '어려움', '매우 어려움'],
      },
      {
        id: 'q26', no: 26,
        question: '청년 사역에 도움이 될 것이라 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q27', no: 27,
        question: '동역자 간 서로를 이해하는 데 도움이 될 것이라 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q28', no: 28,
        question: '신학적으로 우려되는 부분이 있다면 작성해 주십시오.',
        kind: 'text',
      },
      {
        id: 'q29', no: 29,
        question: '30개 문항의 표현은 적절하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 적절', '적절', '보통', '수정 필요', '대폭 수정 필요'],
      },
      {
        id: 'q30', no: 30,
        question: '수정 또는 삭제가 필요한 문항이 있다면 작성해 주십시오.',
        kind: 'text',
      },
      {
        id: 'q31', no: 31,
        question: '결과 화면에서 가장 중요하다고 생각하는 것은 무엇입니까?',
        kind: 'radio', freeText: true,
        options: ['신앙적 강점', '신앙적 약점', '추천 말씀', '추천 미션', '추천 공동체', '성경 인물 분석'],
      },
      {
        id: 'q32', no: 32,
        question:
          '64명의 성경 인물 매칭에 대해 어떻게 생각하십니까?\n' +
          '(스더, 바울, 바나바, 느헤미야, 다니엘, 모세, 다윗, 드보라, 요셉, 베드로, 요한, 한나, 기드온, 아삽, 고넬료, 여호수아, 에훗, 미리암, 보아스, 훌다, 히스기야, 마리아(베다니), 나다나엘, 아리마대 요셉, 여호사밧, 바르실래, 글로바, 욥, 엘리사벳, 수산나, 술람미 여인, 아나니아, 구레네 시몬, 아비새, 바락, 옷니엘, 스룹바벨, 이사야, 요나단, 세례 요한, 스데반, 나단, 사가랴, 여호야다, 아비아달, 두기고, 라합, 빌레몬, 요셉(예수 양부), 시므온, 이드로, 노아, 마리아(마가의 어머니), 예레미야, 호세아, 에스겔, 누가, 마가, 아킬라, 사마리아 여인(수가), 에티오피아 내시, 혈루병 여인, 야이로, 도르가(다비다)',
        kind: 'radio', freeText: true,
        options: ['매우 긍정적', '긍정적', '보통', '우려됨', '매우 우려됨'],
      },
      {
        id: 'q33', no: 33,
        question: '추가되면 좋을 성경 인물이나 유형이 있다면 작성해 주십시오.',
        kind: 'text',
      },
      {
        id: 'q34', no: 34,
        question: '테스트 결과와 함께 개인의 신앙 성장을 위한 구체적인 조언과 실천 방향을 제공하는 것이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q35', no: 35,
        question:
          '크라이스트 테스트 결과에 따라 개인의 신앙 성향에 맞는 추천 말씀, 기도 제목, 실천 미션을 제공하는 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q36', no: 36,
        question: '크라이스트 테스트 결과를 실제 목회 현장에서 활용할 의향이 있으십니까?',
        kind: 'radio', freeText: true,
        options: ['적극 활용', '상황에 따라 활용', '검토 후 활용', '활용 계획 없음'],
      },
      {
        id: 'q37', no: 37,
        question: '크라이스트 테스트에 대한 자유 의견',
        kind: 'text',
      },
    ],
  },

  // ─────────── Ⅴ. 말씀 기능 평가 (38~47) ───────────
  {
    id: 'V',
    title: 'Ⅴ. 말씀 기능 평가',
    questions: [
      {
        id: 'q38', no: 38,
        question:
          '솔루마 안에 성경읽기, QT, 통독, 필사, 설교노트와 같은 말씀 중심 기능이 포함되는 것이 성도들의 영적 성장에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q39', no: 39,
        question:
          '성도가 매일 읽은 성경 본문과 분량을 기록하고, 말씀 생활의 흐름을 확인할 수 있는 성경 읽기 기록 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q40', no: 40,
        question:
          '성경을 직접 읽기 어려운 상황에서도 말씀을 들을 수 있도록 오디오 성경 기능이 제공된다면 도움이 될 것이라 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q41', no: 41,
        question:
          '성도가 매일 말씀을 묵상하고 자신의 생각, 적용, 기도제목을 기록할 수 있는 QT 작성 기능이 신앙 성장에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q42', no: 42,
        question: '말씀을 읽은 후 자신의 삶에 적용할 내용을 기록하고 실천 여부를 점검할 수 있는 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q43', no: 43,
        question:
          '성도가 개인별로 성경통독 목표를 설정하고, 자신의 진행률과 완독 여부를 확인할 수 있는 개인 성경통독 챌린지 기능이 말씀 읽기 습관 형성에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q44', no: 44,
        question: '성경 말씀을 직접 따라 쓰고 기록하는 성경 필사 기능이 말씀 묵상과 영성 훈련에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q45', no: 45,
        question:
          '예배 중 들은 말씀을 기록하고, 핵심 내용·은혜 받은 말씀·삶의 적용·기도제목을 정리할 수 있는 설교노트 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q46', no: 46,
        question: '말씀 기능 중 가장 우선적으로 개발되어야 한다고 생각하는 기능은 무엇입니까?',
        kind: 'radio', freeText: true,
        options: ['성경 읽기 기록', '오디오 성경', 'QT 작성', '교회 QT 교재 연동', '성경 통독 챌린지', '성경 필사', '설교노트', '말씀 검색', '기타 (　　　　　)'],
      },
      {
        id: 'q47', no: 47,
        question:
          '말씀 기능과 관련하여 추가되었으면 하는 기능이나 보완이 필요한 부분이 있다면 자유롭게 작성해 주십시오.',
        kind: 'text',
      },
    ],
  },

  // ─────────── Ⅵ. 공동체·참여·기타 기능 평가 (48~65) ───────────
  {
    id: 'VI',
    title: 'Ⅵ. 공동체·참여·기타 기능 평가',
    questions: [
      {
        id: 'q48', no: 48, label: '기도제목 기능',
        question:
          '성도가 자신의 기도제목을 기록하고, 필요할 경우 공동체와 함께 나눌 수 있는 기도제목 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q49', no: 49, label: '기도제목 공개 범위',
        question: '기도제목 기능을 운영할 때 가장 중요하게 고려해야 할 부분은 무엇이라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['개인정보 보호', '익명성', '공개 범위 설정', '목회자/리더 확인 기능', '기도 응답 기록', '기타 (　　　　　)'],
      },
      {
        id: 'q50', no: 50, label: '간증 기능',
        question:
          '성도들이 하나님께 받은 은혜와 삶의 변화를 나눌 수 있는 간증 기능이 신앙공동체 형성에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q51', no: 51, label: '간증 기능 운영 기준',
        question: '간증 기능을 운영할 때 가장 중요하게 관리되어야 할 부분은 무엇이라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['신학적 건전성', '과장된 표현 방지', '개인정보 보호', '상처가 될 수 있는 표현 관리', '목회자/운영자 검토', '기타 (　　　　　)'],
      },
      {
        id: 'q52', no: 52, label: '오늘의 마음 기능',
        question:
          '성도가 하루의 마음 상태나 신앙 상태를 간단히 기록하고 돌아볼 수 있는 오늘의 마음 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q53', no: 53, label: '오늘의 마음 활용 방향',
        question: '오늘의 마음 기능이 제공된다면 어떤 방향으로 활용되는 것이 가장 적절하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['개인 신앙 일기', '감정과 마음 점검', '기도제목 연결', '말씀 묵상 연결', '목회적 돌봄 참고', '기타 (　　　　　)'],
      },
      {
        id: 'q54', no: 54, label: '개인 챌린지 기능',
        question:
          '성도가 말씀읽기, 기도, 감사, 묵상, 실천 과제 등을 스스로 정하고 수행할 수 있는 개인 챌린지 기능이 신앙생활의 지속성에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q55', no: 55, label: '챌린지 보상 방식',
        question: '개인 챌린지 기능에 참여할 때, 어떤 방식의 동기부여가 가장 적절하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['완료 기록', '달성률 표시', '말씀 카드 제공', '영적 성장 리포트', '달란트/포인트 보상', '보상 기능은 신중해야 함', '기타 (　　　　　)'],
      },
      {
        id: 'q56', no: 56, label: '소그룹 기능',
        question:
          '성도들이 교회 안에서 소그룹, 셀, 순, 목장, 제자훈련 모임 등을 관리하고 소통할 수 있는 소그룹 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q57', no: 57, label: '소그룹 기능의 핵심 요소',
        question: '소그룹 기능에서 가장 중요하다고 생각하는 요소는 무엇입니까?',
        kind: 'radio', freeText: true,
        options: ['출석 확인', '기도제목 나눔', '말씀 나눔', '공지사항 전달', '리더 보고', '멤버 돌봄 기록', '기타 (　　　　　)'],
      },
      {
        id: 'q58', no: 58, label: 'AI 상담 기능',
        question:
          '성도가 신앙생활, 말씀 이해, 기도, 관계 문제 등에 대해 1차적으로 도움을 받을 수 있는 AI 상담 기능에 대해 어떻게 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 긍정적', '긍정적', '보통', '우려됨', '매우 우려됨'],
      },
      {
        id: 'q59', no: 59, label: 'AI 상담의 역할 범위',
        question: 'AI 상담 기능은 어느 정도 범위에서 활용되는 것이 적절하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['말씀 이해 보조', '기도문 작성 보조', '신앙생활 안내', '목회 상담 전 사전 정리', '위기 상황 시 목회자 연결', 'AI 상담 기능은 신중해야 함', '기타 (　　　　　)'],
      },
      {
        id: 'q60', no: 60, label: 'AI 상담 운영 시 우려점',
        question: 'AI 상담 기능을 운영할 때 가장 우려되는 부분은 무엇입니까?',
        kind: 'radio', freeText: true,
        options: ['신학적 오류', '잘못된 성경 해석', '개인정보 노출', '목회 상담 대체 우려', '정서적 위기 대응 한계', '기타 (　　　　　)'],
      },
      {
        id: 'q61', no: 61, label: '선물하기 기능',
        question:
          '성도가 가족, 친구, 새신자, 지인에게 솔루마의 유료 기능이나 콘텐츠를 선물할 수 있는 선물하기 기능이 전도와 신앙 격려에 도움이 된다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 도움', '도움', '보통', '도움 안됨', '전혀 도움 안됨'],
      },
      {
        id: 'q62', no: 62, label: '구독 기능',
        question:
          '솔루마가 일부 프리미엄 기능을 구독 방식으로 제공할 경우, 교회와 성도들이 수용 가능하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 가능', '가능', '보통', '어려움', '매우 어려움'],
      },
      {
        id: 'q63', no: 63, label: '유료 기능 운영 기준',
        question: '솔루마가 유료 기능을 운영할 때 가장 중요하게 지켜야 할 기준은 무엇이라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['과도한 상업성 지양', '무료 기능과 유료 기능의 균형', '수익 사용처의 투명성', '비자립교회 및 선교 지원과의 연결', '성도 부담 최소화', '기타 (　　　　　)'],
      },
      {
        id: 'q64', no: 64, label: '플랫폼 사용 편의성',
        question:
          '솔루마의 다양한 기능이 성도들이 쉽게 사용할 수 있도록 단순하고 직관적으로 구성되는 것이 중요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 중요', '중요', '보통', '중요하지 않음', '전혀 중요하지 않음'],
      },
      {
        id: 'q65', no: 65, label: '기타 기능 제안',
        question:
          '사진에 제시된 기능 외에 솔루마에 추가되면 좋겠다고 생각하는 기능이나, 반드시 보완되어야 할 기능이 있다면 자유롭게 작성해 주십시오.',
        kind: 'text',
      },
    ],
  },

  // ─────────── Ⅶ. JOBBOX 및 보호 기능 평가 (66~72) ───────────
  {
    id: 'VII',
    title: 'Ⅶ. JOBBOX 및 보호 기능 평가',
    questions: [
      {
        id: 'q66', no: 66,
        question: '교회의 필요와 성도의 달란트를 연결하는 JOBBOX 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q67', no: 67,
        question:
          'JOBBOX를 통해 교회 내 봉사자 모집, 사역자 연결, 기독교 구인·구직 등이 이루어진다면 실제 목회 현장에서 활용할 의향이 있으십니까?',
        kind: 'radio', freeText: true,
        options: ['적극 활용', '활용 가능', '검토 후 활용', '활용 계획 없음'],
      },
      {
        id: 'q68', no: 68,
        question: 'JOBBOX에서 가장 우선적으로 제공되어야 할 분야는 무엇이라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['교역자 청빙', '찬양사역자', '교회학교 교사', '선교사 및 단기사역', '미디어·디자인 봉사', '일반 직업 정보', '전문인 재능기부', '기타 (　　　　　　)'],
      },
      {
        id: 'q69', no: 69,
        question: '이단 예방을 위한 이단 점검 및 자가진단 기능이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q70', no: 70,
        question: '이단 점검 기능 운영 시 가장 중요하다고 생각하는 요소는 무엇입니까?',
        kind: 'radio', freeText: true,
        options: ['신학적 정확성', '교단별 검증', '최신 정보 제공', '전문가 자문', '상담 및 신고 연계', '기타 (　　　　　　)'],
      },
      {
        id: 'q71', no: 71,
        question:
          '플랫폼 내에서 활동하는 교역자 및 사역자의 신뢰성을 위해 사역자 인증 시스템이 필요하다고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 필요', '필요', '보통', '불필요', '매우 불필요'],
      },
      {
        id: 'q72', no: 72,
        question: '사역자 인증 시 가장 중요하게 확인되어야 할 요소는 무엇이라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['교단 소속 여부', '안수 여부', '재직증명 확인', '추천인 제도', '사역 경력 확인', '기타 (　　　　　　)'],
      },
    ],
  },

  // ─────────── Ⅷ. 향후 동역 및 참여 의향 (73~78) ───────────
  {
    id: 'VIII',
    title: 'Ⅷ. 향후 동역 및 참여 의향',
    questions: [
      {
        id: 'q73', no: 73,
        question: '향후 솔루마 자문위원으로 참여하실 의향이 있으십니까?',
        kind: 'radio', freeText: true,
        options: ['적극 참여', '가능', '추후 논의', '어려움'],
      },
      {
        id: 'q74', no: 74,
        question: '관심 있는 자문 분야를 선택해 주십시오. (복수선택 가능)',
        kind: 'checkbox', freeText: true,
        options: ['신학 검수', '크라이스트 테스트', '다음세대 사역', '선교', '커뮤니티', 'JOBBOX', '콘텐츠 제작', '플랫폼 운영', '교회 네트워크', '기타'],
      },
      {
        id: 'q75', no: 75,
        question: '솔루마 베타테스터로 참여하실 의향이 있으십니까?',
        kind: 'radio', freeText: true,
        options: ['참여 희망', '검토 후 참여', '미참여'],
      },
      {
        id: 'q76', no: 76,
        question: '협력교회로 참여하실 의향이 있으십니까?',
        kind: 'radio', freeText: true,
        options: ['적극 참여', '가능', '추후 논의', '어려움'],
      },
      {
        id: 'q77', no: 77,
        question: '주변 목회자 및 교회,성도들에게 솔루마를 소개하거나 연결해 주실 의향이 있으십니까?',
        kind: 'radio', freeText: true,
        options: ['적극 가능', '가능', '상황에 따라 가능', '어려움'],
      },
      {
        id: 'q78', no: 78,
        question: '향후 ROOT 비영리재단 설립 시 자문 및 동역에 참여하실 의향이 있으십니까?',
        kind: 'radio', freeText: true,
        options: ['적극 참여', '가능', '추후 논의', '어려움'],
      },
    ],
  },

  // ─────────── Ⅸ. 종합 평가 및 자유 의견 (79~84) ───────────
  {
    id: 'IX',
    title: 'Ⅸ. 종합 평가 및 자유 의견',
    questions: [
      {
        id: 'q79', no: 79,
        question: '오늘 발표 및 솔루마 소개에 대한 전반적인 만족도는 어떠하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 만족', '만족', '보통', '불만족', '매우 불만족'],
      },
      {
        id: 'q80', no: 80,
        question: '솔루마의 성공 가능성은 어느 정도라고 생각하십니까?',
        kind: 'radio', freeText: true,
        options: ['매우 높음', '높음', '보통', '낮음', '매우 낮음'],
      },
      {
        id: 'q81', no: 81,
        question: '솔루마 기능 중 가장 기대되는 기능은 무엇입니까?',
        kind: 'text',
      },
      {
        id: 'q82', no: 82,
        question: '반드시 추가되어야 한다고 생각하는 기능은 무엇입니까?',
        kind: 'text',
      },
      {
        id: 'q83', no: 83,
        question: '삭제 또는 수정이 필요하다고 생각하는 기능은 무엇입니까?',
        kind: 'text',
      },
      {
        id: 'q84', no: 84,
        question: 'ROOT와 SOLUMA를 위한 조언 또는 기도제목을 자유롭게 작성해 주십시오.',
        kind: 'text',
      },
    ],
  },
];

// ───────────── 기본 정보 (Ⅰ. 1~7) ─────────────
export const ROLE_OPTIONS = ['담임목사', '부목사', '선교사', '기관장', '기타'];
export const MINISTRY_OPTIONS = ['담임목회', '부목회', '교육', '청년', '청소년', '선교', '상담', '예배/찬양', '미디어', '교회개척', '기타'];
export const CAREER_OPTIONS = ['5년 이하', '5~10년', '10~20년', '20~30년', '30년 이상'];

// ───────────── 크라이스트 테스트 30문항 (검증용) ─────────────
// 원본: mobile-app/src/data/questions_3040.ts (questions3040, 30문항)
// SCENARIO: options(text 배열) / AGREE_DISAGREE: leftLabel·rightLabel 척도
// 점수(score)는 의도적으로 숨김 — 목사님은 문항·답변의 적절성만 검증

export type ChristType = 'SCENARIO' | 'AGREE_DISAGREE';

export interface ChristQuestion {
  id: number;
  category: 'C' | 'H' | 'R' | 'I' | 'S' | 'T';
  type: ChristType;
  question: string;
  options?: string[];   // SCENARIO 선택지 (점수 제외)
  leftLabel?: string;   // AGREE_DISAGREE 좌측
  rightLabel?: string;  // AGREE_DISAGREE 우측
}

export const CHRIST_QUESTIONS: ChristQuestion[] = [
  // C: Character (원칙 vs 공감)
  {
    id: 1, category: 'C', type: 'SCENARIO',
    question: '구역 모임에서 한 성도가 매번 나눔 시간에 세상적인 이야기만 합니다.',
    options: [
      '그분도 교회가 유일한 소통 창구일 수 있다. 들어주는 것이 사랑이다.',
      '답답하지만, 분위기상 자연스럽게 말씀 나눔으로 전환해본다.',
      '구역 모임의 목적을 다시 나누고, 나눔 가이드라인을 제안한다.',
      '모임의 거룩함을 위해 직접 말씀드리고 개선을 요구한다.',
    ],
  },
  {
    id: 2, category: 'C', type: 'SCENARIO',
    question: '회사에서 주일 근무를 요구합니다. 거부하면 승진에 불이익이 있을 수 있습니다.',
    options: [
      '하나님은 마음을 보시니, 상황에 따라 유연하게 대처한다.',
      '가족 생계도 중요하니, 이번만 하고 다음에는 안 하겠다고 한다.',
      '주일 예배를 지키되, 대안(야간 근무 등)을 제시해본다.',
      '안식일은 하나님과의 약속이다. 어떤 불이익도 감수한다.',
    ],
  },
  {
    id: 3, category: 'C', type: 'SCENARIO',
    question: '자녀가 "교회 안 가고 싶어"라고 말합니다.',
    options: [
      '억지로 하면 오히려 역효과. 아이의 마음을 존중하고 기다린다.',
      '왜 싫은지 먼저 들어보고, 아이 수준에서 교회의 좋은 점을 나눈다.',
      '신앙 교육은 부모의 의무이니, 이유를 설명하고 함께 가자고 설득한다.',
      '가정의 영적 원칙이다. 가족 예배는 선택이 아닌 필수라고 가르친다.',
    ],
  },
  {
    id: 4, category: 'C', type: 'AGREE_DISAGREE',
    question: '가정에서도 교회에서도, 정해진 원칙과 질서를 지키는 것이 무엇보다 중요하다.',
    leftLabel: '비동의', rightLabel: '동의',
  },
  {
    id: 5, category: 'C', type: 'AGREE_DISAGREE',
    question: '상황에 따라 유연하게 대처하는 것보다, 일관된 신앙 기준을 지키는 사람이 더 신뢰가 간다.',
    leftLabel: '비동의', rightLabel: '동의',
  },

  // H: Heart (진리 vs 은혜)
  {
    id: 6, category: 'H', type: 'SCENARIO',
    question: '구역 성경공부에서 한 성도가 이단적 해석에 가까운 의견을 말합니다.',
    options: [
      '다양한 해석이 있을 수 있다. 정죄보다 대화가 중요하다.',
      '그분의 신앙 배경을 이해하고, 자연스럽게 바른 해석으로 이끈다.',
      '잘못된 해석은 바로잡아야 한다. 말씀 근거를 들어 조심스럽게 교정한다.',
      '이단적 가르침은 즉시 차단해야 한다. 명확하게 지적하고 목사님께 알린다.',
    ],
  },
  {
    id: 7, category: 'H', type: 'SCENARIO',
    question: '오래 교회를 다녔던 집사님이 이혼 후 교회를 떠났다가 다시 오셨습니다.',
    options: [
      '과거를 묻지 않고 따뜻하게 안아주는 것이 교회다.',
      '돌아오신 것만으로 감사하다. 먼저 식사 대접하며 마음을 열어드린다.',
      '환영하면서도 영적 회복을 위해 목사님과의 상담을 권해드린다.',
      '교회에 다시 온 이상 영적 점검이 먼저다. 진지한 면담이 필요하다.',
    ],
  },
  {
    id: 8, category: 'H', type: 'SCENARIO',
    question: '자녀의 학교에서 다문화/다종교 존중 교육을 강조합니다.',
    options: [
      '다양성 존중은 기독교 정신에도 부합한다. 좋은 교육이라 생각한다.',
      '존중은 하되, 가정에서 기독교 신앙의 유일성을 따로 가르친다.',
      '예수님만이 길이라는 것을 자녀에게 명확히 가르치고 학교에도 의견을 낸다.',
      '다른 종교와 동등하게 취급하는 교육은 위험하다. 적극 대응한다.',
    ],
  },
  {
    id: 9, category: 'H', type: 'AGREE_DISAGREE',
    question: '가정과 교회에서 옳고 그름을 분명히 하는 것이 사랑으로 감싸는 것보다 먼저다.',
    leftLabel: '비동의', rightLabel: '동의',
  },
  {
    id: 10, category: 'H', type: 'AGREE_DISAGREE',
    question: '사람의 연약함을 먼저 품어주는 것이 진리를 가르치는 것보다 우선이다.',
    leftLabel: '동의', rightLabel: '비동의',
  },

  // S: Spirit (수직 vs 수평)
  {
    id: 11, category: 'S', type: 'SCENARIO',
    question: '육아와 직장으로 지칠 때, 회복의 방법은?',
    options: [
      '구역 모임이나 교회 부부 모임에서 같은 처지의 분들과 나누면 힘이 난다.',
      '목사님이나 장로님과 상담하며 기도를 부탁드린다.',
      '새벽에 일어나 말씀 묵상하며 하나님의 뜻을 구한다.',
      '모든 것을 내려놓고 혼자 기도원에 가서 하나님과 독대한다.',
    ],
  },
  {
    id: 12, category: 'S', type: 'SCENARIO',
    question: '가장 은혜로운 주일은?',
    options: [
      '예배 후 성도들과 식사하며 따뜻한 교제를 나누는 날.',
      '구역 모임에서 삶의 이야기를 깊이 나누고 서로 기도해주는 날.',
      '설교 말씀이 깊이 와닿아서 일주일을 붙잡고 묵상할 수 있는 날.',
      '찬양과 기도 속에 성령의 임재가 충만하여 눈물이 나는 날.',
    ],
  },
  {
    id: 13, category: 'S', type: 'SCENARIO',
    question: '신앙이 매너리즘에 빠졌을 때 돌파구는?',
    options: [
      '부부/가족 수련회처럼 함께하는 영적 이벤트.',
      '영적 멘토와의 깊은 나눔과 조언.',
      '신앙 고전을 읽거나 깊이 있는 강해 설교를 듣는 것.',
      '며칠간 금식기도하며 하나님의 음성을 구하는 것.',
    ],
  },
  {
    id: 14, category: 'S', type: 'AGREE_DISAGREE',
    question: '성도들과의 교제보다, 하나님과 단둘이 보내는 시간에서 더 큰 영적 충전을 받는다.',
    leftLabel: '비동의', rightLabel: '동의',
  },
  {
    id: 15, category: 'S', type: 'AGREE_DISAGREE',
    question: '예배와 기도에서 받는 영적 충만함이 사람들과의 교제에서 얻는 에너지보다 더 오래 지속된다.',
    leftLabel: '비동의', rightLabel: '동의',
  },

  // R: Relationship (독립 vs 연합)
  {
    id: 16, category: 'R', type: 'SCENARIO',
    question: '"당신에게 교회란 무엇입니까?"라는 질문에?',
    options: [
      '"제2의 가족입니다." 공동체 안에서 나의 정체성을 찾는다.',
      '"함께 성장하는 곳입니다." 서로 돌보며 세워가는 관계가 핵심이다.',
      '"하나님을 만나는 곳입니다." 교회보다 하나님과의 관계가 먼저다.',
      '"나는 교회 없이도 하나님의 자녀입니다." 소속보다 신앙 자체가 중요하다.',
    ],
  },
  {
    id: 17, category: 'R', type: 'SCENARIO',
    question: '교회의 방침과 내 신앙적 확신이 충돌할 때?',
    options: [
      '교회 질서와 목사님의 권위를 존중하며 따른다.',
      '일단 교회 방침에 따르되, 장로님이나 목사님께 조심스럽게 여쭤본다.',
      '존중하지만 내 확신이 성경에 근거한다면, 따르지 않을 수도 있다.',
      '하나님 앞에서 내 양심과 확신이 교회의 결정보다 우선한다.',
    ],
  },
  {
    id: 18, category: 'R', type: 'SCENARIO',
    question: '신앙 성장에 가장 도움이 되는 것은?',
    options: [
      '교회의 체계적인 제자 훈련이나 성경학교 과정.',
      '구역 모임에서 삶을 나누고 서로 책임져주는 관계.',
      '개인 QT와 말씀 묵상으로 스스로 깨닫는 시간.',
      '다양한 강의, 서적, 세미나로 주도적으로 탐구하는 것.',
    ],
  },
  {
    id: 19, category: 'R', type: 'AGREE_DISAGREE',
    question: '교회의 가르침보다, 내가 직접 말씀에서 찾은 답이 더 확실할 때가 많다.',
    leftLabel: '비동의', rightLabel: '동의',
  },
  {
    id: 20, category: 'R', type: 'AGREE_DISAGREE',
    question: '중요한 가정/사업 결정에서 목사님 조언보다 하나님과의 개인 교통이 더 결정적이다.',
    leftLabel: '비동의', rightLabel: '동의',
  },

  // I: Identity (성취 vs 존재)
  {
    id: 21, category: 'I', type: 'SCENARIO',
    question: '신앙생활에서 가장 보람 있는 순간은?',
    options: [
      '바쁜 일상 속에서도 하나님 안에 머무는 평안을 느낄 때.',
      '자녀가 스스로 기도하거나 내 성품이 변화된 것을 느낄 때.',
      '맡은 직분(집사, 권사 등)의 사역이 결실을 맺을 때.',
      '교회 행사를 성공적으로 이끌거나, 구역 부흥의 열매가 보일 때.',
    ],
  },
  {
    id: 22, category: 'I', type: 'SCENARIO',
    question: '하나님이 나의 삶을 인도하신다는 확신이 들 때는?',
    options: [
      '특별한 일 없어도, 일상 속에서 감사와 평안이 흐를 때.',
      '고난 중에도 원망하지 않고 감사할 수 있는 내면의 힘이 느껴질 때.',
      '기도한 대로 사업이 잘 되거나, 자녀에게 좋은 일이 생길 때.',
      '놀라운 기도 응답이나 기적적인 사건이 일어날 때.',
    ],
  },
  {
    id: 23, category: 'I', type: 'SCENARIO',
    question: '교회 봉사를 고른다면?',
    options: [
      '중보기도팀처럼 보이지 않는 곳에서 묵묵히 기도하는 역할.',
      '심방, 새가족 관리 등 사람을 돌보는 역할.',
      '회계, 시설관리 등 전문성을 살려 교회를 세우는 역할.',
      '구역장, 부서장 등 리더십을 발휘하여 조직을 이끄는 역할.',
    ],
  },
  {
    id: 24, category: 'I', type: 'AGREE_DISAGREE',
    question: '봉사 실적이나 헌금 액수 같은 가시적 결과가 있어야 신앙이 자라는 것 같다.',
    leftLabel: '비동의', rightLabel: '동의',
  },
  {
    id: 25, category: 'I', type: 'AGREE_DISAGREE',
    question: '뚜렷한 사역 성과가 없으면, 내 신앙이 정체된 것 같아 아쉽다.',
    leftLabel: '비동의', rightLabel: '동의',
  },

  // T: Talent (세상 vs 사역)
  {
    id: 26, category: 'T', type: 'SCENARIO',
    question: '나의 전문성과 경험을 가장 쓰고 싶은 곳은?',
    options: [
      '교회 건축, 재정, 교육 등 교회를 직접 세우는 일.',
      '선교 후원이나 미자립 교회 돕기 등 교회 생태계 살리기.',
      '직장에서 그리스도인의 정직과 탁월함을 보여주는 것.',
      '사회적 기업이나 기부를 통해 세상에 하나님 나라 가치를 심는 것.',
    ],
  },
  {
    id: 27, category: 'T', type: 'SCENARIO',
    question: '"하나님의 영광"이 가장 잘 드러나는 모습은?',
    options: [
      '부흥하는 교회에서 수많은 성도가 함께 뜨겁게 예배하는 모습.',
      '다음 세대를 위한 주일학교와 양육이 잘 이루어지는 교회.',
      '크리스천 경영인이 윤리적 기업을 세워 사회에 선한 영향을 끼치는 것.',
      '이름 없는 성도가 가정과 직장에서 묵묵히 정직하게 살아가는 모습.',
    ],
  },
  {
    id: 28, category: 'T', type: 'SCENARIO',
    question: '자녀에게 가르치고 싶은 신앙의 핵심 가치는?',
    options: [
      '교회를 사랑하고, 예배와 봉사에 충실한 사람이 되어라.',
      '어디서든 하나님 말씀을 기준으로 판단할 수 있는 사람이 되어라.',
      '네가 하는 모든 일에서 하나님의 영광을 나타내는 사람이 되어라.',
      '세상의 어둠 속에서 빛과 소금으로 사회를 변화시키는 사람이 되어라.',
    ],
  },
  {
    id: 29, category: 'T', type: 'AGREE_DISAGREE',
    question: '교회 봉사보다, 가정과 직장에서 그리스도인답게 사는 것이 더 어려운 예배다.',
    leftLabel: '비동의', rightLabel: '동의',
  },
  {
    id: 30, category: 'T', type: 'AGREE_DISAGREE',
    question: '재능을 교회 안에만 제한하기보다, 세상에서 발휘하는 것이 더 가치 있다.',
    leftLabel: '비동의', rightLabel: '동의',
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  C: 'C · 성품 (원칙 vs 공감)',
  H: 'H · 가슴 (진리 vs 은혜)',
  S: 'S · 영성 (수직 vs 수평)',
  R: 'R · 관계 (독립 vs 연합)',
  I: 'I · 정체성 (성취 vs 존재)',
  T: 'T · 은사 (세상 vs 사역)',
};

// 설치 링크
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/7SzqebuS';
// preview APK 직링크 (출시 전 임시 — Google Play 승인 후 스토어 링크로 교체 예정)
export const ANDROID_APK_URL = 'https://expo.dev/artifacts/eas/cvC0YAqg8gachPA1nAWpk6J6atPzIcO6hJ1BFsNpMe8.apk';
