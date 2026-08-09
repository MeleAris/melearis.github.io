import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { DEFAULT_WORKS } from '../../constants/defaults/portfolio';
import { useAuth } from '../../context/AuthContext';
import {
  createWork,
  deleteWork,
  listWorks,
  saveWork,
  seedWorksFromLocal,
} from '../../services/portfolioService';

const EMPTY_WORK = {
  title: '',
  category: '',
  color: '#d4c8b8',
  href: '',
  images: [],
};

function WorkForm({ work, onChange, onAddImage, onRemoveImage, disabled }) {
  return (
    <>
      <label className="admin-form__field">
        <span>Titre</span>
        <input
          type="text"
          value={work.title}
          onChange={(event) => onChange('title', event.target.value)}
          disabled={disabled}
          placeholder={DEFAULT_WORKS[0]?.title}
        />
      </label>
      <label className="admin-form__field">
        <span>Catégorie</span>
        <input
          type="text"
          value={work.category}
          onChange={(event) => onChange('category', event.target.value)}
          disabled={disabled}
          placeholder={DEFAULT_WORKS[0]?.category}
        />
      </label>
      <label className="admin-form__field">
        <span>Couleur de secours</span>
        <input
          type="text"
          value={work.color}
          onChange={(event) => onChange('color', event.target.value)}
          disabled={disabled}
          placeholder="#d4c8b8"
        />
      </label>
      <label className="admin-form__field">
        <span>Lien projet</span>
        <input
          type="url"
          value={work.href ?? ''}
          onChange={(event) => onChange('href', event.target.value)}
          disabled={disabled}
          placeholder="https://"
        />
      </label>
      {(work.images ?? []).length > 0 ? (
        <ul className="admin-image-list">
          {(work.images ?? []).map((url, imageIndex) => (
            <li key={`${url}-${imageIndex}`} className="admin-image-list__item">
              <img src={url} alt="" />
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={disabled}
                onClick={() => onRemoveImage(imageIndex)}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <ImageUploadField
        label="Ajouter une image"
        value=""
        onChange={onAddImage}
        folder="portfolio"
        disabled={disabled}
      />
    </>
  );
}

export default function AdminPortfolio() {
  const { isAdmin } = useAuth();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...EMPTY_WORK });
  const [detailId, setDetailId] = useState(null);
  const [detailDraft, setDetailDraft] = useState(null);

  const loadWorks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listWorks();
      setWorks(data);
    } catch {
      setWorks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  useEffect(() => {
    if (!detailId) return;
    const fresh = works.find((work) => work.id === detailId);
    if (fresh) setDetailDraft({ ...fresh, images: [...(fresh.images ?? [])] });
  }, [works, detailId]);

  async function runAction(action) {
    if (!isAdmin) return;
    setBusy(true);
    setMessage(null);
    try {
      await action();
      await loadWorks();
    } catch {
      setMessage({ type: 'error', text: 'Opération impossible. Réessayez.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleSeed() {
    await runAction(async () => {
      const result = await seedWorksFromLocal();
      if (result.seeded) {
        setMessage({
          type: 'success',
          text: `${result.count} réalisations importées (sans images ni liens).`,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'La collection contient déjà des réalisations — import ignoré.',
        });
      }
    });
  }

  function openDetail(work) {
    setDetailId(work.id);
    setDetailDraft({ ...work, images: [...(work.images ?? [])] });
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!createDraft.title.trim()) return;

    await runAction(async () => {
      const created = await createWork({
        title: createDraft.title.trim(),
        category: createDraft.category.trim(),
        color: createDraft.color,
        href: createDraft.href.trim(),
        images: createDraft.images,
        order: works.length,
      });
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_WORK });
      setMessage({ type: 'success', text: 'Réalisation ajoutée.' });
      openDetail(created);
    });
  }

  async function handleSaveDetail(event) {
    event.preventDefault();
    if (!detailDraft) return;

    await runAction(async () => {
      await saveWork(detailDraft.id, detailDraft);
      setMessage({ type: 'success', text: `"${detailDraft.title}" enregistré.` });
    });
  }

  async function handleDeleteDetail() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.title} » ?`)) return;

    await runAction(async () => {
      await deleteWork(detailDraft.id);
      closeDetail();
      setMessage({ type: 'success', text: 'Réalisation supprimée.' });
    });
  }

  async function handleMoveDetail(direction) {
    if (!detailDraft) return;
    const index = works.findIndex((work) => work.id === detailDraft.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= works.length) return;

    const current = works[index];
    const target = works[targetIndex];

    await runAction(async () => {
      await saveWork(current.id, { ...current, order: target.order });
      await saveWork(target.id, { ...target, order: current.order });
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  const detailIndex = detailDraft
    ? works.findIndex((work) => work.id === detailDraft.id)
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
      <h1 className="admin-page__title">Portfolio</h1>
      <p className="admin-page__lead">
        Réalisations affichées dans la grille portfolio. La section et le lien de navigation
        sont masqués tant qu&apos;il n&apos;y a aucune entrée.
      </p>

      {!isAdmin ? (
        <p className="admin-form__error admin-page__warning">
          Accès administrateur requis pour enregistrer les modifications.
        </p>
      ) : null}

      <div className="admin-toolbar">
        <div className="admin-toolbar__actions">
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={!isAdmin || busy}
            onClick={() => {
              setCreateDraft({ ...EMPTY_WORK });
              setCreateOpen(true);
            }}
          >
            Ajouter une réalisation
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            disabled={!isAdmin || busy}
            onClick={handleSeed}
          >
            Importer
          </button>
        </div>
      </div>

      {works.length === 0 ? (
        <p className="admin-page__lead">
          Aucune réalisation en Firestore. Importez la liste locale ou ajoutez une réalisation.
        </p>
      ) : (
        <div className="admin-summary-grid">
          {works.map((work) => {
            const cover = (work.images ?? [])[0];
            return (
              <button
                key={work.id}
                type="button"
                className="admin-summary-card"
                onClick={() => openDetail(work)}
                disabled={!isAdmin}
              >
                {cover ? (
                  <img className="admin-summary-card__thumb" src={cover} alt="" />
                ) : (
                  <div
                    className="admin-summary-card__thumb-wrap"
                    style={{ background: work.color }}
                  />
                )}
                <div className="admin-summary-card__head">
                  {work.category ? (
                    <span className="admin-summary-card__badge">{work.category}</span>
                  ) : (
                    <span />
                  )}
                </div>
                <h3 className="admin-summary-card__title">{work.title || 'Sans titre'}</h3>
              </button>
            );
          })}
        </div>
      )}

      <AdminModal
        open={createOpen}
        title="Nouvelle réalisation"
        onClose={() => setCreateOpen(false)}
        wide
      >
        <form className="admin-form" onSubmit={handleCreate}>
          <WorkForm
            work={createDraft}
            onChange={(field, value) => {
              setCreateDraft((prev) => ({ ...prev, [field]: value }));
              setMessage(null);
            }}
            onAddImage={(url) => {
              if (!url) return;
              setCreateDraft((prev) => ({ ...prev, images: [...prev.images, url] }));
            }}
            onRemoveImage={(imageIndex) => {
              setCreateDraft((prev) => ({
                ...prev,
                images: prev.images.filter((_, index) => index !== imageIndex),
              }));
            }}
            disabled={!isAdmin || busy}
          />
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={!isAdmin || busy}>
              Créer
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={busy}
              onClick={() => setCreateOpen(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(detailDraft)}
        title={detailDraft?.title || 'Réalisation'}
        onClose={closeDetail}
        wide
      >
        {detailDraft ? (
          <form className="admin-form" onSubmit={handleSaveDetail}>
            <WorkForm
              work={detailDraft}
              onChange={(field, value) => {
                setDetailDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
                setMessage(null);
              }}
              onAddImage={(url) => {
                if (!url) return;
                setDetailDraft((prev) =>
                  prev ? { ...prev, images: [...(prev.images ?? []), url] } : prev,
                );
              }}
              onRemoveImage={(imageIndex) => {
                setDetailDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        images: (prev.images ?? []).filter((_, index) => index !== imageIndex),
                      }
                    : prev,
                );
              }}
              disabled={!isAdmin || busy}
            />
            <div className="admin-form__actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={!isAdmin || busy || detailIndex <= 0}
                onClick={() => handleMoveDetail(-1)}
                aria-label="Monter"
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={!isAdmin || busy || detailIndex >= works.length - 1}
                onClick={() => handleMoveDetail(1)}
                aria-label="Descendre"
              >
                ↓
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={!isAdmin || busy}
              >
                Enregistrer
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={!isAdmin || busy}
                onClick={handleDeleteDetail}
              >
                Supprimer
              </button>
            </div>
          </form>
        ) : null}
      </AdminModal>

      {message ? (
        <p
          className={
            message.type === 'success' ? 'admin-form__success' : 'admin-form__error'
          }
          role="status"
          style={{ marginTop: '1.5rem' }}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
