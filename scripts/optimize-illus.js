// 생성된 일러스트 PNG(약 2MB) → 1280px JPEG(q82)로 리사이즈·압축 후 PNG 삭제.
// 실행: node scripts/optimize-illus.js   (web-landing 디렉터리에서)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'public', 'slide', 'illus');

(async () => {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));
    if (!files.length) { console.log('no .png to optimize'); return; }
    for (const f of files) {
        const src = path.join(dir, f);
        const out = path.join(dir, f.replace(/\.png$/, '.jpg'));
        await sharp(src).resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
        const before = fs.statSync(src).size, after = fs.statSync(out).size;
        fs.unlinkSync(src);
        console.log(`${f}  ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024).toFixed(0)}KB`);
    }
    console.log('done');
})();
