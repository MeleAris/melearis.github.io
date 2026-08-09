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
  writeBatch,
} from 'firebase/firestore';
import { renderToStaticMarkup } from 'react-dom/server';
import { DEFAULT_CONTACT, DEFAULT_SOCIAL_LINKS } from '../constants/defaults/contact';
import { getSocialIcon } from '../constants/socialIcons';
import { db } from '../lib/firebase';
import { sanitizeSvg } from '../utils/sanitizeSvg';

const CONTACT_REF = doc(db, 'contact', 'main');
const SOCIAL_LINKS_COLLECTION = collection(db, 'socialLinks');

function validateContact(data) {
  return {
    eyebrow: typeof data?.eyebrow === 'string' ? data.eyebrow : DEFAULT_CONTACT.eyebrow,
    title: typeof data?.title === 'string' ? data.title : DEFAULT_CONTACT.title,
  };
}

function validateSocialLink(data) {
  const iconUrl =
    typeof data?.iconUrl === 'string' && data.iconUrl.trim()
      ? data.iconUrl.trim()
      : undefined;
  const iconSvgRaw = typeof data?.iconSvg === 'string' ? data.iconSvg : '';
  const iconSvg = iconSvgRaw ? sanitizeSvg(iconSvgRaw) : undefined;

  const result = {
    label: typeof data?.label === 'string' ? data.label : '',
    href: typeof data?.href === 'string' ? data.href : '',
    order: typeof data?.order === 'number' ? data.order : 0,
  };

  if (iconUrl) {
    result.iconUrl = iconUrl;
  }
  if (iconSvg) {
    result.iconSvg = iconSvg;
  }

  return result;
}

export async function getContact() {
  const snap = await getDoc(CONTACT_REF);
  if (!snap.exists()) {
    return { ...DEFAULT_CONTACT };
  }
  return validateContact(snap.data());
}

export async function saveContact(data) {
  const validated = validateContact(data);
  await setDoc(CONTACT_REF, validated);
  return validated;
}

export async function listSocialLinks() {
  const snap = await getDocs(query(SOCIAL_LINKS_COLLECTION, orderBy('order', 'asc')));

  if (snap.empty) {
    return [];
  }

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateSocialLink(docSnap.data()),
  }));
}

export async function createSocialLink(data) {
  const validated = validateSocialLink(data);
  const ref = await addDoc(SOCIAL_LINKS_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveSocialLink(id, data) {
  const validated = validateSocialLink(data);
  await setDoc(doc(db, 'socialLinks', id), validated);
  return { id, ...validated };
}

export async function deleteSocialLink(id) {
  await deleteDoc(doc(db, 'socialLinks', id));
}

export async function seedSocialLinksFromLocal() {
  const snap = await getDocs(SOCIAL_LINKS_COLLECTION);

  if (snap.empty) {
    const batch = writeBatch(db);
    DEFAULT_SOCIAL_LINKS.forEach((link, index) => {
      const ref = doc(SOCIAL_LINKS_COLLECTION);
      const icon = getSocialIcon(link.label);
      const iconSvg = icon ? sanitizeSvg(renderToStaticMarkup(icon)) : '';
      const payload = { label: link.label, href: link.href, order: index };
      if (iconSvg) {
        payload.iconSvg = iconSvg;
      }
      batch.set(ref, payload);
    });
    await batch.commit();
    return { seeded: true, backfilled: 0, count: DEFAULT_SOCIAL_LINKS.length };
  }

  const batch = writeBatch(db);
  let backfilled = 0;

  snap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const hasSvg = typeof data.iconSvg === 'string' && data.iconSvg.trim();
    const hasUrl = typeof data.iconUrl === 'string' && data.iconUrl.trim();
    if (hasSvg || hasUrl) return;

    const icon = getSocialIcon(data.label);
    if (!icon) return;

    const iconSvg = sanitizeSvg(renderToStaticMarkup(icon));
    if (!iconSvg) return;

    batch.update(docSnap.ref, { iconSvg });
    backfilled += 1;
  });

  if (backfilled > 0) {
    await batch.commit();
  }

  return { seeded: false, backfilled, count: snap.size };
}
