import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import type { Student } from '../../types/database'

export interface BulkDeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  students: Student[]
  onConfirm: () => Promise<void>
}

const BulkDeleteConfirmModal: React.FC<BulkDeleteConfirmModalProps> = ({
  open,
  onClose,
  students,
  onConfirm,
}) => {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Bulk delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  const displayNames = students.slice(0, 5).map((s) => s.name)
  const remainingCount = students.length - 5

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Delete ${students.length} Student${students.length > 1 ? 's' : ''}?`}
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-danger" />
          </div>
        </div>

        {/* Warning Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-text-muted">
            This action cannot be undone. Associated sponsorships will be
            orphaned.
          </p>
        </div>

        {/* Student List Preview */}
        <div className="bg-surface rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-text-muted uppercase">
            Students to be deleted:
          </p>
          <ul className="space-y-1">
            {displayNames.map((name, idx) => (
              <li key={idx} className="text-sm text-text-high">
                • {name}
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="text-sm text-text-muted italic">
                + {remainingCount} more student{remainingCount > 1 ? 's' : ''}
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={deleting}
            disabled={deleting}
          >
            Delete {students.length} Student{students.length > 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BulkDeleteConfirmModal
