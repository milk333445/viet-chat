import { tool } from 'ai';
import { z } from 'zod';


export const multiply = tool({
  description: '計算兩個數字的乘積',
  parameters: z.object({
    a: z.number().describe('第一個數字'),
    b: z.number().describe('第二個數字'),
  }),
  execute: async ({ a, b }) => {
    const result = a * b;
    return `### 計算結果\n\n\`\`\`txt\n${a} × ${b} = ${a * b}\n\`\`\``;
  },
});