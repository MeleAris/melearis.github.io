import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from '../../components/admin/RequireAuth';
import { AuthProvider } from '../../context/AuthContext';
import { ensureAppCheck } from '../../lib/appCheck';
import AdminAbout from './AdminAbout';
import AdminContact from './AdminContact';
import AdminDashboard from './AdminDashboard';
import AdminExperience from './AdminExperience';
import AdminGallery from './AdminGallery';
import AdminHero from './AdminHero';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import AdminPortfolio from './AdminPortfolio';
import AdminSectionPlaceholder from './AdminSectionPlaceholder';
import AdminServices from './AdminServices';
import AdminSite from './AdminSite';
import AdminStack from './AdminStack';

// App Check (reCAPTCHA) est initialisé ici, donc uniquement quand le
// back-office est chargé — le site public n'en a pas besoin.
ensureAppCheck();

export default function AdminArea() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="site" element={<AdminSite />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="stack" element={<AdminStack />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path=":section" element={<AdminSectionPlaceholder />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
