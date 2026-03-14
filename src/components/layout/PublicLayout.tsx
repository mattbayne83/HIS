import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router'
import { Menu, X } from 'lucide-react'

const GIVE_URL = 'https://www.his-serve.org/give'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/our-story', label: 'Our Story' },
    { to: '/womens-training', label: "Women's Training" },
    { to: '/student-sponsorship', label: 'Student Sponsorship' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur-md text-white shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="font-display text-xl sm:text-2xl font-semibold">
              Himalayan Indigenous Services
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative font-sans text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'text-white bg-white/15 backdrop-blur-sm border-b-2 border-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <a
                href={GIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 font-sans text-sm font-semibold bg-white/90 hover:bg-white text-primary px-4 py-2 rounded-lg transition-all hover:shadow-lg"
              >
                Give
              </a>
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
                  end={to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/15 backdrop-blur-sm text-white border-l-4 border-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <a
                href={GIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg font-sans text-sm font-semibold bg-white/90 text-primary hover:bg-white transition-all"
              >
                Give
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-6">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-2">
          <p className="font-display text-lg">Himalayan Indigenous Services</p>
          <p className="text-sm text-white/70">
            <a href="mailto:info@his-serve.org" className="hover:text-secondary transition-colors">
              info@his-serve.org
            </a>
            <span className="mx-2">·</span>
            2073 Foster Circle, Cookeville, TN 38501
            <span className="mx-2">·</span>
            501(c)(3) Non-Profit
          </p>
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Himalayan Indigenous Services
            <span className="mx-2">·</span>
            <Link to="/login" className="hover:text-white/70 transition-colors">Admin</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
