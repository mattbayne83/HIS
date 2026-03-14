import { Users, Heart, HandCoins } from 'lucide-react'
import { Card, LoadingSpinner } from '../../components/ui'
import { useQuery } from '../../hooks/useQuery'
import { getDashboardStats } from '../../lib/queries'

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-2xl font-semibold text-text-high">{value}</p>
        </div>
      </div>
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
      <h1 className="text-2xl font-display font-semibold text-text-high">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Active Students"
          value={String(stats?.activeStudents ?? 0)}
          icon={Users}
          color="bg-primary"
        />
        <StatCard
          label="Active Sponsorships"
          value={String(stats?.activeSponsorships ?? 0)}
          icon={Heart}
          color="bg-success"
        />
        <StatCard
          label="Total Donors"
          value={String(stats?.totalDonors ?? 0)}
          icon={HandCoins}
          color="bg-secondary"
        />
      </div>
    </div>
  )
}

export { DashboardPage as Component }
