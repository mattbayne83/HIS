import { AlertTriangle, Eye, GitMerge, X } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import type { DuplicateCandidate } from '../../types/database'

export interface DuplicateWarningCardProps {
  duplicates: DuplicateCandidate[]
  onViewStudent: (studentId: string) => void
  onMerge: (studentId: string) => void
  onDismiss: () => void
}

const DuplicateWarningCard: React.FC<DuplicateWarningCardProps> = ({
  duplicates,
  onViewStudent,
  onMerge,
  onDismiss,
}) => {
  if (duplicates.length === 0) return null

  return (
    <Card className="bg-warning/5 border-warning/20 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-high mb-2">
              {duplicates.length === 1
                ? 'Potential Duplicate Found'
                : `${duplicates.length} Potential Duplicates Found`}
            </h3>
            <p className="text-sm text-text-muted mb-4">
              We found existing student(s) with similar information. Review to
              avoid creating duplicates.
            </p>

            <div className="space-y-3">
              {duplicates.map((duplicate) => (
                <div
                  key={duplicate.student.id}
                  className="p-3 bg-white rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-text-high truncate">
                          {duplicate.student.name}
                        </h4>
                        <span className="text-xs font-medium text-warning px-2 py-0.5 bg-warning/10 rounded-full flex-shrink-0">
                          {duplicate.matchScore}% match
                        </span>
                      </div>
                      <p className="text-sm text-text-muted mb-2">
                        Age {duplicate.student.age} • Grade{' '}
                        {duplicate.student.grade} • {duplicate.student.village},{' '}
                        {duplicate.student.region}
                      </p>
                      {duplicate.reasons.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {duplicate.reasons.map((reason, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewStudent(duplicate.student.id)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onMerge(duplicate.student.id)}
                      >
                        <GitMerge className="h-3.5 w-3.5 mr-1" />
                        Merge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="secondary" size="sm" onClick={onDismiss}>
                <X className="h-3.5 w-3.5 mr-1" />
                Ignore & Continue Anyway
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DuplicateWarningCard
