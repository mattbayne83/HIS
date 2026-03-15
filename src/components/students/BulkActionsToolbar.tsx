import { X, FileDown, FileText, Image, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import type { Student } from '../../types/database'

export interface BulkActionsToolbarProps {
  selectedIds: Set<string>
  students: Student[]
  onClearSelection: () => void
  onExportCSV: (selectedStudents: Student[]) => void
  onExportPDF: (selectedStudents: Student[]) => void
  onExportPhotos: (selectedStudents: Student[]) => void
  onBulkDelete: (selectedStudents: Student[]) => void
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedIds,
  students,
  onClearSelection,
  onExportCSV,
  onExportPDF,
  onExportPhotos,
  onBulkDelete,
}) => {
  if (selectedIds.size === 0) return null

  const selectedStudents = students.filter((s) => selectedIds.has(s.id))
  const photosCount = selectedStudents.filter((s) => s.photo_url).length

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl border border-border/30 rounded-2xl px-5 py-3">
        <div className="flex items-center gap-3 whitespace-nowrap">
          {/* Selected Count - More Prominent */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              {selectedIds.size}
            </span>
          </div>

          {/* Divider */}
          <div className="h-7 w-px bg-border/60" />

          {/* Clear Button - Subtle */}
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text-high hover:bg-surface rounded-lg transition-all duration-200 shrink-0 whitespace-nowrap"
            title="Clear selection"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </button>

          {/* Divider */}
          <div className="h-7 w-px bg-border/60" />

          {/* Action Buttons - Grouped */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              onClick={() => onExportCSV(selectedStudents)}
              className="flex items-center gap-1.5 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <FileDown className="h-4 w-4" />
              <span className="font-medium">CSV</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => onExportPDF(selectedStudents)}
              className="flex items-center gap-1.5 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">PDF</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => onExportPhotos(selectedStudents)}
              disabled={photosCount === 0}
              className="flex items-center gap-1.5 shadow-sm hover:shadow-md whitespace-nowrap"
              title={
                photosCount === 0
                  ? 'No photos available in selection'
                  : `Download ${photosCount} photo${photosCount > 1 ? 's' : ''}`
              }
            >
              <Image className="h-4 w-4" />
              <span className="font-medium">
                Photos{photosCount > 0 && ` (${photosCount})`}
              </span>
            </Button>
          </div>

          {/* Divider */}
          <div className="h-7 w-px bg-border/60" />

          {/* Delete Button - Separated for Safety */}
          <Button
            variant="danger"
            onClick={() => onBulkDelete(selectedStudents)}
            className="flex items-center gap-1.5 shadow-sm hover:shadow-md shrink-0 whitespace-nowrap"
          >
            <Trash2 className="h-4 w-4" />
            <span className="font-medium">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BulkActionsToolbar
