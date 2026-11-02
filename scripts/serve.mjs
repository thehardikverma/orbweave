// Zero-dependency static server for previewing the site locally.
// Usage: npm start  (PORT env var optional, default 3000)
// Note: /api/* routes are Vercel serverless functions; use `vercel dev` to run them.
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT) || 3000;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.woff2': 'font/woff2',
};
const blocked = /^\/(node_modules|api|scripts|\.git|\.env)/;

function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, clean);
  if (!file.startsWith(root)) return null;
  try {
    const st = statSync(file);
    if (st.isDirectory()) file = join(file, 'index.html');
    statSync(file);
    return file;
  } catch {
    try { statSync(file + '.html'); return file + '.html'; } catch { return null; }
  }
}

http.createServer((req, res) => {
  if (blocked.test(req.url)) { res.writeHead(404).end('Not found'); return; }
  const file = resolveFile(req.url);
  if (!file) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); return; }
  const type = types[extname(file).toLowerCase()] || 'application/octet-stream';
  const cache = /\.(png|jpe?g|webp|ico|woff2)$/.test(file) ? 'public, max-age=86400' : 'no-cache';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Orbweave preview running at http://localhost:${port}`));
