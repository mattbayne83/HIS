import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useAppStore } from '../../store/useAppStore'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types/database'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const user = useAppStore((s) => s.user)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminAccess() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single<Profile>()

        if (error) {
          console.error('Error fetching profile:', error)
          setIsAdmin(false)
        } else {
          setIsAdmin(data?.role === 'admin')
        }
      } catch (error) {
        console.error('Profile check error:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-sm text-text-muted">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-lg p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-text-high mb-3">
            Unauthorized
          </h1>
          <p className="text-text-muted mb-6">
            You need admin access to view this page. Please contact an administrator
            if you believe this is an error.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-light transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
