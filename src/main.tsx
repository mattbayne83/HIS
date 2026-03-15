import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './styles/leaflet.css'
import { router } from './router'
import { supabase } from './lib/supabase'
import { useAppStore } from './store/useAppStore'
import { ErrorBoundary } from './components/ErrorBoundary'

// Listen for auth state changes and sync to Zustand
supabase.auth.onAuthStateChange((_event, session) => {
  useAppStore.getState().setAuth(session?.user ?? null, session)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
