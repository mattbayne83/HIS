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
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  findPotentialDuplicates,
  mergeStudents,
} from '../../lib/queries'
import type { Student, StudentStatus, DuplicateCandidate } from '../../types/database'
import DuplicateWarningCard from '../../components/students/DuplicateWarningCard'
import MergeStudentsModal from '../../components/students/MergeStudentsModal'
import BulkActionsToolbar from '../../components/students/BulkActionsToolbar'
import ExportProgressModal from '../../components/students/ExportProgressModal'
import BulkDeleteConfirmModal from '../../components/students/BulkDeleteConfirmModal'
import { rankDuplicates } from '../../utils/fuzzyMatch'
import { exportStudentsToCSV, exportStudentsToPDF, exportStudentPhotos } from '../../utils/exportUtils'

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

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([])
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [mergeTargetStudent, setMergeTargetStudent] = useState<Student | null>(null)

  // Bulk selection and export state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [exporting, setExporting] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [bulkDeleteStudents, setBulkDeleteStudents] = useState<Student[]>([])
  const [exportProgress, setExportProgress] = useState({
    current: 0,
    total: 0,
    operation: 'photos' as const,
  })

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
    setDuplicates([]) // Clear duplicates when opening modal
    setModalOpen(true)
  }

  // Check for duplicate students
  async function checkForDuplicates() {
    // Need all required fields to check
    if (!form.name || !form.village || !form.region || !form.age) {
      setDuplicates([])
      return
    }

    const age = parseInt(form.age, 10)
    if (isNaN(age)) {
      setDuplicates([])
      return
    }

    try {
      const candidates = await findPotentialDuplicates(
        form.name,
        form.village,
        form.region,
        age,
        editingStudent?.id // Exclude self when editing
      )

      const ranked = rankDuplicates(candidates, {
        name: form.name,
        village: form.village,
        region: form.region,
        age,
      })

      setDuplicates(ranked)
    } catch (err) {
      console.error('Duplicate detection failed:', err)
      setDuplicates([])
    }
  }

  // Handle merge confirmation
  async function handleConfirmMerge(
    keptId: string,
    mergedId: string,
    selections: Record<string, 'A' | 'B' | 'combine'>
  ) {
    try {
      // Get the current user's email (from auth context, for now use placeholder)
      const mergedBy = 'admin@his-serve.org' // TODO: Get from auth context

      // Build updates for kept student based on selections
      const keptUpdates: Partial<Student> = {}

      // Handle notes combination
      if (selections.notes === 'combine') {
        const keptStudent = mergeTargetStudent
        const mergedStudent = students?.find((s) => s.id === mergedId)
        if (keptStudent && mergedStudent) {
          const notesA = keptStudent.notes || ''
          const notesB = mergedStudent.notes || ''
          keptUpdates.notes = [notesA, notesB].filter(Boolean).join('\n\n---\n\n')
        }
      }

      // Call merge function
      await mergeStudents(keptId, mergedId, selections, keptUpdates, mergedBy)

      // Close modals and refresh
      setShowMergeModal(false)
      setModalOpen(false)
      refetch()

      // Navigate to the kept student's detail page
      navigate(`/admin/students/${keptId}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to merge students')
      throw err
    }
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

  // Bulk export handlers
  async function handleExportCSV(selectedStudents: Student[]) {
    try {
      await exportStudentsToCSV(selectedStudents)
      setSelectedIds(new Set()) // Clear selection after success
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export CSV')
    }
  }

  async function handleExportPDF(selectedStudents: Student[]) {
    try {
      await exportStudentsToPDF(selectedStudents)
      setSelectedIds(new Set()) // Clear selection after success
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export PDF')
    }
  }

  async function handleExportPhotos(selectedStudents: Student[]) {
    const withPhotos = selectedStudents.filter((s) => s.photo_url)

    if (withPhotos.length === 0) {
      alert('No photos to export (selected students have no photos)')
      return
    }

    if (withPhotos.length > 50) {
      if (
        !confirm(
          `You are about to download ${withPhotos.length} photos. This may take a while. Continue?`
        )
      ) {
        return
      }
    }

    setExporting(true)
    setExportProgress({ current: 0, total: withPhotos.length, operation: 'photos' })

    try {
      await exportStudentPhotos(withPhotos, (current, total) => {
        setExportProgress({ current, total, operation: 'photos' })
      })
      setSelectedIds(new Set()) // Clear selection after success
    } catch (err) {
      console.error('Photo export failed:', err)
      alert(err instanceof Error ? err.message : 'Failed to export photos')
    } finally {
      setExporting(false)
    }
  }

  async function handleBulkDelete(selectedStudents: Student[]) {
    setBulkDeleteStudents(selectedStudents)
    setShowBulkDeleteModal(true)
  }

  async function confirmBulkDelete() {
    let failedCount = 0

    for (const student of bulkDeleteStudents) {
      try {
        await deleteStudent(student.id)
      } catch (err) {
        console.error(`Failed to delete ${student.name}:`, err)
        failedCount++
      }
    }

    setShowBulkDeleteModal(false)
    setBulkDeleteStudents([])
    setSelectedIds(new Set())
    refetch()

    if (failedCount > 0) {
      alert(
        `${bulkDeleteStudents.length - failedCount} student(s) deleted. ${failedCount} failed.`
      )
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
        <h1 className="text-4xl font-display font-bold text-text-high">
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
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="relative flex-1 sm:min-w-[500px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, village, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="sm:w-56">
          <Select
            options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[42px]"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/admin/students/${row.id}`)}
        emptyMessage="No students found"
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duplicate Warning */}
          {duplicates.length > 0 && (
            <DuplicateWarningCard
              duplicates={duplicates}
              onViewStudent={(id) => {
                setModalOpen(false)
                navigate(`/admin/students/${id}`)
              }}
              onMerge={(id) => {
                const targetStudent = students?.find((s) => s.id === id)
                if (targetStudent) {
                  setMergeTargetStudent(targetStudent)
                  setShowMergeModal(true)
                }
              }}
              onDismiss={() => setDuplicates([])}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name"
              required
              value={form.name}
              onChange={(e) => {
                setField('name', e.target.value)
                setDuplicates([]) // Clear duplicates when name changes
              }}
              onBlur={checkForDuplicates}
            />
            <Input
              label="Age"
              required
              type="number"
              min={1}
              max={99}
              value={form.age}
              onChange={(e) => {
                setField('age', e.target.value)
                setDuplicates([]) // Clear duplicates when age changes
              }}
              onBlur={checkForDuplicates}
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
              onChange={(e) => {
                setField('village', e.target.value)
                setDuplicates([]) // Clear duplicates when village changes
              }}
              onBlur={checkForDuplicates}
            />
            <Input
              label="Region"
              required
              value={form.region}
              onChange={(e) => {
                setField('region', e.target.value)
                setDuplicates([]) // Clear duplicates when region changes
              }}
              onBlur={checkForDuplicates}
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

      {/* Merge Students Modal */}
      {mergeTargetStudent && (
        <MergeStudentsModal
          open={showMergeModal}
          onClose={() => setShowMergeModal(false)}
          studentA={{
            id: editingStudent?.id || 'new',
            name: form.name,
            age: parseInt(form.age, 10) || 0,
            grade: form.grade,
            village: form.village,
            region: form.region,
            coordinator: form.coordinator,
            status: form.status,
            notes: form.notes || null,
            photo_url: editingStudent?.photo_url || null,
            merged_into_id: null,
            created_at: '',
            updated_at: '',
          }}
          studentB={mergeTargetStudent}
          onConfirmMerge={handleConfirmMerge}
        />
      )}

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedIds={selectedIds}
        students={students ?? []}
        onClearSelection={() => setSelectedIds(new Set())}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        onExportPhotos={handleExportPhotos}
        onBulkDelete={handleBulkDelete}
      />

      {/* Export Progress Modal */}
      <ExportProgressModal
        open={exporting}
        progress={(exportProgress.current / exportProgress.total) * 100}
        total={exportProgress.total}
        current={exportProgress.current}
        operation={exportProgress.operation}
      />

      {/* Bulk Delete Confirmation Modal */}
      <BulkDeleteConfirmModal
        open={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        students={bulkDeleteStudents}
        onConfirm={confirmBulkDelete}
      />
    </div>
  )
}

export { StudentsPage as Component }
