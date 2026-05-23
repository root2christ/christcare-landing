import LegalPage from '../_components/LegalPage';
import { TERMS_KO } from '../_data/legal/termsKo';
import { TERMS_EN } from '../_data/legal/termsEn';

export const metadata = {
    title: '서비스 이용약관 — soluma',
    description: 'soluma 모바일 애플리케이션의 서비스 이용약관입니다.',
};

export default function TermsPage() {
    return (
        <LegalPage
            title={{ ko: '서비스 이용약관', en: 'Terms of Service' }}
            contentKo={TERMS_KO}
            contentEn={TERMS_EN}
        />
    );
}
