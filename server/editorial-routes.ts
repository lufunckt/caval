import express, { type Router } from 'express';
import path from 'node:path';
import pages from '../content/editorial-pages.json';

/** Public editorial routes are served as complete HTML, independently of React. */
export function editorialRoutes(publicRoot: string): Router {
  const router = express.Router();
  const directory = path.join(publicRoot, 'editorial');
  const preview = (hostname: string) => hostname === 'previa.ericoadestrador.com.br' || hostname.endsWith('.sslip.io');

  router.use((req, res, next) => {
    if (preview(req.hostname) || req.query.versao === 'original' || req.path === '/area-do-tutor' || req.path === '/editorial/area-do-tutor.html') {
      res.setHeader('X-Robots-Tag', 'noindex, follow');
    }
    next();
  });
  router.get('/robots.txt', (req, res) => {
    if (preview(req.hostname)) return res.type('text/plain').send('User-agent: *\nDisallow: /\n');
    res.sendFile(path.join(publicRoot, 'robots.txt'));
  });
  router.get('/sitemap.xml', (_req, res) => res.type('application/xml').sendFile(path.join(publicRoot, 'sitemap.xml')));
  router.get('/editorial/index.html', (_req, res) => res.redirect(301, '/'));
  router.get('/editorial/questionario-comportamento-canino.html', (_req, res) => res.redirect(301, '/questionario-comportamento-canino'));
  router.get('/editorial/consulta-comportamento-canino-online.html', (_req, res) => res.redirect(301, '/consulta-comportamento-canino-online'));
  for (const page of pages) {
    router.get(page.path, (req, res, next) => {
      if (page.path === '/' && req.query.versao === 'original') return next();
      res.sendFile(path.join(directory, page.file));
    });
  }
  router.use('/editorial', express.static(directory, { index: false, redirect: false }));
  router.use('/editorial', (_req, res) => res.status(404).type('html').send('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Página não encontrada | Érico Cavalheiro</title><h1>Página não encontrada</h1><p><a href="/editorial/conteudos.html">Voltar aos conteúdos</a></p></html>'));
  return router;
}
