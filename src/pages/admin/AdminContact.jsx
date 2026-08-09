import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import IconField from '../../components/admin/IconField';
import IconMedia from '../../components/IconMedia';
import { DEFAULT_CONTACT } from '../../constants/defaults/contact';
import { KNOWN_SOCIAL_LABELS } from '../../constants/socialIcons';
import { useAuth } from '../../context/AuthContext';
import {
  createSocialLink,
  deleteSocialLink,
  getContact,
  listSocialLinks,
  saveContact,
  saveSocialLink,
  seedSocialLinksFromLocal,
} from '../../services/contactService';

const EMPTY_LINK = {
  label: '',
  href: '',
  iconUrl: '',
  iconSvg: '',
};

function SocialLinkForm({ link, onChange, onIconChange, disabled }) {
  return (
    <>
      <label className="admin-form__field">
        <span>Libellé</span>
        <input
          type="text"
          list="social-labels"
          value={link.label}
          onChange={(event) => onChange('label', event.target.value)}
          disabled={disabled}
          placeholder="LinkedIn"
        />
      </label>
      <label className="admin-form__field">
        <span>URL</span>
        <input
          type="url"
          value={link.href}
          onChange={(event) => onChange('href', event.target.value)}
          disabled={disabled}
          placeholder="https://"
        />
      </label>
      <IconField
        iconUrl={link.iconUrl ?? ''}
        iconSvg={link.iconSvg ?? ''}
        onChange={onIconChange}
        folder="social"
        disabled={disabled}
      />
    </>
  );
}

