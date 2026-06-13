import LegalPage from '../_components/LegalPage';

export const metadata = {
    title: '계정 및 데이터 삭제 — soluma',
    description: 'soluma 계정 및 개인 데이터 삭제 요청 안내입니다.',
};

const KO = `# 계정 및 데이터 삭제 안내

**앱**: soluma
**개발사**: 주식회사 루트 (ROOT CO., Ltd)

soluma 사용자는 언제든지 본인의 계정과 관련 데이터의 삭제를 요청할 수 있습니다.

## 1. 앱에서 직접 삭제하기 (권장)

가장 빠른 방법입니다. 앱 내에서 즉시 처리됩니다.

1. soluma 앱을 실행하고 로그인합니다.
2. **마이페이지 → 설정(⚙️)** 으로 이동합니다.
3. **계정 관리 → 계정 삭제** 를 누릅니다.
4. 안내에 따라 최종 확인하면, 계정과 모든 데이터가 **즉시 영구 삭제**됩니다.

## 2. 이메일로 요청하기

앱에 접근할 수 없는 경우, 아래 이메일로 가입하신 계정 정보(아이디 또는 이메일)와 함께 삭제를 요청해 주세요.

- **고객센터 이메일**: master@root2christ.com
- 본인 확인 후 **영업일 기준 7일 이내** 처리해 드립니다.

## 3. 삭제되는 데이터

계정 삭제 시 다음 데이터가 **영구적으로 삭제**됩니다.

- 프로필 정보 (이름, 이메일, 프로필 사진)
- 테스트 결과 (크라이스트 테스트, 신앙심 점검, 신앙의 계절)
- 큐티(QT) 기록 및 묵상 데이터
- 기도 요청, 간증, 커뮤니티 게시물 및 댓글
- 설교 노트 및 녹음 데이터
- 구독 및 구매 내역
- 위치 기반 검색 기록

## 4. 보관되는 데이터

관련 법령(전자상거래법, 전자금융거래법 등)에 따라 보존 의무가 있는 일부 거래·결제 기록은 법정 보존 기간 동안 별도 분리 보관 후 파기됩니다. 그 외 모든 개인 데이터는 즉시 삭제됩니다.

## 5. 인앱 구매 환불

이미 결제하신 인앱 구매의 환불은 결제하신 스토어(App Store / Google Play)에 직접 요청하셔야 합니다. 계정 삭제와 환불은 별개로 처리됩니다.

---

문의: master@root2christ.com
`;

const EN = `# Account & Data Deletion

**App**: soluma
**Developer**: ROOT CO., Ltd

soluma users may request deletion of their account and associated data at any time.

## 1. Delete in the app (recommended)

The fastest method — processed instantly within the app.

1. Open the soluma app and sign in.
2. Go to **My Page → Settings (⚙️)**.
3. Tap **Account Management → Delete Account**.
4. After final confirmation, your account and all data are **permanently deleted immediately**.

## 2. Request by email

If you cannot access the app, email us with your account info (username or email):

- **Support email**: master@root2christ.com
- Processed within **7 business days** after identity verification.

## 3. Data that will be deleted

- Profile information (name, email, profile photo)
- Test results (C.H.R.I.S.T test, Faith check-up, Faith Season)
- QT (devotion) records and notes
- Prayer requests, testimonies, community posts and comments
- Sermon notes and audio recordings
- Subscription and purchase history
- Location-based search history

## 4. Data that may be retained

Certain transaction and payment records required by law (e.g., e-commerce and electronic financial transaction laws) are stored separately for the legally mandated retention period and then destroyed. All other personal data is deleted immediately.

## 5. In-app purchase refunds

Refunds for in-app purchases must be requested directly from the store (App Store / Google Play). Account deletion and refunds are handled separately.

---

Contact: master@root2christ.com
`;

export default function AccountDeletionPage() {
    return (
        <LegalPage
            title={{ ko: '계정 및 데이터 삭제', en: 'Account & Data Deletion' }}
            contentKo={KO}
            contentEn={EN}
        />
    );
}
