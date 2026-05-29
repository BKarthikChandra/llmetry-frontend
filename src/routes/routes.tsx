import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login';
import { ChatPage } from '../pages/Chat';
import { ProvidersPage } from '../pages/Providers';
import { AnalyticsPage } from '../pages/Analytics';
import { ProfilePage } from '../pages/Profile';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routePaths';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Authenticated shell — sidebar + outlet */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.CHAT} element={<ChatPage />} />
        <Route path={ROUTES.PROVIDERS} element={<ProvidersPage />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
