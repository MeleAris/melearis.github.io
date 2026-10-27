import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { deleteUploadedImage } from './uploadService';

const GALLERY_COLLECTION = collection(db, 'gallery');

export const MEDIA_TYPES = ['image', 'badge', 'pdf'];

const BADGE_FIELDS = [
  'url',
  'provider',
  'title',
  'issuer',
  'issuerUrl',
  'description',
  'imageUrl',
  'issuedOn',
  'expiresOn',
  'criteriaUrl',
  'verificationUrl',
  'resolvedAt',
];

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeBadge(badge) {
  if (!badge || typeof badge !== 'object') return undefined;

  const result = {};
  BADGE_FIELDS.forEach((field) => {
    const value = cleanString(badge[field]);
    if (value) result[field] = value;
  });

  if (Array.isArray(badge.tags)) {
    const tags = badge.tags.map(cleanString).filter(Boolean).slice(0, 6);
    if (tags.length) result.tags = tags;
  }

  return result.url ? result : undefined;
}

/**
 * Normalise un document `gallery`. Les entrées créées avant l'ajout des
 * types de média n'ont pas de `mediaType` : elles sont considérées comme
 * des images (rétro-compatibilité via `imageUrl`).
 */
function validateGalleryItem(data) {
  const mediaType = MEDIA_TYPES.includes(data?.mediaType) ? data.mediaType : 'image';
  const mediaUrl = cleanString(data?.mediaUrl) || cleanString(data?.imageUrl);

  const result = {
    label: typeof data?.label === 'string' ? data.label : '',
    bg: typeof data?.bg === 'string' ? data.bg : '#d4c4a8',
    href: cleanString(data?.href),
    order: typeof data?.order === 'number' ? data.order : 0,
    mediaType,
  };

  if (mediaType !== 'badge' && mediaUrl) {
    result.mediaUrl = mediaUrl;
  }

  if (mediaType === 'badge') {
    const badge = normalizeBadge(data?.badge);
    if (badge) result.badge = badge;
  }

  return result;
}

export async function listGalleryItems() {
  const snap = await getDocs(query(GALLERY_COLLECTION, orderBy('order', 'asc')));

  if (snap.empty) {
    return [];
  }

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateGalleryItem(docSnap.data()),
  }));
}

export async function createGalleryItem(data) {
  const validated = validateGalleryItem(data);
  const ref = await addDoc(GALLERY_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveGalleryItem(id, data) {
  const validated = validateGalleryItem(data);
  await setDoc(doc(db, 'gallery', id), validated);
  return { id, ...validated };
}

export async function deleteGalleryItem(id) {
  const docRef = doc(db, 'gallery', id);

  // Le média est supprimé en premier : si Storage refuse, la fiche reste
  // intacte et l'opération peut être relancée sans laisser d'orphelin.
  const snapshot = await getDoc(docRef);
  const data = snapshot.exists() ? snapshot.data() : null;
  const fileUrl = cleanString(data?.mediaUrl) || cleanString(data?.imageUrl);

  // Les badges sont hébergés par l'émetteur : rien à supprimer côté Storage.
  if (fileUrl) {
    await deleteUploadedImage(fileUrl);
  }

  await deleteDoc(docRef);
}
