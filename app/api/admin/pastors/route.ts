import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * 사역자 신청 + 사용자 등록 교회 조회/처리 (2026-08-14 사장님 지시)
 *
 * 당분간 사역자 등록은 앱에서 자동 활성(auto_verified)이지만,
 * 관리자는 여기서 "언제 누가 신청했는지"를 보고 서류를 크게 확인하며
 * 필요하면 거절(비활성)로 되돌릴 수 있다.
 *
 * GET  /api/admin/pastors            → { pastors: [...], churches: [...] }
 *   - pastors: 신청 전체 (최신순, 서류 URL 포함)
 *   - churches: 사용자가 직접 등록한 교회(verification_status='user_registered') 목록
 * POST /api/admin/pastors            → 상태 변경
 *   body: { id: string, status: 'verified' | 'rejected' | 'pending' }
 */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const supabase = getAdminSupabase();

        // 새 컬럼(auto_verified·applicant_* 등)이 아직 DB에 없을 수 있어(SQL 실행 전)
        // 실패하면 전체 컬럼(*)으로 폴백한다 — 탭이 통째로 죽지 않게.
        let pastors: any[] | null = null;
        {
            const r1 = await supabase
                .from('pastors')
                .select('id, user_id, name, church_name, church_id, denomination, position, phone, verification_status, auto_verified, submitted_at, created_at, ordination_certificate_url, denomination_registration_url, church_bulletin_url')
                .order('created_at', { ascending: false })
                .limit(500);
            if (!r1.error) pastors = r1.data;
            else {
                const r2 = await supabase.from('pastors').select('*').order('created_at', { ascending: false }).limit(500);
                if (r2.error) throw r2.error;
                pastors = r2.data;
            }
        }

        let churches: any[] | null = null;
        {
            const r1 = await supabase
                .from('churches')
                .select('id, name, denomination, region, address, member_count, created_at, created_by, applicant_name, applicant_contact, pastor_name, lat, lon')
                .eq('verification_status', 'user_registered')
                .order('created_at', { ascending: false })
                .limit(500);
            if (!r1.error) churches = r1.data;
            else {
                const r2 = await supabase
                    .from('churches')
                    .select('id, name, denomination, region, member_count, created_at, created_by, lat, lon')
                    .eq('verification_status', 'user_registered')
                    .order('created_at', { ascending: false })
                    .limit(500);
                if (r2.error) throw r2.error;
                churches = r2.data;
            }
        }

        // 서류 이미지: 버킷(pastor-documents)이 private 이라 저장된 public URL 은 404 난다.
        // 서비스 롤로 서명 URL(1시간)을 새로 만들어 내려준다.
        const BUCKET = 'pastor-documents';
        const DOC_FIELDS = ['ordination_certificate_url', 'denomination_registration_url', 'church_bulletin_url'] as const;
        const toObjectPath = (url: string): string | null => {
            if (!url) return null;
            const m = url.match(/\/pastor-documents\/(.+)$/);
            if (m) return decodeURIComponent(m[1].split('?')[0]);
            // 이미 경로만 저장된 경우도 허용
            return url.includes('://') ? null : url;
        };
        {
            const jobs: Array<{ p: any; field: string; path: string }> = [];
            for (const p of (pastors || [])) {
                for (const field of DOC_FIELDS) {
                    const path = toObjectPath(p[field]);
                    if (path) jobs.push({ p, field, path });
                }
            }
            await Promise.all(jobs.map(async ({ p, field, path }) => {
                const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
                if (!error && data?.signedUrl) p[field] = data.signedUrl;
            }));
        }

        // 등록자 이메일 붙이기 (best-effort)
        const uids = Array.from(new Set([
            ...(pastors || []).map((p: any) => p.user_id),
            ...(churches || []).map((c: any) => c.created_by),
        ].filter(Boolean)));
        const emailMap = new Map<string, string>();
        if (uids.length) {
            const { data: profs } = await supabase
                .from('profiles').select('id, email').in('id', uids);
            for (const pr of (profs || []) as any[]) emailMap.set(pr.id, pr.email || '');
        }

        return NextResponse.json({
            pastors: (pastors || []).map((p: any) => ({ ...p, email: emailMap.get(p.user_id) || null })),
            churches: (churches || []).map((c: any) => ({ ...c, creator_email: emailMap.get(c.created_by) || null })),
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '조회 실패' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const { id, status } = await req.json();
        if (!id || !['verified', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json({ error: '잘못된 요청' }, { status: 400 });
        }
        const supabase = getAdminSupabase();
        let { error } = await supabase
            .from('pastors')
            .update({
                verification_status: status,
                // 관리자가 직접 판정한 것이므로 자동 승인 표식은 해제
                auto_verified: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);
        if (error && /auto_verified/i.test(error.message || '')) {
            // 컬럼 미적용(SQL 실행 전) 폴백
            ({ error } = await supabase
                .from('pastors')
                .update({ verification_status: status, updated_at: new Date().toISOString() })
                .eq('id', id));
        }
        if (error) throw error;
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '처리 실패' }, { status: 500 });
    }
}
