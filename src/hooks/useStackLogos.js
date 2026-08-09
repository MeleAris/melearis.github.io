import { useCallback, useEffect, useState } from 'react';
import { listStackLogos } from '../services/stackService';

export function useStackLogos() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listStackLogos();
      setLogos(data);
    } catch (err) {
      setError(err);
      setLogos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { logos, loading, error, refresh };
}
