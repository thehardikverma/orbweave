// "Build" step for this static site: verifies that every local file referenced
// from HTML (src/href) exists, and that JS files parse. Exits non-zero on problems.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const skip = new Set(['node_modules', '.git', '.vercel']);
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  if (skip.has(name)) return [];
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(root);
let problems = 0;

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"#?]+)[^"]*"/g)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(ref) || ref.startsWith('/api/')) continue;
    let target = ref.startsWith('/') ? join(root, ref) : join(dirname(file), ref);
    if (ref.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target) && !existsSync(target + '.html') && !existsSync(join(target, 'index.html'))) {
      console.error(`✗ ${relative(root, file)} → missing ${ref}`);
      problems++;
    }
  }
}
for (const file of files.filter((f) => f.endsWith('.js') && !f.includes(`${'/'}api${'/'}`))) {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); }
  catch (e) { console.error(`✗ ${relative(root, file)} → syntax error\n${e.stderr}`); problems++; }
}
const frames = readdirSync(join(root, 'images')).filter((f) => f.startsWith('compressed_scrub')).length;
console.log(`Checked ${files.filter((f) => f.endsWith('.html')).length} HTML pages, ${frames} hero frames.`);
if (problems) { console.error(`${problems} problem(s) found.`); process.exit(1); }
console.log('✓ All local references resolve. Static site is ready to deploy.');
