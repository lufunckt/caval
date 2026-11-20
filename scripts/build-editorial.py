"""Build the public SEO pages; keep the published editorial design and URLs."""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
import json, math, re, xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/editorial'
ORIGIN = 'https://ericoadestrador.com.br'
UPDATED = '2026-11-20'
SERVICE = '/consulta-comportamento-canino-online'
QUIZ = '/questionario-comportamento-canino'
ARTICLES = json.loads((ROOT / 'content/seo-articles.json').read_text())
BY_SLUG = {a['slug']: a for a in ARTICLES}
SOURCES = {
 'avsab': ('AVSAB — posicionamento sobre métodos de educação canina', 'https://avsab.org/resources/position-statements/'),
 'merck-management': ('Merck Veterinary Manual — manejo de problemas de comportamento', 'https://www.merckvetmanual.com/behavior/behavioral-medicine-introduction/treatment-of-behavior-problems-in-animals'),
 'merck-owners': ('Merck Veterinary Manual — problemas de comportamento em cães', 'https://www.merckvetmanual.com/dog-owners/behavior-of-dogs/behavior-problems-in-dogs'),
 'merck-separation': ('Merck Veterinary Manual — comportamento canino e sofrimento relacionado à separação', 'https://www.merckvetmanual.com/behavior/behavior-of-dogs/behavior-problems-of-dogs'),
 'noise-review': ('Riemer, 2023 — revisão das evidências sobre medo de ruídos em cães', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10705068/'),
}
# Reuse the real, already published header/footer instead of redesigning the site.
template = (OUT / 'metodo.html').read_text()
HEADER = re.search(r'<header\b.*?</header>', template, re.S).group()
HEADER = re.sub(r' aria-current="page"', '', HEADER)
FOOTER = re.search(r'<footer\b.*?</footer>', template, re.S).group()
FLOATING = re.search(r'<a class="whatsapp-flutuante".*?</a>', template, re.S).group()
WHATSAPP = re.search(r'href="([^"]+)"', FLOATING).group(1)
FLOAT_STYLE = re.search(r'<style id="whatsapp-flutuante-css">.*?</style>', template, re.S).group()

def absolute_links(html):
    def replace(m):
        attr, value = m.groups()
        if value == 'questionario-comportamento-canino.html': value = QUIZ
        elif value.startswith('questionario-comportamento-canino.html#'): value = QUIZ + '#' + value.split('#', 1)[1]
        elif value and not value.startswith(('/', '#', 'http:', 'https:', 'mailto:', 'tel:', 'data:')): value = '/editorial/' + value
        return f'{attr}="{value}"'
    return re.sub(r'(href|src)="([^"]+)"', replace, html)

HEADER = absolute_links(HEADER)
FOOTER = absolute_links(FOOTER)
# Service belongs in the primary navigation on all public pages.
if SERVICE not in HEADER:
    HEADER = HEADER.replace('<a href="/editorial/conteudos.html">', f'<a href="{SERVICE}">Consulta online</a><a href="/editorial/conteudos.html">')

def page(title, description, path, main, graph=None):
    structured = '' if not graph else '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False).replace('</', '<\\/') + '</script>'
    return f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(description, quote=True)}">
