import { tool } from "ai";
import { z } from "zod";

const fastApiBase = process.env.FASTPAI_API_URL


export const getFedMeetingData = tool({
  description: 'Get info of Federal Reserve meetings within a specified date range, default to the last 90 days. If both `start_days_ago` and `end_days_ago` are set to 0, this function will automatically return the most recent available meeting record instead of just today',
  parameters: z.object({
    start_days_ago: z
      .number()
      .int()
      .min(0)
      .max(365)
      .default(90)
      .describe("Number of days ago to start searching from (default 90)."),
    end_days_ago: z
      .number()
      .int()
      .min(0)
      .max(365)
      .default(0)
      .describe("Number of days ago to end searching (default 0)."),
  }), 
  execute: async ( { start_days_ago, end_days_ago } ) => {
    try {
      const response = await fetch(`${fastApiBase}/api/fed/meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start_days_ago, end_days_ago }),
      });
      const data = await response.json();
      if (!response.ok) {
        return `查詢失敗：${data.detail ?? "未知錯誤"}`;
      }
      return data.summary ?? "查詢成功但未收到會議摘要";
    } catch (error) {
      return `FastAPI 請求錯誤：${(error as Error).message}`;
    }
  },
});