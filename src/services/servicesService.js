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
import { DEFAULT_SERVICES } from '../constants/defaults/services';
import { db } from '../lib/firebase';

const SERVICES_COLLECTION = collection(db, 'services');

const LOCAL_IMAGE_BY_TITLE = Object.fromEntries(
  DEFAULT_SERVICES.filter((service) => service.imageUrl).map((service) => [
    service.title,
    service.imageUrl,
  ]),
);

function validateService(data) {
  const imageUrl =
    typeof data?.imageUrl === 'string' && data.imageUrl.trim()
      ? data.imageUrl.trim()
      : undefined;

  const result = {
    category: typeof data?.category === 'string' ? data.category : '',
    title: typeof data?.title === 'string' ? data.title : '',
    summary: typeof data?.summary === 'string' ? data.summary : '',
    bullets: Array.isArray(data?.bullets)
      ? data.bullets.filter((b) => typeof b === 'string')
      : [],
    stack: Array.isArray(data?.stack) ? data.stack.filter((s) => typeof s === 'string') : [],
    color: typeof data?.color === 'string' && data.color.trim() ? data.color.trim() : '#e8d5c4',
    order: typeof data?.order === 'number' ? data.order : 0,
  };

  const resolvedImage =
    imageUrl ||
    (typeof result.title === 'string' ? LOCAL_IMAGE_BY_TITLE[result.title] : undefined);

  if (resolvedImage) {
    result.imageUrl = resolvedImage;
  }

  return result;
}

export async function listServices() {
  const snap = await getDocs(query(SERVICES_COLLECTION, orderBy('order', 'asc')));

  if (snap.empty) {
    return DEFAULT_SERVICES.map((service, index) => ({
      id: `default-${index}`,
      ...service,
    }));
  }

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateService(docSnap.data()),
  }));
}

export async function createService(data) {
  const validated = validateService(data);
  const ref = await addDoc(SERVICES_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveService(id, data) {
  const validated = validateService(data);
  await setDoc(doc(db, 'services', id), validated);
  return { id, ...validated };
}

export async function deleteService(id) {
  await deleteDoc(doc(db, 'services', id));
}

export async function seedServicesFromLocal() {
  const snap = await getDocs(SERVICES_COLLECTION);
  if (!snap.empty) {
    return { seeded: false, count: snap.size };
  }

  const batch = writeBatch(db);
  DEFAULT_SERVICES.forEach((service, index) => {
    const ref = doc(SERVICES_COLLECTION);
    batch.set(ref, {
      category: service.category,
      title: service.title,
      summary: service.summary,
      bullets: service.bullets,
      stack: service.stack,
      color: service.color,
      order: index,
      ...(service.imageUrl ? { imageUrl: service.imageUrl } : {}),
    });
  });
  await batch.commit();

  return { seeded: true, count: DEFAULT_SERVICES.length };
}
