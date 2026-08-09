import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_EXPERIENCE_INTRO } from '../constants/defaults/experience';
import { experiences as localExperiences } from '../constants/content';
import {
  getExperienceIntro,
  listExperiencesWithProjects,
} from '../services/experienceService';

function localFallback() {
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

export function useExperience() {
  const [intro, setIntro] = useState(DEFAULT_EXPERIENCE_INTRO);
  const [experiences, setExperiences] = useState(localFallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [introData, experiencesData] = await Promise.all([
        getExperienceIntro(),
        listExperiencesWithProjects(),
      ]);
      setIntro(introData);
      setExperiences(experiencesData);
    } catch (err) {
      setError(err);
      setIntro(DEFAULT_EXPERIENCE_INTRO);
      setExperiences(localFallback());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { intro, experiences, loading, error, refresh };
}
