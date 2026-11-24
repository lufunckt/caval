"""Apply the Tutor-inspired public design without changing the editorial copy."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = ROOT / 'public/editorial'
PAW = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><ellipse cx="8" cy="10" rx="3" ry="4" fill="currentColor" transform="rotate(-25 8 10)"/><ellipse cx="15" cy="6" rx="3" ry="4" fill="currentColor"/><ellipse cx="23" cy="9" rx="3" ry="4" fill="currentColor" transform="rotate(25 23 9)"/><ellipse cx="27" cy="16" rx="2.5" ry="3.5" fill="currentColor" transform="rotate(30 27 16)"/><path d="M7 23c0-4 5-11 9-11s10 7 10 11c0 7-7 3-10 3s-9 4-9-3Z" fill="currentColor"/></svg>'
MENU = '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Abrir menu" hidden><span class="menu-icon" aria-hidden="true"></span>Menu</button>'

for file in DIRECTORY.glob('*.html'):
    # The private portal and its original entry document are outside this redesign.
    if file.name == 'area-do-tutor.html':
        continue
    html = file.read_text(encoding='utf-8')
    html = html.replace('href="/editorial/editorial.css"', 'href="/editorial/public-design.css"')
    html = re.sub(r'<style id="whatsapp-flutuante-css">.*?</style>', '', html, flags=re.S)
    if '/editorial/navigation.js' not in html:
        html = html.replace('</head>', '<script src="/editorial/navigation.js" defer></script></head>')
    page = {
        'index': 'home', 'metodo': 'method', 'sobre': 'about', 'conteudos': 'library',
        'consulta-comportamento-canino-online': 'service',
        'questionario-comportamento-canino': 'questionnaire', 'privacidade': 'privacy',
    }.get(file.stem, 'guide')
    html = re.sub(r'<body(?: data-page="[^"]+")?>', f'<body data-page="{page}">', html, count=1)
    header = re.search(r'<header id="inicio".*?</header>', html, re.S)
    if header:
        navigation = header.group()
        if 'brand-symbol' not in navigation:
            navigation = navigation.replace('início">Érico <span>Cavalheiro</span>', f'início"><span class="brand-symbol">{PAW}</span><span class="brand-name">Érico <strong>Cavalheiro</strong></span>')
        navigation = navigation.replace('<nav aria-label="Navegação principal">', '<nav id="site-navigation" aria-label="Navegação principal">')
        if 'menu-toggle' not in navigation:
            navigation = navigation.replace('<nav id="site-navigation"', MENU + '<nav id="site-navigation"')
        html = html[:header.start()] + navigation + html[header.end():]
    if page == 'home' and 'hero-layout' not in html:
        hero = re.search(r'<section class="hero".*?</section>', html, re.S)
        old = hero.group()
        kicker = re.search(r'<p class="kicker">.*?</p>', old, re.S).group()
        title = re.search(r'<h1.*?</h1>', old, re.S).group()
        lead = re.search(r'<p class="hero-lead".*?</p>', old, re.S).group()
        intro = re.search(r'<div class="panel-intro">.*?</div>', old, re.S).group()
        photo = re.search(r'<figure class="hero-photo">.*?</figure>', old, re.S).group()
        action = re.search(r'<div class="panel-action">.*?</div>', old, re.S).group()
        strip = re.search(r'<div class="hero-strip">.*?</div>', old, re.S).group()
        mascot = '<img class="public-mascot" src="/tutor/biscoito.webp" alt="" aria-hidden="true" width="400" height="400">'
        portrait = '<img class="hero-educator" src="/editorial/erico.webp" alt="" aria-hidden="true" width="480" height="600">'
        new = '<section class="hero" aria-labelledby="home-title"><div class="wrap"><div class="hero-layout"><div class="hero-copy">'+kicker+title+lead+intro+action+'</div><div class="hero-art">'+photo+mascot+portrait+'</div></div>'+strip+'</div></section>'
        html = html[:hero.start()] + new + html[hero.end():]
    if 'problem-icon' not in html:
        html = re.sub(r'(<ul class="problem-links">)(.*?)(</ul>)', lambda m: m[1]+re.sub(r'(<a href="[^"]+">)', r'\1<span class="problem-icon">'+PAW+'</span>', m[2])+m[3], html, flags=re.S)
    file.write_text(html, encoding='utf-8')

print('Applied public design to 12 pages; tutor portal files unchanged.')
