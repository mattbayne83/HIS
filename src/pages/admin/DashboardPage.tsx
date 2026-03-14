export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-text-high">
        Admin Dashboard
      </h1>
      <p className="text-text-muted text-lg">
        Overview statistics, recent activity, and quick actions will be displayed here.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-text-muted text-sm uppercase tracking-wide mb-2">
            Total Students
          </p>
          <p className="font-display text-3xl text-text-high">--</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-text-muted text-sm uppercase tracking-wide mb-2">
            Active Sponsors
          </p>
          <p className="font-display text-3xl text-text-high">--</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-text-muted text-sm uppercase tracking-wide mb-2">
            Total Donations
          </p>
          <p className="font-display text-3xl text-text-high">--</p>
        </div>
      </div>
    </div>
  );
}

export { DashboardPage as Component };
