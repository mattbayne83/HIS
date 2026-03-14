import React, { useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { ValidationResult } from '../../utils/validation'

export interface ValidationPreviewRow {
  data: Record<string, string>
  validation: ValidationResult
}

export interface ValidationPreviewTableProps {
  rows: ValidationPreviewRow[]
  columns: string[]
}

const ValidationPreviewTable: React.FC<ValidationPreviewTableProps> = ({
  rows,
  columns,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  const getRowClassName = (validation: ValidationResult) => {
    if (validation.errors.length > 0) {
      return 'bg-danger/5 border-l-4 border-danger'
    }
    if (validation.warnings.length > 0) {
      return 'bg-warning/5 border-l-4 border-warning'
    }
    return 'bg-white border-l-4 border-transparent'
  }

  const getStatusIcon = (validation: ValidationResult) => {
    if (validation.errors.length > 0) {
      return (
        <div className="flex items-center gap-2 text-danger">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{validation.errors.length} error{validation.errors.length > 1 ? 's' : ''}</span>
        </div>
      )
    }
    if (validation.warnings.length > 0) {
      return (
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">{validation.warnings.length} warning{validation.warnings.length > 1 ? 's' : ''}</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2 text-success">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Valid</span>
      </div>
    )
  }

  // Sort rows: errors first, then warnings, then valid
  const sortedRows = [...rows].sort((a, b) => {
    const aScore = a.validation.errors.length > 0 ? 0 : a.validation.warnings.length > 0 ? 1 : 2
    const bScore = b.validation.errors.length > 0 ? 0 : b.validation.warnings.length > 0 ? 1 : 2
    return aScore - bScore
  })

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-surface border-b border-border">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-text-high">
              Status
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="text-left px-4 py-3 font-medium text-text-high capitalize"
              >
                {col}
              </th>
            ))}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, index) => {
            const isExpanded = expandedRows.has(index)
            const hasDetails =
              row.validation.errors.length > 0 ||
              row.validation.warnings.length > 0

            return (
              <React.Fragment key={index}>
                <tr
                  className={`${getRowClassName(row.validation)} border-b border-border transition-colors`}
                >
                  <td className="px-4 py-3">{getStatusIcon(row.validation)}</td>
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-text-high">
                      {row.data[col] || '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    {hasDetails && (
                      <button
                        onClick={() => toggleRowExpansion(index)}
                        className="p-1 hover:bg-surface rounded transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-text-muted" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-text-muted" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>

                {/* Expanded details row */}
                {isExpanded && hasDetails && (
                  <tr className={getRowClassName(row.validation)}>
                    <td colSpan={columns.length + 2} className="px-4 py-3">
                      <div className="space-y-2">
                        {row.validation.errors.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-danger mb-1">
                              Errors:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {row.validation.errors.map((error, idx) => (
                                <li key={idx} className="text-sm text-danger">
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {row.validation.warnings.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-warning mb-1">
                              Warnings:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {row.validation.warnings.map((warning, idx) => (
                                <li key={idx} className="text-sm text-warning">
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">No data to display</p>
        </div>
      )}
    </div>
  )
}

export default ValidationPreviewTable
