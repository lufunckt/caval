# SEO editorial — implementação de 20/11/2026

## Escopo

O site oficial foi consultado antes da implementação. A home publicada usa HTML editorial e `/editorial/editorial.css`; o repositório principal ainda serve uma versão React anterior. As páginas editoriais públicas e seus recursos foram trazidos para `public/editorial`, preservando o visual e as URLs existentes. O trabalho está separado da Área do Tutor do PR #3.

## Alterações

- Home: title comercial mais claro, complemento visível ao H1 e seis entradas por dificuldade da rotina.
- Landing `/consulta-comportamento-canino-online`: público, funcionamento, preparação da sessão, limites, perguntas frequentes e CTAs. Sem preços inventados, promessa de prazo ou credenciais não confirmadas.
- Três artigos existentes ampliados: reatividade, visitas e barulhos. Dois novos: puxões na guia e dificuldade de ficar sozinho.
- Artigos com resumo, data real desta revisão, estimativa de leitura calculada pelo texto, índice, fontes, artigos relacionados, Método, Sobre, questionário e serviço.
- JSON-LD Article/BreadcrumbList nos artigos e Service na landing. Não há avaliações, estrelas, formação ou FAQ rich results inventados.
- Sitemap com 12 URLs canônicas públicas. Área do Tutor, chats, sessões e histórico privados não entram.
- O questionário editorial estava com `noindex`; agora a versão canônica pública é `/questionario-comportamento-canino`, com HTML completo e wizard original. O endereço `.html` redireciona para ela no servidor Express.
- HTML completo no servidor para as páginas editoriais, sem depender do JavaScript do React para os conteúdos públicos.
- Preservado o acesso React existente por `/?versao=original#tutor`, com `noindex` no servidor. Nenhuma funcionalidade privada nova do PR #3 foi ativada por este trabalho.
- Eventos preparados: `whatsapp_click`, `questionnaire_start`, `questionnaire_complete` e `consultation_interest`. O script não instala GA4, não transmite respostas nem dados do tutor e só chama um `gtag` existente se `window.ericoAnalyticsConsent === true`. Sem ID e integração configurados não há coleta externa: os eventos ficam disponíveis como CustomEvent `erico:conversion`.

## Gerar e validar

```
npm ci
python3 scripts/build-editorial.py
npm run test:seo
npm run build
npm run test:seo:http
npm start
```

O gerador usa somente a biblioteca padrão do Python e os textos em `content/seo-articles.json`. HTML, manifesto e sitemap estão versionados; o build de produção não exige Python. Datas não são atualizadas automaticamente em todo build: alterá-las somente com revisão substancial do conteúdo.

`content/editorial-pages.json` é a fonte das rotas públicas e do sitemap. `server/editorial-routes.ts` serve os mesmos arquivos em desenvolvimento e produção. Prévia e endereços `.sslip.io` continuam fora da indexação. O proxy precisa encaminhar para o servidor Node para que esses cabeçalhos e redirecionamentos sejam aplicados.

## Aplicação na VPS

Ainda não houve implantação no servidor, alteração de DNS ou solicitação de indexação. O Coolify por IP continuou inacessível ao navegador por bloqueio de certificado; esta entrega não contorna esse bloqueio.

Antes de implantar, identificar a aplicação/proxy que atualmente serve o HTML editorial. Não substituir a home por uma build antiga em React. Esta branch já contém as páginas editoriais e o roteamento de compatibilidade; o PR #3 de cadastro/comunidade deve ser integrado separadamente, conciliando as mudanças em `server.ts`.

Se a VPS continuar servindo somente arquivos por Nginx, publicar os arquivos de `public/editorial`, o sitemap e robots na raiz do site e configurar aliases/redirecionamentos equivalentes a `server/editorial-routes.ts`. O questionário e a landing têm URLs limpas; apenas copiar a pasta não cria esses dois endereços. Manter a regra atual que permite abrir o portal original por `?versao=original`. Não sobrescrever configurações de proxy desconhecidas.

Após uma prévia revisada, validar no domínio oficial: HTTP 200 das 12 URLs, canonical, ausência de noindex nas páginas públicas, noindex nas privadas e na prévia, redirecionamentos, imagens, links, formulário e mensagem do WhatsApp. Em seguida enviar o sitemap no Search Console e inspecionar as páginas prioritárias. O envio não garante indexação ou posição.

## Revisão editorial e métricas pendentes

Recomenda-se a leitura dos novos textos por Érico para confirmar aderência à prática dele. Não foi declarada revisão profissional já realizada, nem adicionada formação não fornecida. As fontes veterinárias fundamentam cuidados gerais; nenhum texto oferece diagnóstico, prescrição ou um protocolo individual de tratamento.

Conectar dados reais do Search Console e configurar a medição de conversões, com a solução de consentimento aplicável. Não foram atribuídos volumes, dificuldade ou posições às palavras-chave. Cliques no WhatsApp não equivalem a consultas contratadas. Não foi executado PageSpeed/Core Web Vitals nem um teste de navegador com usuários reais.
