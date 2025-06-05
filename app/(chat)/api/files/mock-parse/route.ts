import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import { updateFileParseResult } from '@/lib/db/files'

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

  try {
    // 模擬解析結果
    const fakeText = `這是 ${name} 的解析結果文字，僅供展示使用。`

    await updateFileParseResult(userId, name, {
      text: fakeText,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ 模擬解析錯誤:', error)
    return NextResponse.json({ error: '解析失敗' }, { status: 500 })
  }
}
