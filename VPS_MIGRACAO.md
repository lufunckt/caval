# Área do Tutor — backend na VPS

Esta branch substitui Firebase Authentication e Firestore por PostgreSQL e uma API
no servidor Node existente. O visual do portal e as páginas públicas/SEO permanecem.
As dependências Firebase saíram do aplicativo; não é necessário acessar o console Google.

## Implantação no Coolify

1. Criar um recurso com o repositório lufunckt/caval e a branch feat/vps-postgres-tutor.
   Usar Docker Compose e o arquivo /docker-compose.yml. Não publicar esta branch
   como aplicação estática, nem apenas trocar a branch do container antigo sem banco.
2. Preencher APP_ORIGIN com a URL HTTPS exata, sem caminhos (por exemplo,
   https://previa.ericoadestrador.com.br durante a revisão).
3. O Coolify gera SERVICE_PASSWORD_64_DATABASE e SERVICE_PASSWORD_64_BOOTSTRAP.
   As senhas persistem no recurso. Não recriar o serviço/volume para atualizar o código.
4. Associar o domínio ao serviço app, porta 3000. Não expor database nem backup
   à internet. Manter o domínio oficial no recurso atual até validar esta instalação.
5. Fazer o deploy. O servidor cria as tabelas de forma idempotente; não apaga dados.
6. Abrir /area-do-tutor?acao=configurar. Informar a chave SERVICE_PASSWORD_64_BOOTSTRAP
   diretamente na página, e escolher a senha do administrador (mínimo 12 caracteres).
   Essa operação funciona uma vez por banco, cria a conta de ADMIN_EMAIL e libera
   o painel do Érico. Não envie a chave ou a senha em conversas.
7. Depois do primeiro acesso, limpar ADMIN_BOOTSTRAP_TOKEN no ambiente do app,
   ou manter a chave protegida: a marca de instalação no PostgreSQL bloqueia o reuso.
   Completar o perfil do Érico e criar uma conta separada para teste como tutor.
8. Configurar SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD e MAIL_FROM
   para confirmação e recuperação de e-mail. SMTP_REQUIRE_TLS é true na composição.
   Para SMTP 465 usar SMTP_SECURE=true. Para 587 usar false com STARTTLS.
   Sem SMTP, o tutor cria conta e perfil, mas a comunidade aguarda confirmação.
9. Confirmar cadastro, e-mail, feed, comentários, curtidas, fóruns, diário privado,
   autorização de tutoria, mensagens individuais e agendamento na prévia.
   Em seguida fazer o corte do domínio oficial para o app novo, ajustando APP_ORIGIN.
   O deploy da branch não altera DNS/proxy de outros recursos por conta própria.

## O que fica na VPS

Contas, hashes de senha, sessões, tokens temporários, perfis, fotos compactadas,
avatares selecionados, publicações, comentários, curtidas, fóruns, diários, mensagens,
agenda, resumos e quotas de avatar. Fotos compactadas são persistidas no PostgreSQL;
não dependem de um bucket Google. As coleções da interface são guardadas em JSONB
com índice de coleção e permissões verificadas pela API. A senha da conta nunca
é guardada em texto puro. Cookies de sessão são HttpOnly, SameSite=Lax e Secure
em produção; o banco guarda apenas o hash do token. Não há tokens de login no
localStorage. O progresso do questionário React legado fica somente no navegador.

As consultas e mudanças chegam por atualização periódica: mensagens a cada três
segundos e outras coleções entre cinco e sessenta segundos, com deduplicação de
assinaturas. Não são WebSockets. A aba oculta pausa essas atualizações.

## Integrações opcionais

GEMINI_API_KEY/GEMINI_AVATAR_MODEL habilitam a transformação da foto em avatar.
DAILY_API_KEY habilita a sala privada de consulta. O agendamento e a liberação
da tutoria continuam manuais; checkout e cobrança automática não fazem parte.
A migração de banco não muda essas integrações e não contrata nenhum serviço.

## Backups e restauração

O volume tutor-database mantém o banco entre deploys. O serviço backup faz pg_dump
em formato custom no início e a cada 24 horas, retendo sete dias no volume
tutor-backups. Uma cópia na mesma VPS não protege contra perda do servidor:
configurar cópia externa antes da abertura ampla. Testar a restauração em banco
separado usando pg_restore, sem sobrescrever o banco de produção.

## Contas e dados anteriores

Esta versão começa com um banco PostgreSQL novo. Não acessa, apaga ou importa
automaticamente dados do Firebase. Se já houver contas ou conteúdo real lá,
é necessário obter uma exportação autorizada e preparar a migração antes do corte.
Senhas de contas antigas não podem ser copiadas em texto: planejar redefinição
de senha para os tutores importados.

## Verificação

npm ci
npm run lint
npm run test:tutor
npm run test:seo
npm run build
npm run test:seo:http

npm run test:backend exige DATABASE_URL apontando para um PostgreSQL de teste.
Os testes de integração criam contas sintéticas, usam SMTP local simulado e
verificam isolamento de dados, papel administrativo, autorização, tokens,
expiração de sessões, reinício do servidor e transações atômicas. Os testes de
navegador verificam a navegação pública e o cadastro/uso real do portal contra
esse banco de teste. Não fazem chamadas a Daily ou Gemini nem usam produção.

Documentação: https://coolify.io/docs/services/configuration/docker-compose
