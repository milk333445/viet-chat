import { auth } from '@/app/(auth)/auth';
import { updateFileParseResult } from '@/lib/db/files';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp'; // 新增引入 sharp

const fastApiBase = process.env.FASTPAI_API_URL;

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: '未登入' }, { status: 401 });
  }

  const userId = session.user.id;
  const { name } = await req.json();
  console.log('file name: ', name);

  if (!name) {
    return NextResponse.json({ error: '未提供檔名' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', userId, name);
  console.log('🔍 檔案絕對路徑:', filePath);

  try {
    const res = await fetch(`${fastApiBase}/api/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_path: filePath }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.detail || '解析失敗' },
        { status: res.status },
      );
    }

    const { text, images } = await res.json();

    // console.log('圖片', images);

    const sanitizedFolderName = path.parse(name).name
      .replace(/\s+/g, '_') // 將空格替換為底線
      .replace(/\./g, '') // 移除點號
      .replace(/_/g, '_'); // 確保底線格式一致
    const imageDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      userId,
      'images',
      sanitizedFolderName, // 使用去掉副檔名的檔名作為子目錄
    );
    await fs.mkdir(imageDir, { recursive: true }); // 確保目錄存在

    const imageUrls: string[] = [];

    // 替換 text 中的圖片路徑
    let updatedText = text;

    for (const [imageName, base64Data] of Object.entries(images)) {
      if (typeof base64Data !== 'string') {
        console.error(`Invalid base64 data for image: ${imageName}`);
        continue;
      }

      // 提取 Base64 資料（去掉 'data:image/png;base64,' 前綴）
      const base64Content = base64Data.split(',')[1];
      if (!base64Content) {
        console.error(`Invalid Base64 format for image: ${imageName}`);
        continue;
      }

      const imagePath = path.join(
        imageDir,
        `${path.parse(imageName).name}.png`,
      ); // 強制使用 PNG 格式
      const buffer = Buffer.from(base64Content, 'base64');

      // 使用 sharp 將圖片轉換為 PNG 格式
      await sharp(buffer).png().toFile(imagePath);

      // 生成圖片的 URL
      const imageUrl = `/uploads/${userId}/images/${sanitizedFolderName}/${path.parse(imageName).name}.png`;
      imageUrls.push(imageUrl);

      // 替換 text 中的路徑
      const originalPath = `images/${imageName}`;
      updatedText = updatedText.replace(originalPath, imageUrl);
    }

    await updateFileParseResult(userId, name, {
      text: updatedText.trim(), // 使用更新後的文字
      images: imageUrls, // 傳入圖片的 URL 列表
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('FastAPI 錯誤:', error);
    return NextResponse.json({ error: 'FastAPI 呼叫失敗' }, { status: 500 });
  }
}
