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
import { DEFAULT_ABOUT, DEFAULT_ABOUT_STATS } from '../constants/defaults/about';
import { db } from '../lib/firebase';
import { sanitizeHtml } from '../utils/sanitizeHtml';

const ABOUT_REF = doc(db, 'about', 'main');
const STATS_COLLECTION = collection(db, 'aboutStats');

const ABOUT_FIELDS = Object.keys(DEFAULT_ABOUT);
const RICH_ABOUT_FIELDS = new Set(['intro', 'cardPrimary', 'cardSecondary']);

function validateAbout(data) {
  const result = {};
  for (const field of ABOUT_FIELDS) {
    const value = data?.[field];
    const asString = typeof value === 'string' ? value : DEFAULT_ABOUT[field];
    result[field] = RICH_ABOUT_FIELDS.has(field) ? sanitizeHtml(asString) : asString;
  }
  return result;
}

function validateAboutStat(data) {
  return {
    value: typeof data?.value === 'string' ? data.value : '',
    label: typeof data?.label === 'string' ? data.label : '',
    order: typeof data?.order === 'number' ? data.order : 0,
  };
}

export async function getAbout() {
  const snap = await getDoc(ABOUT_REF);
  if (!snap.exists()) {
    return { ...DEFAULT_ABOUT };
  }
  return validateAbout(snap.data());
}

export async function saveAbout(data) {
  const validated = validateAbout(data);
  await setDoc(ABOUT_REF, validated);
  return validated;
}

export async function listAboutStats() {
  const snap = await getDocs(query(STATS_COLLECTION, orderBy('order', 'asc')));

  if (snap.empty) {
    return DEFAULT_ABOUT_STATS.map((stat, index) => ({
      id: `default-${index}`,
      ...stat,
    }));
  }

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateAboutStat(docSnap.data()),
  }));
}

export async function createAboutStat(data) {
  const validated = validateAboutStat(data);
  const ref = await addDoc(STATS_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveAboutStat(id, data) {
  const validated = validateAboutStat(data);
  await setDoc(doc(db, 'aboutStats', id), validated);
  return { id, ...validated };
}

export async function deleteAboutStat(id) {
  await deleteDoc(doc(db, 'aboutStats', id));
}
