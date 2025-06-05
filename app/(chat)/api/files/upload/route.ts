import { writeFile, mkdir } from 'fs/promises'
import { insertFile } from '@/lib/db/files'
import path from 'path'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/app/(auth)/auth'

// 檔案驗證規則
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: '檔案大小需小於 5MB',
    })
    .refine(
      (file) =>
        ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type),
      {
        message: '檔案格式僅限 JPEG, PNG, PDF',
      }
    ),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: '未登入或 session 遺失' }, { status: 401 })
  }

  const userId = session.user.id
  console.log('📦 使用者 ID:', userId)

  if (!request.body) {
    return new Response('Request body is empty', { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '未提供檔案' }, { status: 400 })
    }

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
    await writeFile(filePath, buffer)
    await insertFile(userId, filename)

    const fileUrl = `/uploads/${userId}/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: filename,
      contentType: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '處理檔案失敗' }, { status: 500 })
  }
}
