import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { z } from 'zod'
import { auth } from '@/app/(auth)/auth'
import { insertFile } from '@/lib/db/files'
import { stat } from 'fs/promises'

const schema = z.object({
  filename: z.string().min(1),
  content: z.string().min(1),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: '未登入' }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json()
  const parseResult = schema.safeParse(body)

  if (!parseResult.success) {
    return NextResponse.json({ error: '請提供正確的 filename 與 content' }, { status: 400 })
  }

  let { filename, content } = parseResult.data

  // ✅ 自動補上 .md 副檔名（如果沒有）
  if (!filename.toLowerCase().endsWith('.md')) {
    filename += '.md'
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId)
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)

    try {
          await stat(filePath)
          return NextResponse.json({ error: `檔案「${filename}」已存在，請勿重複上傳` }, { status: 400 })
        } catch {
    
        }

    await writeFile(filePath, content, 'utf-8')

    const uploadedAt = new Date()
    await insertFile(userId, filename, uploadedAt)

    const fileUrl = `/uploads/${userId}/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: filename,
      contentType: 'text/markdown',
      size: content.length,
      uploadedAt: uploadedAt.toISOString(),
    })
  } catch (err) {
    console.error('📄 手動新增失敗:', err)
    return NextResponse.json({ error: '檔案儲存失敗' }, { status: 500 })
  }
}
