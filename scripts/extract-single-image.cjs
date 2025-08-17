const fs = require('fs');
const path = require('path');

// Parse CLI args: --file=, --id=, --outDir=, --out=
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, true];
    return [k.replace(/^--/, ''), v];
  })
);

const defaultSvgPath = path.join(__dirname, '../src/components/Map/ReactSvg.tsx');
const svgPath = args.file ? path.resolve(args.file) : defaultSvgPath;
const imageIdNumber = args.id ? String(args.id) : '2';
const targetId = `_Image${imageIdNumber}`;
const outDir = args.outDir ? path.resolve(args.outDir) : path.join(__dirname, '../public/map-images');

function tryMatch(regex, text) {
  const m = text.match(regex);
  return m && m[1] ? m : null;
}

(async () => {
  try {
    if (!fs.existsSync(svgPath)) {
      console.error(`Input file not found: ${svgPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(svgPath, 'utf8');

    // Try to find the image element with id and data URI in various attribute forms
    const patterns = [
      // id="_Image2" ... xlinkHref="data:image/..."
      new RegExp(`<image\\s[\\s\\S]*?id=(?:\"|\')${targetId}(?:\"|\')[\\s\\S]*?(?:xlink:href|xlinkHref)=(?:\"|\')([^\"\']+)(?:\"|\')[\\s\\S]*?>`, 'i'),
      // id="_Image2" ... href="data:image/..."
      new RegExp(`<image\\s[\\s\\S]*?id=(?:\"|\')${targetId}(?:\"|\')[\\s\\S]*?href=(?:\"|\')([^\"\']+)(?:\"|\')[\\s\\S]*?>`, 'i'),
    ];

    let match = null;
    for (const re of patterns) {
      match = content.match(re);
      if (match) break;
    }

    if (!match) {
      console.error(`Could not find an <image> with id="${targetId}" and a data URI in ${svgPath}`);
      process.exit(2);
    }

    const href = match[1];
    if (!href || !href.startsWith('data:image/')) {
      console.error(`Found id="${targetId}", but href is not a data URI. Found: ${href}`);
      process.exit(3);
    }

    const dataMatch = href.match(/data:image\/([^;]+);base64,(.+)/);
    if (!dataMatch) {
      console.error('Failed to parse data URI.');
      process.exit(4);
    }

    const mime = dataMatch[1].toLowerCase();
    const base64 = dataMatch[2];

    const ext = mime === 'png' ? 'png' : mime === 'webp' ? 'webp' : mime === 'jpeg' ? 'jpg' : mime;

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = args.out ? path.resolve(args.out) : path.join(outDir, `${imageIdNumber}.${ext}`);

    fs.writeFileSync(outFile, Buffer.from(base64, 'base64'));

    console.log(`Extracted ${targetId} -> ${outFile}`);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err.message || String(err));
    process.exit(10);
  }
})();
