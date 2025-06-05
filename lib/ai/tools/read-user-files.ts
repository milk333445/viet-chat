import { tool } from 'ai';
import { z } from 'zod';
import { getUserFiles } from '@/lib/db/files';
import { Session } from 'next-auth';

interface ReadUserFilesProps {
  session: Session;
}

export const readUserFilesTool = ({ session }: ReadUserFilesProps) =>
  tool({
    description: 'Read the contents of user-uploaded documents. If no filenames are provided, all documents will be read by default.',
    parameters: z.object({
      filenames: z
        .array(z.string())
        .optional()
        .describe('An array of document names to read, e.g., ["report", "summary"]. If not provided, all parsed documents will be read.'),
    }),
    execute: async ({ filenames }) => {
      const files = await getUserFiles(session.user.id);

      if (files.length === 0) {
        return `使用者尚未上傳任何檔案。請提醒使用者前往「檔案管理中心」上傳並完成解析後再試一次。`;
      }

      const matchedFiles =
        filenames && filenames.length > 0
          ? files.filter((file) =>
              filenames.some((query) =>
                file.filename.toLowerCase().includes(query.toLowerCase())
              )
            )
          : files;

      if (filenames && matchedFiles.length === 0) {
        return `找不到符合關鍵字的檔案（輸入的: ${filenames.join(', ')}）\n\n目前上傳檔案如下：
${files.map((f) => `- ${f.filename}（已解析：${f.parsed ? '是' : '否'}）`).join('\n')}`;
      }

      const unparsed = matchedFiles.filter((f) => !f.parsed);
      if (unparsed.length > 0) {
        return `以下檔案尚未解析，請先前往「檔案管理中心」完成解析後再試一次：\n\n${unparsed
          .map((f) => `- ${f.filename}`)
          .join('\n')}`;
      }

      const content = matchedFiles
        .map((f) => {
            const text = f.parseResult?.text?.trim();
            if (!text) return null;

            return `### ${f.filename}\n\`\`\`txt\n${text}\n\`\`\``;
        })
        .filter((block) => !!block);

        return content.join('\n\n');
    },
  });
