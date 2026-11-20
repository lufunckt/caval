import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
const withHost = (url, host) => new Promise((resolve, reject) => {
  http.get(url, { headers: { Host: host } }, res => { let text=''; res.on('data', b => text+=b);res.on('end', () => resolve({ headers: res.headers, text })); }).on('error', reject);
});
let server;
const port = 32000 + Math.floor(Math.random() * 10000);
const base = `http://127.0.0.1:${port}`;
before(async () => {
  server = spawn(process.execPath, ['dist/server.cjs'], { env: { ...process.env, NODE_ENV: 'production', PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    let output = ''; const timeout = setTimeout(() => reject(new Error('Server startup timeout: ' + output)), 10000);
    server.stdout.on('data', chunk => { output += chunk; if (output.includes('Server running')) { clearTimeout(timeout); resolve(); } });
    server.stderr.on('data', chunk => { output += chunk; });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error('Server exited: ' + code + ' ' + output)); });
  });
});
after(() => server?.kill('SIGTERM'));
test('production serves every sitemap entry as complete indexable HTML', async () => {
  const pages = JSON.parse(fs.readFileSync('content/editorial-pages.json', 'utf8'));
  for (const page of pages) {
    const r = await fetch(base + page.path); assert.equal(r.status, 200, page.path);
    assert.ok(!r.headers.get('x-robots-tag')?.includes('noindex'), page.path);
    const html = await r.text(); assert.match(html, /<h1\b/);assert.ok(html.includes(`href="https://ericoadestrador.com.br${page.path}"`));
    assert.ok(!html.includes('<div id="root"></div>'), 'Public editorial content must not be an empty React shell');
  }
});
test('duplicate editorial endpoints redirect permanently to canonical URLs', async () => {
  for (const [from, to] of [['/editorial/index.html','/'],['/editorial/questionario-comportamento-canino.html','/questionario-comportamento-canino'],['/editorial/consulta-comportamento-canino-online.html','/consulta-comportamento-canino-online']]) {
    const r = await fetch(base + from, { redirect: 'manual' }); assert.equal(r.status, 301); assert.equal(r.headers.get('location'), to);
  }
});
test('preview and private entry stay noindex; original React portal remains available', async () => {
  const preview = await withHost(base + '/consulta-comportamento-canino-online', 'previa.ericoadestrador.com.br'); assert.match(preview.headers['x-robots-tag'], /noindex/);
  const robots = await withHost(base + '/robots.txt', 'previa.ericoadestrador.com.br'); assert.match(robots.text, /Disallow: \//);
  const privatePage = await fetch(base + '/editorial/area-do-tutor.html'); assert.match(privatePage.headers.get('x-robots-tag'), /noindex/);
  const original = await fetch(base + '/?versao=original'); assert.equal(original.status, 200); assert.match(original.headers.get('x-robots-tag'), /noindex/);assert.match(await original.text(), /id="root"/);
});
test('missing editorial pages return 404 and assets have expected MIME types', async () => {
  assert.equal((await fetch(base + '/editorial/does-not-exist.html')).status, 404);
  for (const [file, type] of [['passeio.webp', 'image/webp'],['questionario.js','javascript'],['editorial.css','text/css']]) {
    const r = await fetch(base + '/editorial/' + file); assert.equal(r.status, 200); assert.ok(r.headers.get('content-type').includes(type));
  }
});
