import { useNavigate } from 'react-router'
import { GraduationCap, Link2, Heart } from 'lucide-react'
import { Card, LoadingSpinner } from '../../components/ui'
import MapWidget from '../../components/ui/MapWidget'
import { useQuery } from '../../hooks/useQuery'
import { getDashboardStats } from '../../lib/queries'

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  to,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  to: string
}) {
  const navigate = useNavigate()

  return (
    <Card>
      <button
        onClick={() => navigate(to)}
        className="flex items-center gap-4 w-full text-left transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-2xl font-semibold text-text-high">{value}</p>
        </div>
      </button>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: stats, loading, error } = useQuery(getDashboardStats)

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-high">
          Dashboard
        </h1>
        <Card>
          <p className="text-danger">Failed to load dashboard: {error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-display font-bold text-text-high">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Active Students"
          value={String(stats?.activeStudents ?? 0)}
          icon={GraduationCap}
          color="bg-primary"
          to="/admin/students"
        />
        <StatCard
          label="Active Sponsorships"
          value={String(stats?.activeSponsorships ?? 0)}
          icon={Link2}
          color="bg-success"
          to="/admin/sponsorships"
        />
        <StatCard
          label="Total Donors"
          value={String(stats?.totalDonors ?? 0)}
          icon={Heart}
          color="bg-secondary"
          to="/admin/donors"
        />
      </div>

      {/* Map */}
      <div className="space-y-3">
        <h2 className="text-2xl font-display font-semibold text-text-high">
          Student Locations
        </h2>
        <MapWidget
          locations={[]}
          height="400px"
          cluster={true}
          showControls={true}
        />
        <p className="text-sm text-text-muted italic">
          Map will display student locations by district (coming soon)
        </p>
      </div>
    </div>
  )
}

export { DashboardPage as Component }
