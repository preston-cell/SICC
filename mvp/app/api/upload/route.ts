import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { getAuthContext } from '@/lib/auth-helper'

// PDF magic bytes: %PDF (hex: 25 50 44 46)
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]

function isPdfByMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false
  return (
    buffer[0] === PDF_MAGIC_BYTES[0] &&
    buffer[1] === PDF_MAGIC_BYTES[1] &&
    buffer[2] === PDF_MAGIC_BYTES[2] &&
    buffer[3] === PDF_MAGIC_BYTES[3]
  )
}

// POST /api/upload - Upload a file and return storage ID
export async function POST(request: NextRequest) {
  try {
    // Require auth or session for uploads
    const authContext = await getAuthContext(request)
    if (!authContext.userId && !authContext.sessionId) {
      return NextResponse.json(
        { error: 'Authentication or session required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 20MB' },
        { status: 400 }
      )
    }

    // Generate a unique storage ID
    const storageId = randomUUID()
    const extension = file.name.split('.').pop() || 'pdf'
    const fileName = `${storageId}.${extension}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Read file content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate magic bytes (actual file content, not just extension/MIME type)
    if (!isPdfByMagicBytes(buffer)) {
      return NextResponse.json(
        { error: 'Invalid file: must be a valid PDF document' },
        { status: 400 }
      )
    }

    // Write the file
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      storageId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    })
  } catch (error) {
    console.error('Failed to upload file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
