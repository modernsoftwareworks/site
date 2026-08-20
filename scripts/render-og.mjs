import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = join(root, 'node_modules/.cache/og-fonts');

const INK = '#12161d';
const PAPER = '#fafbfd';
const PAPER_2 = '#ecf2fa';
const ACCENT = '#5a7fb8';
const WASH = '#d5e2f5';
const MUTED = '#414a57';
const ON_DARK = '#a8c3e8';

// resvg reads TrueType, not woff2. Fontshare's stylesheet lists a .ttf next to
// every woff2, so the brand faces come from there and stay out of the repo.
// The endpoint only honours one family per request, hence one call each.
const FONTSHARE_FAMILIES = ['clash-display@600', 'satoshi@400,500,700'];
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function trueTypeUrls(family) {
  const css = await (
    await fetch(`https://api.fontshare.com/v2/css?f[]=${family}&display=swap`, {
      headers: { 'user-agent': BROWSER_UA },
    })
  ).text();

  const urls = [
    ...new Set([...css.matchAll(/url\('(\/\/[^']+\.ttf)'\)/g)].map((m) => `https:${m[1]}`)),
  ];
  if (urls.length === 0) {
    throw new Error(
      `Fontshare returned no TrueType files for ${family}; the OG card would render in a fallback face.`,
    );
  }
  return urls;
}

async function brandFontFiles() {
  await mkdir(cacheDir, { recursive: true });

  const urls = (await Promise.all(FONTSHARE_FAMILIES.map(trueTypeUrls))).flat();

  return Promise.all(
    urls.map(async (url) => {
      const file = join(cacheDir, url.split('/').pop());
      try {
        await readFile(file);
      } catch {
        const response = await fetch(url, { headers: { 'user-agent': BROWSER_UA } });
        await writeFile(file, Buffer.from(await response.arrayBuffer()));
      }
      return file;
    }),
  );
}

async function monogram(fill) {
  const mark = await readFile(join(root, 'src/assets/brand/msw.svg'), 'utf8');
  return mark
    .replace(/fill="currentColor"/, `fill="${fill}"`)
    .replace(/<\?xml[^>]*>/, '')
    .replace(/role="img"/, '')
    .replace(/aria-label="[^"]*"/, '')
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<desc>[\s\S]*?<\/desc>/, '');
}

const fontFiles = await brandFontFiles();
const inkMark = await monogram(INK);
const paperMark = await monogram(PAPER);

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Modern Software Works — manual work is a choice">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="45%" stop-color="${PAPER}"/>
      <stop offset="100%" stop-color="${PAPER_2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ground)"/>

  <g transform="translate(812, 128) scale(0.62)" opacity="0.96">${inkMark}</g>

  <text x="80" y="104" fill="${INK}" font-family="Clash Display" font-size="30" font-weight="600">Modern Software Works<tspan fill="${ACCENT}">.</tspan></text>

  <text x="80" y="296" fill="${INK}" font-family="Clash Display" font-size="76" font-weight="600">Manual work is</text>
  <rect x="72" y="326" width="384" height="98" rx="20" fill="${WASH}"/>
  <text x="98" y="398" fill="${INK}" font-family="Clash Display" font-size="76" font-weight="600">a choice.</text>

  <text x="80" y="474" fill="${MUTED}" font-family="Satoshi" font-size="24" font-weight="400">Scheduling software · AI automation · Custom software</text>

  <rect x="0" y="558" width="1200" height="72" fill="${INK}"/>
  <text x="80" y="602" fill="${PAPER}" font-family="Satoshi" font-size="20" font-weight="700">modernsoftware.works</text>
  <text x="1120" y="602" text-anchor="end" fill="${ON_DARK}" font-family="Satoshi" font-size="18" font-weight="500">EN · IT · FR · JA · AR</text>
</svg>`;

const og = new Resvg(ogSvg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { fontFiles, loadSystemFonts: false },
});
await writeFile(join(root, 'public/og.png'), og.render().asPng());

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${INK}"/>
  <g transform="translate(22, 32) scale(0.26)">${paperMark}</g>
</svg>`;

const icon = new Resvg(iconSvg, { fitTo: { mode: 'width', value: 180 } });
await writeFile(join(root, 'public/apple-touch-icon.png'), icon.render().asPng());

console.log('Wrote public/og.png and public/apple-touch-icon.png');
