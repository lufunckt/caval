import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SupabaseProvider } from './context/SupabaseCtx.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </StrictMode>,
);

// Register Service Worker for Progressive Web App (PWA) installation and offline support
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registrado com sucesso: ", registration.scope);
      })
      .catch((error) => {
        console.error("Falha ao registrar o Service Worker: ", error);
      });
  });
}
