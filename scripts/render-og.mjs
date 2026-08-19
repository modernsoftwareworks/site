import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const ogSvg = await readFile(join(root, 'scripts/og-card.svg'));
const og = new Resvg(ogSvg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
});
await writeFile(join(root, 'public/og.png'), og.render().asPng());

const mark = await readFile(join(root, 'src/assets/brand/msw.svg'), 'utf8');
const markInner = mark
  .replace(/fill="currentColor"/, 'fill="#f4f1ea"')
  .replace(/<\?xml[^>]*>/, '')
  .replace(/role="img"/, '')
  .replace(/aria-label="[^"]*"/, '')
  .replace(/<title>[\s\S]*?<\/title>/, '')
  .replace(/<desc>[\s\S]*?<\/desc>/, '');

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#0c0e14"/>
  <g transform="translate(22, 32) scale(0.26)">
    ${markInner}
  </g>
</svg>`;

const icon = new Resvg(iconSvg, {
  fitTo: { mode: 'width', value: 180 },
});
await writeFile(join(root, 'public/apple-touch-icon.png'), icon.render().asPng());
