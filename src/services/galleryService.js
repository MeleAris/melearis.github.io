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

const GALLERY_COLLECTION = collection(db, 'gallery');

function validateGalleryItem(data) {
  const imageUrl =
    typeof data?.imageUrl === 'string' && data.imageUrl.trim()
      ? data.imageUrl.trim()
      : undefined;

  const result = {
    label: typeof data?.label === 'string' ? data.label : '',
    bg: typeof data?.bg === 'string' ? data.bg : '#d4c4a8',
    href: typeof data?.href === 'string' ? data.href.trim() : '',
    order: typeof data?.order === 'number' ? data.order : 0,
  };

  if (imageUrl) {
    result.imageUrl = imageUrl;
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
  await deleteDoc(doc(db, 'gallery', id));
}
