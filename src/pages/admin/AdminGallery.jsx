import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useAuth } from '../../context/AuthContext';
import {
  createGalleryItem,
  deleteGalleryItem,
  listGalleryItems,
  saveGalleryItem,
} from '../../services/galleryService';

const EMPTY_ITEM = {
  label: '',
  bg: '#d4c4a8',
  href: '',
  imageUrl: '',
};

function GalleryForm({ item, onChange, disabled }) {
  return (
    <>
      <label className="admin-form__field">
        <span>Libellé</span>
        <input
          type="text"
          value={item.label}
          onChange={(event) => onChange('label', event.target.value)}
          disabled={disabled}
          placeholder="Ex. AWS Certified"
        />
      </label>
      <label className="admin-form__field">
        <span>Lien</span>
        <input
          type="url"
          value={item.href ?? ''}
          onChange={(event) => onChange('href', event.target.value)}
          disabled={disabled}
          placeholder="https://"
        />
      </label>
      <label className="admin-form__field">
        <span>Couleur de secours</span>
        <input
          type="text"
          value={item.bg}
          onChange={(event) => onChange('bg', event.target.value)}
          disabled={disabled}
          placeholder="#d4c4a8"
        />
      </label>
      <ImageUploadField
        label="Image de certification"
        value={item.imageUrl ?? ''}
        onChange={(url) => onChange('imageUrl', url)}
        folder="certifications"
        disabled={disabled}
      />
    </>
  );
}

export default function AdminGallery() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...EMPTY_ITEM });
  const [detailId, setDetailId] = useState(null);
  const [detailDraft, setDetailDraft] = useState(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listGalleryItems();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (!detailId) return;
    const fresh = items.find((item) => item.id === detailId);
    if (fresh) setDetailDraft({ ...fresh });
  }, [items, detailId]);

  async function runAction(action) {
    if (!isAdmin) return;
    setBusy(true);
    setMessage(null);
    try {
      await action();
      await loadItems();
    } catch {
      setMessage({ type: 'error', text: 'Opération impossible. Réessayez.' });
    } finally {
      setBusy(false);
    }
  }

  function openDetail(item) {
    setDetailId(item.id);
    setDetailDraft({ ...item });
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!createDraft.label.trim()) return;

    await runAction(async () => {
      const created = await createGalleryItem({
        label: createDraft.label.trim(),
        bg: createDraft.bg,
        href: createDraft.href.trim(),
        imageUrl: createDraft.imageUrl || undefined,
        order: items.length,
      });
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_ITEM });
      setMessage({ type: 'success', text: 'Certification ajoutée.' });
      openDetail(created);
    });
  }

  async function handleSaveDetail(event) {
    event.preventDefault();
    if (!detailDraft) return;

    await runAction(async () => {
      await saveGalleryItem(detailDraft.id, detailDraft);
      setMessage({ type: 'success', text: `"${detailDraft.label}" enregistré.` });
    });
  }

  async function handleDeleteDetail() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.label} » ?`)) return;

    await runAction(async () => {
      await deleteGalleryItem(detailDraft.id);
      closeDetail();
      setMessage({ type: 'success', text: 'Certification supprimée.' });
    });
  }

  async function handleMoveDetail(direction) {
    if (!detailDraft) return;
    const index = items.findIndex((item) => item.id === detailDraft.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= items.length) return;

    const current = items[index];
    const target = items[targetIndex];

    await runAction(async () => {
      await saveGalleryItem(current.id, { ...current, order: target.order });
      await saveGalleryItem(target.id, { ...target, order: current.order });
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  const detailIndex = detailDraft
    ? items.findIndex((item) => item.id === detailDraft.id)
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
      <h1 className="admin-page__title">Certifications</h1>
      <p className="admin-page__lead">
        Bandeau sous la section « À propos » : libellé, lien, couleur de secours et image
        de certification. La section est masquée sur le site public tant qu&apos;il n&apos;y a
        aucune entrée.
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
              setCreateDraft({ ...EMPTY_ITEM });
              setCreateOpen(true);
            }}
          >
            Ajouter une certification
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="admin-page__lead">
          Aucune certification en Firestore. Ajoutez une entrée pour l&apos;afficher sur le site
          public.
        </p>
      ) : (
        <div className="admin-summary-grid">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-summary-card"
              onClick={() => openDetail(item)}
              disabled={!isAdmin}
            >
              {item.imageUrl ? (
                <img className="admin-summary-card__thumb" src={item.imageUrl} alt="" />
              ) : (
                <div
                  className="admin-summary-card__thumb-wrap"
                  style={{ background: item.bg }}
                />
              )}
              <h3 className="admin-summary-card__title">{item.label || 'Sans libellé'}</h3>
              {item.href ? <p className="admin-summary-card__meta">{item.href}</p> : null}
            </button>
          ))}
        </div>
      )}

      <AdminModal
        open={createOpen}
        title="Nouvelle certification"
        onClose={() => setCreateOpen(false)}
      >
        <form className="admin-form" onSubmit={handleCreate}>
          <GalleryForm
            item={createDraft}
            onChange={(field, value) => {
              setCreateDraft((prev) => ({ ...prev, [field]: value }));
              setMessage(null);
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
        title={detailDraft?.label || 'Certification'}
        onClose={closeDetail}
      >
        {detailDraft ? (
          <form className="admin-form" onSubmit={handleSaveDetail}>
            <GalleryForm
              item={detailDraft}
              onChange={(field, value) => {
                setDetailDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
                setMessage(null);
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
                disabled={!isAdmin || busy || detailIndex >= items.length - 1}
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
