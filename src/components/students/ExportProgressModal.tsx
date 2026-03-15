import Modal from '../ui/Modal'

export interface ExportProgressModalProps {
  open: boolean
  progress: number // 0-100
  total: number
  current: number
  operation: 'photos' | 'pdf'
}

const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  open,
  progress,
  total,
  current,
  operation,
}) => {
  const title = operation === 'photos' ? 'Exporting Photos...' : 'Generating PDFs...'
  const statusText =
    operation === 'photos'
      ? `Downloading photo ${current} of ${total}...`
      : `Generating PDF ${current} of ${total}...`

  return (
    <Modal open={open} onClose={() => {}} title={title} size="sm">
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <p className="text-sm text-text-muted text-center">{statusText}</p>

        {/* Percentage */}
        <p className="text-2xl font-semibold text-text-high text-center">
          {Math.round(progress)}%
        </p>
      </div>
    </Modal>
  )
}

export default ExportProgressModal
