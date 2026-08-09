import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_CONTACT } from '../constants/defaults/contact';
import { getContact, listSocialLinks } from '../services/contactService';

export function useContact() {
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactData, linksData] = await Promise.all([getContact(), listSocialLinks()]);
      setContact(contactData);
      setSocialLinks(linksData);
    } catch (err) {
      setError(err);
      setContact(DEFAULT_CONTACT);
      setSocialLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { contact, socialLinks, loading, error, refresh };
}
