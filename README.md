# Érico Cavalheiro — Comportamento Canino e Educação Relacional

Este é um projeto full-stack (React + Express) desenvolvido para o consultório de educação canina de Érico Cavalheiro.

## Tecnologias Utilizadas

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React.
- **Backend**: Node.js Express, Google Gemini AI (Canine News API).
- **Banco de Dados & Auth**: Firebase (Firestore & Google Authentication).

## Configuração do Ambiente

1. **Instalação**:
   `npm install`

2. **Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz baseado no `.env.example`:
   - `GEMINI_API_KEY`: Chave da API do Google AI Studio.
   - `VITE_META_PIXEL_ID`: ID do Pixel do Facebook (opcional).
   - `APP_URL`: URL base do site.

3. **Desenvolvimento**:
   `npm run dev`

4. **Produção / Build**:
   `npm run build`
   `npm start`

## Estrutura do Projeto

- `src/components/`: Componentes visuais e seções do site.
- `src/App.tsx`: Gerenciamento de estado de navegação (tabs) e animações globais.
- `src/context/FirebaseCtx.tsx`: Contexto de autenticação e comunicação com Firestore.
- `server.ts`: Servidor Express que gerencia a API de notícias e serve os arquivos estáticos.
- `public/`: Arquivos estáticos como o **Ebook (PDF)** e manifestos.

## Acesso à Área do Tutor

A Área do Tutor possui dois métodos de entrada:
1. **Google Auth**: Requer autorização manual no Firestore (`isAuthorized: true` no documento do usuário).
2. **Código de Acesso**: Códigos válidos definidos em `TutorArea.tsx` (Ex: `VINCOLO2026`).

## Ebook

Para atualizar o ebook disponível para download direto, substitua o arquivo em `public/ebook-vinculo-sem-comando.pdf` ou altere o link em `src/config.ts`.

---
*Desenvolvido com foco em Educação Relacional Canina.*
