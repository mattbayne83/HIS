import { Outlet, NavLink, useLocation, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  GraduationCap,
  Heart,
  Link2,
  DollarSign,
  FileText,
  Building2,
  Printer,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { signOut } from '../../lib/auth'

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppStore((s) => s.user)
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const clearAuth = useAppStore((s) => s.clearAuth)

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/donors', label: 'Donors', icon: Heart },
    { to: '/admin/sponsorships', label: 'Sponsorships', icon: Link2 },
    { to: '/admin/donations', label: 'Donations', icon: DollarSign },
    { to: '/admin/articles', label: 'Articles', icon: FileText },
    { to: '/admin/ministries', label: 'Ministries', icon: Building2 },
    { to: '/admin/pdf', label: 'PDF Export', icon: Printer },
  ]

  const handleLogout = async () => {
    try {
      await signOut()
      clearAuth()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <h1 className="font-display text-xl font-semibold">HIS Admin</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-primary-light transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar()
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-light text-secondary'
                    : 'text-white/90 hover:bg-primary-light hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-surface-alt transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={20} className="text-text-high" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-text-muted">
              {user?.email || 'Admin User'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-high hover:bg-surface-alt transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
