import { tool } from "ai";
import { z } from "zod";

const fastApiBase = process.env.FASTPAI_API_URL;

export const searchWebTool = tool({
  description: "Use web search to gather factual and up-to-date information from reliable online sources to answer the user's query.",
  parameters: z.object({
    query: z.string().min(1).describe("The user's original query."),
  }),
  execute: async ({ query }) => {
    try {
      const response = await fetch(`${fastApiBase}/api/agent/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          max_research_loops: 1,
          initial_search_query_count: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return `查詢失敗：${data.detail ?? "未知錯誤"}`;
      }
      return data.result_text ?? "查詢成功但找不到相關資料。";
    } catch (error) {
      return `FastAPI 請求錯誤：${(error as Error).message}`;
    }
  },
});
