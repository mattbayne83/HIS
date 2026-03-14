export interface PhotoMatch {
  file: File
  studentIndex: number | null // null if unmatched
  confidence: 'exact' | 'fuzzy' | 'manual'
}

/**
 * Normalize a string for name matching
 * Converts to lowercase, removes special characters, normalizes whitespace
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy name matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  // Initialize first column and row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Auto-match photos to students based on filename
 * Uses exact matching first, then fuzzy matching (Levenshtein distance < 3)
 * @param files - Array of photo files to match
 * @param students - Array of students with names
 * @returns Array of photo matches with confidence levels
 */
export function autoMatchPhotos(
  files: File[],
  students: Array<{ name: string }>
): PhotoMatch[] {
  return files.map((file) => {
    // Remove file extension from filename
    const filename = file.name.replace(/\.[^/.]+$/, '')
    const normalizedFilename = normalizeString(filename)

    // Try exact match
    const exactIndex = students.findIndex(
      (s) => normalizeString(s.name) === normalizedFilename
    )
    if (exactIndex !== -1) {
      return { file, studentIndex: exactIndex, confidence: 'exact' }
    }

    // Try fuzzy match (Levenshtein distance < 3)
    let bestMatch = -1
    let bestDistance = 3 // Only accept matches with distance < 3

    students.forEach((student, index) => {
      const distance = levenshteinDistance(
        normalizeString(student.name),
        normalizedFilename
      )
      if (distance < bestDistance) {
        bestDistance = distance
        bestMatch = index
      }
    })

    if (bestMatch !== -1) {
      return { file, studentIndex: bestMatch, confidence: 'fuzzy' }
    }

    // Unmatched
    return { file, studentIndex: null, confidence: 'manual' }
  })
}
