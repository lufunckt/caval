import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const origin = 'https://ericoadestrador.com.br';
const pages = JSON.parse(fs.readFileSync('content/editorial-pages.json', 'utf8'));
const documents = pages.map(page => ({ ...page, html: fs.readFileSync(path.join('public/editorial', page.file), 'utf8') }));
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const captures = (text, pattern) => [...text.matchAll(pattern)].map(m => m[1]);
const links = (html) => captures(html, /(?:href|src)="([^"]+)"/g);
test('sitemap contains exactly the public canonical URLs and no private, preview or fragmented URLs', () => {
  const locations = captures(sitemap, /<loc>(.*?)<\/loc>/g);
  assert.deepEqual(locations.sort(), pages.map(p => origin + p.path).sort());
  assert.equal(new Set(locations).size, locations.length);
  for (const location of locations) assert.doesNotMatch(location, /#|\?|previa\.|area-do-tutor|\/messages|\/consultations/);
});
test('every indexable page has unique title, description, one H1 and a matching canonical', () => {
  const titles = new Set(), descriptions = new Set();
  for (const page of documents) {
    assert.equal(captures(page.html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/g).length, 1, page.path);
    const title = captures(page.html, /<title>(.*?)<\/title>/g); assert.equal(title.length, 1, page.path);
    const description = captures(page.html, /<meta name="description" content="([^"]+)"/g); assert.equal(description.length, 1, page.path);
    assert.ok(!titles.has(title[0]), 'duplicate title: ' + page.path); titles.add(title[0]);
    assert.ok(!descriptions.has(description[0]), 'duplicate description: ' + page.path); descriptions.add(description[0]);
    assert.deepEqual(captures(page.html, /<link rel="canonical" href="([^"]+)"/g), [origin + page.path], page.path);
    assert.doesNotMatch(page.html, /<meta name="robots"[^>]*noindex/i, page.path);
  }
});
test('all local links, scripts, images and fragment targets resolve inside the release', () => {
  const routeFiles = new Map(pages.map(p => [p.path, path.join(root, 'public/editorial', p.file)]));
  for (const page of documents) for (const target of links(page.html)) {
    if (/^(data:|mailto:|tel:)/.test(target)) continue;
    const url = new URL(target, origin + page.path);
    if (url.origin !== origin) continue;
    const file = routeFiles.get(url.pathname) || path.join(root, 'public', url.pathname);
    assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), `${page.path} links to missing ${target}`);
    if (url.hash && !url.search) {
      const html = fs.readFileSync(file, 'utf8');
      assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `missing fragment ${target} on ${page.path}`);
    }
  }
});
test('articles have related content, service, method, author, questionnaire, sources and valid structured data', () => {
  const articles = JSON.parse(fs.readFileSync('content/seo-articles.json', 'utf8'));
  for (const a of articles) {
    const html = documents.find(p => p.file === a.slug + '.html').html;
    for (const href of ['/editorial/metodo.html', '/editorial/sobre.html', '/questionario-comportamento-canino', '/consulta-comportamento-canino-online']) assert.ok(html.includes(`href="${href}"`));
    for (const related of a.related) assert.ok(html.includes(`href="/editorial/${related}.html"`));
    assert.match(html, /class="article-sources"/);
    const graph = JSON.parse(captures(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)[0]);
    assert.equal(graph['@graph'][0].headline, a.title);
    assert.equal(graph['@graph'][0].mainEntityOfPage, origin + '/editorial/' + a.slug + '.html');
    assert.ok(graph['@graph'].some(n => n['@type'] === 'BreadcrumbList'));
    assert.ok(!graph['@graph'].some(n => n['@type'] === 'Review' || n['@type'] === 'AggregateRating'));
  }
});
test('private portal stays noindex; canonical questionnaire is indexable and retains its wizard script', () => {
  assert.match(fs.readFileSync('public/editorial/area-do-tutor.html', 'utf8'), /noindex/);
  const quiz = documents.find(p => p.path === '/questionario-comportamento-canino').html;
  assert.match(quiz, /id="quiz"/);assert.match(quiz, /src="\/editorial\/questionario.js"/);
  assert.doesNotMatch(quiz, /noindex/);
});
test('conversion hooks do not load a tracker or transmit answers, names or WhatsApp message URLs', () => {
  const script = fs.readFileSync('public/editorial/telemetry.js', 'utf8');
  assert.doesNotMatch(script, /fetch\(|sendBeacon|url\.href|url\.search|\.value|gtag\/js|googletagmanager\.com/);
  assert.match(script, /ericoAnalyticsConsent === true/);
});
