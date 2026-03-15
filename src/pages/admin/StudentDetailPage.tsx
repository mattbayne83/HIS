import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Edit2, Save, X, User, FileText } from 'lucide-react'
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
import FileInput from '../../components/ui/FileInput'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import {
  getStudent,
  updateStudent,
  getStudentSponsorships,
  findPotentialDuplicates,
  mergeStudents,
} from '../../lib/queries'
import { uploadImage } from '../../lib/storage'
import { processImage } from '../../utils/imageProcessor'
import type { Student, StudentStatus, Sponsorship, DuplicateCandidate } from '../../types/database'
import { formatDateShort } from '../../utils/format'
import { exportStudentsToPDF } from '../../utils/exportUtils'
import DuplicateWarningCard from '../../components/students/DuplicateWarningCard'
import MergeStudentsModal from '../../components/students/MergeStudentsModal'
import MergeHistoryCard from '../../components/students/MergeHistoryCard'
import { rankDuplicates } from '../../utils/fuzzyMatch'

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

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Student>>({})
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([])
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [mergeTargetStudent, setMergeTargetStudent] = useState<Student | null>(null)

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
      photo_url: student.photo_url,
    })
    setPhotoFile(null) // Clear photo file when starting edit
    setDuplicates([]) // Clear duplicates when starting edit
    setEditing(true)
  }

  // Check for duplicate students
  async function checkForDuplicates() {
    if (!editing) return // Only check when editing

    // Need all required fields
    if (!form.name || !form.village || !form.region || !form.age) {
      setDuplicates([])
      return
    }

    try {
      const candidates = await findPotentialDuplicates(
        form.name,
        form.village,
        form.region,
        form.age,
        id // Exclude current student
      )

      const ranked = rankDuplicates(candidates, {
        name: form.name,
        village: form.village,
        region: form.region,
        age: form.age,
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
    if (!student) return

    try {
      const mergedBy = 'admin@his-serve.org' // TODO: Get from auth context

      // Build updates for kept student
      const keptUpdates: Partial<Student> = {}

      // Handle notes combination
      if (selections.notes === 'combine') {
        const mergedStudent = mergeTargetStudent
        if (student && mergedStudent) {
          const notesA = student.notes || ''
          const notesB = mergedStudent.notes || ''
          keptUpdates.notes = [notesA, notesB].filter(Boolean).join('\n\n---\n\n')
        }
      }

      await mergeStudents(keptId, mergedId, selections, keptUpdates, mergedBy)

      setShowMergeModal(false)
      setEditing(false)
      refetch()

      // Navigate to the kept student
      navigate(`/admin/students/${keptId}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to merge students')
      throw err
    }
  }

  async function handleSave() {
    if (!student) return
    setSaving(true)
    try {
      let updates = { ...form }

      // Upload photo if a new one was selected
      if (photoFile) {
        // Compress and resize the photo (max 800px, 85% quality, JPEG)
        const processedPhoto = await processImage(photoFile)
        const fileName = `${student.id}-${Date.now()}.jpg`
        const photoUrl = await uploadImage(processedPhoto, `students/${fileName}`)
        updates = { ...updates, photo_url: photoUrl }
      }

      await updateStudent(student.id, updates)
      setEditing(false)
      setPhotoFile(null)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handlePrint() {
    if (!student) return
    try {
      await exportStudentsToPDF([student])
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate PDF')
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
          <h1 className="text-4xl font-display font-bold text-text-high">
            {student.name}
          </h1>
          <Badge variant={STATUS_BADGE[student.status]} label={student.status} />
        </div>
        {!editing ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handlePrint}>
              <FileText className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="secondary" onClick={startEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
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
          <div className="space-y-4">
            {/* Duplicate Warning */}
            {duplicates.length > 0 && (
              <DuplicateWarningCard
                duplicates={duplicates}
                onViewStudent={(targetId) => {
                  setEditing(false)
                  navigate(`/admin/students/${targetId}`)
                }}
                onMerge={(targetId) => {
                  const targetStudent = duplicates.find((d) => d.student.id === targetId)?.student
                  if (targetStudent) {
                    setMergeTargetStudent(targetStudent)
                    setShowMergeModal(true)
                  }
                }}
                onDismiss={() => setDuplicates([])}
              />
            )}

            {/* Photo Upload */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Current Photo Preview */}
              <div className="flex-shrink-0">
                <div className="w-64 h-64 rounded-lg overflow-hidden bg-surface-alt border-2 border-secondary/20 flex items-center justify-center shadow-lg">
                  {form.photo_url || student?.photo_url ? (
                    <img
                      src={form.photo_url || student?.photo_url || ''}
                      alt={student?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-32 w-32 text-text-muted" />
                  )}
                </div>
              </div>

              {/* Photo Upload Field */}
              <div className="flex-1">
                <FileInput
                  label="Update Photo"
                  accept=".jpg,.jpeg,.png,.webp"
                  onFilesChange={(files) => setPhotoFile(files[0] || null)}
                  helperText="JPG, PNG, or WEBP (max 5MB)"
                  maxFiles={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                required
                value={form.name ?? ''}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }))
                  setDuplicates([]) // Clear duplicates when name changes
                }}
                onBlur={checkForDuplicates}
              />
              <Input
                label="Age"
                required
                type="number"
                value={String(form.age ?? '')}
                onChange={(e) => {
                  setForm((f) => ({ ...f, age: parseInt(e.target.value, 10) || 0 }))
                  setDuplicates([]) // Clear duplicates when age changes
                }}
                onBlur={checkForDuplicates}
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
                onChange={(e) => {
                  setForm((f) => ({ ...f, village: e.target.value }))
                  setDuplicates([]) // Clear duplicates when village changes
                }}
                onBlur={checkForDuplicates}
              />
              <Input
                label="Region"
                required
                value={form.region ?? ''}
                onChange={(e) => {
                  setForm((f) => ({ ...f, region: e.target.value }))
                  setDuplicates([]) // Clear duplicates when region changes
                }}
                onBlur={checkForDuplicates}
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
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Photo Display */}
            <div className="flex-shrink-0">
              <div className="w-80 h-80 rounded-lg overflow-hidden bg-surface-alt border-2 border-secondary/20 flex items-center justify-center shadow-lg">
                {student.photo_url ? (
                  <img
                    src={student.photo_url}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-40 w-40 text-text-muted" />
                )}
              </div>
            </div>

            {/* Student Details Card */}
            <div className="flex-1 space-y-6">
              <Card>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    ['Age', student.age],
                    ['Grade', student.grade],
                    ['Village', student.village],
                    ['Region', student.region],
                    ['Coordinator', student.coordinator || '—'],
                    ['Added', formatDateShort(student.created_at)],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <dt className="text-xs text-text-muted font-normal uppercase tracking-wide mb-1.5">
                        {label}
                      </dt>
                      <dd className="text-text-high font-semibold text-xl">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              {/* Notes Section */}
              {student.notes && (
                <Card>
                  <dt className="text-sm text-text-muted font-semibold uppercase tracking-wide mb-3">
                    Notes
                  </dt>
                  <dd className="text-text-high whitespace-pre-line leading-relaxed">
                    {student.notes}
                  </dd>
                </Card>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Sponsorship History */}
      <div className="space-y-3">
        <h2 className="text-2xl font-display font-semibold text-text-high">
          Sponsorship History
        </h2>
        <DataTable
          columns={sponsorColumns}
          data={sponsorships ?? []}
          emptyMessage="No sponsorships yet"
        />
      </div>

      {/* Merge History */}
      <MergeHistoryCard studentId={id!} />

      {/* Merge Students Modal */}
      {student && mergeTargetStudent && (
        <MergeStudentsModal
          open={showMergeModal}
          onClose={() => setShowMergeModal(false)}
          studentA={student}
          studentB={mergeTargetStudent}
          onConfirmMerge={handleConfirmMerge}
        />
      )}
    </div>
  )
}

export { StudentDetailPage as Component }
