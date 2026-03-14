import imageCompression from 'browser-image-compression'

/**
 * Process and compress an image file for upload
 * Resizes to max 800px width/height and compresses to 85% quality
 * Optimized for print-ready PDF exports
 * @param file - Image file to process
 * @returns Compressed image file (JPEG format)
 */
export async function processImage(file: File): Promise<File> {
  const options = {
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.85,
  }

  try {
    const compressed = await imageCompression(file, options)
    return compressed
  } catch (error) {
    console.error('Image compression failed:', error)
    // Fallback to original file if compression fails
    return file
  }
}

/**
 * Process multiple images in parallel
 * Shows progress via optional callback
 * @param files - Array of image files to process
 * @param onProgress - Optional callback for progress updates (current, total)
 * @returns Array of compressed image files
 */
export async function processImages(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const results: File[] = []

  for (let i = 0; i < files.length; i++) {
    const processed = await processImage(files[i])
    results.push(processed)

    if (onProgress) {
      onProgress(i + 1, files.length)
    }
  }

  return results
}
