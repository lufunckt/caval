<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/505d361b-c76e-4d53-bf7b-313689b58c40

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Como colocar no ar (Deploy)

Este projeto utiliza um servidor Express para servir o frontend e a API de notícias.

### Requisitos:
- Node.js (v18+)
- Chave de API do Google Gemini (para notícias em tempo real)

### Passos:
1. **Build**: Execute `npm run build` para gerar os arquivos otimizados na pasta `dist`.
2. **Variáveis de Ambiente**: Configure `GEMINI_API_KEY` no seu serviço de hospedagem.
3. **Início**: O comando de inicialização é `npm start`.

Recomendamos utilizar plataformas como **Render**, **Fly.io** ou **Vercel** (com configurações de Serverless Functions se preferir).
