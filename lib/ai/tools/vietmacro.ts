import { tool } from "ai";
import { z } from "zod";

const fastApiBase = process.env.FASTPAI_API_URL


export const getVietMacrostatSummary = tool({
  description: "Fetch recent Vietnam macroeconomic data with optional keyword filtering.",
  parameters: z.object({
    start_days_ago: z
      .number()
      .int()
      .min(0)
      .default(7)
      .describe("How many days ago to start querying from. Default is 7."),
    end_days_ago: z
      .number()
      .int()
      .min(0)
      .default(0)
      .describe("How many days ago to end querying at. Default is 0 (today)."),
    keywords: z
      .array(z.string())
      .min(1)
      .optional()
      .describe("List of keywords to filter macro indicators. Supports partial match. defaults to None, meaning get all data."),
  }),
  execute: async ({ start_days_ago, end_days_ago, keywords }) => {
    try {
      const response = await fetch(
        `${fastApiBase}/api/viet/macro/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ start_days_ago, end_days_ago, keywords }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return `查詢失敗：${data.detail ?? "未知錯誤"}`;
      }

      return data.summary ?? "查詢成功但沒有摘要結果。";
    } catch (error) {
      return `FastAPI 請求錯誤：${(error as Error).message}`;
    }
  },
});

export const getVietMacrostatTrend = tool({
  description: "Query the trend of specific Vietnamese macroeconomic indicators over a date range.",
  parameters: z.object({
    keywords: z
      .array(z.string().min(1))
      .min(1)
      .describe("A list of macroeconomic indicator keywords to search for. Example: ['GDP', 'Inflation']"),
    start_days_ago: z
      .number()
      .int()
      .min(0)
      .max(730)
      .default(180)
      .describe("How many days ago to start from. Defaults to 180."),
    end_days_ago: z
      .number()
      .int()
      .min(0)
      .max(730)
      .default(0)
      .describe("How many days ago to end at. Defaults to 0 (today)."),
  }),
  execute: async ({ keywords, start_days_ago, end_days_ago }) => {
    try {
      const response = await fetch(`${fastApiBase}/api/viet/macro/trend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords, start_days_ago, end_days_ago }),
      });

      const data = await response.json();

      if (!response.ok) {
        return `查詢失敗：${data.detail ?? "未知錯誤"}`;
      }

      return data.summary ?? "趨勢查詢成功，但回應內容缺少摘要。";
    } catch (error) {
      return `FastAPI 請求錯誤：${(error as Error).message}`;
    }
  },
});
