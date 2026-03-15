import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Download, Upload } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import FileInput from '../../components/ui/FileInput'
import Modal from '../../components/ui/Modal'
import WizardSteps from '../../components/ui/WizardSteps'
import ValidationPreviewTable, {
  type ValidationPreviewRow,
} from '../../components/ui/ValidationPreviewTable'
import { parseCSV } from '../../utils/csv'
import { validateStudentRow } from '../../utils/validation'
import { autoMatchPhotos, type PhotoMatch } from '../../utils/photoMatcher'
import { processImages } from '../../utils/imageProcessor'
import { bulkCreateStudents } from '../../lib/queries'
import { uploadImage } from '../../lib/storage'
import type { Student, StudentStatus } from '../../types/database'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

interface StudentRow {
  name: string
  age: string
  grade: string
  village: string
  region: string
  coordinator?: string
  status?: string
  notes?: string
  photo_filename?: string
  [key: string]: string | undefined
}

const BulkUploadPage = () => {
  const navigate = useNavigate()

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0)

  // Step 1: CSV Upload state
  const [parsedRows, setParsedRows] = useState<StudentRow[]>([])
  const [validationRows, setValidationRows] = useState<ValidationPreviewRow[]>(
    []
  )
  const [csvError, setCsvError] = useState<string>()

  // Step 2: Photo Matching state
  const [photoMatches, setPhotoMatches] = useState<PhotoMatch[]>([])
  const [processingPhotos, setProcessingPhotos] = useState(false)
  const [processingProgress, setProcessingProgress] = useState<{
    current: number
    total: number
  } | null>(null)

  // Step 3: Review & Commit state
  const [importing, setImporting] = useState(false)
  const [importOnlyValid, setImportOnlyValid] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [importResult, setImportResult] = useState<{
    added: number
    skipped: number
  } | null>(null)

  // Step 1: Handle CSV upload
  const handleCsvUpload = async (files: File[]) => {
    if (files.length === 0) {
      setParsedRows([])
      setValidationRows([])
      setCsvError(undefined)
      return
    }

    const file = files[0]
    setCsvError(undefined)

    try {
      const { data, errors } = await parseCSV<StudentRow>(file)

      if (errors.length > 0) {
        setCsvError('CSV contains parsing errors. Please check the format.')
        return
      }

      if (data.length === 0) {
        setCsvError('CSV file is empty')
        return
      }

      // Check for required columns
      const requiredColumns = ['name', 'age', 'grade', 'village', 'region']
      const firstRow = data[0]
      const missingColumns = requiredColumns.filter((col) => !(col in firstRow))

      if (missingColumns.length > 0) {
        setCsvError(
          `CSV must include columns: ${missingColumns.join(', ')}`
        )
        return
      }

      setParsedRows(data)

      // Validate all rows - convert StudentRow to Record<string, string>
      const validated = data.map((row) => {
        // Convert undefined values to empty strings for validation and display
        const rowData: Record<string, string> = {
          name: row.name,
          age: row.age,
          grade: row.grade,
          village: row.village,
          region: row.region,
          coordinator: row.coordinator ?? '',
          status: row.status ?? '',
          notes: row.notes ?? '',
          photo_filename: row.photo_filename ?? '',
        }
        return {
          data: rowData,
          validation: validateStudentRow(rowData),
        }
      })

      setValidationRows(validated)
    } catch (error) {
      setCsvError('Unable to parse CSV. Please check the format.')
      console.error('CSV parse error:', error)
    }
  }

  // Step 2: Handle photo upload
  const handlePhotoUpload = async (files: File[]) => {
    if (files.length === 0) {
      setPhotoMatches([])
      return
    }

    // Process images (compress & resize)
    setProcessingPhotos(true)
    setProcessingProgress({ current: 0, total: files.length })

    try {
      const processed = await processImages(files, (current, total) => {
        setProcessingProgress({ current, total })
      })

      // Auto-match photos to students
      const matches = autoMatchPhotos(processed, parsedRows)
      setPhotoMatches(matches)
    } catch (error) {
      console.error('Photo processing error:', error)
    } finally {
      setProcessingPhotos(false)
      setProcessingProgress(null)
    }
  }

  // Manual photo assignment
  const handleManualAssignment = (photoIndex: number, studentIndex: number) => {
    const newMatches = [...photoMatches]
    newMatches[photoIndex] = {
      ...newMatches[photoIndex],
      studentIndex,
      confidence: 'manual',
    }
    setPhotoMatches(newMatches)
  }

  // Step 3: Commit import
  const handleCommit = async () => {
    setImporting(true)

    try {
      // Filter students based on import mode
      const studentsToImport = importOnlyValid
        ? validationRows.filter((row) => row.validation.valid)
        : validationRows

      // Upload photos and build student records
      const studentsWithPhotos: Omit<
        Student,
        'id' | 'created_at' | 'updated_at'
      >[] = []

      for (const row of studentsToImport) {
        // Find matching photo - use the index from validationRows which matches parsedRows order
        const rowIndex = validationRows.indexOf(row)
        const photoMatch = photoMatches.find(
          (m) => m.studentIndex === rowIndex
        )

        let photoUrl: string | null = null
        if (photoMatch) {
          try {
            // Upload photo to storage
            const timestamp = Date.now()
            const photoPath = `students/${timestamp}_${photoMatch.file.name}`
            photoUrl = await uploadImage(photoMatch.file, photoPath)
          } catch (error) {
            console.error('Photo upload failed:', error)
            // Continue without photo
          }
        }

        // Build student record
        studentsWithPhotos.push({
          name: row.data.name.trim(),
          age: parseInt(row.data.age, 10),
          grade: row.data.grade.trim(),
          village: row.data.village.trim(),
          region: row.data.region.trim(),
          coordinator: row.data.coordinator?.trim() || '',
          status: (row.data.status?.trim() as StudentStatus) || 'active',
          notes: row.data.notes?.trim() || null,
          photo_url: photoUrl,
          merged_into_id: null,
        })
      }

      // Batch insert
      await bulkCreateStudents(studentsWithPhotos)

      // Show success
      setImportResult({
        added: studentsWithPhotos.length,
        skipped: validationRows.length - studentsWithPhotos.length,
      })
      setShowSuccessModal(true)
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to import students. Please try again.'
      )
    } finally {
      setImporting(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    navigate('/admin/students')
  }

  // Navigation
  const canProceedStep1 = validationRows.some((row) => row.validation.valid)
  const canProceedStep2 = true // Photos are optional

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCancel = () => {
    navigate('/admin/students')
  }

  // Summary stats
  const validCount = validationRows.filter((r) => r.validation.valid).length
  const errorCount = validationRows.filter(
    (r) => r.validation.errors.length > 0
  ).length
  const warningCount = validationRows.filter(
    (r) => r.validation.warnings.length > 0 && r.validation.valid
  ).length
  const matchedPhotos = photoMatches.filter((m) => m.studentIndex !== null).length
  const unmatchedPhotos = photoMatches.filter((m) => m.studentIndex === null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-muted" />
        </button>
        <h1 className="text-4xl font-display font-bold text-text-high">
          Bulk Upload Students
        </h1>
      </div>

      {/* Wizard Steps */}
      <WizardSteps
        steps={['Upload CSV', 'Match Photos', 'Review']}
        currentStep={currentStep}
      />

      {/* Step 1: CSV Upload */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <Card>
            <FileInput
              accept=".csv"
              multiple={false}
              onFilesChange={handleCsvUpload}
              error={csvError}
              label="Upload CSV File"
              helperText="Expected columns: name, age, grade, village, region, coordinator, status, notes, photo_filename"
            />

            <div className="mt-4">
              <a
                href="/templates/student-import-template.csv"
                download
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Template CSV
              </a>
            </div>
          </Card>

          {validationRows.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-text-high mb-4">
                Preview ({parsedRows.length} rows)
              </h2>

              <div className="flex items-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-success">{validCount}</span>
                  <span className="text-text-muted">Valid</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-warning">
                    {warningCount}
                  </span>
                  <span className="text-text-muted">Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-danger">{errorCount}</span>
                  <span className="text-text-muted">Errors</span>
                </div>
              </div>

              <ValidationPreviewTable
                rows={validationRows}
                columns={['name', 'age', 'grade', 'village', 'region']}
              />
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={!canProceedStep1}>
              Next: Upload Photos
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Photo Matching */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <p className="text-sm text-text-muted mb-4">
              {validCount} students ready to import. Upload photos to match automatically.
            </p>

            <FileInput
              accept="image/*"
              multiple={true}
              onFilesChange={handlePhotoUpload}
              label="Upload Photos"
              helperText="Photos will be auto-compressed to 800px for PDF export"
            />

            {processingPhotos && processingProgress && (
              <div className="mt-4 text-center">
                <LoadingSpinner size="md" />
                <p className="text-sm text-text-muted mt-2">
                  Processing {processingProgress.current}/{processingProgress.total} photos...
                </p>
              </div>
            )}
          </Card>

          {photoMatches.length > 0 && (
            <>
              {/* Matched Photos */}
              <Card>
                <h2 className="text-lg font-semibold text-text-high mb-4">
                  Matched Photos ({matchedPhotos})
                </h2>
                <div className="space-y-2">
                  {photoMatches
                    .filter((m) => m.studentIndex !== null)
                    .map((match, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-success">✓</div>
                          <div>
                            <p className="text-sm font-medium text-text-high">
                              {match.file.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              → {parsedRows[match.studentIndex!].name}
                              {match.confidence === 'fuzzy' && ' (fuzzy match)'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              {/* Unmatched Photos */}
              {unmatchedPhotos.length > 0 && (
                <Card>
                  <h2 className="text-lg font-semibold text-text-high mb-4">
                    Unmatched Photos ({unmatchedPhotos.length})
                  </h2>
                  <p className="text-sm text-text-muted mb-4">
                    Manually assign these photos to students:
                  </p>
                  <div className="space-y-3">
                    {photoMatches
                      .filter((m) => m.studentIndex === null)
                      .map((match, matchIndex) => {
                        const photoIndex = photoMatches.indexOf(match)
                        return (
                          <div
                            key={matchIndex}
                            className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-text-high">
                                {match.file.name}
                              </p>
                            </div>
                            <Select
                              options={[
                                { value: '', label: 'Select student...' },
                                ...parsedRows.map((student, idx) => ({
                                  value: idx.toString(),
                                  label: student.name,
                                })),
                              ]}
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleManualAssignment(
                                    photoIndex,
                                    parseInt(e.target.value, 10)
                                  )
                                }
                              }}
                            />
                          </div>
                        )
                      })}
                  </div>
                </Card>
              )}
            </>
          )}

          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleBack}>
              ← Back
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleNext}>
                Skip Photos
              </Button>
              <Button onClick={handleNext} disabled={!canProceedStep2}>
                Next: Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review & Commit */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-text-high mb-4">
              Ready to Import
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                <p className="text-2xl font-bold text-success">{validCount}</p>
                <p className="text-sm text-text-muted">Valid Students</p>
              </div>
              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <p className="text-2xl font-bold text-warning">{warningCount}</p>
                <p className="text-sm text-text-muted">Warnings</p>
              </div>
              <div className="p-4 bg-danger/5 rounded-lg border border-danger/20">
                <p className="text-2xl font-bold text-danger">{errorCount}</p>
                <p className="text-sm text-text-muted">Errors</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-2xl font-bold text-primary">{matchedPhotos}</p>
                <p className="text-sm text-text-muted">Photos Matched</p>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-surface rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={importOnlyValid}
                onChange={(e) => setImportOnlyValid(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20 rounded"
              />
              <span className="text-sm text-text-high">
                Import only valid rows ({validCount} students)
              </span>
            </label>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-text-high mb-4">
              Preview
            </h2>
            <ValidationPreviewTable
              rows={validationRows}
              columns={['name', 'age', 'grade', 'village', 'region']}
            />
          </Card>

          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleBack}>
              ← Back
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleCommit}
                loading={importing}
                disabled={validCount === 0}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Students
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onClose={handleSuccessClose}
        title="Import Complete"
        size="md"
      >
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
            <Upload className="h-8 w-8 text-success" />
          </div>

          <h3 className="text-xl font-semibold text-text-high mb-2">
            Successfully Imported!
          </h3>

          {importResult && (
            <div className="space-y-2">
              <p className="text-success">
                ✓ {importResult.added} students added
              </p>
              {importResult.skipped > 0 && (
                <p className="text-warning">
                  ⚠ {importResult.skipped} rows skipped
                </p>
              )}
            </div>
          )}

          <Button onClick={handleSuccessClose} className="mt-6">
            View Students
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export { BulkUploadPage as Component }
