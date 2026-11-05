import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const WORKS_COLLECTION = collection(db, 'works');

function normalizeLinks(data) {
  const rawLinks = Array.isArray(data?.links) ? data.links : [];
  const links = rawLinks
    .filter((link) => link && typeof link.url === 'string' && link.url.trim())
    .map((link) => ({
      label:
        typeof link.label === 'string' && link.label.trim()
          ? link.label.trim()
          : 'Voir le projet',
      url: link.url.trim(),
    }));

  // Rétrocompatibilité avec l'ancien champ `href`.
  if (
    links.length === 0 &&
    typeof data?.href === 'string' &&
    data.href.trim()
  ) {
    links.push({ label: 'Voir le projet', url: data.href.trim() });
  }

  return links;
}

function validateWork(data) {
  const images = Array.isArray(data?.images)
    ? data.images
        .filter((url) => typeof url === 'string' && url.trim())
        .map((url) => url.trim())
    : [];

  return {
    title: typeof data?.title === 'string' ? data.title : '',
    category: typeof data?.category === 'string' ? data.category : '',
    description:
      typeof data?.description === 'string' ? data.description : '',
    color: typeof data?.color === 'string' ? data.color : '#d4c8b8',
    images,
    links: normalizeLinks(data),
    order: typeof data?.order === 'number' ? data.order : 0,
  };
}

export async function listWorks() {
  const snap = await getDocs(query(WORKS_COLLECTION, orderBy('order', 'asc')));

  if (snap.empty) {
    return [];
  }

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateWork(docSnap.data()),
  }));
}

export async function createWork(data) {
  const validated = validateWork(data);
  const ref = await addDoc(WORKS_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveWork(id, data) {
  const validated = validateWork(data);
  await setDoc(doc(db, 'works', id), validated);
  return { id, ...validated };
}

export async function deleteWork(id) {
  await deleteDoc(doc(db, 'works', id));
}
