import 'server-only';

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
  stream,
  file
} from './schema';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

// 新增檔案記錄
export async function insertFile(userId: string, filename: string) {
  await db.insert(file).values({
    userId,
    filename,
    parsed: false,
    createdAt: new Date()
  });
}

// 更新解析結果
export async function updateFileParseResult(userId: string, filename: string, result: any) {
  await db.update(file)
    .set({
      parsed: true,
      parseResult: result
    })
    .where(and(eq(file.userId, userId), eq(file.filename, filename)))
}

// 查詢某使用者的檔案清單
export async function getUserFiles(userId: string) {
  return await db
    .select()
    .from(file)
    .where(eq(file.userId, userId))
    .orderBy(desc(file.createdAt));
}

export async function deleteFile(userId: string, filename: string) {
  await db.delete(file).where(and(eq(file.userId, userId), eq(file.filename, filename)))
}
