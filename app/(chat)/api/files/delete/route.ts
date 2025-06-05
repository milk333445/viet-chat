import { unlink } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import { deleteFile } from '@/lib/db/files'

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: '未登入' }, { status: 401 })
  }

  const userId = session.user.id
  const { name } = await req.json()

  if (!name) {
    return NextResponse.json({ error: '未提供檔名' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', userId, name)

  try {
    await unlink(filePath) // ✅ 刪檔案
    await deleteFile(userId, name) // ✅ 刪資料庫
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('❌ 刪除失敗:', e)
    return NextResponse.json({ success: false, error: '刪除失敗' }, { status: 500 })
  }
}
