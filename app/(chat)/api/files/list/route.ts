import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import { getUserFiles } from '@/lib/db/files'

export async function GET() {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const rows = await getUserFiles(userId)

    const fileList = rows.map(file => ({
    name: file.filename,
    url: `/uploads/${userId}/${file.filename}`,
    size: 0, // 可選：用 fs.stat 拿實際大小
    type: getMimeType(file.filename),
    uploadedAt: file.createdAt?.getTime() ?? Date.now(),
    parsed: file.parsed,
    parseresult: file.parseResult?.text ?? null,
    }))

    return NextResponse.json({ files: fileList })
  } catch (error) {
    console.error('讀取檔案清單錯誤:', error)
    return NextResponse.json({ error: '查詢失敗' }, { status: 500 })
  }
}

const mimeMap: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.csv': 'text/csv',
};

function getMimeType(filename: string): string {
  const ext = Object.keys(mimeMap).find((ext) => filename.toLowerCase().endsWith(ext));
  return ext ? mimeMap[ext] : 'application/octet-stream';
}

