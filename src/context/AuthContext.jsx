import { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext(null);

function mapAuthError(code) {
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Connexion annulée.';
    case 'auth/popup-blocked':
      return 'La fenêtre Google a été bloquée. Autorisez les popups pour ce site.';
    case 'auth/unauthorized-domain':
      return 'Domaine non autorisé pour Google Sign-In.';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard.';
    case 'auth/network-request-failed':
      return 'Erreur réseau. Vérifiez votre connexion.';
    case 'auth/access-denied':
      return 'Accès refusé.';
    default:
      return 'Une erreur est survenue. Réessayez.';
  }
}

async function checkIsAdmin(uid) {
  if (!uid) return false;
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const admin = await checkIsAdmin(currentUser.uid);
        if (!admin) {
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
        } else {
          setUser(currentUser);
          setIsAdmin(true);
        }
      } catch {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function loginWithGoogle() {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const admin = await checkIsAdmin(credential.user.uid);

      if (!admin) {
        await signOut(auth);
        setIsAdmin(false);
        throw new Error(mapAuthError('auth/access-denied'));
      }

      setIsAdmin(true);
      return credential.user;
    } catch (error) {
      if (error.message === mapAuthError('auth/access-denied')) {
        throw error;
      }
      throw new Error(mapAuthError(error.code));
    }
  }

  async function logout() {
    await signOut(auth);
    setIsAdmin(false);
  }

  const value = {
    user,
    loading,
    isAdmin,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider.');
  }
  return context;
}
