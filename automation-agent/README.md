# Caval Landing Release Agent

Agente local para validar e publicar a landing do ebook sem tocar na `main`.

## Executar

```powershell
uv run caval-agent "Valide, envie a branch e tente os deploys"
```

O agente usa `.env.local` para `OPENAI_API_KEY`, que não deve ser versionado. A Vercel exige `VERCEL_TOKEN` no ambiente ou uma CLI já autenticada. O Firebase exige login e billing habilitado no projeto quando o banco ainda não existe.

Proteções: branch fixa `landing-ebook`, Firebase limitado a `firestore:rules`, Vercel limitado a `landing`, e nenhum segredo é impresso.