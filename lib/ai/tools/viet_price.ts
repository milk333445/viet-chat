import { tool } from "ai";
import { z } from "zod";

const fastApiBase = process.env.FASTPAI_API_URL

export const getStockPriceNow = tool({
    description: 'Retrieve the real-time price information of a specific viet stock.',
    parameters: z.object({
      stock_name: z.string().describe('The stock ticker symbol, which must be provided in **uppercase letters**(e.g., "HPG", "VNM", "FPT"). Fuzzy prefix matching is supported, so input like "HPG" will match "HPG-hoa-phat-group-jsc". Please ensure the stock symbol is valid to get the correct information.'),
    }), 
    execute: async ( { stock_name } ) => {
      try {
        console.log(`Fetching real-time price for stock: ${stock_name} ${fastApiBase}/api/viet/price/now`);
        const response = await fetch(`${fastApiBase}/api/viet/price/now`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock_name }),
        });
        const data = await response.json();
        if (!response.ok) {
          return `查詢失敗：${data.detail ?? "未知錯誤"}`;
        }
        return data.summary ?? "查詢成功但無法解析回應內容";
      } catch (error) {
        return `FastAPI 請求錯誤：${(error as Error).message}`;
      }
    },
  });


export const getStockPriceTrend = tool({
  description: 'Analyze the recent trend of a specific viet stock over a number of days.',
  parameters: z.object({
    stock_name: z
    .string()
    .describe('The stock ticker symbol, which must be provided in **uppercase letters**(e.g., "HPG", "VNM", "FPT"). Fuzzy prefix matching is supported, so input like "HPG" will match "HPG-hoa-phat-group-jsc". Please ensure the stock symbol is valid to get the correct information.'),
    days: z
    .number()
    .int()
    .min(1)
    .default(7)
    .describe("Number of recent days to analyze. Default is 7."),
  }), 
  execute: async ( { stock_name, days } ) => {
    try {
      const response = await fetch(`${fastApiBase}/api/viet/price/trend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock_name, days }),
      });
      const data = await response.json();
      if (!response.ok) {
        return `查詢失敗：${data.detail ?? "未知錯誤"}`;
      }
      return data.summary ?? "查詢成功但未收到趨勢說明文字";
    } catch (error) {
      return `FastAPI 請求錯誤：${(error as Error).message}`;
    }
  },
});


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