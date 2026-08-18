import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DEFAULT_HERO } from '../constants/defaults/hero';
import { db } from '../lib/firebase';

const HERO_REF = doc(db, 'hero', 'main');

function validateHero(data) {
  const portraitUrl =
    typeof data?.portraitUrl === 'string' && data.portraitUrl.trim()
      ? data.portraitUrl.trim()
      : '';

  return {
    scrollLabel:
      typeof data?.scrollLabel === 'string' && data.scrollLabel.trim()
        ? data.scrollLabel
        : DEFAULT_HERO.scrollLabel,
    portraitUrl,
  };
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
