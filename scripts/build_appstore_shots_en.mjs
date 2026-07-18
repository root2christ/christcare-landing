// App Store 영문 마케팅 스크린샷 생성기 (1284×2778)
import fs from 'fs';
import path from 'path';

const SRC = 'E:/christ_app/스크린샷/영어';
const OUT = 'E:/christ_app/스크린샷/appstore_en';
fs.mkdirSync(OUT, { recursive: true });

const SHOTS = [
  { file: 'KakaoTalk_20260707_164453907_05.jpg', out: '01_home', title: 'Your daily walk with God,<br/>all in one place', sub: 'Devotionals · Bible · Prayer · Challenges' },
  { file: 'KakaoTalk_20260707_164453907_04.jpg', out: '02_qt_intro', title: 'A year of<br/>daily devotionals', sub: '365 days with 91 figures of the Bible' },
  { file: 'KakaoTalk_20260707_164453907_03.jpg', out: '03_qt_meditate', title: 'Guided meditation,<br/>every morning', sub: 'Read, reflect, and write — step by step' },
  { file: 'KakaoTalk_20260707_164453907_01.jpg', out: '04_memorization', title: 'Memorize Scripture<br/>with five companions', sub: 'One verse a day, five verses a week', cropTop: 60 },
  { file: 'KakaoTalk_20260707_164453907_02.jpg', out: '05_church_map', title: 'Find your church<br/>on the map', sub: 'Church registration is always free' },
  { file: 'KakaoTalk_20260707_164453907.jpg', out: '06_talents', title: 'Every step of faith,<br/>rewarded', sub: 'Earn Talents as you grow in the Word' },
];

for (const s of SHOTS) {
  const img = fs.readFileSync(path.join(SRC, s.file)).toString('base64');
  const crop = s.cropTop || 0;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1284px; height:2778px; background:linear-gradient(180deg,#F3FAFF 0%,#FAF7F0 30%); font-family:'Segoe UI','Malgun Gothic',sans-serif; overflow:hidden; }
  .copy { text-align:center; padding-top:110px; }
  .title { font-size:84px; font-weight:800; color:#0F2A43; line-height:1.22; letter-spacing:-1px; }
  .sub { font-size:38px; color:#5A7184; margin-top:28px; font-weight:600; }
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
console.log('완료 →', OUT);
