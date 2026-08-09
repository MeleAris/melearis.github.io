import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DEFAULT_SITE_PROFILE } from '../constants/defaults/site';
import { db } from '../lib/firebase';

const SITE_PROFILE_REF = doc(db, 'site', 'profile');

const PROFILE_FIELDS = Object.keys(DEFAULT_SITE_PROFILE);

function validateProfile(data) {
  const result = {};
  for (const field of PROFILE_FIELDS) {
    const value = data?.[field];
    result[field] = typeof value === 'string' ? value : DEFAULT_SITE_PROFILE[field];
  }
  return result;
}

export async function getSiteProfile() {
  const snap = await getDoc(SITE_PROFILE_REF);
  if (!snap.exists()) {
    return { ...DEFAULT_SITE_PROFILE };
  }
  return validateProfile(snap.data());
}

export async function saveSiteProfile(data) {
  const validated = validateProfile(data);
  await setDoc(SITE_PROFILE_REF, validated);
  return validated;
}
