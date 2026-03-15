export interface ChangelogEntry {
  version: string
  date: string
  title: string
  items: string[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: '1.1.0',
    date: '2026-03-14',
    title: 'Public Site Polish & SEO',
    items: [
      'Added SEO meta tags with react-helmet-async integration',
      'Page-specific titles and descriptions on all public pages',
      'Created branded NotFoundPage component with navigation options',
      'Fixed Vite base path configuration (conditional dev/prod)',
      'Resolved lazy-loaded admin route 404 errors in development',
      'Audited mobile image optimization (all images already responsive)',
      'Created lessons.md to capture configuration best practices',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-14',
    title: 'Initial Release',
    items: [
      'VSS Field Data Management (Features 1, 3, 4 complete)',
      'Bulk CSV/photo upload with compression and validation',
      'Duplicate detection with fuzzy matching and merge workflow',
      'Bulk select and export (CSV, PDF profile cards, photo ZIP)',
      'Design system polish (3.8/5 → 4.4/5 across all dimensions)',
      'Hero CTA hierarchy, spacing scale audit, footer redesign',
      'Accessibility improvements (skip-to-content, focus-visible states)',
      'Button shadow consistency, glassmorphism variant naming',
      'Typography hierarchy upgrade across admin pages',
      'Dashboard stat cards made clickable with navigation',
      'Student detail page photo sizing optimized',
      'Sponsorships page search added',
      'PDF export branded design with client-side generation',
      'Password reset flow (request + confirm pages)',
      'Donations CRUD page with currency formatting',
      'ErrorBoundary integration for global error catching',
      'Database setup verification script and documentation',
      'GitHub Pages deployment with auto-deploy workflow',
      'Supabase integration (DB, Auth, Storage with RLS)',
      'Admin layout with responsive sidebar navigation',
      'Public site (HomePage, AboutPage, VssPage, WomensTrainingPage)',
      'Students, Donors, Sponsorships CRUD operations',
      'Articles and Ministries management (hidden from nav)',
      'Nepal-inspired design system (Crimson Red, Mountain Bronze, Temple Gold)',
      'Glassmorphic UI components (Card, Button, Modal, DataTable)',
    ],
  },
]
