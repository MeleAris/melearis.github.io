import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_SERVICES } from '../constants/defaults/services';
import { listServices } from '../services/servicesService';

function defaultServicesWithIds() {
  return DEFAULT_SERVICES.map((service, index) => ({
    id: `default-${index}`,
    ...service,
  }));
}

export function useServices() {
  const [services, setServices] = useState(defaultServicesWithIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listServices();
      setServices(data);
    } catch (err) {
      setError(err);
      setServices(defaultServicesWithIds());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { services, loading, error, refresh };
}
