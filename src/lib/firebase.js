import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Seuls `app` et `db` vivent ici : ce module est chargé par le site public.
 * Auth, Storage, App Check et le back-office sont importés uniquement par le
 * chunk admin (voir `src/pages/admin/AdminArea.jsx`).
 */
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
