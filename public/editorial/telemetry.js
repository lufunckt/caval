/* Conversion hooks only. No analytics vendor is loaded and no questionnaire data is sent. */
(() => {
  const allowed = new Set(['whatsapp_click', 'questionnaire_start', 'questionnaire_complete', 'consultation_interest']);
  window.ericoTrack = (name, placement = 'page') => {
    if (!allowed.has(name)) return;
    const detail = { event_name: name, page_path: location.pathname, placement };
    document.dispatchEvent(new CustomEvent('erico:conversion', { detail }));
    // A configured analytics integration must manage consent before enabling transmission.
    if (window.ericoAnalyticsConsent === true && typeof window.gtag === 'function') {
      window.gtag('event', name, { page_path: detail.page_path, placement });
    }
  };
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    const placement = anchor.classList.contains('whatsapp-flutuante') ? 'floating' : anchor.closest('.article-cta') ? 'article_cta' : 'page';
    if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') window.ericoTrack('whatsapp_click', placement);
    else if (url.origin === location.origin && url.pathname === '/consulta-comportamento-canino-online') window.ericoTrack('consultation_interest', placement);
  });
})();
