# SEO e Área do Tutor integrados

Esta versão reúne `feat/seo-editorial` (2a981b6) e
`feat/area-tutor-comunidade-consultas` (54a2b9c). Preserva as páginas
editoriais, sitemap e questionário públicos e adiciona o portal React e as
APIs privadas. A inicialização Firebase usa o projeto e banco nomeado
configurados no aplicativo. Os scripts de teste das duas versões foram mantidos.

## Publicação no Coolify

- Branch: `release/seo-area-tutor`. Usar o SHA informado na entrega.
- Dockerfile na raiz, porta interna 3000. A imagem usa Node 24 e executa
  `npm run build`; não configurar esta aplicação como um site somente estático.
- Preservar domínios, proxy e variáveis existentes. Se outro container Nginx
  ainda atender o domínio, ele precisa encaminhar as rotas ao servidor Node,
  conforme `SEO_IMPLEMENTACAO.md`; trocar a branch não altera esse proxy externo.
- O link editorial `/editorial/area-do-tutor.html` redireciona para
  `/area-do-tutor`. Essa página fica fora da indexação e abre a nova interface.
  O acesso legado `/?versao=original#tutor` continua disponível.
- Manter as configurações Firebase e aplicar as regras conforme
  `TUTOR_IMPLEMENTACAO.md`. Configurar credencial de serviço no servidor,
  autenticação e domínios autorizados no Firebase. `GEMINI_API_KEY` habilita
  avatar; `DAILY_API_KEY` habilita vídeo. Nunca colocar segredos no Git.

## Validação

Os seis testes de SEO e os três testes de política da Área do Tutor passaram
localmente nesta integração. O instalador npm local falhou com
`Exit handler never called`; por isso build, TypeScript e testes HTTP precisam
ser confirmados pelo workflow `Validate SEO and Tutor release` no GitHub.
O workflow roda na branch de integração, sem acesso a segredos de produção.

Os testes HTTP incluem a entrada do portal, o redirecionamento antigo,
metadados privados, assets e rejeição de chamadas à API sem login, além das
12 páginas públicas. As regras Firestore não mudaram em relação à branch do
portal; o emulador não foi repetido nesta integração. Login, banco real,
geração de avatar e consulta com duas pessoas ainda dependem das credenciais
e de teste com as contas reais. Esta integração não publica regras Firebase,
não contrata serviços e não executa o deploy na VPS.
