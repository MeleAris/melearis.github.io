import { Link, NavLink, Outlet } from 'react-router-dom';
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

export default function AdminLayout() {
  const { logout, user } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__head">
          <p className="admin-sidebar__brand">Admin</p>
          {user?.email ? (
            <p className="admin-sidebar__user">{user.email}</p>
          ) : null}
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className="admin-nav__link">
            Tableau de bord
          </NavLink>
          {SECTION_LINKS.map(({ label, path }) => (
            <NavLink key={path} to={path} className="admin-nav__link">
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__actions">
          <Link to="/" className="admin-btn admin-btn--ghost">
            Voir le site
          </Link>
          <button type="button" className="admin-btn admin-btn--outline" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
