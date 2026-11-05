import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { app } from './firebase';

let started = false;

/**
 * App Check ne protège que les écritures d'administration. Il est initialisé
 * depuis le chunk admin, jamais par le site public : sinon chaque visiteur
 * télécharge ≈350 Ko de reCAPTCHA Enterprise pour rien.
 */
export function ensureAppCheck() {
  if (started || typeof window === 'undefined') return;

  const siteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;
  if (!siteKey) return;

  // En local, il faut un jeton de debug explicite et enregistré dans la
  // console Firebase (App Check → Jetons de débogage), sinon l'échange échoue
  // et Firebase bloque les tentatives pendant 24 h.
  const debugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
  const host = window.location.hostname;
  const isLocal =
    import.meta.env.DEV ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]';

  if (isLocal) {
    if (!debugToken) return;
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  }

  started = true;
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
