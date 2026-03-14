import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Edit2, Save, X } from 'lucide-react'
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  Badge,
  LoadingSpinner,
  DataTable,
} from '../../components/ui'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import {
  getStudent,
  updateStudent,
  getStudentSponsorships,
} from '../../lib/queries'
import type { Student, StudentStatus, Sponsorship } from '../../types/database'
import { formatDateShort } from '../../utils/format'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'graduated', label: 'Graduated' },
]

const STATUS_BADGE: Record<StudentStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  inactive: 'warning',
  graduated: 'neutral',
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Student>>({})

  const {
    data: student,
    loading,
    error,
    refetch,
  } = useQuery(() => getStudent(id!), [id])

  const { data: sponsorships } = useQuery(
    () => getStudentSponsorships(id!),
    [id]
  )

  function startEdit() {
    if (!student) return
    setForm({
      name: student.name,
      age: student.age,
      grade: student.grade,
      village: student.village,
      region: student.region,
      coordinator: student.coordinator,
      status: student.status,
      notes: student.notes,
    })
    setEditing(true)
  }

  async function handleSave() {
    if (!student) return
    setSaving(true)
    try {
      await updateStudent(student.id, form)
      setEditing(false)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const sponsorColumns: DataTableColumn<Sponsorship>[] = [
    {
      key: 'donor',
      label: 'Donor',
      render: (_, row) => {
        const donor = row.donor as { name: string; email: string } | undefined
        return donor?.name ?? '—'
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
  ]

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/students')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <p className="text-danger">{error ?? 'Student not found'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/students')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-display font-semibold text-text-high">
            {student.name}
          </h1>
          <Badge variant={STATUS_BADGE[student.status]} label={student.status} />
        </div>
        {!editing ? (
          <Button variant="secondary" onClick={startEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name"
              required
              value={form.name ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Age"
              required
              type="number"
              value={String(form.age ?? '')}
              onChange={(e) =>
                setForm((f) => ({ ...f, age: parseInt(e.target.value, 10) || 0 }))
              }
            />
            <Input
              label="Grade"
              required
              value={form.grade ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
            />
            <Input
              label="Village"
              required
              value={form.village ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))}
            />
            <Input
              label="Region"
              required
              value={form.region ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            />
            <Input
              label="Coordinator"
              value={form.coordinator ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, coordinator: e.target.value }))
              }
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status ?? 'active'}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as StudentStatus,
                }))
              }
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Notes"
                value={form.notes ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={3}
              />
            </div>
          </div>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {[
              ['Age', student.age],
              ['Grade', student.grade],
              ['Village', student.village],
              ['Region', student.region],
              ['Coordinator', student.coordinator || '—'],
              ['Added', formatDateShort(student.created_at)],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-sm text-text-muted">{label}</dt>
                <dd className="text-text-high font-medium">{String(value)}</dd>
              </div>
            ))}
            {student.notes && (
              <div className="sm:col-span-2 lg:col-span-3">
                <dt className="text-sm text-text-muted">Notes</dt>
                <dd className="text-text-high whitespace-pre-line">
                  {student.notes}
                </dd>
              </div>
            )}
          </dl>
        )}
      </Card>

      {/* Sponsorship History */}
      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold text-text-high">
          Sponsorship History
        </h2>
        <DataTable
          columns={sponsorColumns}
          data={sponsorships ?? []}
          emptyMessage="No sponsorships yet"
        />
      </div>
    </div>
  )
}

export { StudentDetailPage as Component }
