import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/admin/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import PublicSite from './pages/PublicSite';
import AdminAbout from './pages/admin/AdminAbout';
import AdminContact from './pages/admin/AdminContact';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminExperience from './pages/admin/AdminExperience';
import AdminGallery from './pages/admin/AdminGallery';
import AdminHero from './pages/admin/AdminHero';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminSectionPlaceholder from './pages/admin/AdminSectionPlaceholder';
import AdminServices from './pages/admin/AdminServices';
import AdminSite from './pages/admin/AdminSite';
import AdminStack from './pages/admin/AdminStack';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
