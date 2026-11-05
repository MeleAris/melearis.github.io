import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicSite from './pages/PublicSite';

// Le back-office (Firebase Auth/Storage/App Check + toutes les pages admin)
// est dans un chunk séparé : un visiteur du site public ne le télécharge pas.
const AdminArea = lazy(() => import('./pages/admin/AdminArea'));

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

function AdminFallback() {
  return (
    <div className="admin-loading">
      <p>Chargement…</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminArea />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
