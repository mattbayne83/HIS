import { createBrowserRouter, Navigate } from 'react-router'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthGuard } from './components/layout/AuthGuard'

// Public pages (eagerly loaded)
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import VssPage from './pages/public/VssPage'
import WomensTrainingPage from './pages/public/WomensTrainingPage'
import ArticlePage from './pages/public/ArticlePage'
import LoginPage from './pages/public/LoginPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'our-story', element: <AboutPage /> },
      { path: 'student-sponsorship', element: <VssPage /> },
      { path: 'womens-training', element: <WomensTrainingPage /> },
      { path: 'vss', element: <Navigate to="/student-sponsorship" replace /> },
      { path: 'news/:slug', element: <ArticlePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'reset-password',
        lazy: () => import('./pages/public/ResetPasswordRequestPage'),
      },
      {
        path: 'reset-password/confirm',
        lazy: () => import('./pages/public/ResetPasswordConfirmPage'),
      },
      {
        path: 'design-demo',
        lazy: () => import('./pages/public/DesignDemoPage'),
      },
    ],
  },
  {
    path: 'admin',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        lazy: () => import('./pages/admin/DashboardPage'),
      },
      {
        path: 'students',
        lazy: () => import('./pages/admin/StudentsPage'),
      },
      {
        path: 'students/bulk-upload',
        lazy: () => import('./pages/admin/BulkUploadPage'),
      },
      {
        path: 'students/:id',
        lazy: () => import('./pages/admin/StudentDetailPage'),
      },
      {
        path: 'donors',
        lazy: () => import('./pages/admin/DonorsPage'),
      },
      {
        path: 'sponsorships',
        lazy: () => import('./pages/admin/SponsorshipsPage'),
      },
      {
        path: 'donations',
        lazy: () => import('./pages/admin/DonationsPage'),
      },
      {
        path: 'articles',
        lazy: () => import('./pages/admin/ArticlesPage'),
      },
      {
        path: 'articles/new',
        lazy: () => import('./pages/admin/ArticleEditorPage'),
      },
      {
        path: 'articles/:id/edit',
        lazy: () => import('./pages/admin/ArticleEditorPage'),
      },
      {
        path: 'ministries',
        lazy: () => import('./pages/admin/MinistriesPage'),
      },
      {
        path: 'pdf',
        lazy: () => import('./pages/admin/PdfExportPage'),
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL, // Use Vite's BASE_URL for GitHub Pages
})
