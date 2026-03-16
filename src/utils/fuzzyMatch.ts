import type { Student, DuplicateCandidate } from '../types/database'

/**
 * Calculate Levenshtein distance between two strings
 * (Edit distance - minimum number of single-character edits needed)
 * @param a - First string
 * @param b - Second string
 * @returns Number of edits required
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  // Initialize matrix
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
 * Normalize string for comparison (lowercase, remove special chars)
 * @param str - String to normalize
 * @returns Normalized string
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Calculate match score between a candidate student and input form data
 * @param candidate - Existing student from database
 * @param input - Form input data
 * @returns Match score (0-100)
 */
export function calculateMatchScore(
  candidate: Student,
  input: {
    name: string
    municipality_id: number | null
    district_id: number | null
    age: number
  }
): number {
  const normCandidateName = normalizeString(candidate.name)
  const normInputName = normalizeString(input.name)

  // Check exact matches
  const exactNameMatch = normCandidateName === normInputName
  const exactMunicipalityMatch =
    input.municipality_id !== null &&
    candidate.municipality_id === input.municipality_id
  const exactDistrictMatch =
    input.district_id !== null && candidate.district_id === input.district_id
  const exactAgeMatch = candidate.age === input.age

  // Calculate Levenshtein distance for name
  const nameDistance = levenshteinDistance(normCandidateName, normInputName)
  const ageDifference = Math.abs(candidate.age - input.age)

  // Scoring algorithm (updated for location hierarchy)
  if (exactNameMatch && exactMunicipalityMatch && exactAgeMatch) {
    // Exact match on all core fields
    return 95
  }

  if (nameDistance <= 2 && exactMunicipalityMatch && ageDifference <= 1) {
    // Very close name + same municipality + age within 1 year
    return 85
  }

  if (nameDistance <= 3 && exactMunicipalityMatch && ageDifference <= 1) {
    // Close name + same municipality + age within 1 year
    return 75
  }

  if (exactNameMatch && exactMunicipalityMatch && ageDifference <= 2) {
    // Exact name + municipality but different age
    return 70
  }

  if (nameDistance <= 3 && exactMunicipalityMatch && ageDifference <= 2) {
    // Similar name + same municipality + age within 2 years
    return 65
  }

  if (exactNameMatch && exactDistrictMatch && ageDifference <= 1) {
    // Exact name + same district (different/no municipality) + similar age
    return 60
  }

  // Below threshold - consider location match even if no exact municipality
  const locationBonus = exactMunicipalityMatch ? 20 : exactDistrictMatch ? 10 : 0
  return Math.max(0, 50 - nameDistance * 10 - ageDifference * 5 + locationBonus)
}

/**
 * Rank and filter duplicate candidates
 * @param candidates - Array of potential duplicates from database
 * @param input - Form input data
 * @returns Sorted array of duplicates with match scores >= 60%
 */
export function rankDuplicates(
  candidates: Student[],
  input: {
    name: string
    municipality_id: number | null
    district_id: number | null
    age: number
  }
): DuplicateCandidate[] {
  const THRESHOLD = 60 // Minimum match score percentage

  // Calculate scores and filter
  const rankedCandidates: DuplicateCandidate[] = candidates
    .map((candidate) => {
      const matchScore = calculateMatchScore(candidate, input)
      const reasons: string[] = []

      // Generate reasons for match
      const normCandidateName = normalizeString(candidate.name)
      const normInputName = normalizeString(input.name)
      const nameDistance = levenshteinDistance(normCandidateName, normInputName)

      if (normCandidateName === normInputName) {
        reasons.push('Exact name match')
      } else if (nameDistance <= 3) {
        reasons.push(`Similar name (${nameDistance} character difference)`)
      }

      if (
        input.municipality_id !== null &&
        candidate.municipality_id === input.municipality_id
      ) {
        reasons.push('Same municipality')
      } else if (
        input.district_id !== null &&
        candidate.district_id === input.district_id
      ) {
        reasons.push('Same district')
      }

      const ageDiff = Math.abs(candidate.age - input.age)
      if (ageDiff === 0) {
        reasons.push('Same age')
      } else if (ageDiff <= 2) {
        reasons.push(`Similar age (${ageDiff} year difference)`)
      }

      return {
        student: candidate,
        matchScore,
        reasons,
      }
    })
    .filter((candidate) => candidate.matchScore >= THRESHOLD)
    .sort((a, b) => b.matchScore - a.matchScore) // Sort by score descending

  return rankedCandidates
}
