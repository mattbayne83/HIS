export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate a student row from CSV import
 * Checks required fields and optional field formats
 * @param row - Raw CSV row data (all values are strings)
 * @returns Validation result with errors and warnings
 */
export function validateStudentRow(
  row: Record<string, string>
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields
  if (!row.name?.trim()) {
    errors.push('Name is required')
  }

  const age = parseInt(row.age, 10)
  if (isNaN(age)) {
    errors.push('Age must be a number')
  } else if (age < 4 || age > 18) {
    warnings.push('Age outside typical range (4-18)')
  }

  if (!row.grade?.trim()) {
    errors.push('Grade is required')
  }

  if (!row.village?.trim()) {
    errors.push('Village is required')
  }

  if (!row.region?.trim()) {
    errors.push('Region is required')
  }

  // Optional fields
  if (row.status && !['active', 'inactive', 'graduated', 'merged'].includes(row.status)) {
    errors.push('Status must be: active, inactive, graduated, or merged')
  }

  if (!row.coordinator?.trim()) {
    warnings.push('Coordinator not provided')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
