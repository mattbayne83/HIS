import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Button,
  Select,
  Modal,
  Badge,
  DataTable,
  LoadingSpinner,
  Card,
  Textarea,
  Input,
} from '../../components/ui'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import {
  getSponsorships,
  getStudents,
  getDonors,
  createSponsorship,
  updateSponsorship,
} from '../../lib/queries'
import type { Sponsorship, SponsorshipStatus } from '../../types/database'
import { formatDateShort } from '../../utils/format'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
]

export default function SponsorshipsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [createOpen, setCreateOpen] = useState(false)
  const [endConfirm, setEndConfirm] = useState<Sponsorship | null>(null)
  const [saving, setSaving] = useState(false)

  const [newDonorId, setNewDonorId] = useState('')
  const [newStudentId, setNewStudentId] = useState('')
  const [newStartDate, setNewStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [newNotes, setNewNotes] = useState('')

  const {
    data: sponsorships,
    loading,
    error,
    refetch,
  } = useQuery(
    () =>
      getSponsorships(
        statusFilter ? (statusFilter as SponsorshipStatus) : undefined
      ),
    [statusFilter]
  )

  const { data: students } = useQuery(() => getStudents('active'))
  const { data: donors } = useQuery(getDonors)

  const columns: DataTableColumn<Sponsorship>[] = [
    {
      key: 'donor',
      label: 'Donor',
      render: (_, row) => {
        const donor = row.donor as { name: string } | undefined
        return donor?.name ?? '—'
      },
    },
    {
      key: 'student',
      label: 'Student',
      render: (_, row) => {
        const student = row.student as { name: string; village: string } | undefined
        return student ? `${student.name} (${student.village})` : '—'
      },
    },
    {
      key: 'start_date',
      label: 'Start Date',
      sortable: true,
      render: (val) => formatDateShort(val as string),
    },
    {
      key: 'end_date',
      label: 'End Date',
      render: (val) => (val ? formatDateShort(val as string) : '—'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <Badge
          variant={row.status === 'active' ? 'success' : 'neutral'}
          label={row.status}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) =>
        row.status === 'active' ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setEndConfirm(row)
            }}
          >
            End
          </Button>
        ) : null,
    },
  ]

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newDonorId || !newStudentId) return
    setSaving(true)
    try {
      await createSponsorship({
        donor_id: newDonorId,
        student_id: newStudentId,
        start_date: newStartDate,
        end_date: null,
        status: 'active',
        notes: newNotes || null,
      })
      setCreateOpen(false)
      setNewDonorId('')
      setNewStudentId('')
      setNewNotes('')
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create sponsorship')
    } finally {
      setSaving(false)
    }
  }

  async function handleEnd() {
    if (!endConfirm) return
    try {
      await updateSponsorship(endConfirm.id, {
        status: 'ended',
        end_date: new Date().toISOString().split('T')[0],
      })
      setEndConfirm(null)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to end sponsorship')
    }
  }

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-text-high">
          Sponsorships
        </h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Sponsorship
        </Button>
      </div>

      {error && (
        <Card>
          <p className="text-danger">{error}</p>
        </Card>
      )}

      <div className="sm:w-48">
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={sponsorships ?? []}
        emptyMessage="No sponsorships found"
      />

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Sponsorship"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Donor"
            required
            placeholder="Select a donor"
            options={(donors ?? []).map((d) => ({
              value: d.id,
              label: d.name,
            }))}
            value={newDonorId}
            onChange={(e) => setNewDonorId(e.target.value)}
          />
          <Select
            label="Student"
            required
            placeholder="Select a student"
            options={(students ?? []).map((s) => ({
              value: s.id,
              label: `${s.name} — ${s.village}`,
            }))}
            value={newStudentId}
            onChange={(e) => setNewStudentId(e.target.value)}
          />
          <Input
            label="Start Date"
            type="date"
            required
            value={newStartDate}
            onChange={(e) => setNewStartDate(e.target.value)}
          />
          <Textarea
            label="Notes"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            rows={2}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create Sponsorship
            </Button>
          </div>
        </form>
      </Modal>

      {/* End Confirmation */}
      <Modal
        open={!!endConfirm}
        onClose={() => setEndConfirm(null)}
        title="End Sponsorship"
        size="sm"
      >
        <p className="text-text-high mb-6">
          Are you sure you want to end this sponsorship? Today's date will be
          recorded as the end date.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setEndConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleEnd}>
            End Sponsorship
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export { SponsorshipsPage as Component }