export default function AdminContact() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({ ...DEFAULT_CONTACT });
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyLink, setBusyLink] = useState(false);
  const [message, setMessage] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...EMPTY_LINK });
  const [detailId, setDetailId] = useState(null);
  const [detailDraft, setDetailDraft] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [contactData, linksData] = await Promise.all([getContact(), listSocialLinks()]);
      setForm(contactData);
      setLinks(linksData);
    } catch {
      setForm({ ...DEFAULT_CONTACT });
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!detailId) return;
    const fresh = links.find((link) => link.id === detailId);
    if (fresh) setDetailDraft({ ...fresh });
  }, [links, detailId]);

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setMessage(null);
    };
  }

  async function handleSaveMain(event) {
    event.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    setMessage(null);

    try {
      const saved = await saveContact(form);
      setForm(saved);
      setMessage({ type: 'success', text: 'Textes de contact enregistrés.' });
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
      const saved = await saveContact(DEFAULT_CONTACT);
      setForm(saved);
      setMessage({ type: 'success', text: 'Valeurs par défaut restaurées.' });
    } catch {
      setMessage({ type: 'error', text: 'Réinitialisation impossible. Réessayez.' });
    } finally {
      setSaving(false);
    }
  }

  async function runLinkAction(action) {
    if (!isAdmin) return;
    setBusyLink(true);
    setMessage(null);
    try {
      await action();
      await loadData();
    } catch {
      setMessage({ type: 'error', text: 'Opération sur les liens impossible.' });
    } finally {
      setBusyLink(false);
    }
  }

  async function handleSeedLinks() {
    await runLinkAction(async () => {
      const result = await seedSocialLinksFromLocal();
      if (result.seeded) {
        setMessage({
          type: 'success',
          text: `${result.count} liens sociaux importés (SVG sérialisés dans Firestore).`,
        });
      } else if (result.backfilled > 0) {
        setMessage({
          type: 'success',
          text: `${result.backfilled} SVG ajoutés aux liens existants.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Les liens ont déjà une icône (SVG ou image).',
        });
      }
    });
  }

  function openDetail(link) {
    setDetailId(link.id);
    setDetailDraft({ ...link });
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
  }

  async function handleCreateLink(event) {
    event.preventDefault();
    if (!createDraft.label.trim() || !createDraft.href.trim()) return;

    await runLinkAction(async () => {
      const created = await createSocialLink({
        label: createDraft.label.trim(),
        href: createDraft.href.trim(),
        order: links.length,
        iconUrl: createDraft.iconUrl || undefined,
        iconSvg: createDraft.iconSvg || undefined,
      });
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_LINK });
      setMessage({ type: 'success', text: 'Lien ajouté.' });
      openDetail(created);
    });
  }

  async function handleSaveLinkDetail(event) {
    event.preventDefault();
    if (!detailDraft) return;

    await runLinkAction(async () => {
      await saveSocialLink(detailDraft.id, detailDraft);
      setMessage({ type: 'success', text: `"${detailDraft.label}" enregistré.` });
    });
  }

  async function handleDeleteLinkDetail() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.label} » ?`)) return;

    await runLinkAction(async () => {
      await deleteSocialLink(detailDraft.id);
      closeDetail();
      setMessage({ type: 'success', text: 'Lien supprimé.' });
    });
  }

  async function handleMoveLinkDetail(direction) {
    if (!detailDraft) return;
    const index = links.findIndex((link) => link.id === detailDraft.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= links.length) return;

    const current = links[index];
    const target = links[targetIndex];

    await runLinkAction(async () => {
      await saveSocialLink(current.id, { ...current, order: target.order });
      await saveSocialLink(target.id, { ...target, order: current.order });
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  const detailIndex = detailDraft
    ? links.findIndex((link) => link.id === detailDraft.id)
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
      <h1 className="admin-page__title">Contact</h1>
      <p className="admin-page__lead">
        Textes de la section contact et liens sociaux du pied de page. Le libellé du bouton
        CTA provient du profil site.
      </p>

      {!isAdmin ? (
        <p className="admin-form__error admin-page__warning">
          Accès administrateur requis pour enregistrer les modifications.
        </p>
      ) : null}

      <form className="admin-form admin-form--wide" onSubmit={handleSaveMain}>
        <h2 className="admin-page__subtitle">Textes de la section</h2>
        <label className="admin-form__field">
          <span>Eyebrow</span>
          <input
            type="text"
            value={form.eyebrow}
            onChange={handleChange('eyebrow')}
            disabled={!isAdmin || saving}
            placeholder={DEFAULT_CONTACT.eyebrow}
          />
        </label>
        <label className="admin-form__field">
          <span>Titre</span>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            disabled={!isAdmin || saving}
            placeholder={DEFAULT_CONTACT.title}
          />
        </label>
        <div className="admin-form__actions">
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={!isAdmin || saving}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer les textes'}
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

      <section style={{ marginTop: '3rem' }}>
        <h2 className="admin-page__subtitle">Liens sociaux</h2>
        <p className="admin-page__lead">
          Chaque icône provient de Firestore (SVG collé ou fichier uploadé). Utilisez
          « Importer » une fois pour migrer LinkedIn et WhatsApp.
        </p>

        <div className="admin-toolbar">
          <div className="admin-toolbar__actions">
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={!isAdmin || busyLink}
              onClick={() => {
                setCreateDraft({ ...EMPTY_LINK });
                setCreateOpen(true);
              }}
            >
              Ajouter un lien
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              disabled={!isAdmin || busyLink}
              onClick={handleSeedLinks}
            >
              Importer
            </button>
          </div>
        </div>

        {links.length === 0 ? (
          <p className="admin-page__lead">
            Aucun lien en Firestore. Importez les liens par défaut ou ajoutez-en manuellement.
            Le pied de page reste sans icônes tant qu&apos;aucun lien n&apos;est enregistré.
          </p>
        ) : (
          <div className="admin-summary-grid">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                className="admin-summary-card admin-summary-card--compact"
                onClick={() => openDetail(link)}
                disabled={!isAdmin}
              >
                <span
                  className="admin-summary-card__swatch admin-summary-card__swatch--icon"
                  style={{ background: 'var(--bg)' }}
                >
                  <IconMedia iconSvg={link.iconSvg} iconUrl={link.iconUrl} alt={link.label} />
                </span>
                <div>
                  <h3 className="admin-summary-card__title">{link.label}</h3>
                  <p className="admin-summary-card__meta">{link.href}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <datalist id="social-labels">
          {KNOWN_SOCIAL_LABELS.map((label) => (
            <option key={label} value={label} />
          ))}
        </datalist>
      </section>

      <AdminModal
        open={createOpen}
        title="Nouveau lien social"
        onClose={() => setCreateOpen(false)}
      >
        <form className="admin-form" onSubmit={handleCreateLink}>
          <SocialLinkForm
            link={createDraft}
            onChange={(field, value) => {
              setCreateDraft((prev) => ({ ...prev, [field]: value }));
              setMessage(null);
            }}
            onIconChange={(icons) => {
              setCreateDraft((prev) => ({ ...prev, ...icons }));
              setMessage(null);
            }}
            disabled={!isAdmin || busyLink}
          />
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={!isAdmin || busyLink}>
              Créer
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={busyLink}
              onClick={() => setCreateOpen(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(detailDraft)}
        title={detailDraft?.label || 'Lien social'}
        onClose={closeDetail}
      >
        {detailDraft ? (
          <form className="admin-form" onSubmit={handleSaveLinkDetail}>
            <SocialLinkForm
              link={detailDraft}
              onChange={(field, value) => {
                setDetailDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
                setMessage(null);
              }}
              onIconChange={(icons) => {
                setDetailDraft((prev) => (prev ? { ...prev, ...icons } : prev));
                setMessage(null);
              }}
              disabled={!isAdmin || busyLink}
            />
            <div className="admin-form__actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={!isAdmin || busyLink || detailIndex <= 0}
                onClick={() => handleMoveLinkDetail(-1)}
                aria-label="Monter"
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={!isAdmin || busyLink || detailIndex >= links.length - 1}
                onClick={() => handleMoveLinkDetail(1)}
                aria-label="Descendre"
              >
                ↓
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={!isAdmin || busyLink}
              >
                Enregistrer
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={!isAdmin || busyLink}
                onClick={handleDeleteLinkDetail}
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
