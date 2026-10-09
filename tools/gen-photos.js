// Gera photos/photos.json a partir das imagens da pasta photos/.  Uso: node tools/gen-photos.js
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "..", "photos");
const list = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
fs.writeFileSync(path.join(dir, "photos.json"), JSON.stringify(list, null, 2));
console.log(`${list.length} fotos listadas.`);
