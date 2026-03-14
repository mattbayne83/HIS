import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'

interface AppState {
  // Auth
  user: User | null
  session: Session | null
  setAuth: (user: User | null, session: Session | null) => void
  clearAuth: () => void

  // UI
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      session: null,
      setAuth: (user, session) => set({ user, session }),
      clearAuth: () => set({ user: null, session: null }),

      // UI
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: 'his-storage',
      partialize: (state) => ({
        // Only persist UI prefs — auth comes from Supabase session
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
