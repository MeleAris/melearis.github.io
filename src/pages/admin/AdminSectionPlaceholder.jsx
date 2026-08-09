import { useParams } from 'react-router-dom';

const SECTION_LABELS = {
  site: 'Profil',
  hero: 'Hero',
  stack: 'Stack',
  about: 'À propos',
  gallery: 'Certifications',
  experience: 'Expérience',
  portfolio: 'Portfolio',
  services: 'Services',
  contact: 'Contact',
};

export default function AdminSectionPlaceholder({ section: sectionProp }) {
  const { section: sectionParam } = useParams();
  const section = sectionProp || sectionParam || 'section';
  const label = SECTION_LABELS[section] || section;

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Édition de {label}</h1>
      <p className="admin-page__lead">À venir — l’éditeur pour cette section sera disponible prochainement.</p>
    </div>
  );
}
