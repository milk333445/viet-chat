import { writeFile, mkdir } from 'fs/promises'
import { insertFile } from '@/lib/db/files'
import path from 'path'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/app/(auth)/auth'
import { stat } from 'fs/promises'


// 檔案驗證規則
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/plain',
  'text/markdown', // ✅ 新增支援 Markdown
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
  'text/csv',
  'application/msword', 
];


const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: '檔案大小需小於 5MB',
    })
    .refine((file) => ALLOWED_TYPES.includes(file.type), {
      message: '檔案格式僅支援 JPEG, PNG, PDF, TXT, MD, DOCX, XLSX, CSV',
    }),
});

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: '未登入或 session 遺失' }, { status: 401 })
  }

  const userId = session.user.id
  console.log('📦 使用者 ID:', userId)
  console.log('🔍 session 資訊:', session)

  if (!request.body) {
    return new Response('Request body is empty', { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    console.log('🔍 上傳檔案 MIME 類型:', file.type)

    if (!file) {
      return NextResponse.json({ error: '未提供檔案' }, { status: 400 })
    }

    console.log('🔍 上傳檔案 MIME 類型:', file.type)
    console.log('🔍 上傳檔案大小:', file.size)

    const validatedFile = FileSchema.safeParse({ file })
    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const filename = file.name
    const buffer = Buffer.from(await file.arrayBuffer())

    // 建立目錄 public/uploads/{userId}
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId)
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)

    try {
      await stat(filePath)
      return NextResponse.json({ error: `檔案「${filename}」已存在，請勿重複上傳` }, { status: 400 })
    } catch {

    }

    await writeFile(filePath, buffer)

    const uploadedAt = new Date();
    await insertFile(userId, filename, uploadedAt)

    const fileUrl = `/uploads/${userId}/${filename}`

    return NextResponse.json({
    success: true,
    url: fileUrl,
    name: filename,
    contentType: file.type,
    size: file.size,
    uploadedAt: uploadedAt.toISOString(),
  })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '處理檔案失敗' }, { status: 500 })
  }
}
