import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { DEFAULT_ABOUT } from '../../constants/defaults/about';
import { useAuth } from '../../context/AuthContext';
import {
  createAboutStat,
  deleteAboutStat,
  getAbout,
  listAboutStats,
  saveAbout,
  saveAboutStat,
} from '../../services/aboutService';

const FIELD_LABELS = {
  eyebrow: 'Eyebrow',
  title: 'Titre',
  intro: 'Introduction',
  cardPrimary: 'Carte principale (fond sombre)',
  cardSecondary: 'Carte secondaire',
};

const RICH_FIELDS = new Set(['intro', 'cardPrimary', 'cardSecondary']);
const EMPTY_STAT = { value: '', label: '' };

export default function AdminAbout() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({ ...DEFAULT_ABOUT });
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyStat, setBusyStat] = useState(false);
  const [message, setMessage] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...EMPTY_STAT });
  const [detailId, setDetailId] = useState(null);
  const [detailDraft, setDetailDraft] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aboutData, statsData] = await Promise.all([getAbout(), listAboutStats()]);
      setForm(aboutData);
      setStats(statsData.filter((stat) => !String(stat.id).startsWith('default-')));
    } catch {
      setForm({ ...DEFAULT_ABOUT });
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setMessage(null);
    };
  }

  function handleRichChange(field) {
    return (html) => {
      setForm((prev) => ({ ...prev, [field]: html }));
      setMessage(null);
    };
  }

  async function handleSaveMain(event) {
    event.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    setMessage(null);

    try {
      const saved = await saveAbout(form);
      setForm(saved);
      setMessage({ type: 'success', text: 'Contenu « À propos » enregistré.' });
    } catch {
      setMessage({ type: 'error', text: 'Enregistrement impossible. Réessayez.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleResetMain() {
    if (!isAdmin) return;

    setSaving(true);
    setMessage(null);

    try {
      const saved = await saveAbout(DEFAULT_ABOUT);
      setForm(saved);
      setMessage({ type: 'success', text: 'Valeurs par défaut restaurées.' });
    } catch {
      setMessage({ type: 'error', text: 'Réinitialisation impossible. Réessayez.' });
    } finally {
      setSaving(false);
    }
  }

  async function runStatAction(action) {
    if (!isAdmin) return;
    setBusyStat(true);
    setMessage(null);
    try {
      await action();
      await loadData();
    } catch {
      setMessage({ type: 'error', text: 'Opération sur les statistiques impossible.' });
    } finally {
      setBusyStat(false);
    }
  }

  function openCreate() {
    setCreateDraft({ ...EMPTY_STAT });
    setCreateOpen(true);
    setMessage(null);
  }

  function openDetail(stat) {
    setDetailId(stat.id);
    setDetailDraft({ ...stat });
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
  }

  function handleDetailChange(field) {
    return (event) => {
      setDetailDraft((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleCreateChange(field) {
    return (event) => {
      setCreateDraft((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleCreateStat(event) {
    event.preventDefault();
    if (!createDraft.value.trim() || !createDraft.label.trim()) return;

    await runStatAction(async () => {
      const created = await createAboutStat({
        value: createDraft.value.trim(),
        label: createDraft.label.trim(),
        order: stats.length,
      });
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_STAT });
      setMessage({ type: 'success', text: 'Statistique ajoutée.' });
      setDetailId(created.id);
      setDetailDraft({ ...created });
    });
  }

  async function handleSaveStat(event) {
    event.preventDefault();
    if (!detailDraft) return;

    await runStatAction(async () => {
      await saveAboutStat(detailDraft.id, detailDraft);
      setMessage({ type: 'success', text: 'Statistique enregistrée.' });
      closeDetail();
    });
  }

  async function handleDeleteStat() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.label} » ?`)) return;

    await runStatAction(async () => {
      await deleteAboutStat(detailDraft.id);
      setMessage({ type: 'success', text: 'Statistique supprimée.' });
      closeDetail();
    });
  }

  async function handleMoveStat(direction) {
    if (!detailDraft) return;
    const index = stats.findIndex((stat) => stat.id === detailDraft.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= stats.length) return;

    const current = stats[index];
    const target = stats[targetIndex];

    await runStatAction(async () => {
      await saveAboutStat(current.id, { ...current, order: target.order });
      await saveAboutStat(target.id, { ...target, order: current.order });
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  const detailIndex = detailDraft
    ? stats.findIndex((stat) => stat.id === detailDraft.id)
    : -1;

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-page__lead">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">À propos</h1>
      <p className="admin-page__lead">
        Textes à gauche, statistiques à droite. L&apos;ajout et l&apos;édition des stats
        se font dans un modal.
      </p>

      {!isAdmin ? (
        <p className="admin-form__error admin-page__warning">
          Accès administrateur requis pour enregistrer les modifications.
        </p>
      ) : null}

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

      <div className="admin-about-layout">
        <form className="admin-form admin-form--wide admin-about-layout__texts" onSubmit={handleSaveMain}>
          <h2 className="admin-page__subtitle">Contenu principal</h2>

          {Object.keys(DEFAULT_ABOUT).map((field) =>
            RICH_FIELDS.has(field) ? (
              <RichTextEditor
                key={field}
                label={FIELD_LABELS[field]}
                value={form[field]}
                onChange={handleRichChange(field)}
                disabled={!isAdmin || saving}
                placeholder={DEFAULT_ABOUT[field] || ''}
              />
            ) : (
              <label key={field} className="admin-form__field">
                <span>{FIELD_LABELS[field]}</span>
                <input
                  type="text"
                  value={form[field]}
                  onChange={handleChange(field)}
                  disabled={!isAdmin || saving}
                  placeholder={DEFAULT_ABOUT[field] || undefined}
                />
              </label>
            ),
          )}

          <div className="admin-form__actions">
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={!isAdmin || saving}
            >
              {saving ? 'Enregistrement…' : 'Enregistrer le contenu'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              disabled={!isAdmin || saving}
              onClick={handleResetMain}
            >
              Réinitialiser
            </button>
          </div>
        </form>

        <aside className="admin-about-layout__stats">
          <div className="admin-toolbar">
            <h2 className="admin-page__subtitle" style={{ marginBottom: 0 }}>
              Statistiques
            </h2>
            <div className="admin-toolbar__actions">
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={!isAdmin || busyStat}
                onClick={openCreate}
              >
                Ajouter
              </button>
            </div>
          </div>

          {stats.length === 0 ? (
            <p className="admin-page__lead">
              Aucune statistique. Cliquez sur « Ajouter » pour en créer une.
            </p>
          ) : (
            <div className="admin-summary-grid admin-summary-grid--compact">
              {stats.map((stat) => (
                <button
                  key={stat.id}
                  type="button"
                  className="admin-summary-card"
                  onClick={() => openDetail(stat)}
                >
                  <p className="admin-summary-card__title">{stat.value || '—'}</p>
                  <p className="admin-summary-card__meta">{stat.label || 'Sans libellé'}</p>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>

      <AdminModal
        open={createOpen}
        title="Nouvelle statistique"
        onClose={() => setCreateOpen(false)}
      >
        <form className="admin-form" onSubmit={handleCreateStat}>
          <label className="admin-form__field">
            <span>Valeur</span>
            <input
              type="text"
              value={createDraft.value}
              onChange={handleCreateChange('value')}
              disabled={!isAdmin || busyStat}
              placeholder="Ex. 3+"
              required
            />
          </label>
          <label className="admin-form__field">
            <span>Libellé</span>
            <input
              type="text"
              value={createDraft.label}
              onChange={handleCreateChange('label')}
              disabled={!isAdmin || busyStat}
              placeholder="Ex. Années d'expérience"
              required
            />
          </label>
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={!isAdmin || busyStat}>
              Créer
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setCreateOpen(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(detailDraft)}
        title={detailDraft?.label || 'Statistique'}
        onClose={closeDetail}
      >
        {detailDraft ? (
          <form className="admin-form" onSubmit={handleSaveStat}>
            <label className="admin-form__field">
              <span>Valeur</span>
              <input
                type="text"
                value={detailDraft.value}
                onChange={handleDetailChange('value')}
                disabled={!isAdmin || busyStat}
                required
              />
            </label>
            <label className="admin-form__field">
              <span>Libellé</span>
              <input
                type="text"
                value={detailDraft.label}
                onChange={handleDetailChange('label')}
                disabled={!isAdmin || busyStat}
                required
              />
            </label>
            <div className="admin-form__actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={!isAdmin || busyStat || detailIndex <= 0}
                onClick={() => handleMoveStat(-1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={!isAdmin || busyStat || detailIndex < 0 || detailIndex >= stats.length - 1}
                onClick={() => handleMoveStat(1)}
              >
                ↓
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={!isAdmin || busyStat}>
                Enregistrer
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={!isAdmin || busyStat}
                onClick={handleDeleteStat}
              >
                Supprimer
              </button>
            </div>
          </form>
        ) : null}
      </AdminModal>
    </div>
  );
}
