import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * ScrollToTop component that scrolls to the top of the page on route changes.
 * Should be placed inside Router context (e.g., in layout components).
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
