import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DEFAULT_HERO } from '../constants/defaults/hero';
import { db } from '../lib/firebase';

const HERO_REF = doc(db, 'hero', 'main');

const HERO_FIELDS = Object.keys(DEFAULT_HERO);

function validateHero(data) {
  const result = {};
  for (const field of HERO_FIELDS) {
    const value = data?.[field];
    result[field] = typeof value === 'string' ? value : DEFAULT_HERO[field];
  }
  return result;
}

export async function getHero() {
  const snap = await getDoc(HERO_REF);
  if (!snap.exists()) {
    return { ...DEFAULT_HERO };
  }
  return validateHero(snap.data());
}

export async function saveHero(data) {
  const validated = validateHero(data);
  await setDoc(HERO_REF, validated);
  return validated;
}
