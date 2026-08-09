import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_HERO } from '../constants/defaults/hero';
import { getHero } from '../services/heroService';

export function useHero() {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHero();
      setHero(data);
    } catch (err) {
      setError(err);
      setHero(DEFAULT_HERO);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { hero, loading, error, refresh };
}
