import { useState } from 'react'
import { Outlet, NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/vss', label: 'Village Schools' },
    { to: '/news', label: 'News' },
    { to: '/donate', label: 'Donate' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="font-display text-xl sm:text-2xl font-semibold">
              Himalayan Indigenous Services
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `font-sans text-sm font-medium transition-colors hover:text-secondary ${
                      isActive ? 'text-secondary' : 'text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-primary-light transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-light text-secondary'
                        : 'text-white hover:bg-primary-light'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-3">
                Himalayan Indigenous Services
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Facilitating transformation in Nepal through local partnerships,
                education, and community development.
              </p>
              <p className="text-xs text-white/60 mt-3">
                501(c)(3) Non-Profit Organization
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className="text-sm text-white/80 hover:text-secondary transition-colors"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-3">Contact</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                For more information or to support our mission, please reach out through
                our contact page.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm text-white/60">
            <p>&copy; {new Date().getFullYear()} Himalayan Indigenous Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
