import { unparse } from 'papaparse'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
import type { Student } from '../types/database'

/**
 * Helper: Downloads a blob to the user's browser
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Exports selected students to CSV format
 */
export async function exportStudentsToCSV(students: Student[]): Promise<void> {
  const data = students.map((s) => ({
    Name: s.name,
    Age: s.age || '',
    Grade: s.grade || '',
    Village: s.village || '',
    Region: s.region || '',
    Coordinator: s.coordinator || '',
    Status: s.status,
  }))

  const csv = unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  downloadBlob(blob, `students_export_${timestamp}.csv`)
}

/**
 * Exports selected students to PDF format (one profile card per student)
 * Branded layout matching HIS Nepal-inspired design system
 */
export async function exportStudentsToPDF(students: Student[]): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter', // 8.5 x 11 inches
  })

  // HIS Brand Colors (RGB for jsPDF)
  const colors = {
    crimsonRed: [220, 20, 60] as [number, number, number], // Primary
    mountainBronze: [166, 124, 82] as [number, number, number], // Secondary
    warmSand: [212, 197, 176] as [number, number, number], // Accent
    textHigh: [51, 43, 35] as [number, number, number], // Dark text
    textMuted: [107, 93, 82] as [number, number, number], // Muted text
    white: [255, 255, 255] as [number, number, number],
  }

  for (let i = 0; i < students.length; i++) {
    const student = students[i]

    if (i > 0) {
      doc.addPage()
    }

    // ========================================
    // CRIMSON RED HEADER BAR
    // ========================================
    doc.setFillColor(...colors.crimsonRed)
    doc.rect(0, 0, 8.5, 0.8, 'F') // Full-width header

    doc.setTextColor(...colors.white)
    doc.setFontSize(18)
    doc.setFont('times', 'bold') // Serif for brand name (matches Cormorant Garamond)
    doc.text('HIMALI INDIGENOUS SERVICES', 4.25, 0.35, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('times', 'italic') // Serif italic for subtitle
    doc.text('Student Profile', 4.25, 0.6, { align: 'center' })

    // ========================================
    // PHOTO SECTION (centered, with border)
    // ========================================
    const photoSize = 3.5
    const photoX = (8.5 - photoSize) / 2 // Center horizontally
    let yOffset = 1.2

    if (student.photo_url) {
      try {
        const response = await fetch(student.photo_url)
        const blob = await response.blob()
        const base64 = await blobToBase64(blob)

        // Crop image to square using canvas (object-fit: cover)
        const croppedBase64 = await cropImageToSquare(base64, 800) // 800px square @ 2x for quality

        // Draw bronze border
        doc.setDrawColor(...colors.mountainBronze)
        doc.setLineWidth(0.03)
        doc.rect(photoX - 0.05, yOffset - 0.05, photoSize + 0.1, photoSize + 0.1)

        // Add cropped photo (now perfectly square)
        doc.addImage(croppedBase64, 'JPEG', photoX, yOffset, photoSize, photoSize)
      } catch (error) {
        console.error('Failed to embed photo:', error)
        drawPhotoPlaceholder(doc, photoX, yOffset, photoSize, colors, 'Photo unavailable')
      }
    } else {
      drawPhotoPlaceholder(doc, photoX, yOffset, photoSize, colors, 'No photo')
    }

    yOffset += photoSize + 0.5 // Increased spacing to prevent overlap

    // ========================================
    // STUDENT NAME (Crimson Red, centered, serif)
    // ========================================
    doc.setTextColor(...colors.crimsonRed)
    doc.setFontSize(28)
    doc.setFont('times', 'bold') // Times Roman (serif, matches Cormorant Garamond)
    doc.text(student.name.toUpperCase(), 4.25, yOffset, { align: 'center' })

    yOffset += 0.45

    // ========================================
    // SUBTITLE (Age, Grade only)
    // ========================================
    doc.setTextColor(...colors.mountainBronze)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal') // Sans-serif (matches Inter)
    const subtitle = `Age ${student.age || 'N/A'}  •  Grade ${student.grade || 'N/A'}`
    doc.text(subtitle, 4.25, yOffset, { align: 'center' })

    yOffset += 0.6

    // ========================================
    // WARM SAND DIVIDER
    // ========================================
    doc.setDrawColor(...colors.warmSand)
    doc.setLineWidth(0.02)
    doc.line(0.75, yOffset, 7.75, yOffset)

    yOffset += 0.5

    // ========================================
    // MAP SECTION (centered)
    // ========================================
    // Map container (6.5" wide × 3" tall, centered)
    const mapWidth = 6.5
    const mapHeight = 3
    const mapX = (8.5 - mapWidth) / 2 // Center horizontally
    const mapY = yOffset

    // Draw map border (warm sand)
    doc.setDrawColor(...colors.warmSand)
    doc.setLineWidth(0.02)
    doc.rect(mapX, mapY, mapWidth, mapHeight)

    // Map background (light cream)
    doc.setFillColor(245, 241, 235)
    doc.rect(mapX, mapY, mapWidth, mapHeight, 'F')

    // Placeholder text (will be replaced with actual map in future)
    doc.setTextColor(...colors.textMuted)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text('Nepal Map', mapX + mapWidth / 2, mapY + mapHeight / 2 - 0.2, {
      align: 'center',
    })
    doc.setFontSize(8)
    doc.text(
      `(${student.village || 'Village'} location pin will appear here)`,
      mapX + mapWidth / 2,
      mapY + mapHeight / 2 + 0.1,
      { align: 'center' }
    )

    yOffset += mapHeight + 0.3

    // Map caption
    doc.setTextColor(...colors.textMuted)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const caption = `Region: ${student.region || 'N/A'}  •  Village: ${student.village || 'N/A'}`
    doc.text(caption, 4.25, yOffset, { align: 'center' })

    yOffset += 0.4

    // ========================================
    // FOOTER (muted, centered)
    // ========================================
    // Position footer dynamically after caption
    const footerY = yOffset

    doc.setDrawColor(...colors.warmSand)
    doc.setLineWidth(0.02)
    doc.line(0.75, footerY, 7.75, footerY)

    doc.setTextColor(...colors.textMuted)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const footerLine1 = `Generated ${new Date().toLocaleDateString()} • Student ID: ${student.id.slice(
      0,
      8
    )}`
    const footerLine2 = 'Himali Indigenous Services • his-serve.org'

    doc.text(footerLine1, 4.25, footerY + 0.2, { align: 'center' })
    doc.text(footerLine2, 4.25, footerY + 0.4, { align: 'center' })

    // Reset text color for next page
    doc.setTextColor(0, 0, 0)
  }

  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  doc.save(`students_profiles_${timestamp}.pdf`)
}