<link rel="canonical" href="{ORIGIN}{path}"><meta property="og:title" content="{escape(title, quote=True)}"><meta property="og:description" content="{escape(description, quote=True)}"><meta property="og:url" content="{ORIGIN}{path}"><meta property="og:type" content="{'article' if graph and graph[0]['@type'] == 'Article' else 'website'}"><meta property="og:locale" content="pt_BR">
<link rel="stylesheet" href="/editorial/editorial.css">{FLOAT_STYLE}{structured}<script src="/editorial/telemetry.js" defer></script></head><body>
<a class="skip" href="#conteudo-principal">Pular para o conteúdo</a>{HEADER}
<main id="conteudo-principal">{main}</main>{FOOTER}{FLOATING}</body></html>'''

class Text(HTMLParser):
    def __init__(self): super().__init__(); self.text=[]
    def handle_data(self, d): self.text.append(d)
def read_minutes(text):
    p=Text(); p.feed(text); return max(1, math.ceil(len(' '.join(p.text).split()) / 200))
def cta(text):
    return f'<aside class="article-cta"><h2>Vamos olhar para a rotina de vocês?</h2><p>{escape(text)}</p><a class="button" href="{QUIZ}">Preencher o questionário de comportamento canino</a><p><a href="{SERVICE}">Como funciona a consulta de comportamento canino online</a></p></aside>'
def article_url(slug): return '/editorial/' + slug + '.html'

for a in ARTICLES:
    blocks=[]
    for n, section in enumerate(a['sections']):
        title, *paragraphs = section
        blocks.append(f'<section id="sec-{n+1}"><h2>{escape(title)}</h2>' + ''.join('<p>'+escape(p)+'</p>' for p in paragraphs) + '</section>')
        if n == 1: blocks.append(cta(a['cta']))
    faq = '<section id="perguntas"><h2>Perguntas frequentes</h2>' + ''.join(f'<details><summary>{escape(q)}</summary><p>{escape(ans)}</p></details>' for q, ans in a['faq']) + '</section>'
    related = '<section class="article-related"><h2>Continue a leitura</h2><ul>' + ''.join(f'<li><a href="{article_url(slug)}">{escape(BY_SLUG[slug]["title"])}</a></li>' for slug in a['related']) + f'<li><a href="/editorial/metodo.html">Conheça o Método de Educação Relacional</a></li><li><a href="/editorial/sobre.html">Conheça o trabalho do Érico</a></li></ul></section>'
    source_html = '<section class="article-sources"><h2>Fontes para aprofundar</h2><ul>' + ''.join(f'<li><a href="{SOURCES[key][1]}" target="_blank" rel="noopener noreferrer">{SOURCES[key][0]}</a></li>' for key in a['sources']) + '</ul><p>Conteúdo educativo. As orientações individuais dependem da avaliação do caso. Diagnóstico, prescrição e questões de saúde são atribuições do médico-veterinário.</p></section>'
    toc = '<nav class="article-toc" aria-label="Neste artigo"><strong>Neste artigo</strong><ul>' + ''.join(f'<li><a href="#sec-{n+1}">{escape(s[0])}</a></li>' for n,s in enumerate(a['sections'])) + '<li><a href="#perguntas">Perguntas frequentes</a></li></ul></nav>'
    body = ''.join(blocks)+faq+related+source_html+cta(a['cta'])
    main = f'<header class="wrap article-header"><nav class="breadcrumbs" aria-label="Você está em"><a href="/">Início</a><span>/</span><a href="/editorial/conteudos.html">Conteúdos</a></nav><p class="kicker">Comportamento canino na rotina</p><h1>{escape(a["title"])}</h1><p class="article-summary">{escape(a["summary"])}</p><p class="article-meta"><a href="/editorial/sobre.html">Érico Cavalheiro</a> · Educação relacional<br>Atualizado em <time datetime="{UPDATED}">20 de novembro de 2026</time> · {read_minutes(body)} min de leitura</p></header><article class="wrap article-body">{toc}{body}</article>'
    path = article_url(a['slug'])
    graph = [{'@type':'Article','headline':a['title'],'description':a['description'],'mainEntityOfPage':ORIGIN+path,'inLanguage':'pt-BR','dateModified':UPDATED,'author':{'@type':'Person','name':'Érico Cavalheiro','url':ORIGIN+'/editorial/sobre.html'},'publisher':{'@type':'Organization','name':'Érico Cavalheiro','url':ORIGIN}}, {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Início','item':ORIGIN+'/'},{'@type':'ListItem','position':2,'name':'Conteúdos','item':ORIGIN+'/editorial/conteudos.html'},{'@type':'ListItem','position':3,'name':a['title'],'item':ORIGIN+path}]}]
    (OUT / (a['slug']+'.html')).write_text(page(a['title']+' | Érico Cavalheiro', a['description'], path, main, graph))

service_main = '''<section class="wrap intro service-intro"><p class="kicker">Atendimento por videochamada · Em português</p><h1>Consulta de comportamento canino online</h1><div class="band"><p>Entenda o que acontece na rotina do seu cão e organize os próximos passos com Érico Cavalheiro, de onde você estiver.</p><a class="button" href="/questionario-comportamento-canino">Preparar minha conversa</a></div></section>
<section class="wrap sub-section"><h2>Quando faz sentido procurar orientação?</h2><p>Quando passeios, visitas ou momentos em casa se tornam difíceis, uma conversa individual pode ajudar a organizar o contexto. Você não precisa chegar com um diagnóstico.</p><div class="sub-grid">
<article class="tile"><h3>Seu cão late ou avança no passeio</h3><p>Converse sobre os encontros com outros cães, o trajeto e as possibilidades de criar distância.</p><a class="inline" href="/editorial/reatividade-na-guia.html">Entender a reatividade na guia</a></article>
<article class="tile"><h3>A chegada de visitas ficou difícil</h3><p>Descreva a entrada das pessoas e como o ambiente pode ser organizado com mais segurança.</p><a class="inline" href="/editorial/agitacao-com-visitas.html">Observar os latidos para visitas</a></article>
<article class="tile"><h3>Ficar sozinho ou ouvir barulhos causa dificuldade</h3><p>Organize os registros e converse sobre a necessidade de acompanhamento comportamental e veterinário.</p><a class="inline" href="/editorial/ansiedade-de-separacao.html">Ler sobre ficar sozinho</a></article>
<article class="tile"><h3>Os puxões limitam o passeio</h3><p>Leve informações sobre equipamentos, horários e as dificuldades de quem conduz o cão.</p><a class="inline" href="/editorial/cachorro-puxa-a-guia.html">Observar os puxões na guia</a></article></div></section>
<section class="wrap sub-section service-how"><h2>Como funciona a videochamada</h2><ol class="steps"><li><div><strong>Conte uma situação real</strong><span>Preencha o questionário e revise o resumo antes de abrir o WhatsApp. Combine horário, valor e condições diretamente com Érico.</span></div></li><li><div><strong>Converse sobre o contexto</strong><span>Na sessão individual, vocês conversam sobre a rotina, as situações difíceis e os sinais observados.</span></div></li><li><div><strong>Organize a prática</strong><span>As orientações devem considerar as possibilidades da sua casa e dos seus passeios. Confirme com Érico como funciona o suporte do atendimento escolhido.</span></div></li></ol></section>
<section class="wrap sub-section"><h2>O que preparar antes da consulta</h2><ul class="service-checklist"><li>Uma ou duas situações que você quer compreender melhor.</li><li>Informações sobre rotina, equipamentos e mudanças recentes.</li><li>Um celular ou computador com câmera, áudio e conexão estável.</li><li>Registros existentes, quando for seguro compartilhar. Não provoque uma reação para filmar.</li><li>Informações de avaliações veterinárias anteriores, quando houver.</li></ul><p>Você pode anotar dúvidas e confirmar com Érico quais materiais realmente serão necessários.</p></section>
<section class="wrap sub-section"><h2>Educação relacional e limites do atendimento</h2><p>O trabalho de Érico considera a convivência, o ambiente e a comunicação entre tutor e cão. <a href="/editorial/metodo.html">Conheça a Educação Relacional</a> e <a href="/editorial/sobre.html">saiba mais sobre o Érico</a>.</p><p>A orientação comportamental online não substitui avaliação médica veterinária, diagnóstico de doenças ou prescrição de medicamentos. Dor, mudanças súbitas de comportamento, ferimentos e risco de mordida exigem atenção profissional. Alguns casos precisam de atendimento presencial ou de acompanhamento conjunto.</p><p>Não há promessa de resultado em um número fixo de sessões. O plano depende da situação e das condições de cada família.</p></section>
<section class="wrap sub-section article-body service-faq"><h2>Perguntas sobre a consulta online</h2><details><summary>Posso participar de outra cidade?</summary><p>Sim. O atendimento por videochamada pode ser combinado de qualquer lugar do Brasil.</p></details><details><summary>É uma consulta veterinária?</summary><p>Não. É um atendimento de orientação sobre comportamento e educação canina. Questões de saúde e medicamentos devem ser avaliadas por um médico-veterinário.</p></details><details><summary>Preciso mostrar uma reação do meu cão ao vivo?</summary><p>Não provoque uma situação difícil para a consulta. Combine registros seguros e formas de apresentar a rotina.</p></details><details><summary>Quanto custa e qual é a duração?</summary><p>Confirme valor, duração, disponibilidade e condições do atendimento diretamente com Érico antes de agendar.</p></details><details><summary>Posso começar pelo questionário?</summary><p>Sim. Ele organiza seu relato; você revisa as informações antes de abrir a conversa no WhatsApp.</p></details></section>'''
service_main += cta('Conte qual situação da rotina você quer compreender melhor e confirme as condições do atendimento com Érico.')
service_main = service_main.replace('<aside class="article-cta">', '<aside class="wrap article-cta">')
(OUT/'consulta-comportamento-canino-online.html').write_text(page('Consulta de Comportamento Canino Online | Érico Cavalheiro','Orientação online para reatividade, latidos, passeios e convivência com seu cão. Conheça a videochamada com Érico e prepare sua conversa pelo questionário.',SERVICE,service_main,[{'@type':'Service','name':'Consulta de comportamento canino online','serviceType':'Orientação comportamental e educação canina por videochamada','url':ORIGIN+SERVICE,'provider':{'@type':'Person','name':'Érico Cavalheiro','url':ORIGIN+'/editorial/sobre.html'},'areaServed':{'@type':'Country','name':'Brasil'}}]))

cards=''.join(f'<article class="tile"><p class="kicker">Passeios e convivência</p><h3><a href="{article_url(a["slug"])}">{escape(a["title"])}</a></h3><p>{escape(a["summary"])}</p><p class="article-meta">Érico Cavalheiro · Atualizado em 20/11/2026</p><a class="inline" href="{article_url(a["slug"])}">Ler o guia completo</a></article>' for a in ARTICLES)
index_main='<section class="wrap intro"><p class="kicker">Leituras para tutores</p><h1>Comportamento canino na prática</h1><div class="band"><p>Guias para observar situações reais: passeios, visitas, barulhos e os momentos em que o cão fica sozinho. Comece pela dificuldade que está mais presente na sua rotina.</p></div></section><section class="wrap sub-section"><h2>Por onde você quer começar?</h2><div class="sub-grid">'+cards+'</div></section><section class="wrap sub-section"><h2>Quer conversar sobre a sua situação?</h2><p>Os artigos são educativos. Para discutir a rotina do seu cão de forma individual, <a href="'+SERVICE+'">conheça a consulta de comportamento canino online</a>.</p></section>'+cta('Use o questionário para organizar uma situação concreta e conversar sobre ela com Érico.')
index_main=index_main.replace('<aside class="article-cta">','<aside class="wrap article-cta">')
(OUT/'conteudos.html').write_text(page('Comportamento Canino: Passeios, Latidos e Rotina | Érico Cavalheiro','Guias sobre cachorro reativo na guia, latidos para visitas, medo de barulhos, puxões e dificuldade de ficar sozinho. Leia e prepare sua conversa com Érico.','/editorial/conteudos.html',index_main))

# Apply shared URL/metadata fixes to imported pages and newly generated documents.
for file in OUT.glob('*.html'):
    html=absolute_links(file.read_text())
    html=html.replace('/editorial/questionario-comportamento-canino.html',QUIZ)
    html=re.sub(r'<header\b[^>]*id="inicio".*?</header>',HEADER,html,count=1,flags=re.S)
    if '/editorial/telemetry.js' not in html: html=html.replace('</head>','<script src="/editorial/telemetry.js" defer></script></head>')
    if file.name=='index.html':
        html=html.replace('Adestrador Online e Comportamento Canino | Érico Cavalheiro','Adestrador Online para Comportamento Canino | Érico Cavalheiro')
        html=html.replace('Adestramento online para cães com Érico Cavalheiro. Receba orientações por videochamada para lidar com reatividade, latidos e desafios na rotina do seu cão.','Adestramento online com Érico Cavalheiro para entender reatividade, latidos e desafios da convivência. Conheça a consulta por videochamada e o questionário.')
        if 'id="home-seo-lead"' not in html: html=html.replace('<div class="hero-panel">','<p class="hero-lead" id="home-seo-lead">Para entender e melhorar o comportamento do seu cão, de onde você estiver.</p><div class="hero-panel">',1)
        if 'id="problemas-atendidos"' not in html:
            problems=[('Cão reativo no passeio','reatividade-na-guia'),('Latidos para visitas','agitacao-com-visitas'),('Agitação com visitas','agitacao-com-visitas'),('Medo de fogos e barulhos','medo-de-barulhos'),('Dificuldade de ficar sozinho','ansiedade-de-separacao'),('Puxões na guia','cachorro-puxa-a-guia')]
            links=''.join(f'<li><a href="{article_url(slug)}">{label}</a></li>' for label,slug in problems)
            section='<section class="wrap sub-section" id="problemas-atendidos"><p class="kicker">O que está difícil na rotina?</p><h2>Encontre um ponto de partida.</h2><ul class="problem-links">'+links+'</ul><a class="inline" href="'+SERVICE+'">Conhecer a consulta de comportamento canino online</a></section>'
            html=html.replace('<section class="online"',section+'<section class="online"',1)
        if "'#sobre':" not in html: html=html.replace("'#diagnostico': '/questionario-comportamento-canino'", "'#diagnostico': '/questionario-comportamento-canino', '#sobre': '/editorial/sobre.html'")
    if file.name=='questionario-comportamento-canino.html':
        html=re.sub(r'<meta name="robots"[^>]*>','',html)
        html=re.sub(r'<link rel="canonical"[^>]*>','',html)
        html=html.replace('</head>',f'<link rel="canonical" href="{ORIGIN}{QUIZ}"></head>')
        html=html.replace('<h1>questionário canino</h1>','<h1>Questionário de comportamento canino</h1>')
    if file.name=='sobre.html' and 'id="limites-atendimento"' not in html:
        html=html.replace('</main>','<section class="wrap sub-section" id="limites-atendimento"><h2>Uma orientação com contexto e responsabilidade</h2><p>O atendimento se concentra na observação da rotina e na educação canina. Não substitui consulta médico-veterinária, diagnóstico de doenças ou prescrição. Mudanças súbitas de comportamento e sinais de dor precisam de avaliação veterinária.</p><p><a href="'+SERVICE+'">Veja como funciona a consulta online</a> ou <a href="'+QUIZ+'">prepare um relato pelo questionário</a>.</p></section></main>')
    if file.name=='area-do-tutor.html':
        # Preserve the existing private portal access and its noindex instruction.
        pass
    active = '/' if file.name == 'index.html' else '/editorial/' + file.name
    if file.name == 'consulta-comportamento-canino-online.html': active = SERVICE
    if file.name == 'questionario-comportamento-canino.html': active = QUIZ
    if file.stem in BY_SLUG: active = '/editorial/conteudos.html'
    header = re.search(r'<header id="inicio".*?</header>', html, re.S)
    if header:
        marked = re.sub(r' aria-current="page"', '', header.group())
        marked = marked.replace(f'href="{active}">', f'href="{active}" aria-current="page">')
        html = html[:header.start()] + marked + html[header.end():]
    # Share cards describe the same canonical document as the visible page.
    title = re.search(r'<title>(.*?)</title>', html).group(1)
    description = re.search(r'<meta name="description" content="([^"\n]+)"', html).group(1)
    canonical = re.search(r'<link rel="canonical" href="([^"\n]+)"', html)
    for property, value in [('og:title', title), ('og:description', description), ('og:url', canonical.group(1) if canonical else '')]:
        if value and f'property="{property}"' not in html:
            html = html.replace('</head>', f'<meta property="{property}" content="{value}"></head>')
    file.write_text(html)

pages=[{'path':'/','file':'index.html'},{'path':'/editorial/metodo.html','file':'metodo.html'},{'path':'/editorial/sobre.html','file':'sobre.html'},{'path':'/editorial/conteudos.html','file':'conteudos.html'},{'path':SERVICE,'file':'consulta-comportamento-canino-online.html'},{'path':QUIZ,'file':'questionario-comportamento-canino.html'},{'path':'/editorial/privacidade.html','file':'privacidade.html'}]+[{'path':article_url(a['slug']),'file':a['slug']+'.html'} for a in ARTICLES]
(ROOT/'content/editorial-pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n')
ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
xml=ET.Element(ns+'urlset')
for p in pages:
    item=ET.SubElement(xml,ns+'url');ET.SubElement(item,ns+'loc').text=ORIGIN+p['path']
ET.indent(xml)
(ROOT/'public/sitemap.xml').write_bytes(ET.tostring(xml,encoding='utf-8',xml_declaration=True))
(ROOT/'public/robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+ORIGIN+'/sitemap.xml\n')
print(f'Generated {len(ARTICLES)} articles, service page, contents index and {len(pages)} sitemap entries.')
