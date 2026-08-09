import { createContext, useContext } from 'react';
import { useSiteProfile } from '../hooks/useSiteProfile';

const SiteProfileContext = createContext(null);

export function SiteProfileProvider({ children }) {
  const value = useSiteProfile();
  return (
    <SiteProfileContext.Provider value={value}>{children}</SiteProfileContext.Provider>
  );
}

export function useSiteProfileContext() {
  const context = useContext(SiteProfileContext);
  if (!context) {
    throw new Error('useSiteProfileContext doit être utilisé dans un SiteProfileProvider.');
  }
  return context;
}
