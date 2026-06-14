-- ════════════════════════════════════════════════════════════
-- soluma 목회자 자문 설문 시스템 (/survey) — Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- (advisory 와 동일하게 RLS 켜고, 서버 API(service role)로만 접근)
-- ════════════════════════════════════════════════════════════

create table if not exists public.survey_responses (
    id              uuid primary key default gen_random_uuid(),
    respondent_uid  text not null unique,        -- 응답자 식별 UUID (브라우저 localStorage 발급, 로그인 없음)
    name            text,                        -- 성함
    church          text,                        -- 교회명
    role            text,                        -- 직분 (담임목사/부목사/선교사/기관장/기타…)
    phone           text,                        -- 연락처
    email           text,                        -- 이메일
    ministry        jsonb default '[]'::jsonb,   -- 담당 사역 분야 (복수선택 문자열 배열)
    career          text,                        -- 목회 경력
    answers         jsonb default '{}'::jsonb,   -- 84문항 본설문 답변 { "q8": "공감", "q8__free": "...", "q74": ["신학 검수","선교"], ... }
    christ_memos    jsonb default '{}'::jsonb,   -- 크라이스트 30문항 검증 메모 { "1": "...", "2": "...", ... }
    updated_at      timestamptz not null default now(),
    created_at      timestamptz not null default now()
);

-- 관리자 목록 정렬용 인덱스
create index if not exists survey_responses_updated_idx
    on public.survey_responses (updated_at desc);

-- RLS — API(service role)로만 접근하므로 정책 없이 RLS 켜둠(=anon 접근 차단)
alter table public.survey_responses enable row level security;

-- (service role 키는 RLS를 우회하므로 서버 API 라우트에서 정상 동작)
