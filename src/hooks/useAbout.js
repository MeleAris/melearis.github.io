import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_ABOUT, DEFAULT_ABOUT_STATS } from '../constants/defaults/about';
import { getAbout, listAboutStats } from '../services/aboutService';

export function useAbout() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [stats, setStats] = useState(DEFAULT_ABOUT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [aboutData, statsData] = await Promise.all([getAbout(), listAboutStats()]);
      setAbout(aboutData);
      setStats(statsData);
    } catch (err) {
      setError(err);
      setAbout(DEFAULT_ABOUT);
      setStats(
        DEFAULT_ABOUT_STATS.map((stat, index) => ({
          id: `default-${index}`,
          ...stat,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { about, stats, loading, error, refresh };
}
