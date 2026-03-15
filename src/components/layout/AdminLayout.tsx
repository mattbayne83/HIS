import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router'
import {
  LayoutDashboard,
  GraduationCap,
  Heart,
  Link2,
  Menu,
  X,
  LogOut,
  Home,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { signOut } from '../../lib/auth'
import { ScrollToTop } from './ScrollToTop'

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
    { to: '/admin/sponsorships', label: 'Sponsorships', icon: Link2 },
    { to: '/admin/donors', label: 'Donors', icon: Heart },
    // Hidden for now: Donations, Articles, Ministries (routes still exist, just not in nav)
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
      <ScrollToTop />
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-heavy text-neutral-800 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
          <h1 className="font-display text-2xl font-semibold text-primary">HIS Admin</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-primary-soft transition-all duration-200"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-primary" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02] -translate-y-0.5'
                    : 'text-neutral-600 hover:bg-primary-soft hover:text-primary hover:shadow-lg hover:shadow-primary/5'
                }`}
              >
                <Icon size={20} />
                <span className="text-base">{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Link */}
        <div className="px-3 py-4 border-t border-white/20">
          <Link
            to="/"
            onClick={() => {
              if (window.innerWidth < 1024) {
                toggleSidebar()
              }
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-100 hover:text-primary transition-all duration-200"
          >
            <Home size={20} />
            <span className="text-base">Return to HIS Site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 glass-medium border-b border-white/20 flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 rounded-xl hover:bg-primary-soft border border-white/30 transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="Open sidebar"
          >
            <Menu size={20} className="text-primary" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium text-neutral-600">
              {user?.email || 'Admin User'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 active:scale-95"
            >
              <LogOut size={18} />
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
