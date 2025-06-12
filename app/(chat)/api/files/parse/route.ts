import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import path from 'path'
import { updateFileParseResult } from '@/lib/db/files'
import fs from 'fs/promises'

const fastApiBase = process.env.FASTPAI_API_URL

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
  console.log('🔍 檔案絕對路徑:', filePath);

  try {
    const res = await fetch(`${fastApiBase}/api/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_path: filePath }),
    })

    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json({ error: error.detail || '解析失敗' }, { status: res.status })
    }

    const { text } = await res.json()

    await updateFileParseResult(userId, name, {
      text: text.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FastAPI 錯誤:', error)
    return NextResponse.json({ error: 'FastAPI 呼叫失敗' }, { status: 500 })
  }
  // try {
  //   const buffer = await fs.readFile(filePath)
  //   const ext = path.extname(name).toLowerCase()

  //   let text = ''

  //   if (ext === '.pdf') {
  //     const data = await pdfParse(buffer)
  //     text = data.text
  //   } else if (ext === '.txt' || ext === '.md') {
  //     text = buffer.toString('utf-8')
  //   } else if (ext === '.docx') {
  //     const result = await mammoth.extractRawText({ buffer })
  //     text = result.value
  //   } else if (ext === '.csv') {
  //     const records: string[][] = parse(buffer.toString('utf-8'), {
  //       skip_empty_lines: true,
  //     })
  //     text = records.map((row: string[]) => row.join(' , ')).join('\n')
  //   } else {
  //     return NextResponse.json({ error: '不支援的檔案類型' }, { status: 400 })
  //   }

  //   await updateFileParseResult(userId, name, {
  //     text: text.trim(),
  //   })

  //   return NextResponse.json({ success: true })
  // } catch (error) {
  //   console.error('解析失敗:', error)
  //   return NextResponse.json({ error: '解析失敗' }, { status: 500 })
  // }
}
