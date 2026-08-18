import { useEffect, useState } from 'react';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { DEFAULT_HERO } from '../../constants/defaults/hero';
import { useAuth } from '../../context/AuthContext';
import { getHero, saveHero } from '../../services/heroService';

export default function AdminHero() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({ ...DEFAULT_HERO });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await getHero();
        if (!cancelled) {
          setForm(data);
        }
      } catch {
        if (!cancelled) {
          setForm({ ...DEFAULT_HERO });
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
      const saved = await saveHero(form);
      setForm(saved);
      setMessage({ type: 'success', text: 'Hero enregistré.' });
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
      const saved = await saveHero(DEFAULT_HERO);
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
      <h1 className="admin-page__title">Hero</h1>
      <p className="admin-page__lead">
        Photo portrait à droite du Hello, et libellé du bouton de défilement. L&apos;eyebrow
        (nom, titre) reste géré dans Profil / site.
      </p>

      {!isAdmin ? (
        <p className="admin-form__error admin-page__warning">
          Accès administrateur requis pour enregistrer les modifications.
        </p>
      ) : null}

      <form className="admin-form admin-form--wide" onSubmit={handleSave}>
        <ImageUploadField
          label="Photo portrait (droite)"
          value={form.portraitUrl ?? ''}
          onChange={(url) => {
            setForm((prev) => ({ ...prev, portraitUrl: url }));
            setMessage(null);
          }}
          folder="hero"
          disabled={!isAdmin || saving}
        />
        <p className="admin-form__hint">
          PNG ou JPG, idéalement 1200×1600 (ratio 3:4), fond blanc / clair, cadrage
          buste. Max 11 Mo.
        </p>

        <label className="admin-form__field">
          <span>Libellé du bouton scroll</span>
          <input
            type="text"
            value={form.scrollLabel}
            onChange={handleChange('scrollLabel')}
            disabled={!isAdmin || saving}
            placeholder={DEFAULT_HERO.scrollLabel}
          />
        </label>

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
