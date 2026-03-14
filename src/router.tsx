import { createBrowserRouter } from 'react-router'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthGuard } from './components/layout/AuthGuard'

// Public pages (eagerly loaded)
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ProgramsPage from './pages/public/ProgramsPage'
import VssPage from './pages/public/VssPage'
import NewsPage from './pages/public/NewsPage'
import ArticlePage from './pages/public/ArticlePage'
import DonatePage from './pages/public/DonatePage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/public/LoginPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'vss', element: <VssPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <ArticlePage /> },
      { path: 'donate', element: <DonatePage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
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
])
