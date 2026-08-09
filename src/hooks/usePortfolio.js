import { useCallback, useEffect, useState } from 'react';
import { listWorks } from '../services/portfolioService';

export function usePortfolio() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listWorks();
      setWorks(data);
    } catch (err) {
      setError(err);
      setWorks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasWorks = works.length > 0;

  return { works, loading, error, refresh, hasWorks };
}
