import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;
const appCheckDebugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;

// En production, App Check protège Firestore/Storage via reCAPTCHA Enterprise.
// En local, il n'est activé que si un jeton de debug explicite est fourni :
// `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true` générait un jeton aléatoire à
// chaque profil de navigateur, non enregistré dans la console Firebase — d'où
// les 403 « App attestation failed » au lieu d'un simple avertissement.
const shouldEnableAppCheck =
  Boolean(appCheckSiteKey) && (import.meta.env.PROD || Boolean(appCheckDebugToken));

if (typeof window !== 'undefined' && shouldEnableAppCheck) {
  if (import.meta.env.DEV) {
    // Jeton fixe à enregistrer dans Firebase Console → App Check → Jetons de débogage.
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckDebugToken;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
