import type { Metadata } from 'next';
import Deck from './_components/Deck';

export const metadata: Metadata = {
    title: 'soluma 목사님 자문회',
    description: 'soluma 앱·회사 소개 및 자문 — 주식회사 루트',
};

export default function AdvisoryPage() {
    return <Deck />;
}
