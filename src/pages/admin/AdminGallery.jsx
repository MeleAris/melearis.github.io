import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useAuth } from '../../context/AuthContext';
import { formatBadgePeriod, resolveBadge } from '../../services/badgeService';
import {
  createGalleryItem,
  deleteGalleryItem,
  listGalleryItems,
  saveGalleryItem,
} from '../../services/galleryService';

const MEDIA_OPTIONS = [
  { value: 'image', label: 'Image (upload)' },
  { value: 'badge', label: 'Badge numérique (URL)' },
  { value: 'pdf', label: 'Document PDF (upload)' },
];

const EMPTY_ITEM = {
  label: '',
  bg: '#d4c4a8',
  href: '',
  mediaType: 'image',
  mediaUrl: '',
  badge: null,
};

function toDraft(item) {
  if (!item) return { ...EMPTY_ITEM };
  return {
    // Indispensable pour enregistrer / supprimer : l'id pointe le document Firestore.
    id: item.id,
    label: item.label ?? '',
    bg: item.bg ?? '#d4c4a8',
    href: item.href ?? '',
    mediaType: item.mediaType ?? 'image',
    mediaUrl: item.mediaUrl ?? '',
    badge: item.badge ? { ...item.badge } : null,
  };
}

function MediaThumb({ item }) {
  if (item.mediaType === 'badge') {
    return item.badge?.imageUrl ? (
      <img
        className="admin-media-thumb admin-media-thumb--contain"
        src={item.badge.imageUrl}
        alt=""
      />
    ) : (
      <div className="admin-summary-card__thumb-wrap">
        <span className="admin-media-thumb__tag">Badge</span>
      </div>
    );
  }

  if (item.mediaType === 'pdf') {
    return (
      <div className="admin-summary-card__thumb-wrap">
        <span className="admin-media-thumb__tag">PDF</span>
      </div>
    );
  }

  return item.mediaUrl ? (
    <img className="admin-summary-card__thumb" src={item.mediaUrl} alt="" />
  ) : (
    <div className="admin-summary-card__thumb-wrap" style={{ background: item.bg }} />
  );
}

