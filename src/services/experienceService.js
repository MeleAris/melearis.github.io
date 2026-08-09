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
  where,
} from 'firebase/firestore';
import { experiences as localExperiences } from '../constants/content';
import { DEFAULT_EXPERIENCE_INTRO } from '../constants/defaults/experience';
import { db } from '../lib/firebase';
import { sanitizeHtml } from '../utils/sanitizeHtml';

const INTRO_REF = doc(db, 'experienceIntro', 'main');
const EXPERIENCES_COLLECTION = collection(db, 'experiences');
const PROJECTS_COLLECTION = collection(db, 'projects');

function validateIntro(data) {
  const body =
    typeof data?.body === 'string' ? data.body : DEFAULT_EXPERIENCE_INTRO.body;
  return {
    title:
      typeof data?.title === 'string' ? data.title : DEFAULT_EXPERIENCE_INTRO.title,
    body: sanitizeHtml(body),
  };
}

function validateExperience(data) {
  return {
    company: typeof data?.company === 'string' ? data.company : '',
    period: typeof data?.period === 'string' ? data.period : '',
    role: typeof data?.role === 'string' ? data.role : '',
    tags: Array.isArray(data?.tags) ? data.tags.filter((t) => typeof t === 'string') : [],
    order: typeof data?.order === 'number' ? data.order : 0,
  };
}

function validateProject(data) {
  return {
    experienceId: typeof data?.experienceId === 'string' ? data.experienceId : '',
    title: typeof data?.title === 'string' ? data.title : '',
    description: typeof data?.description === 'string' ? data.description : '',
    tasks: Array.isArray(data?.tasks) ? data.tasks.filter((t) => typeof t === 'string') : [],
    tags: Array.isArray(data?.tags) ? data.tags.filter((t) => typeof t === 'string') : [],
    order: typeof data?.order === 'number' ? data.order : 0,
  };
}

function localExperiencesWithProjects() {
  return localExperiences.map((exp, index) => ({
    id: `default-${index}`,
    company: exp.company,
    period: exp.period,
    role: exp.role,
    tags: exp.tags ?? [],
    order: index,
    projects: (exp.projects ?? []).map((project, pIndex) => ({
      id: `default-${index}-p${pIndex}`,
      experienceId: `default-${index}`,
      title: project.title,
      description: project.description,
      tasks: project.tasks ?? [],
      tags: project.tags ?? [],
      order: pIndex,
    })),
  }));
}

export async function getExperienceIntro() {
  const snap = await getDoc(INTRO_REF);
  if (!snap.exists()) {
    return { ...DEFAULT_EXPERIENCE_INTRO };
  }
  return validateIntro(snap.data());
}

export async function saveExperienceIntro(data) {
  const validated = validateIntro(data);
  await setDoc(INTRO_REF, validated);
  return validated;
}

export async function listExperiences() {
  const snap = await getDocs(query(EXPERIENCES_COLLECTION, orderBy('order', 'asc')));

  if (snap.empty) {
    return localExperiencesWithProjects().map(({ projects: _p, ...exp }) => exp);
  }

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateExperience(docSnap.data()),
  }));
}

export async function listProjects(experienceId) {
  const snap = await getDocs(
    query(PROJECTS_COLLECTION, where('experienceId', '==', experienceId)),
  );

  return snap.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...validateProject(docSnap.data()),
    }))
    .sort((a, b) => a.order - b.order);
}

export async function listAllProjects() {
  const expSnap = await getDocs(query(EXPERIENCES_COLLECTION, orderBy('order', 'asc')));

  if (expSnap.empty) {
    return localExperiencesWithProjects().flatMap((exp) => exp.projects);
  }

  const snap = await getDocs(query(PROJECTS_COLLECTION, orderBy('order', 'asc')));
  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateProject(docSnap.data()),
  }));
}

export async function listExperiencesWithProjects() {
  const expSnap = await getDocs(query(EXPERIENCES_COLLECTION, orderBy('order', 'asc')));

  if (expSnap.empty) {
    return localExperiencesWithProjects();
  }

  const experiences = expSnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateExperience(docSnap.data()),
  }));

  const projectsSnap = await getDocs(query(PROJECTS_COLLECTION, orderBy('order', 'asc')));
  const projects = projectsSnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...validateProject(docSnap.data()),
  }));

  const projectsByExp = projects.reduce((acc, project) => {
    const list = acc[project.experienceId] ?? [];
    list.push(project);
    acc[project.experienceId] = list;
    return acc;
  }, {});

  return experiences.map((exp) => ({
    ...exp,
    projects: projectsByExp[exp.id] ?? [],
  }));
}

export async function createExperience(data) {
  const validated = validateExperience(data);
  const ref = await addDoc(EXPERIENCES_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveExperience(id, data) {
  const validated = validateExperience(data);
  await setDoc(doc(db, 'experiences', id), validated);
  return { id, ...validated };
}

export async function deleteExperience(id) {
  const projectsSnap = await getDocs(
    query(PROJECTS_COLLECTION, where('experienceId', '==', id)),
  );
  const batch = writeBatch(db);
  projectsSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
  batch.delete(doc(db, 'experiences', id));
  await batch.commit();
}

export async function createProject(data) {
  const validated = validateProject(data);
  const ref = await addDoc(PROJECTS_COLLECTION, validated);
  return { id: ref.id, ...validated };
}

export async function saveProject(id, data) {
  const validated = validateProject(data);
  await setDoc(doc(db, 'projects', id), validated);
  return { id, ...validated };
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, 'projects', id));
}

export async function seedExperiencesFromLocal() {
  const expSnap = await getDocs(EXPERIENCES_COLLECTION);
  if (!expSnap.empty) {
    return { seeded: false, experienceCount: expSnap.size };
  }

  const batch = writeBatch(db);
  const experienceIds = [];

  localExperiences.forEach((exp, index) => {
    const ref = doc(EXPERIENCES_COLLECTION);
    experienceIds.push(ref.id);
    batch.set(ref, {
      company: exp.company,
      period: exp.period,
      role: exp.role,
      tags: exp.tags ?? [],
      order: index,
    });
  });

  localExperiences.forEach((exp, expIndex) => {
    (exp.projects ?? []).forEach((project, pIndex) => {
      const ref = doc(PROJECTS_COLLECTION);
      batch.set(ref, {
        experienceId: experienceIds[expIndex],
        title: project.title,
        description: project.description,
        tasks: project.tasks ?? [],
        tags: project.tags ?? [],
        order: pIndex,
      });
    });
  });

  await batch.commit();

  const projectCount = localExperiences.reduce(
    (sum, exp) => sum + (exp.projects?.length ?? 0),
    0,
  );

  return {
    seeded: true,
    experienceCount: localExperiences.length,
    projectCount,
  };
}
