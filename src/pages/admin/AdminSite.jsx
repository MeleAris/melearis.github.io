import { useEffect, useState } from 'react';
import { DEFAULT_SITE_PROFILE } from '../../constants/defaults/site';
import { useAuth } from '../../context/AuthContext';
import { getSiteProfile, saveSiteProfile } from '../../services/siteService';

const FIELD_LABELS = {
  brandName: 'Nom de marque (logo nav)',
  fullName: 'Prénom / nom complet',
  jobTitle: 'Titre professionnel',
  ctaLabel: 'Libellé du bouton contact',
  formspreeAction: 'URL Formspree (optionnel)',
};

export default function AdminSite() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({ ...DEFAULT_SITE_PROFILE });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await getSiteProfile();
        if (!cancelled) {
          setForm(data);
        }
      } catch {
        if (!cancelled) {
          setForm({ ...DEFAULT_SITE_PROFILE });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setMessage(null);
    };
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    setMessage(null);

    try {
      const saved = await saveSiteProfile(form);
      setForm(saved);
      setMessage({ type: 'success', text: 'Profil enregistré.' });
    } catch {
      setMessage({ type: 'error', text: 'Enregistrement impossible. Réessayez.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!isAdmin) return;

    setSaving(true);
    setMessage(null);

    try {
      const saved = await saveSiteProfile(DEFAULT_SITE_PROFILE);
      setForm(saved);
      setMessage({ type: 'success', text: 'Valeurs par défaut restaurées.' });
    } catch {
      setMessage({ type: 'error', text: 'Réinitialisation impossible. Réessayez.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-page__lead">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Profil / site</h1>
      <p className="admin-page__lead">
        Identité globale du site : logo, nom, titre et boutons de contact.
      </p>

      {!isAdmin ? (
        <p className="admin-form__error admin-page__warning">
          Accès administrateur requis pour enregistrer les modifications.
        </p>
      ) : null}

      <form className="admin-form admin-form--wide" onSubmit={handleSave}>
        {Object.keys(DEFAULT_SITE_PROFILE).map((field) => (
          <label key={field} className="admin-form__field">
            <span>{FIELD_LABELS[field]}</span>
            <input
              type={field === 'formspreeAction' ? 'url' : 'text'}
              value={form[field]}
              onChange={handleChange(field)}
              disabled={!isAdmin || saving}
              placeholder={DEFAULT_SITE_PROFILE[field] || undefined}
            />
          </label>
        ))}

        {message ? (
          <p
            className={
              message.type === 'success' ? 'admin-form__success' : 'admin-form__error'
            }
            role="status"
          >
            {message.text}
          </p>
        ) : null}

        <div className="admin-form__actions">
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={!isAdmin || saving}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            disabled={!isAdmin || saving}
            onClick={handleReset}
          >
            Réinitialiser les valeurs par défaut
          </button>
        </div>
      </form>
    </div>
  );
}
