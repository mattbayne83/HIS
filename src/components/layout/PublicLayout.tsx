import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router'
import { Menu, X } from 'lucide-react'
import { ScrollToTop } from './ScrollToTop'

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
      <ScrollToTop />
      {/* Skip to Content Link - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur-md text-white shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="font-display text-xl sm:text-2xl font-semibold">
              Himali Indigenous Services
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative font-sans text-sm font-medium px-3 py-2 rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${
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
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            aria-hidden="true"
          />

          {/* Mobile Menu */}
          <nav className="fixed top-16 left-0 right-0 z-50 md:hidden bg-primary/95 backdrop-blur-md shadow-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 space-y-2">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${
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
        </>
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="text-center space-y-4">
            <p className="font-display text-2xl">Himali Indigenous Services</p>
            <p className="text-base text-white/80">
              <a
                href="mailto:info@his-serve.org"
                className="hover:text-secondary transition-colors underline decoration-white/30"
              >
                info@his-serve.org
              </a>
            </p>
            <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
              2073 Foster Circle, Cookeville, TN 38501<br />
              501(c)(3) Non-Profit
            </p>
          </div>
          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} Himali Indigenous Services
              <span className="mx-3">·</span>
              <Link to="/login" className="hover:text-white/70 transition-colors">
                Admin
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
