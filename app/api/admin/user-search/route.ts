import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { verifyAdminPassword } from '../../../../lib/auth';

/**
 * POST /api/admin/user-search
 * body: { password: string, query: string }
 *   - query는 이메일 일부 또는 이름 일부
 * 반환: 매칭되는 사용자 최대 20명
 */
export async function POST(req: NextRequest) {
    try {
        const { password, query } = await req.json();
        if (!verifyAdminPassword(password)) {
            return NextResponse.json({ error: '인증 실패' }, { status: 401 });
        }
        const q = (query || '').trim();
        if (q.length < 2) {
            return NextResponse.json({ error: '검색어는 2자 이상 입력해주세요' }, { status: 400 });
        }

        const supabase = getAdminSupabase();

        // profiles 테이블에서 full_name 또는 email로 검색
        // (profiles에 email이 별도 컬럼으로 동기화되어 있지 않을 수 있으니 두 경로로 시도)
        const { data: byName } = await supabase
            .from('profiles')
            .select('id, full_name, email, church_id')
            .ilike('full_name', `%${q}%`)
            .limit(20);

        // auth.users 검색은 admin API 필요
        let byEmail: any[] = [];
        try {
            const { data: { users } } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
            byEmail = (users || [])
                .filter(u => u.email?.toLowerCase().includes(q.toLowerCase()))
                .slice(0, 20)
                .map(u => ({
                    id: u.id,
                    full_name: (u.user_metadata as any)?.name || (u.user_metadata as any)?.full_name || '',
                    email: u.email,
                }));
        } catch (e) {
            // ignore — profiles 결과로만 응답
        }

        // 합치고 중복 제거
        const seen = new Set<string>();
        const combined: any[] = [];
        for (const u of [...(byName || []), ...byEmail]) {
            if (seen.has(u.id)) continue;
            seen.add(u.id);
            combined.push(u);
            if (combined.length >= 20) break;
        }

        return NextResponse.json({ users: combined });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
