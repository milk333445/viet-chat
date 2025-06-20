import { tool } from "ai";
import { Session } from 'next-auth';
import { z } from "zod";
import { getUserFiles } from "@/lib/db/files";

interface ListFilesToolProps {
    session: Session;
}

export const listUserUploadedFiles = ({ session }: ListFilesToolProps) =>
  tool({
    description: 'List all uploaded files for the current user',
    parameters: z.object({
      confirm: z.literal('yes').describe("請輸入 'yes' 以確認執行列出使用者上傳檔案的操作"),
    }),
    execute: async () => {
      console.log(`user: ${session}`);
      if (!session?.user?.id) {
        return {
          error: 'User not authenticated.',
        };
      }

      const files = await getUserFiles(session.user.id);

      if (!files.length) {
        return `使用者尚未上傳任何檔案。請前往「檔案管理中心」上傳檔案。`;
      }

      return `### 使用者目前共上傳 ${files.length} 份檔案：
${files.map(f =>
`- **${f.filename}** ｜ 解析狀態：${f.parsed ? '已解析' : '未解析'}`
).join('\n')}`;
    },
  });