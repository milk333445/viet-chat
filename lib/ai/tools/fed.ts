import { tool } from "ai";
import { z } from "zod";

const fastApiBase = process.env.FASTPAI_API_URL


  export const getIntradayStockPerformance = tool({
    description: 'Retrieve the intraday hourly price summary for a specific stock on a given date, showing only the closing price and percentage change for each hour.',
    parameters: z.object({
      stock_name: z
      .string()
      .describe('The stock ticker symbol, which must be provided in **uppercase letters**(e.g., "HPG", "VNM", "FPT"). Fuzzy prefix matching is supported, so input like "HPG" will match "HPG-hoa-phat-group-jsc". Please ensure the stock symbol is valid to get the correct information.'),
      date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("The date to query, formatted as (YYYY-MM-DD). Defaults to today."),
    }), 
    execute: async ( { stock_name, date } ) => {
      try {
        const response = await fetch(`${fastApiBase}/api/viet/price/performance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock_name, date }),
        });
        const data = await response.json();
        if (!response.ok) {
          return `查詢失敗：${data.detail ?? "未知錯誤"}`;
        }
        return data.summary ?? "查詢成功但未收到盤中走勢說明";
      } catch (error) {
        return `FastAPI 請求錯誤：${(error as Error).message}`;
      }
    },
  });