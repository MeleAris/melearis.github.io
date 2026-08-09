import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { DEFAULT_WORKS } from '../constants/defaults/portfolio';
import { db } from '../lib/firebase';

const WORKS_COLLECTION = collection(db, 'works');

function validateWork(data) {
  const images = Array.isArray(data?.images)
    ? data.images
        .filter((url) => typeof url === 'string' && url.trim())
        .map((url) => url.trim())
    : [];

  return {
    title: typeof data?.title === 'string' ? data.title : '',
    category: typeof data?.category === 'string' ? data.category : '',
    color: typeof data?.color === 'string' ? data.color : '#d4c8b8',
    href: typeof data?.href === 'string' ? data.href.trim() : '',
    images,
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

export async function seedWorksFromLocal() {
  const snap = await getDocs(WORKS_COLLECTION);
  if (!snap.empty) {
    return { seeded: false, count: snap.size };
  }

  const batch = writeBatch(db);
  DEFAULT_WORKS.forEach((work, index) => {
    const ref = doc(WORKS_COLLECTION);
    batch.set(ref, {
      title: work.title,
      category: work.category,
      color: work.color,
      href: '',
      images: [],
      order: index,
    });
  });
  await batch.commit();

  return { seeded: true, count: DEFAULT_WORKS.length };
}
