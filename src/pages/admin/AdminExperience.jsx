import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { DEFAULT_EXPERIENCE_INTRO } from '../../constants/defaults/experience';
import { useAuth } from '../../context/AuthContext';
import {
  createExperience,
  createProject,
  deleteExperience,
  deleteProject,
  getExperienceIntro,
  listExperiences,
  listProjects,
  saveExperience,
  saveExperienceIntro,
  saveProject,
  seedExperiencesFromLocal,
} from '../../services/experienceService';
import { arrayToLines, arrayToTags, linesToArray, tagsToArray } from '../../utils/listFields';

const EMPTY_EXPERIENCE = {
  company: '',
  period: '',
  role: '',
  tagsText: '',
};

const EMPTY_PROJECT = {
  title: '',
  description: '',
  tasksText: '',
  tagsText: '',
};

function ExperienceForm({ experience, onChange, disabled }) {
  return (
    <>
      <label className="admin-form__field">
        <span>Entreprise</span>
        <input
          type="text"
          value={experience.company}
          onChange={(event) => onChange('company', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Période</span>
        <input
          type="text"
          value={experience.period}
          onChange={(event) => onChange('period', event.target.value)}
          disabled={disabled}
          placeholder="Jan 2024 – Present"
        />
      </label>
      <label className="admin-form__field">
        <span>Rôle</span>
        <input
          type="text"
          value={experience.role}
          onChange={(event) => onChange('role', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Tags (virgules)</span>
        <input
          type="text"
          value={experience.tagsText ?? ''}
          onChange={(event) => onChange('tagsText', event.target.value)}
          disabled={disabled}
          placeholder="**Tech Lead"
        />
      </label>
    </>
  );
}

function ProjectForm({ project, onChange, disabled }) {
  return (
    <>
      <label className="admin-form__field">
        <span>Titre</span>
        <input
          type="text"
          value={project.title}
          onChange={(event) => onChange('title', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Description</span>
        <textarea
          rows={2}
          value={project.description}
          onChange={(event) => onChange('description', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Tâches (une par ligne)</span>
        <textarea
          rows={4}
          value={project.tasksText ?? ''}
          onChange={(event) => onChange('tasksText', event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="admin-form__field">
        <span>Tags (virgules)</span>
        <input
          type="text"
          value={project.tagsText ?? ''}
          onChange={(event) => onChange('tagsText', event.target.value)}
          disabled={disabled}
        />
      </label>
    </>
  );
}

export default function AdminExperience() {
  const { isAdmin } = useAuth();
  const [intro, setIntro] = useState({ ...DEFAULT_EXPERIENCE_INTRO });
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [savingIntro, setSavingIntro] = useState(false);
  const [message, setMessage] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...EMPTY_EXPERIENCE });
  const [detailId, setDetailId] = useState(null);
  const [detailDraft, setDetailDraft] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const loadExperiences = useCallback(async () => {
    const data = await listExperiences();
    return data.filter((exp) => !String(exp.id).startsWith('default-'));
  }, []);

  const loadProjects = useCallback(async (experienceId) => {
    if (!experienceId) {
      setProjects([]);
      return;
    }
    const data = await listProjects(experienceId);
    setProjects(
      data.map((project) => ({
        ...project,
        tasksText: arrayToLines(project.tasks),
        tagsText: arrayToTags(project.tags),
      })),
    );
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [introData, expData] = await Promise.all([
        getExperienceIntro(),
        loadExperiences(),
      ]);
      setIntro(introData);
      setExperiences(
        expData.map((exp) => ({
          ...exp,
          tagsText: arrayToTags(exp.tags),
        })),
      );
    } catch {
      setIntro({ ...DEFAULT_EXPERIENCE_INTRO });
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  }, [loadExperiences]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (detailId) {
      loadProjects(detailId);
    } else {
      setProjects([]);
    }
  }, [detailId, loadProjects]);

  useEffect(() => {
    if (!detailId) return;
    const fresh = experiences.find((exp) => exp.id === detailId);
    if (fresh) setDetailDraft({ ...fresh });
  }, [experiences, detailId]);

  async function runAction(action) {
    if (!isAdmin) return;
    setBusy(true);
    setMessage(null);
    try {
      await action();
    } catch {
      setMessage({ type: 'error', text: 'Opération impossible. Réessayez.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveIntro(event) {
    event.preventDefault();
    if (!isAdmin) return;

    setSavingIntro(true);
    setMessage(null);
    try {
      const saved = await saveExperienceIntro(intro);
      setIntro(saved);
      setMessage({ type: 'success', text: 'Introduction enregistrée.' });
    } catch {
      setMessage({ type: 'error', text: 'Enregistrement impossible. Réessayez.' });
    } finally {
      setSavingIntro(false);
    }
  }

  async function handleSeed() {
    await runAction(async () => {
      const result = await seedExperiencesFromLocal();
      if (result.seeded) {
        setMessage({
          type: 'success',
          text: `${result.experienceCount} expériences et ${result.projectCount} projets importés.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'La collection contient déjà des expériences — import ignoré.',
        });
      }
      const expData = await loadExperiences();
      setExperiences(
        expData.map((exp) => ({
          ...exp,
          tagsText: arrayToTags(exp.tags),
        })),
      );
      closeDetail();
    });
  }

  function handleIntroChange(field) {
    return (event) => {
      setIntro((prev) => ({ ...prev, [field]: event.target.value }));
      setMessage(null);
    };
  }

  function openDetail(exp) {
    setDetailId(exp.id);
    setDetailDraft({ ...exp });
    setMessage(null);
  }

  function closeDetail() {
    setDetailId(null);
    setDetailDraft(null);
    setProjects([]);
    closeProjectModal();
  }

  function openProjectModal(project = null) {
    if (project) {
      setEditingProjectId(project.id);
      setProjectDraft({ ...project });
    } else {
      setEditingProjectId(null);
      setProjectDraft({ ...EMPTY_PROJECT });
    }
    setProjectModalOpen(true);
  }

  function closeProjectModal() {
    setProjectModalOpen(false);
    setProjectDraft(null);
    setEditingProjectId(null);
  }

  async function handleCreateExperience(event) {
    event.preventDefault();
    if (!createDraft.company.trim()) return;

    await runAction(async () => {
      const created = await createExperience({
        company: createDraft.company.trim(),
        period: createDraft.period.trim(),
        role: createDraft.role.trim(),
        tags: tagsToArray(createDraft.tagsText),
        order: experiences.length,
      });
      setCreateOpen(false);
      setCreateDraft({ ...EMPTY_EXPERIENCE });
      const expData = await loadExperiences();
      const mapped = expData.map((exp) => ({
        ...exp,
        tagsText: arrayToTags(exp.tags),
      }));
      setExperiences(mapped);
      setMessage({ type: 'success', text: 'Expérience ajoutée.' });
      openDetail({
        ...created,
        tagsText: arrayToTags(created.tags),
      });
    });
  }

  async function handleSaveDetail(event) {
    event.preventDefault();
    if (!detailDraft) return;

    await runAction(async () => {
      await saveExperience(detailDraft.id, {
        company: detailDraft.company,
        period: detailDraft.period,
        role: detailDraft.role,
        tags: tagsToArray(detailDraft.tagsText),
        order: detailDraft.order,
      });
      const expData = await loadExperiences();
      setExperiences(
        expData.map((exp) => ({
          ...exp,
          tagsText: arrayToTags(exp.tags),
        })),
      );
      setMessage({ type: 'success', text: `"${detailDraft.company}" enregistré.` });
    });
  }

  async function handleDeleteDetail() {
    if (!detailDraft) return;
    if (!window.confirm(`Supprimer « ${detailDraft.company} » et tous ses projets ?`)) return;

    await runAction(async () => {
      await deleteExperience(detailDraft.id);
      const expData = await loadExperiences();
      setExperiences(
        expData.map((exp) => ({
          ...exp,
          tagsText: arrayToTags(exp.tags),
        })),
      );
      closeDetail();
      setMessage({ type: 'success', text: 'Expérience supprimée.' });
    });
  }

  async function handleMoveDetail(direction) {
    if (!detailDraft) return;
    const index = experiences.findIndex((exp) => exp.id === detailDraft.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= experiences.length) return;

    const current = experiences[index];
    const target = experiences[targetIndex];

    await runAction(async () => {
      await saveExperience(current.id, {
        ...current,
        tags: tagsToArray(current.tagsText),
        order: target.order,
      });
      await saveExperience(target.id, {
        ...target,
        tags: tagsToArray(target.tagsText),
        order: current.order,
      });
      const expData = await loadExperiences();
      setExperiences(
        expData.map((exp) => ({
          ...exp,
          tagsText: arrayToTags(exp.tags),
        })),
      );
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  async function handleSaveProject(event) {
    event.preventDefault();
    if (!detailId || !projectDraft?.title.trim()) return;

    await runAction(async () => {
      if (editingProjectId) {
        await saveProject(editingProjectId, {
          experienceId: detailId,
          title: projectDraft.title,
          description: projectDraft.description,
          tasks: linesToArray(projectDraft.tasksText),
          tags: tagsToArray(projectDraft.tagsText),
          order: projectDraft.order,
        });
        setMessage({ type: 'success', text: `"${projectDraft.title}" enregistré.` });
      } else {
        await createProject({
          experienceId: detailId,
          title: projectDraft.title.trim(),
          description: projectDraft.description.trim(),
          tasks: linesToArray(projectDraft.tasksText),
          tags: tagsToArray(projectDraft.tagsText),
          order: projects.length,
        });
        setMessage({ type: 'success', text: 'Projet ajouté.' });
      }
      await loadProjects(detailId);
      closeProjectModal();
    });
  }

  async function handleDeleteProject() {
    if (!projectDraft || !editingProjectId) return;
    if (!window.confirm(`Supprimer le projet « ${projectDraft.title} » ?`)) return;

    await runAction(async () => {
      await deleteProject(editingProjectId);
      await loadProjects(detailId);
      closeProjectModal();
      setMessage({ type: 'success', text: 'Projet supprimé.' });
    });
  }

  async function handleMoveProject(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const current = projects[index];
    const target = projects[targetIndex];

    await runAction(async () => {
      await saveProject(current.id, {
        experienceId: detailId,
        title: current.title,
        description: current.description,
        tasks: linesToArray(current.tasksText),
        tags: tagsToArray(current.tagsText),
        order: target.order,
      });
      await saveProject(target.id, {
        experienceId: detailId,
        title: target.title,
        description: target.description,
        tasks: linesToArray(target.tasksText),
        tags: tagsToArray(target.tagsText),
        order: current.order,
      });
      await loadProjects(detailId);
      setMessage({ type: 'success', text: 'Ordre mis à jour.' });
    });
  }

  const detailIndex = detailDraft
    ? experiences.findIndex((exp) => exp.id === detailDraft.id)
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
      <h1 className="admin-page__title">Expérience</h1>
      <p className="admin-page__lead">
        Introduction de la section, parcours professionnel et projets associés à chaque
        expérience.
      </p>

      {!isAdmin ? (
        <p className="admin-form__error admin-page__warning">
          Accès administrateur requis pour enregistrer les modifications.
        </p>
      ) : null}

      <form className="admin-form admin-form--wide" onSubmit={handleSaveIntro}>
        <h2 className="admin-page__subtitle">Introduction</h2>
        <label className="admin-form__field">
          <span>Titre</span>
          <input
            type="text"
            value={intro.title}
            onChange={handleIntroChange('title')}
            disabled={!isAdmin || savingIntro}
            placeholder={DEFAULT_EXPERIENCE_INTRO.title}
          />
        </label>
        <RichTextEditor
          label="Texte"
          value={intro.body}
          onChange={(html) => {
            setIntro((prev) => ({ ...prev, body: html }));
            setMessage(null);
          }}
          disabled={!isAdmin || savingIntro}
          placeholder={DEFAULT_EXPERIENCE_INTRO.body}
        />
        <div className="admin-form__actions">
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={!isAdmin || savingIntro}
          >
            {savingIntro ? 'Enregistrement…' : 'Enregistrer l\'introduction'}
          </button>
        </div>
      </form>

      <section style={{ marginTop: '3rem' }}>
        <h2 className="admin-page__subtitle">Expériences</h2>

        <div className="admin-toolbar">
          <div className="admin-toolbar__actions">
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={!isAdmin || busy}
              onClick={() => {
                setCreateDraft({ ...EMPTY_EXPERIENCE });
                setCreateOpen(true);
              }}
            >
              Ajouter une expérience
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

        {experiences.length === 0 ? (
          <p className="admin-page__lead">
            Aucune expérience en Firestore. Les données de content.js s&apos;affichent sur le
            site public. Importez la liste locale ou ajoutez une expérience.
          </p>
        ) : (
          <div className="admin-summary-grid">
            {experiences.map((exp) => (
              <button
                key={exp.id}
                type="button"
                className="admin-summary-card"
                onClick={() => openDetail(exp)}
                disabled={!isAdmin}
              >
                <h3 className="admin-summary-card__title">{exp.company || 'Sans entreprise'}</h3>
                <p className="admin-summary-card__meta">{exp.role}</p>
                <p className="admin-summary-card__meta">{exp.period}</p>
                {exp.tagsText ? (
                  <p className="admin-summary-card__summary">{exp.tagsText}</p>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </section>

      <AdminModal
        open={createOpen}
        title="Nouvelle expérience"
        onClose={() => setCreateOpen(false)}
      >
        <form className="admin-form" onSubmit={handleCreateExperience}>
          <ExperienceForm
            experience={createDraft}
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
        title={detailDraft?.company || 'Expérience'}
        onClose={closeDetail}
        wide
      >
        {detailDraft ? (
          <>
            <form className="admin-form" onSubmit={handleSaveDetail}>
              <ExperienceForm
                experience={detailDraft}
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
                  disabled={!isAdmin || busy || detailIndex >= experiences.length - 1}
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

            <div className="admin-modal__subsection">
              <div className="admin-toolbar" style={{ marginBottom: '0.75rem' }}>
                <h3 className="admin-page__subtitle" style={{ margin: 0 }}>
                  Projets
                </h3>
                <div className="admin-toolbar__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    disabled={!isAdmin || busy}
                    onClick={() => openProjectModal()}
                  >
                    Ajouter un projet
                  </button>
                </div>
              </div>

              {projects.length === 0 ? (
                <p className="admin-page__lead">Aucun projet pour cette expérience.</p>
              ) : (
                <div className="admin-project-cards">
                  {projects.map((project, index) => (
                    <div key={project.id} style={{ display: 'grid', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="admin-project-card"
                        onClick={() => openProjectModal(project)}
                        disabled={!isAdmin}
                      >
                        <p className="admin-project-card__title">
                          {project.title || 'Sans titre'}
                        </p>
                        {project.description ? (
                          <p className="admin-summary-card__meta">{project.description}</p>
                        ) : null}
                      </button>
                      <div className="admin-form__actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          disabled={!isAdmin || busy || index === 0}
                          onClick={() => handleMoveProject(index, -1)}
                          aria-label="Monter le projet"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          disabled={!isAdmin || busy || index === projects.length - 1}
                          onClick={() => handleMoveProject(index, 1)}
                          aria-label="Descendre le projet"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </AdminModal>

      <AdminModal
        open={projectModalOpen}
        title={editingProjectId ? projectDraft?.title || 'Projet' : 'Nouveau projet'}
        onClose={closeProjectModal}
      >
        {projectDraft ? (
          <form className="admin-form" onSubmit={handleSaveProject}>
            <ProjectForm
              project={projectDraft}
              onChange={(field, value) => {
                setProjectDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
                setMessage(null);
              }}
              disabled={!isAdmin || busy}
            />
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={!isAdmin || busy}>
                {editingProjectId ? 'Enregistrer' : 'Créer'}
              </button>
              {editingProjectId ? (
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  disabled={!isAdmin || busy}
                  onClick={handleDeleteProject}
                >
                  Supprimer
                </button>
              ) : null}
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={busy}
                onClick={closeProjectModal}
              >
                Annuler
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
