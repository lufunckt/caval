(() => {
  const header = document.querySelector('body > header');
  const toggle = header?.querySelector('.menu-toggle');
  const navigation = header?.querySelector('#site-navigation');
  if (!toggle || !navigation) return;
  const compact = window.matchMedia('(max-width: 960px)');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navigation.hidden = compact.matches && !open;
  };
  const sync = () => {
    toggle.hidden = !compact.matches;
    setOpen(false);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && compact.matches && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && compact.matches) setOpen(false);
  });
  compact.addEventListener('change', sync);
  sync();
})();
