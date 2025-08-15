import { auth } from '@/app/(auth)/auth';
import { deleteFile } from '@/lib/db/files';
import { NextResponse } from 'next/server';
import { rm, unlink } from 'node:fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: '未登入' }, { status: 401 });
  }

  const userId = session.user.id;
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: '未提供檔名' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', userId, name);
  const imageDir = path.join(
    process.cwd(),
    'public',
    'uploads',
    userId,
    'images',
    path.parse(name).name, // 使用去掉副檔名的檔名作為圖片資料夾名稱
  );

  try {
    await unlink(filePath); // ✅ 刪檔案

    // 刪除圖片資料夾及其內容
    await rm(imageDir, { recursive: true, force: true });

    await deleteFile(userId, name); // ✅ 刪資料庫
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('❌ 刪除失敗:', e);
    return NextResponse.json(
      { success: false, error: '刪除失敗' },
      { status: 500 },
    );
  }
}
