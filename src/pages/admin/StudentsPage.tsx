import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Search, Upload } from 'lucide-react'
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  Modal,
  Badge,
  DataTable,
  LoadingSpinner,
} from '../../components/ui'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../lib/queries'
import type { Student, StudentStatus } from '../../types/database'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'graduated', label: 'Graduated' },
  { value: 'merged', label: 'Merged' },
]

const STATUS_BADGE: Record<StudentStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  inactive: 'warning',
  graduated: 'neutral',
  merged: 'neutral',
}

type StudentFormData = {
  name: string
  age: string
  grade: string
  village: string
  region: string
  coordinator: string
  status: StudentStatus
  notes: string
}

const emptyForm: StudentFormData = {
  name: '',
  age: '',
  grade: '',
  village: '',
  region: '',
  coordinator: '',
  status: 'active',
  notes: '',
}

export default function StudentsPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [form, setForm] = useState<StudentFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Student | null>(null)

  const {
    data: students,
    loading,
    error,
    refetch,
  } = useQuery(
    () => getStudents(statusFilter ? (statusFilter as StudentStatus) : undefined),
    [statusFilter]
  )

  const filtered = (students ?? []).filter((s) =>
    search
      ? s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.village.toLowerCase().includes(search.toLowerCase()) ||
        s.region.toLowerCase().includes(search.toLowerCase())
      : true
  )

  const columns: DataTableColumn<Student>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'grade', label: 'Grade', sortable: true },
    { key: 'village', label: 'Village', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'coordinator', label: 'Coordinator', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_, row) => (
        <Badge variant={STATUS_BADGE[row.status]} label={row.status} />
      ),
    },
  ]

  function openCreate() {
    setEditingStudent(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        age: parseInt(form.age, 10),
        grade: form.grade,
        village: form.village,
        region: form.region,
        coordinator: form.coordinator,
        status: form.status,
        notes: form.notes || null,
        photo_url: editingStudent?.photo_url ?? null,
        merged_into_id: editingStudent?.merged_into_id ?? null,
      }

      if (editingStudent) {
        await updateStudent(editingStudent.id, payload)
      } else {
        await createStudent(payload)
      }

      setModalOpen(false)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save student')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    try {
      await deleteStudent(deleteConfirm.id)
      setDeleteConfirm(null)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student')
    }
  }

  function setField(key: keyof StudentFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
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
          Students
        </h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/admin/students/bulk-upload')}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <p className="text-danger">{error}</p>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, village, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Select
          options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-48"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/admin/students/${row.id}`)}
        emptyMessage="No students found"
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name"
              required
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            <Input
              label="Age"
              required
              type="number"
              min={1}
              max={99}
              value={form.age}
              onChange={(e) => setField('age', e.target.value)}
            />
            <Input
              label="Grade"
              required
              value={form.grade}
              onChange={(e) => setField('grade', e.target.value)}
            />
            <Input
              label="Village"
              required
              value={form.village}
              onChange={(e) => setField('village', e.target.value)}
            />
            <Input
              label="Region"
              required
              value={form.region}
              onChange={(e) => setField('region', e.target.value)}
            />
            <Input
              label="Coordinator"
              value={form.coordinator}
              onChange={(e) => setField('coordinator', e.target.value)}
            />
            <Select
              label="Status"
              required
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(e) => setField('status', e.target.value)}
            />
          </div>
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              {editingStudent && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setModalOpen(false)
                    setDeleteConfirm(editingStudent)
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editingStudent ? 'Save Changes' : 'Add Student'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Student"
        size="sm"
      >
        <p className="text-text-high mb-6">
          Are you sure you want to delete{' '}
          <strong>{deleteConfirm?.name}</strong>? This will also remove all
          associated sponsorships and cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export { StudentsPage as Component }
