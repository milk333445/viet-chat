import { tool } from "ai";
import { z } from "zod";

const fastApiBase = process.env.FASTPAI_API_URL


export const searchVietNews = tool({
  description: "Search and retrieve recent viet news articles related to a list of expanded keywords. The `keywords` must be provided **in English only**",
  parameters: z.object({
    keywords: z
      .array(z.string().min(1))
      .min(1)
      .describe("A list of expanded **English** keywords or phrases to search for. Example: ['Vietnam economy', 'Vietnam stock market']"),
    days: z
      .number()
      .int()
      .min(1)
      .max(30)
      .default(7)
      .describe("Number of past days from today to include in the search range. Default is 7 days."),
  }),
  execute: async ({ keywords, days }) => {
    try {
      const response = await fetch(
        `${fastApiBase}/api/viet/news/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keywords, days }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return `查詢失敗：${data.detail ?? "未知錯誤"}`;
      }

      return data.content ?? "查詢成功但找不到相關新聞。";
    } catch (error) {
      return `FastAPI 請求錯誤：${(error as Error).message}`;
    }
  },
});

