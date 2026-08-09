import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SECTION_LINKS = [
  { label: 'Profil', path: '/admin/site' },
  { label: 'Hero', path: '/admin/hero' },
  { label: 'Stack', path: '/admin/stack' },
  { label: 'À propos', path: '/admin/about' },
  { label: 'Certifications', path: '/admin/gallery' },
  { label: 'Expérience', path: '/admin/experience' },
  { label: 'Portfolio', path: '/admin/portfolio' },
  { label: 'Services', path: '/admin/services' },
  { label: 'Contact', path: '/admin/contact' },
];

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Bienvenue</h1>
      <p className="admin-page__lead">
        Connecté en tant que <strong>{user?.email}</strong>
        {isAdmin ? '' : ' (accès limité — admin non confirmé)'}
      </p>

      <section className="admin-section-list">
        <h2 className="admin-page__subtitle">Sections du site</h2>
        <ul>
          {SECTION_LINKS.map(({ label, path }) => (
            <li key={path}>
              <Link to={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
