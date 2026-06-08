-- ════════════════════════════════════════════════════════════
-- soluma 목사 자문 발표 사이트 (/advisory) — Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- ════════════════════════════════════════════════════════════

-- 1) 자문 참여 목사 명단 (자가 등록 — 이름+교회)
create table if not exists public.advisory_pastors (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    church      text,
    created_at  timestamptz not null default now()
);
-- 같은 이름+교회 중복 방지
create unique index if not exists advisory_pastors_uniq
    on public.advisory_pastors (lower(name), lower(coalesce(church, '')));

-- 2) 항목별 자문 (별점 + 코멘트)
create table if not exists public.advisory_feedback (
    id          uuid primary key default gen_random_uuid(),
    pastor_id   uuid not null references public.advisory_pastors(id) on delete cascade,
    item_id     text not null,         -- 슬라이드 id
    rating      int,                   -- 1~5 (null 가능)
    comment     text,
    updated_at  timestamptz not null default now()
);
-- 목사+항목 당 1행 (upsert)
create unique index if not exists advisory_feedback_uniq
    on public.advisory_feedback (pastor_id, item_id);

-- 3) RLS — API(service role)로만 접근하므로 정책 없이 RLS 켜둠(=anon 접근 차단)
alter table public.advisory_pastors  enable row level security;
alter table public.advisory_feedback enable row level security;

-- (service role 키는 RLS를 우회하므로 서버 API 라우트에서 정상 동작)