/**
 * Helper: Draws a photo placeholder with border
 */
function drawPhotoPlaceholder(
  doc: jsPDF,
  x: number,
  y: number,
  size: number,
  colors: Record<string, [number, number, number]>,
  text: string
): void {
  // Bronze border
  doc.setDrawColor(...colors.mountainBronze)
  doc.setLineWidth(0.03)
  doc.rect(x - 0.05, y - 0.05, size + 0.1, size + 0.1)

  // Light fill
  doc.setFillColor(245, 241, 235) // Warm cream background
  doc.rect(x, y, size, size, 'F')

  // Placeholder text
  doc.setTextColor(...colors.textMuted)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(text, x + size / 2, y + size / 2, { align: 'center' })
}

/**
 * Exports photos of selected students as a ZIP file
 */
export async function exportStudentPhotos(
  students: Student[],
  onProgress: (current: number, total: number) => void
): Promise<void> {
  // Filter students with photos
  const withPhotos = students.filter((s) => s.photo_url)

  if (withPhotos.length === 0) {
    throw new Error('No photos to export')
  }

  const zip = new JSZip()

  for (let i = 0; i < withPhotos.length; i++) {
    const student = withPhotos[i]
    onProgress(i + 1, withPhotos.length)

    try {
      // Fetch photo from Supabase Storage
      const response = await fetch(student.photo_url!)
      const blob = await response.blob()

      // Sanitize filename: replace spaces with underscores, keep only alphanumeric
      const sanitizedName = student.name.replace(/[^a-zA-Z0-9]/g, '_')
      const filename = `${sanitizedName}_${student.id.slice(0, 8)}.jpg`

      zip.file(filename, blob)
    } catch (error) {
      console.error(`Failed to fetch photo for ${student.name}:`, error)
      // Continue with next photo (skip failed ones)
    }
  }

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({ type: 'blob' })

  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  downloadBlob(zipBlob, `student_photos_${timestamp}.zip`)
}

/**
 * Helper: Converts a Blob to base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Helper: Crops an image to a square using canvas (object-fit: cover behavior)
 * @param base64 - Base64 encoded image
 * @param size - Target square size in pixels
 * @returns Base64 encoded square image
 */
function cropImageToSquare(base64: string, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Calculate cover dimensions (same as CSS object-fit: cover)
      const imgAspect = img.width / img.height
      const targetAspect = 1 // Square

      let drawWidth: number
      let drawHeight: number
      let offsetX: number
      let offsetY: number

      if (imgAspect > targetAspect) {
        // Image is wider - fit height, crop width
        drawHeight = size
        drawWidth = imgAspect * size
        offsetX = (size - drawWidth) / 2
        offsetY = 0
      } else {
        // Image is taller - fit width, crop height
        drawWidth = size
        drawHeight = size / imgAspect
        offsetX = 0
        offsetY = (size - drawHeight) / 2
      }

      // Draw image with cover scaling
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      // Convert canvas to base64
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = base64
  })
}
