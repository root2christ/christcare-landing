// App Store 마케팅 스크린샷 생성기 (1284×2778, iPhone 6.5")
// 폴드 스샷(968×2155)을 기기 프레임에 넣고 상단 카피를 얹는다.
// 사용: node scripts/build_appstore_shots.mjs  → E:\christ_app\스크린샷\appstore\*.html (Edge로 캡처는 별도)
import fs from 'fs';
import path from 'path';

const SRC = 'E:/christ_app/스크린샷';
const OUT = path.join(SRC, 'appstore');
fs.mkdirSync(OUT, { recursive: true });

const SHOTS = [
  { file: 'KakaoTalk_20260707_162916310.jpg', out: '01_home', title: '매일의 신앙 습관,<br/>한 곳에서', sub: '큐티 · 성경 · 기도 · 챌린지를 하나의 홈에' },
  { file: 'KakaoTalk_20260707_162916310_03.jpg', out: '02_christtest', title: '성경 속 나와 닮은<br/>인물 찾기', sub: '크라이스트 테스트 · 성경 인물 64명' },
  { file: 'KakaoTalk_20260707_162916310_01.jpg', out: '03_qt_read', title: '매일 아침,<br/>나를 위한 큐티', sub: '91명의 인물과 함께 걷는 365일' },
  { file: 'KakaoTalk_20260707_162916310_04.jpg', out: '04_memorization', title: '다섯 사람이 함께<br/>외우는 암송', sub: '매주 다섯 절, 하루 한 절씩 목소리로', cropTop: 60 },
  { file: 'KakaoTalk_20260707_162916310_05.jpg', out: '05_church_map', title: '지도에서<br/>우리 교회 찾기', sub: '교회 등록은 언제나 무료' },
  { file: 'KakaoTalk_20260707_162916310_02.jpg', out: '06_qt_meditate', title: '깊이 있는<br/>묵상 가이드', sub: '읽고, 묵상하고, 기록하는 아침 저녁 큐티' },
  { file: 'KakaoTalk_20260707_162916310_06.jpg', out: '07_gallery', title: '모아가는 재미,<br/>성경 인물 도감', sub: '인물 탐구를 완주하면 한 명씩 채워져요' },
];

for (const s of SHOTS) {
  const img = fs.readFileSync(path.join(SRC, s.file)).toString('base64');
  const crop = s.cropTop || 0;
  // 프레임 내부 폭 1020 → 스샷 968 스케일 1020/968=1.0537, 높이 2155→2271 (cropTop 반영)
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1284px; height:2778px; background:linear-gradient(180deg,#F3FAFF 0%,#FAF7F0 30%); font-family:'Malgun Gothic','Noto Sans KR',sans-serif; overflow:hidden; }
  .copy { text-align:center; padding-top:110px; }
  .title { font-size:88px; font-weight:900; color:#0F2A43; line-height:1.22; letter-spacing:-1px; }
  .sub { font-size:40px; color:#5A7184; margin-top:28px; font-weight:600; }
  .frame { width:1080px; margin:70px auto 0; background:#0F172A; border-radius:64px; padding:26px;
           box-shadow:0 40px 80px rgba(2,132,199,.22); }
  .screen { width:1028px; height:2200px; border-radius:44px; overflow:hidden; background:#fff; }
  .screen img { width:1028px; display:block; margin-top:-${Math.round(crop * 1028 / 968)}px; }
  </style></head><body>
    <div class="copy"><div class="title">${s.title}</div><div class="sub">${s.sub}</div></div>
    <div class="frame"><div class="screen"><img src="data:image/jpeg;base64,${img}"/></div></div>
  </body></html>`;
  fs.writeFileSync(path.join(OUT, s.out + '.html'), html);
  console.log(s.out + '.html');
}
console.log('HTML 생성 완료 →', OUT);
