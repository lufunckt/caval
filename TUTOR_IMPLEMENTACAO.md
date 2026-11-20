# Área do Tutor — primeira implementação

Rota: `/area-do-tutor` (o acesso antigo `/#tutor` abre a mesma interface).

## O que foi implementado

- Cadastro gratuito por e-mail/senha, login Google, recuperação de senha e confirmação de e-mail com Firebase Authentication.
- Perfil privado do tutor e cão. Foto comprimida no navegador, avatar opcional e download. Só a imagem escolhida em miniatura é compartilhada com a comunidade.
- Diário privado, acessível ao próprio tutor e ao educador.
- Feed compartilhado, assuntos, comentários e curtidas por usuário. Cada pessoa pode excluir sua publicação; Érico pode moderar publicações.
- Fóruns em tempo real. A conversa individual exige `isAuthorized`, definido por Érico.
- Agenda individual, sala de espera com teste de câmera/microfone, acesso a videochamada e histórico de orientações.
- Painel do Érico para liberar tutoria, agendar, abrir a sala como anfitrião, publicar resumos e atividades, ler diários e responder mensagens individuais.
- Geração de avatar com Gemini, consentimento explícito e uma geração por mês por conta verificada. Falhas do fornecedor devolvem a quota.
- Vídeo com salas privadas Daily, token por participante, validade limitada e limite de duas pessoas. Gravação automática desativada. A sala abre 15 minutos antes e fecha 30 minutos após a duração prevista.

Não há consultas, progresso, mensagens ou depoimentos fictícios. Os estados vazios orientam a primeira utilização.

## Antes de ativar no domínio

1. Confirmar que este repositório corresponde ao código que deve atender a rota no site atual. A versão editorial publicada na VPS pode ter sido criada fora deste Git; não substituir essa versão sem integrar a nova rota ao proxy ou ao aplicativo que ela usa.
2. No projeto Firebase existente (`firebase-applet-config.json`), ativar Email/Senha e Google; autorizar o domínio de prévia e o domínio oficial.
3. Configurar uma conta de serviço Firebase no servidor, com acesso ao banco nomeado `default` deste projeto. Montar o JSON como segredo e definir `GOOGLE_APPLICATION_CREDENTIALS`. Não colocar o JSON no Git ou no navegador. `firebase-admin` usa Application Default Credentials.
4. Aplicar as regras revisadas: `npx firebase deploy --only firestore:rules --config firebase.tutor.json --project gen-lang-client-0831166793`. A configuração aponta para o banco nomeado `default`, como o cliente já fazia. Fazer isso junto da ativação da nova interface, pois as novas permissões de mensagens exigem `authorId`.
5. Definir `GEMINI_API_KEY` e, se necessário, `GEMINI_AVATAR_MODEL`. A referência é `gemini-3.1-flash-image`; confirmar disponibilidade e faturamento na conta. A chave nunca é enviada ao navegador.
6. Para vídeo, configurar `DAILY_API_KEY` da conta do serviço. A sala é criada apenas quando um participante autorizado entra no horário permitido. A API do provedor pode ter cobrança por uso. Nenhum serviço pago foi contratado por esta implementação.
7. No Coolify usar o Dockerfile e porta interna 3000, com HTTPS e os segredos acima. Testar primeiro na prévia. A imagem Docker roda como usuário sem privilégios.
8. Entrar com `ericocavalheiro.psico@gmail.com`, e-mail confirmado, para acessar o painel do educador. Não existe senha ou código de acesso embutido.

## Verificação e lançamento

```
npm ci
npm run lint
npm run test:tutor
npm run test:rules
npm run build
npm run dev
```

A área local fica em `http://localhost:3000/area-do-tutor`. Esse endereço é do ambiente de desenvolvimento, não um link público para outro computador.

Os testes de regras usam um projeto de demonstração no emulador, sem usuários ou dados de produção. Os testes do acesso à consulta cobrem identidade, confirmação de e-mail, horário, cancelamento e acesso entre contas. O teste completo com dois participantes, dispositivos reais e geração de imagem depende das credenciais externas.

## Limites desta entrega

Não foram conectadas credenciais nem publicados dados ou regras no projeto Firebase real. Não houve substituição do site na VPS. Sem configuração, vídeo e avatar apresentam mensagens claras de indisponibilidade; o restante utiliza o Firebase existente quando habilitado.

Agendamento é manual pelo Érico; não há checkout, cobrança recorrente, reserva pública automática, notificações por e-mail, gravação de consultas ou armazenamento de vídeos. Materiais são texto no resumo, sem upload de anexos. O limite de geração gratuita é por conta verificada, não por pessoa física; controles adicionais contra criação abusiva de contas e App Check devem ser avaliados antes de uma campanha pública de grande volume. É preciso definir avisos de privacidade, retenção/exclusão de dados e moderação com a operação antes da abertura pública.

Documentação usada nas integrações:

- https://docs.daily.co/reference/rest-api/rooms/create-room
- https://docs.daily.co/reference/rest-api/meeting-tokens/create-meeting-token
- https://ai.google.dev/gemini-api/docs/image-generation