function GalleryForm({
  item,
  onChange,
  onAnalyze,
  analyzing,
  badgeError,
  disabled,
}) {
  const isBadge = item.mediaType === 'badge';
  const badgeUrl = item.badge?.url ?? '';

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
        <span>Type de média</span>
        <select
          value={item.mediaType}
          onChange={(event) => onChange('mediaType', event.target.value)}
          disabled={disabled}
        >
          {MEDIA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {item.mediaType === 'image' ? (
        <ImageUploadField
          label="Image de certification"
          value={item.mediaUrl ?? ''}
          onChange={(url) => onChange('mediaUrl', url)}
          folder="certifications"
          disabled={disabled}
        />
      ) : null}

      {item.mediaType === 'pdf' ? (
        <ImageUploadField
          label="Document PDF"
          value={item.mediaUrl ?? ''}
          onChange={(url) => onChange('mediaUrl', url)}
          folder="certifications"
          kind="pdf"
          disabled={disabled}
        />
      ) : null}

      {isBadge ? (
        <>
          <div className="admin-form__field">
            <span>URL du badge</span>
            <div className="admin-badge-url">
              <input
                type="url"
                value={badgeUrl}
                onChange={(event) => onChange('badgeUrl', event.target.value)}
                disabled={disabled}
                placeholder="https://badges.suse.com/…"
              />
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={onAnalyze}
                disabled={disabled || analyzing || !badgeUrl.trim()}
              >
                {analyzing ? 'Analyse…' : 'Analyser'}
              </button>
            </div>
            <span className="admin-form__hint">
              Collez le lien public du badge (Accredible/SUSE, Credly, Open Badges) : le titre,
              l’émetteur, les dates et l’image sont récupérés automatiquement.
            </span>
          </div>

          {badgeError ? <p className="admin-form__error">{badgeError}</p> : null}

          {item.badge?.imageUrl ? (
            <div className="admin-badge-preview">
              <img src={item.badge.imageUrl} alt="" />
              <div className="admin-badge-preview__meta">
                <strong>{item.badge.title || item.label || 'Badge'}</strong>
                {item.badge.issuer ? <span>{item.badge.issuer}</span> : null}
                {formatBadgePeriod(item.badge) ? (
                  <span>{formatBadgePeriod(item.badge)}</span>
                ) : null}
                {item.badge.provider ? (
                  <span className="admin-badge-preview__provider">
                    via {item.badge.provider}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      <label className="admin-form__field">
        <span>Lien de vérification (optionnel)</span>
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
  const [analyzing, setAnalyzing] = useState(false);
  const [badgeError, setBadgeError] = useState(null);

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
    if (fresh) setDetailDraft(toDraft(fresh));
  }, [items, detailId]);

  async function runAction(action) {
    if (!isAdmin) return;
    setBusy(true);
    setMessage(null);
    try {
      await action();
      await loadItems();
    } catch (err) {
      console.error('Admin certifications :', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Opération impossible. Réessayez.',
      });
    } finally {
      setBusy(false);
    }
  }

  function openCreate() {
    setCreateDraft({ ...EMPTY_ITEM });
    setBadgeError(null);
    setMessage(null);
    setCreateOpen(true);
  }

  function openDetail(item) {
    setDetailId(item.id);
    setDetailDraft(toDraft(item));
    setBadgeError(null);
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
    setBadgeError(null);
  }

  function closeCreate() {
    setCreateOpen(false);
    setCreateDraft({ ...EMPTY_ITEM });
    setBadgeError(null);
  }

  const activeIsCreate = createOpen;

  function updateActiveDraft(updater) {
    if (activeIsCreate) {
      setCreateDraft((prev) => (prev ? updater(prev) : prev));
    } else {
      setDetailDraft((prev) => (prev ? updater(prev) : prev));
    }
  }

  function handleFieldChange(field, value) {
    setMessage(null);
    setBadgeError(null);

    updateActiveDraft((prev) => {
      if (field === 'badgeUrl') {
        // Une nouvelle URL invalide les métadonnées déjà récupérées.
        return { ...prev, badge: { ...(prev.badge ?? {}), url: value } };
      }

      if (field === 'mediaType') {
        const mediaType = value;
        return {
          ...prev,
          mediaType,
          mediaUrl: mediaType === prev.mediaType ? prev.mediaUrl : '',
          badge:
            mediaType === 'badge' ? { ...(prev.badge ?? {}), url: prev.badge?.url ?? '' } : null,
        };
      }

      return { ...prev, [field]: value };
    });
  }

  async function handleAnalyzeBadge() {
    const draft = activeIsCreate ? createDraft : detailDraft;
    const url = draft?.badge?.url?.trim();
    if (!url) {
      setBadgeError('Renseignez l’URL du badge.');
      return;
    }

    setAnalyzing(true);
    setBadgeError(null);

    try {
      const badge = await resolveBadge(url);
      updateActiveDraft((prev) => ({
        ...prev,
        badge,
        label: prev.label?.trim() ? prev.label : badge.title,
        href: prev.href?.trim() ? prev.href : badge.verificationUrl,
      }));
      setMessage({ type: 'success', text: 'Badge analysé.' });
    } catch (err) {
      setBadgeError(err instanceof Error ? err.message : 'Analyse impossible.');
    } finally {
      setAnalyzing(false);
    }
  }

  async function buildPayload(draft) {
    if (draft.mediaType === 'badge') {
      const url = draft.badge?.url?.trim();
      if (!url) throw new Error('Renseignez l’URL du badge.');

      let badge = draft.badge;
      if (!badge?.imageUrl) {
        try {
          badge = await resolveBadge(url);
        } catch {
          // Le badge reste enregistrable même sans métadonnées (lien + libellé).
          badge = { url };
        }
      }

      const label = draft.label.trim() || badge.title || url;
      return { ...draft, label, mediaType: 'badge', mediaUrl: '', badge };
    }

    if (draft.mediaType === 'pdf' && !draft.mediaUrl) {
      throw new Error('Ajoutez le fichier PDF de la certification.');
    }

    return { ...draft, badge: null };
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!createDraft) return;

    await runAction(async () => {
      const payload = await buildPayload(createDraft);
      await createGalleryItem({ ...payload, order: items.length });
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_ITEM });
      setBadgeError(null);
      setMessage({ type: 'success', text: 'Certification ajoutée.' });
    });
  }

  async function handleSaveDetail(event) {
    event.preventDefault();
    if (!detailDraft) return;

    const { id } = detailDraft;

    await runAction(async () => {
      const payload = await buildPayload(detailDraft);
      await saveGalleryItem(id, payload);
      closeDetail();
      setMessage({ type: 'success', text: `"${payload.label}" enregistré.` });
    });
  }

  async function handleDeleteDetail() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.label} » ?`)) return;

    const { id, label } = detailDraft;

    await runAction(async () => {
      await deleteGalleryItem(id);
      closeDetail();
      setMessage({ type: 'success', text: `« ${label} » supprimée.` });
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
        Section « Certifications » : image importée, badge numérique (lien public analysé
        automatiquement) ou document PDF avec aperçu sur le site. La section est masquée tant
        qu&apos;il n&apos;y a aucune entrée.
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
            onClick={openCreate}
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
              <MediaThumb item={item} />
              <h3 className="admin-summary-card__title">{item.label || 'Sans libellé'}</h3>
              <p className="admin-summary-card__meta">
                {item.mediaType === 'badge'
                  ? item.badge?.issuer || 'Badge numérique'
                  : item.mediaType === 'pdf'
                    ? 'Document PDF'
                    : item.href || 'Image'}
              </p>
            </button>
          ))}
        </div>
      )}

      <AdminModal open={createOpen} title="Nouvelle certification" onClose={closeCreate}>
        <form className="admin-form" onSubmit={handleCreate}>
          <GalleryForm
            item={createDraft}
            onChange={handleFieldChange}
            onAnalyze={handleAnalyzeBadge}
            analyzing={analyzing}
            badgeError={badgeError}
            disabled={!isAdmin || busy}
          />
          <div className="admin-form__actions">
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={!isAdmin || busy || analyzing}
            >
              Créer
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={busy || analyzing}
              onClick={closeCreate}
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
              onChange={handleFieldChange}
              onAnalyze={handleAnalyzeBadge}
              analyzing={analyzing}
              badgeError={badgeError}
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
                disabled={!isAdmin || busy || analyzing}
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
