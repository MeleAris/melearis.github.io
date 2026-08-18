import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { DEFAULT_SERVICES } from '../../constants/defaults/services';
import { useAuth } from '../../context/AuthContext';
import {
  createService,
  deleteService,
  listServices,
  saveService,
  seedServicesFromLocal,
} from '../../services/servicesService';
import { arrayToLines, arrayToTags, linesToArray, tagsToArray } from '../../utils/listFields';

const EMPTY_SERVICE = {
  category: '',
  title: '',
  summary: '',
  bulletsText: '',
  stackText: '',
  color: '#e8d5c4',
  imageUrl: '',
};

function truncate(text, max = 100) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function toServicePayload(service, order) {
  return {
    category: service.category?.trim?.() ?? service.category ?? '',
    title: service.title?.trim?.() ?? service.title ?? '',
    summary: service.summary?.trim?.() ?? service.summary ?? '',
    bullets: linesToArray(service.bulletsText ?? arrayToLines(service.bullets)),
    stack: tagsToArray(service.stackText ?? arrayToTags(service.stack)),
    color: service.color || '#e8d5c4',
    imageUrl: service.imageUrl || undefined,
    order,
  };
}

function ServiceForm({ service, onChange, disabled }) {
  return (
    <>
      <label className="admin-form__field">
        <span>Catégorie</span>
        <input
          type="text"
          value={service.category}
          onChange={(event) => onChange('category', event.target.value)}
          disabled={disabled}
          placeholder={DEFAULT_SERVICES[0]?.category}
        />
      </label>
      <label className="admin-form__field">
        <span>Titre</span>
        <input
          type="text"
          value={service.title}
          onChange={(event) => onChange('title', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Résumé</span>
        <textarea
          rows={2}
          value={service.summary}
          onChange={(event) => onChange('summary', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Points clés (un par ligne)</span>
        <textarea
          rows={3}
          value={service.bulletsText ?? ''}
          onChange={(event) => onChange('bulletsText', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Stack (virgules)</span>
        <input
          type="text"
          value={service.stackText ?? ''}
          onChange={(event) => onChange('stackText', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Couleur de fond</span>
        <div className="admin-form__color-row">
          <input
            type="color"
            value={/^#[0-9A-Fa-f]{6}$/.test(service.color) ? service.color : '#e8d5c4'}
            onChange={(event) => onChange('color', event.target.value)}
            disabled={disabled}
            aria-label="Choisir une couleur"
          />
          <input
            type="text"
            value={service.color}
            onChange={(event) => onChange('color', event.target.value)}
            disabled={disabled}
            placeholder="#e8d5c4"
          />
        </div>
      </label>
      <ImageUploadField
        label="Illustration PNG"
        value={service.imageUrl ?? ''}
        onChange={(url) => onChange('imageUrl', url)}
        folder="services"
        disabled={disabled}
      />
      <p className="admin-form__hint">
        PNG transparent recommandé, ~720×480 (ratio 3:2), max 11 Mo. Affiché centré sur la
        couleur de fond.
      </p>
    </>
  );
}

export default function AdminServices() {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...EMPTY_SERVICE });
  const [detailId, setDetailId] = useState(null);
  const [detailDraft, setDetailDraft] = useState(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listServices();
      setServices(
        data
          .filter((service) => !String(service.id).startsWith('default-'))
          .map((service) => ({
            ...service,
            imageUrl: service.imageUrl ?? '',
            bulletsText: arrayToLines(service.bullets),
            stackText: arrayToTags(service.stack),
          })),
      );
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  async function runAction(action) {
    if (!isAdmin) return;
    setBusy(true);
    setMessage(null);
    try {
      await action();
      await loadServices();
    } catch {
      setMessage({ type: 'error', text: 'Opération impossible. Réessayez.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleSeed() {
    await runAction(async () => {
      const result = await seedServicesFromLocal();
      if (result.seeded) {
        setMessage({
          type: 'success',
          text: `${result.count} services importés depuis content.js.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'La collection contient déjà des services — import ignoré.',
        });
      }
    });
  }

  function openDetail(service) {
    setDetailId(service.id);
    setDetailDraft({ ...service });
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
  }

  function handleCreateChange(field, value) {
    setCreateDraft((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  }

  function handleDetailChange(field, value) {
    setDetailDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
    setMessage(null);
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!createDraft.title.trim()) return;

    await runAction(async () => {
      const created = await createService(toServicePayload(createDraft, services.length));
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_SERVICE });
      setMessage({ type: 'success', text: 'Service ajouté.' });
      openDetail({
        ...created,
        imageUrl: created.imageUrl ?? '',
        bulletsText: arrayToLines(created.bullets),
        stackText: arrayToTags(created.stack),
      });
    });
  }

  async function handleSaveDetail(event) {
    event.preventDefault();
    if (!detailDraft) return;

    await runAction(async () => {
      await saveService(detailDraft.id, toServicePayload(detailDraft, detailDraft.order));
      setMessage({ type: 'success', text: `"${detailDraft.title}" enregistré.` });
    });
  }

  async function handleDeleteDetail() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.title} » ?`)) return;

    await runAction(async () => {
      await deleteService(detailDraft.id);
      closeDetail();
      setMessage({ type: 'success', text: 'Service supprimé.' });
    });
  }

  async function handleMoveDetail(direction) {
    if (!detailDraft) return;
    const index = services.findIndex((service) => service.id === detailDraft.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= services.length) return;

    const current = services[index];
    const target = services[targetIndex];

    await runAction(async () => {
      await saveService(current.id, toServicePayload(current, target.order));
      await saveService(target.id, toServicePayload(target, current.order));
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  const detailIndex = detailDraft
    ? services.findIndex((service) => service.id === detailDraft.id)
    : -1;

  useEffect(() => {
    if (!detailId) return;
    const fresh = services.find((service) => service.id === detailId);
    if (fresh) setDetailDraft({ ...fresh });
  }, [services, detailId]);

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-page__lead">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Services</h1>
      <p className="admin-page__lead">
        Cartes de services : illustration PNG sur fond coloré, catégorie, titre, résumé,
        points clés et stack.
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
              setCreateDraft({ ...EMPTY_SERVICE });
              setCreateOpen(true);
            }}
          >
            Ajouter un service
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

      {services.length === 0 ? (
        <p className="admin-page__lead">
          Aucun service en Firestore. Les cartes de content.js s&apos;affichent sur le site
          public. Importez la liste locale ou ajoutez un service.
        </p>
      ) : (
        <div className="admin-summary-grid">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              className="admin-summary-card"
              onClick={() => openDetail(service)}
              disabled={!isAdmin}
            >
              <div
                className="admin-summary-card__media"
                style={{ background: service.color }}
              >
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt="" />
                ) : (
                  <span className="admin-summary-card__media-empty">Sans image</span>
                )}
              </div>
              <div className="admin-summary-card__head">
                {service.category ? (
                  <span className="admin-summary-card__badge">{service.category}</span>
                ) : (
                  <span />
                )}
              </div>
              <h3 className="admin-summary-card__title">{service.title || 'Sans titre'}</h3>
              <p className="admin-summary-card__summary">{truncate(service.summary)}</p>
            </button>
          ))}
        </div>
      )}

      <AdminModal
        open={createOpen}
        title="Nouveau service"
        onClose={() => setCreateOpen(false)}
      >
        <form className="admin-form" onSubmit={handleCreate}>
          <ServiceForm
            service={createDraft}
            onChange={handleCreateChange}
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
        title={detailDraft?.title || 'Service'}
        onClose={closeDetail}
      >
        {detailDraft ? (
          <form className="admin-form" onSubmit={handleSaveDetail}>
            <ServiceForm
              service={detailDraft}
              onChange={handleDetailChange}
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
                disabled={!isAdmin || busy || detailIndex >= services.length - 1}
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
