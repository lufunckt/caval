# Landing do ebook Antes do Comando

Landing estática para captura de nome e WhatsApp, registro no Firestore e liberação do ebook.

## Publicação na Vercel

1. Importe o repositório `lufunckt/caval`.
2. Selecione a branch `landing-ebook`.
3. Defina **Root Directory** como `landing`.
4. Framework Preset: `Other`.
5. Build Command: deixe vazio.
6. Output Directory: `.`.

## Arquivos obrigatórios antes da publicação

Adicionar dentro de `landing/assets/`:

- `capa.png`: capa do ebook.
- `logo-erico.png`: logotipo oficial.
- `antes-do-comando.pdf`: versão final e revisada do ebook.

## Captação

Os cadastros são enviados à coleção `ebook_leads` do Firestore já associado ao projeto. São registrados nome, WhatsApp, consentimento, origem e parâmetros UTM.

## Contato configurado

WhatsApp: +55 55 99724-0369
Instagram: @erico.educacaorelacional
