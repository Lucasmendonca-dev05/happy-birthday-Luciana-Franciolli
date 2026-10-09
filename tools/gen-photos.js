// Gera miniaturas em photos/thumbs/ e o photos/photos.json.  Uso: npm run fotos
// As originais em photos/ nunca são alteradas — o download é sempre da original.
const fs = require("fs"), path = require("path");
const sharp = require("sharp");
const dir = path.join(__dirname, "..", "photos");
const thumbs = path.join(dir, "thumbs");
fs.mkdirSync(thumbs, { recursive: true });

(async () => {
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  const list = [];
  for (const f of files) {
    const thumb = f.replace(/\.[^.]+$/, "") + ".webp";
    const out = path.join(thumbs, thumb);
    const img = sharp(path.join(dir, f)).rotate(); // respeita a orientação EXIF
    const meta = await img.clone().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    list.push({ file: f, thumb, w: meta.width, h: meta.height });
  }
  fs.writeFileSync(path.join(dir, "photos.json"), JSON.stringify(list, null, 2));
  console.log(`${list.length} fotos prontas (miniaturas em photos/thumbs).`);
})();
