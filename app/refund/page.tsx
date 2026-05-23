import LegalPage from '../_components/LegalPage';
import { REFUND_KO } from '../_data/legal/refundKo';
import { REFUND_EN } from '../_data/legal/refundEn';

export const metadata = {
    title: '환불정책 — soluma',
    description: 'soluma 모바일 애플리케이션의 환불정책입니다.',
};

export default function RefundPage() {
    return (
        <LegalPage
            title={{ ko: '환불정책', en: 'Refund Policy' }}
            contentKo={REFUND_KO}
            contentEn={REFUND_EN}
        />
    );
}
