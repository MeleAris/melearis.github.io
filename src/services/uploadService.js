import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { storage } from '../lib/firebase';

const MAX_BYTES = 11 * 1024 * 1024;
const UPLOAD_PREFIX = 'uploads/';

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function isAllowedImage(file) {
  if (!file) return false;
  const type = (file.type ?? '').toLowerCase();
  const name = (file.name ?? '').toLowerCase();
  return type.startsWith('image/') || name.endsWith('.svg');
}

function isPdf(file) {
  if (!file) return false;
  const type = (file.type ?? '').toLowerCase();
  const name = (file.name ?? '').toLowerCase();
  return type === 'application/pdf' || name.endsWith('.pdf');
}

async function uploadFile(file, folder, { accept }) {
  if (!accept(file)) {
    throw new Error(
      accept === isPdf ? 'Fichiers PDF uniquement.' : 'Images ou fichiers SVG uniquement.',
    );
  }

  if (file.size > MAX_BYTES) {
    throw new Error('Le fichier ne doit pas dépasser 11 Mo.');
  }

  const path = `${UPLOAD_PREFIX}${folder}/${Date.now()}-${safeFileName(file.name)}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type || (isPdf(file) ? 'application/pdf' : undefined),
  });
  return getDownloadURL(storageRef);
}

export async function uploadImage(file, folder) {
  return uploadFile(file, folder, { accept: isAllowedImage });
}

export async function uploadPdf(file, folder) {
  return uploadFile(file, folder, { accept: isPdf });
}

/**
 * Retrouve le chemin Storage (`uploads/...`) à partir d'une URL de téléchargement
 * Firebase (`https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media`)
 * ou d'une URL `gs://<bucket>/<path>`.
 * Retourne null pour toute URL qui n'est pas un fichier de ce bucket.
 */
export function storagePathFromUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return null;

  if (url.startsWith('gs://')) {
    const withoutScheme = url.slice('gs://'.length);
    const slash = withoutScheme.indexOf('/');
    if (slash === -1) return null;
    try {
      return decodeURIComponent(withoutScheme.slice(slash + 1));
    } catch {
      return null;
    }
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const isGoogleStorageHost =
    parsed.hostname === 'firebasestorage.googleapis.com' ||
    parsed.hostname.endsWith('.firebasestorage.app') ||
    parsed.hostname === 'storage.googleapis.com';

  if (!isGoogleStorageHost) return null;

  const marker = '/o/';
  const index = parsed.pathname.indexOf(marker);
  if (index === -1) return null;

  try {
    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

/**
 * Supprime le fichier Storage correspondant à une URL de téléchargement.
 * Ne fait rien (et retourne false) si l'URL ne pointe pas vers un fichier
 * `uploads/…` de ce bucket, ou si le fichier n'existe déjà plus.
 */
export async function deleteUploadedImage(url) {
  const path = storagePathFromUrl(url);
  if (!path || !path.startsWith(UPLOAD_PREFIX)) return false;

  try {
    await deleteObject(ref(storage, path));
    return true;
  } catch (err) {
    if (err?.code === 'storage/object-not-found') return false;
    throw err;
  }
}
