import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import IconField from '../../components/admin/IconField';
import IconMedia from '../../components/IconMedia';
import { stackLogos } from '../../constants/stackLogos';
import { useAuth } from '../../context/AuthContext';
import {
  createStackLogo,
  deleteStackLogo,
  listStackLogos,
  saveStackLogo,
  seedStackLogosFromLocal,
} from '../../services/stackService';

const EMPTY_LOGO = {
  name: '',
  iconUrl: '',
  iconSvg: '',
  placeOnHero: false,
};

function StackForm({ logo, onChange, onIconChange, disabled }) {
  return (
    <>
      <label className="admin-form__field">
        <span>Nom</span>
        <input
          type="text"
          list="stack-logo-names"
          value={logo.name}
          onChange={(event) => onChange('name', event.target.value)}
          disabled={disabled}
          placeholder="Ex. Kubernetes"
        />
      </label>
      <label className="admin-form__check">
        <input
          type="checkbox"
          checked={Boolean(logo.placeOnHero)}
          onChange={(event) => onChange('placeOnHero', event.target.checked)}
          disabled={disabled}
        />
        <span>Afficher sous le Hello (hero)</span>
      </label>
      <p className="admin-form__hint">
        Si décoché, le logo apparaît en bas de la section À propos (pleine largeur).
      </p>
      <IconField
        iconUrl={logo.iconUrl ?? ''}
        iconSvg={logo.iconSvg ?? ''}
        onChange={onIconChange}
        folder="stack"
        disabled={disabled}
      />
    </>
  );
}

export default function AdminStack() {
  const { isAdmin } = useAuth();
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...EMPTY_LOGO });
  const [detailId, setDetailId] = useState(null);
  const [detailDraft, setDetailDraft] = useState(null);

  const suggestedNames = stackLogos.map((logo) => logo.name);

  const loadLogos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listStackLogos();
      setLogos(data);
    } catch {
      setLogos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogos();
  }, [loadLogos]);

  useEffect(() => {
    if (!detailId) return;
    const fresh = logos.find((logo) => logo.id === detailId);
    if (fresh) setDetailDraft({ ...fresh });
  }, [logos, detailId]);

  async function runAction(action) {
    if (!isAdmin) return;
    setBusy(true);
    setMessage(null);
    try {
      await action();
      await loadLogos();
    } catch {
      setMessage({ type: 'error', text: 'Opération impossible. Réessayez.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleSeed() {
    await runAction(async () => {
      const result = await seedStackLogosFromLocal();
      if (result.seeded) {
        setMessage({
          type: 'success',
          text: `${result.count} logos importés (SVG sérialisés dans Firestore).`,
        });
      } else if (result.backfilled > 0) {
        setMessage({
          type: 'success',
          text: `${result.backfilled} SVG ajoutés aux logos existants.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Les logos ont déjà une icône (SVG ou image).',
        });
      }
    });
  }

  function openDetail(logo) {
    setDetailId(logo.id);
    setDetailDraft({ ...logo });
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!createDraft.name.trim()) return;

    await runAction(async () => {
      const created = await createStackLogo({
        name: createDraft.name.trim(),
        order: logos.length,
        placeOnHero: Boolean(createDraft.placeOnHero),
        iconUrl: createDraft.iconUrl || undefined,
        iconSvg: createDraft.iconSvg || undefined,
      });
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_LOGO });
      setMessage({ type: 'success', text: 'Logo ajouté.' });
      openDetail(created);
    });
  }

  async function handleSaveDetail(event) {
    event.preventDefault();
    if (!detailDraft) return;

    await runAction(async () => {
      await saveStackLogo(detailDraft.id, detailDraft);
      setMessage({ type: 'success', text: `"${detailDraft.name}" enregistré.` });
    });
  }

  async function handleDeleteDetail() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.name} » ?`)) return;

    await runAction(async () => {
      await deleteStackLogo(detailDraft.id);
      closeDetail();
      setMessage({ type: 'success', text: 'Logo supprimé.' });
    });
  }

  async function handleMoveDetail(direction) {
    if (!detailDraft) return;
    const index = logos.findIndex((logo) => logo.id === detailDraft.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= logos.length) return;

    const current = logos[index];
    const target = logos[targetIndex];

    await runAction(async () => {
      await saveStackLogo(current.id, { ...current, order: target.order });
      await saveStackLogo(target.id, { ...target, order: current.order });
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  const detailIndex = detailDraft
    ? logos.findIndex((logo) => logo.id === detailDraft.id)
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
      <h1 className="admin-page__title">Stack (logos)</h1>
      <p className="admin-page__lead">
        Logos de la stack : cochez « Afficher sous le Hello » pour le hero, sinon ils
        apparaissent en bas de À propos sur toute la largeur. Chaque icône vient de
        Firestore (SVG ou fichier). Utilisez « Importer » une fois pour migrer les SVG
        locaux.
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
              setCreateDraft({ ...EMPTY_LOGO });
              setCreateOpen(true);
            }}
          >
            Ajouter un logo
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

      {logos.length === 0 ? (
        <p className="admin-page__lead">
          Aucun logo en Firestore. Importez les SVG locaux ou ajoutez un logo manuellement.
          Le hero reste vide tant qu&apos;aucune icône n&apos;est enregistrée.
        </p>
      ) : (
        <div className="admin-summary-grid">
          {logos.map((logo) => (
            <button
              key={logo.id}
              type="button"
              className="admin-summary-card admin-summary-card--compact"
              onClick={() => openDetail(logo)}
              disabled={!isAdmin}
            >
              <span
                className="admin-summary-card__swatch admin-summary-card__swatch--icon"
                style={{ background: 'var(--bg)' }}
              >
                <IconMedia iconSvg={logo.iconSvg} iconUrl={logo.iconUrl} alt={logo.name} />
              </span>
              <div>
                <h3 className="admin-summary-card__title">{logo.name}</h3>
                <p className="admin-summary-card__meta">
                  {logo.placeOnHero ? 'Hero' : 'À propos'}
                  {' · '}
                  {logo.iconSvg ? 'SVG' : logo.iconUrl ? 'Fichier' : 'Sans icône'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <datalist id="stack-logo-names">
        {suggestedNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <AdminModal
        open={createOpen}
        title="Nouveau logo"
        onClose={() => setCreateOpen(false)}
      >
        <form className="admin-form" onSubmit={handleCreate}>
          <StackForm
            logo={createDraft}
            onChange={(field, value) => {
              setCreateDraft((prev) => ({ ...prev, [field]: value }));
              setMessage(null);
            }}
            onIconChange={(icons) => {
              setCreateDraft((prev) => ({ ...prev, ...icons }));
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
        title={detailDraft?.name || 'Logo'}
        onClose={closeDetail}
      >
        {detailDraft ? (
          <form className="admin-form" onSubmit={handleSaveDetail}>
            <StackForm
              logo={detailDraft}
              onChange={(field, value) => {
                setDetailDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
                setMessage(null);
              }}
              onIconChange={(icons) => {
                setDetailDraft((prev) => (prev ? { ...prev, ...icons } : prev));
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
                disabled={!isAdmin || busy || detailIndex >= logos.length - 1}
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
