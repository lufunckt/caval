# Visual público alinhado à Área do Tutor

Branch: `release/design-site-tutor`, sobre a integração SEO + Área do Tutor.

O visual público usa a paleta azul #1239ac, tinta #10265c, creme #fff8ee,
pêssego #ffe4cd e fundo #f8eee3 do portal. Cartões e botões têm bordas suaves
e sombras de papel. A home tem composição em duas colunas, fotografias reais,
o Biscoito já existente e cartões para as dificuldades da rotina.

O cabeçalho tem menu no celular, suporte a teclado e alternativa sem JavaScript.
Método, Sobre, consulta online, biblioteca, cinco guias, questionário e
privacidade compartilham a nova apresentação. O botão de WhatsApp continua
disponível. Não foram acrescentadas fontes, bibliotecas ou imagens remotas.

Os textos principais, títulos, descrições e canônicas das 12 páginas foram
comparados com a versão anterior e preservados. Scripts do questionário e
conversões, dados estruturados e rotas públicas também foram mantidos.
O redesenho não altera src/tutor, autenticação, regras, APIs, dados ou CSS
do portal, nem public/editorial/area-do-tutor.html.

scripts/style-public.py aplica os elementos visuais às páginas e é chamado
ao final do gerador editorial. O CSS está em public/editorial/public-design.css;
o CSS anterior continua disponível por compatibilidade com o documento legado.

O workflow verifica TypeScript, políticas do portal, SEO, build, rotas HTTP
e o visual no Chromium em 1440, 768 e 390 pixels. Verifica também o menu por
teclado, navegação sem JavaScript e questionário até criar o link de WhatsApp,
sem enviar mensagem. Capturas da home ficam no artefato public-design-preview.

No Coolify, usar a branch e o SHA fornecidos na entrega. Manter Dockerfile,
porta 3000, domínios e configurações da versão integrada. O código ainda
precisa ser implantado na VPS; este documento não confirma deploy em produção.
