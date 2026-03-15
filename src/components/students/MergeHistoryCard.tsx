import { useEffect, useState } from 'react'
import { GitMerge, Clock } from 'lucide-react'
import Card from '../ui/Card'
import LoadingSpinner from '../ui/LoadingSpinner'
import { getStudentMergeLog } from '../../lib/queries'
import type { StudentMergeLog } from '../../types/database'

export interface MergeHistoryCardProps {
  studentId: string
}

const MergeHistoryCard: React.FC<MergeHistoryCardProps> = ({ studentId }) => {
  const [loading, setLoading] = useState(true)
  const [mergeLog, setMergeLog] = useState<StudentMergeLog[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMergeLog() {
      setLoading(true)
      setError(null)
      try {
        const log = await getStudentMergeLog(studentId)
        setMergeLog(log)
      } catch (err) {
        console.error('Failed to fetch merge log:', err)
        setError('Failed to load merge history')
      } finally {
        setLoading(false)
      }
    }

    fetchMergeLog()
  }, [studentId])

  if (loading) {
    return (
      <Card>
        <h3 className="text-lg font-display font-semibold text-text-high mb-4">
          Merge History
        </h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <h3 className="text-lg font-display font-semibold text-text-high mb-4">
          Merge History
        </h3>
        <p className="text-sm text-danger">{error}</p>
      </Card>
    )
  }

  if (mergeLog.length === 0) {
    return null // Don't show the card if there's no merge history
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <GitMerge className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-display font-semibold text-text-high">
          Merge History
        </h3>
      </div>

      <div className="space-y-4">
        {mergeLog.map((entry) => {
          const mergeDate = new Date(entry.merged_at)
          const formattedDate = mergeDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          const formattedTime = mergeDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })

          // Parse field selections to show which fields were kept
          const fieldSelections = entry.field_selections || {}
          const keptFields = Object.entries(fieldSelections)
            .map(([field, value]) => {
              if (value === 'A') return `${field} (kept)`
              if (value === 'B') return `${field} (merged)`
              return null
            })
            .filter(Boolean)

          return (
            <div
              key={entry.id}
              className="p-4 bg-surface rounded-lg border border-border"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium text-text-high">
                      {formattedDate} at {formattedTime}
                    </span>
                  </div>

                  <p className="text-sm text-text-muted mb-2">
                    Merged student{' '}
                    <span className="font-medium text-text-high">
                      ID: {entry.merged_student_id.slice(0, 8)}...
                    </span>{' '}
                    into this record
                  </p>

                  <p className="text-xs text-text-muted">
                    By: {entry.merged_by}
                  </p>

                  {keptFields.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-medium text-text-muted mb-2">
                        Field Selections:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {keptFields.slice(0, 5).map((field, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                          >
                            {field}
                          </span>
                        ))}
                        {keptFields.length > 5 && (
                          <span className="text-xs px-2 py-1 bg-surface text-text-muted rounded">
                            +{keptFields.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default MergeHistoryCard
