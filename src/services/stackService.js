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
import { renderToStaticMarkup } from 'react-dom/server';
import { stackLogos } from '../constants/stackLogos';
import { db } from '../lib/firebase';
import { sanitizeSvg } from '../utils/sanitizeSvg';

const STACK_COLLECTION = collection(db, 'stackLogos');

function validateStackLogo(data) {
  const name = typeof data?.name === 'string' ? data.name.trim() : '';
  const order = typeof data?.order === 'number' ? data.order : 0;
  const placeOnHero = Boolean(data?.placeOnHero);
  const iconUrl =
    typeof data?.iconUrl === 'string' && data.iconUrl.trim()
      ? data.iconUrl.trim()
      : undefined;
  const iconSvgRaw = typeof data?.iconSvg === 'string' ? data.iconSvg : '';
  const iconSvg = iconSvgRaw ? sanitizeSvg(iconSvgRaw) : undefined;

  const result = { name, order, placeOnHero };
  if (iconUrl) {
    result.iconUrl = iconUrl;
  }
  if (iconSvg) {
    result.iconSvg = iconSvg;
  }
  return result;
}

export async function listStackLogos() {
  const snap = await getDocs(query(STACK_COLLECTION, orderBy('order', 'asc')));

  if (snap.empty) {
    return [];
  }

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateStackLogo(docSnap.data()),
  }));
}

export async function createStackLogo(data) {
  const validated = validateStackLogo(data);
  const ref = await addDoc(STACK_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveStackLogo(id, data) {
  const validated = validateStackLogo(data);
  await setDoc(doc(db, 'stackLogos', id), validated);
  return { id, ...validated };
}

export async function deleteStackLogo(id) {
  await deleteDoc(doc(db, 'stackLogos', id));
}

export async function seedStackLogosFromLocal() {
  const snap = await getDocs(STACK_COLLECTION);
  const byName = Object.fromEntries(stackLogos.map((logo) => [logo.name, logo]));

  if (snap.empty) {
    const batch = writeBatch(db);
    stackLogos.forEach((logo, index) => {
      const ref = doc(STACK_COLLECTION);
      const iconSvg = sanitizeSvg(renderToStaticMarkup(logo.icon));
      const payload = { name: logo.name, order: index, placeOnHero: false };
      if (iconSvg) {
        payload.iconSvg = iconSvg;
      }
      batch.set(ref, payload);
    });
    await batch.commit();
    return { seeded: true, backfilled: 0, count: stackLogos.length };
  }

  const batch = writeBatch(db);
  let backfilled = 0;

  snap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const hasSvg = typeof data.iconSvg === 'string' && data.iconSvg.trim();
    const hasUrl = typeof data.iconUrl === 'string' && data.iconUrl.trim();
    if (hasSvg || hasUrl) return;

    const local = byName[data.name];
    if (!local?.icon) return;

    const iconSvg = sanitizeSvg(renderToStaticMarkup(local.icon));
    if (!iconSvg) return;

    batch.update(docSnap.ref, { iconSvg });
    backfilled += 1;
  });

  if (backfilled > 0) {
    await batch.commit();
  }

  return { seeded: false, backfilled, count: snap.size };
}
