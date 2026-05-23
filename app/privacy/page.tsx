import LegalPage from '../_components/LegalPage';
import { PRIVACY_KO } from '../_data/legal/privacyKo';
import { PRIVACY_EN } from '../_data/legal/privacyEn';

export const metadata = {
    title: '개인정보 처리방침 — soluma',
    description: 'soluma 모바일 애플리케이션의 개인정보 처리방침입니다.',
};

export default function PrivacyPage() {
    return (
        <LegalPage
            title={{ ko: '개인정보 처리방침', en: 'Privacy Policy' }}
            contentKo={PRIVACY_KO}
            contentEn={PRIVACY_EN}
        />
    );
}
