import Papa from 'papaparse'

export interface ParsedCSV<T> {
  data: T[]
  errors: Papa.ParseError[]
  meta: Papa.ParseMeta
}

/**
 * Parse a CSV file using papaparse
 * Automatically converts headers to lowercase and trims whitespace
 * @param file - CSV file to parse
 * @returns Parsed data with error information
 */
export async function parseCSV<T>(file: File): Promise<ParsedCSV<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => resolve(results as ParsedCSV<T>),
      error: reject,
    })
  })
}
