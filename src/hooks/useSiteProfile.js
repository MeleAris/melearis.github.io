import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_SITE_PROFILE } from '../constants/defaults/site';
import { getSiteProfile } from '../services/siteService';

export function useSiteProfile() {
  const [profile, setProfile] = useState(DEFAULT_SITE_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSiteProfile();
      setProfile(data);
    } catch (err) {
      setError(err);
      setProfile(DEFAULT_SITE_PROFILE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, error, refresh };
}
