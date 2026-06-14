import type { Metadata } from 'next';
import Viewer from './_components/Viewer';

export const metadata: Metadata = {
    title: 'soluma 목사님 자문회',
    description: 'soluma 앱·회사 소개 및 자문 — 주식회사 루트',
};

// 청중(목사님) 화면 — 발표자가 진행하는 슬라이드를 따라보는 순수 뷰어
export default function AdvisoryPage() {
    return <Viewer />;
}
