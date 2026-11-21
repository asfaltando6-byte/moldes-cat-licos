import { readFile, writeFile, readdir, unlink, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const assets = join(dist, 'assets/optimized');
let html = await readFile(join(dist, 'index.html'), 'utf8');
const css = (await readFile(join(dist, 'styles.css'), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
const cssTag = `<style id="site-styles">${css}</style>`;
if (/<style id="site-styles">[\s\S]*?<\/style>/.test(html)) html = html.replace(/<style id="site-styles">[\s\S]*?<\/style>/, () => cssTag);
else {
  if (!html.includes('<link rel="stylesheet" href="styles.css">')) throw new Error('Stylesheet marker missing');
  html = html.replace('<link rel="stylesheet" href="styles.css">', () => cssTag);
}
const pixel = await readFile(join(dist, 'meta-pixel.js'), 'utf8');
const pixelTag = `<script id="meta-pixel-inline">${pixel}</script>`;
if (/<script id="meta-pixel-inline">[\s\S]*?<\/script>/.test(html)) html = html.replace(/<script id="meta-pixel-inline">[\s\S]*?<\/script>/, () => pixelTag);
else {
  if (!html.includes('<script src="meta-pixel.js" defer></script>')) throw new Error('Pixel marker missing');
  html = html.replace('<script src="meta-pixel.js" defer></script>', () => pixelTag);
}
const parts = await Promise.all(['clientes.js', 'app.js', 'notifications.js'].map(file => readFile(join(dist, file), 'utf8')));
const bundle = parts.join('\n;\n');
const hash = createHash('sha256').update(bundle).digest('hex').slice(0, 10);
const bundleName = `site.${hash}.js`;
const runtimeTag = `<script id="site-runtime" src="assets/optimized/${bundleName}" defer></script>`;
if (/<script id="site-runtime"[^>]*><\/script>/.test(html)) html = html.replace(/<script id="site-runtime"[^>]*><\/script>/, () => runtimeTag);
else {
  const sources = /<script src="clientes\.js" defer><\/script>\s*<script src="app\.js" defer><\/script>\s*<script src="notifications\.js" defer><\/script>/;
  if (!sources.test(html)) throw new Error('Runtime marker missing');
  html = html.replace(sources, () => runtimeTag);
}
const manifest = JSON.parse(await readFile(join(root, 'scripts/assets.json'), 'utf8'));
await Promise.all([...manifest.hero.map(x => x.path), ...Object.values(manifest.backgrounds).map(x => x.path), manifest.font.path].map(path => access(join(dist, path))));
await writeFile(join(assets, bundleName), bundle);
await writeFile(join(dist, 'index.html'), html);
for (const file of await readdir(assets)) if (/^site\.[a-f0-9]{10}\.js$/.test(file) && file !== bundleName) await unlink(join(assets, file));
console.log(JSON.stringify({ cssInlineBytes: Buffer.byteLength(css), runtime: bundleName, pixel: 'PageView preserved', htmlBytes: Buffer.byteLength(html) }));
