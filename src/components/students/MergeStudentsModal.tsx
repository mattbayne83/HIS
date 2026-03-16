import { useState } from 'react'
import { GitMerge } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import type { StudentWithLocation } from '../../types/database'
import { formatStudentLocation } from '../../utils/format'

export interface MergeStudentsModalProps {
  open: boolean
  onClose: () => void
  studentA: StudentWithLocation // "Kept" student (will remain active)
  studentB: StudentWithLocation // "Merged" student (will be marked as merged)
  onConfirmMerge: (
    keptId: string,
    mergedId: string,
    selections: Record<string, 'A' | 'B' | 'combine'>
  ) => Promise<void>
}

type FieldKey =
  | 'name'
  | 'age'
  | 'grade'
  | 'municipality_id' // Represents full location selection (province, district, municipality)
  | 'coordinator'
  | 'status'
  | 'photo_url'
  | 'notes'

const MergeStudentsModal: React.FC<MergeStudentsModalProps> = ({
  open,
  onClose,
  studentA,
  studentB,
  onConfirmMerge,
}) => {
  // Default to student A for all fields
  const [selections, setSelections] = useState<Record<FieldKey, 'A' | 'B' | 'combine'>>({
    name: 'A',
    age: 'A',
    grade: 'A',
    municipality_id: 'A', // Controls province_id, district_id, and municipality_id together
    coordinator: 'A',
    status: 'A',
    photo_url: 'A',
    notes: 'A',
  })

  const [combineNotes, setCombineNotes] = useState(false)
  const [merging, setMerging] = useState(false)

  const handleSelectionChange = (field: FieldKey, value: 'A' | 'B') => {
    setSelections((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMerge = async () => {
    setMerging(true)
    try {
      const finalSelections = { ...selections }

      // If combine notes is checked, override the selection
      if (combineNotes) {
        // This will be handled in the parent component by combining the notes
        finalSelections.notes = 'combine'
      }

      await onConfirmMerge(studentA.id, studentB.id, finalSelections)
      onClose()
    } catch (error) {
      console.error('Merge failed:', error)
    } finally {
      setMerging(false)
    }
  }

  const renderFieldRow = (
    _label: string,
    field: FieldKey,
    valueA: string | number | null,
    valueB: string | number | null
  ) => {
    const displayValueA = valueA ?? '(empty)'
    const displayValueB = valueB ?? '(empty)'
    const selected = selections[field]

    return (
      <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-4 items-center py-3 border-b border-border last:border-0">
        {/* Student A Value */}
        <div className="text-right">
          <span className={selected === 'A' ? 'font-medium text-text-high' : 'text-text-muted'}>
            {displayValueA}
          </span>
        </div>

        {/* Student A Radio */}
        <div>
          <input
            type="radio"
            name={field}
            checked={selected === 'A'}
            onChange={() => handleSelectionChange(field, 'A')}
            className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Student B Radio */}
        <div>
          <input
            type="radio"
            name={field}
            checked={selected === 'B'}
            onChange={() => handleSelectionChange(field, 'B')}
            className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Student B Value */}
        <div>
          <span className={selected === 'B' ? 'font-medium text-text-high' : 'text-text-muted'}>
            {displayValueB}
          </span>
        </div>
      </div>
    )
  }

  const renderPhotoRow = () => {
    const selected = selections.photo_url

    return (
      <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-4 items-center py-3 border-b border-border">
        {/* Student A Photo */}
        <div className="text-right flex justify-end">
          {studentA.photo_url ? (
            <img
              src={studentA.photo_url}
              alt={`${studentA.name} photo`}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-surface rounded-lg flex items-center justify-center text-text-muted text-sm">
              No photo
            </div>
          )}
        </div>

        {/* Student A Radio */}
        <div>
          <input
            type="radio"
            name="photo_url"
            checked={selected === 'A'}
            onChange={() => handleSelectionChange('photo_url', 'A')}
            className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Student B Radio */}
        <div>
          <input
            type="radio"
            name="photo_url"
            checked={selected === 'B'}
            onChange={() => handleSelectionChange('photo_url', 'B')}
            className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Student B Photo */}
        <div className="flex justify-start">
          {studentB.photo_url ? (
            <img
              src={studentB.photo_url}
              alt={`${studentB.name} photo`}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-surface rounded-lg flex items-center justify-center text-text-muted text-sm">
              No photo
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderNotesRow = () => {
    const notesA = studentA.notes || ''
    const notesB = studentB.notes || ''
    const combinedNotes = [notesA, notesB].filter(Boolean).join('\n\n---\n\n')

    return (
      <div className="py-3">
        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={combineNotes}
              onChange={(e) => setCombineNotes(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20 rounded"
            />
            <span className="text-sm font-medium text-text-high">
              Combine both notes
            </span>
          </label>
        </div>

        {combineNotes ? (
          <div>
            <p className="text-xs text-text-muted mb-2">Preview (combined):</p>
            <textarea
              value={combinedNotes}
              readOnly
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-high text-sm"
            />
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-4 items-start">
            {/* Student A Notes */}
            <div className="text-right">
              <textarea
                value={notesA}
                readOnly
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
                  selections.notes === 'A'
                    ? 'border-primary bg-primary/5 text-text-high'
                    : 'border-border bg-surface text-text-muted'
                }`}
              />
            </div>

            {/* Student A Radio */}
            <div className="pt-2">
              <input
                type="radio"
                name="notes"
                checked={selections.notes === 'A'}
                onChange={() => handleSelectionChange('notes', 'A')}
                className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Student B Radio */}
            <div className="pt-2">
              <input
                type="radio"
                name="notes"
                checked={selections.notes === 'B'}
                onChange={() => handleSelectionChange('notes', 'B')}
                className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Student B Notes */}
            <div>
              <textarea
                value={notesB}
                readOnly
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
                  selections.notes === 'B'
                    ? 'border-primary bg-primary/5 text-text-high'
                    : 'border-border bg-surface text-text-muted'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Merge Students" size="lg">
      <div className="space-y-6">
        <p className="text-sm text-text-muted">
          Select which values to keep for each field. The kept student will
          remain active, and the merged student will be marked as merged.
        </p>

        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-4 items-center pb-3 border-b-2 border-border">
          <div className="text-right font-semibold text-text-high">
            {studentA.name}
            <div className="text-xs text-text-muted font-normal mt-1">
              (Will be kept)
            </div>
          </div>
          <div className="text-xs text-text-muted">Keep</div>
          <div className="text-xs text-text-muted">Keep</div>
          <div className="font-semibold text-text-high">
            {studentB.name}
            <div className="text-xs text-text-muted font-normal mt-1">
              (Will be merged)
            </div>
          </div>
        </div>

        {/* Field Comparison */}
        <div className="space-y-0">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-high mb-3">
              Basic Information
            </h4>
            {renderFieldRow('Name', 'name', studentA.name, studentB.name)}
            {renderFieldRow('Age', 'age', studentA.age, studentB.age)}
            {renderFieldRow('Grade', 'grade', studentA.grade, studentB.grade)}
            {renderFieldRow(
              'Location',
              'municipality_id',
              formatStudentLocation(studentA) || '(none)',
              formatStudentLocation(studentB) || '(none)'
            )}
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-high mb-3">
              Additional Details
            </h4>
            {renderFieldRow(
              'Coordinator',
              'coordinator',
              studentA.coordinator,
              studentB.coordinator
            )}
            {renderFieldRow(
              'Status',
              'status',
              studentA.status,
              studentB.status
            )}
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-high mb-3">Photo</h4>
            {renderPhotoRow()}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-high mb-3">Notes</h4>
            {renderNotesRow()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose} disabled={merging}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleMerge}
            loading={merging}
            disabled={merging}
          >
            <GitMerge className="h-4 w-4 mr-2" />
            Confirm Merge
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default MergeStudentsModal
