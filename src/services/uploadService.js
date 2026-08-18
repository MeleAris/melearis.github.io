import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';

const MAX_BYTES = 11 * 1024 * 1024;

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function isAllowedUpload(file) {
  if (!file) return false;
  const type = (file.type ?? '').toLowerCase();
  const name = (file.name ?? '').toLowerCase();
  return type.startsWith('image/') || name.endsWith('.svg');
}

export async function uploadImage(file, folder) {
  if (!isAllowedUpload(file)) {
    throw new Error('Images ou fichiers SVG uniquement.');
  }

  if (file.size > MAX_BYTES) {
    throw new Error("L'image ne doit pas dépasser 11 Mo.");
  }

  const path = `uploads/${folder}/${Date.now()}-${safeFileName(file.name)}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
