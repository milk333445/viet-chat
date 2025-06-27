import type { CoreAssistantMessage, CoreToolMessage, UIMessage } from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Document } from '@/lib/db/schema';
import { ChatSDKError, type ErrorCode } from './errors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new ChatSDKError(code as ErrorCode, cause);
  }

  return response.json();
};

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatSDKError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatSDKError('offline:chat');
    }

    throw error;
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}

type MacroTrendEntry = {
  title: string
  values: {
    date: string
    value: number | null
    unit: string
  }[]
}

type ParsedMacroTrend = {
  trends: MacroTrendEntry[]
  rawText: string
  isStructured: boolean
}

type VietMacroIndicator = {
  title: string
  value: string
  unit: string
  date: string
}

type VietMacroSummary = {
  startDate: string
  endDate: string
  indicators: VietMacroIndicator[]
  rawText: string
  isStructured: boolean
}

type IntradayStockData = {
  time: string
  price: number
  change: number | null
}

type IntradayTrend = {
  stockName: string
  date: string
  data: IntradayStockData[]
  rawText: string
  isStructured: boolean
}

type StockTrendPoint = {
  date: string         // yyyy-mm-dd
  price: number        // 價格 (數值)
  change: number       // 漲跌百分比
}

type ParsedStockTrend = {
  stockName: string
  data: StockTrendPoint[]
  rawText: string
  isStructured: boolean
}

type NewsArticle = {
  title: string
  time: string
  category: string
  rank: number
  content: string
  link: string
}

type ParsedNewsResult = {
  articles: NewsArticle[]
  rawText: string
  isStructured: boolean
}

type FedMeeting = {
  meetingDate: string;
  releaseDate: string;
  statement: string;
  statementLink: string;
  minutesLink: string;
};

type ParseFedResult = {
  meetings: FedMeeting[];
  rawText: string;
  isStructured: boolean;
};

export function parseFedSummary(summary: string): ParseFedResult {
  const entries = summary
    .split('---')
    .map(e => e.trim())
    .filter(e => e.startsWith('**'));

  const meetings: FedMeeting[] = entries.map(entry => {
    const meetingDateMatch = entry.match(/\*\*(\d{4}-\d{2}-\d{2})\*\*/);
    const releaseDateMatch = entry.match(/\(Released on (\d{4}-\d{2}-\d{2})\)/);
    const statementMatch = entry.match(/- \*\*Statement\*\*:([\s\S]+?)(?=\n- \[Full Statement\]|\n- \[Full Minutes\])/)
    const statementLinkMatch = entry.match(/\[Full Statement\]\((.+?)\)/);
    const minutesLinkMatch = entry.match(/\[Full Minutes\]\((.+?)\)/);

    return {
      meetingDate: meetingDateMatch?.[1] || '',
      releaseDate: releaseDateMatch?.[1] || '',
      statement: statementMatch?.[1] || '',
      statementLink: statementLinkMatch?.[1] || '',
      minutesLink: minutesLinkMatch?.[1] || ''
    };
  });

  return {
    meetings,
    rawText: summary,
    isStructured: meetings.length > 0
  };
}

export function parseNewsSummary(summary: string): ParsedNewsResult {
  const blocks = summary.split('---')
    .map(block => block.trim())
    .filter(block => block.includes('[title]'))

  const articles: NewsArticle[] = blocks.map(block => {
    const titleMatch = block.match(/\[title\]\s+\*\*(.+?)\*\*/)
    const timeMatch = block.match(/\[time\]\s+(.+)/)
    const categoryMatch = block.match(/\[category\]\s+(.+)/)
    const rankMatch = block.match(/\[rank\]\s+([\d.]+)/)
    const contentMatch = block.match(/\[content\]\s+([\s\S]+?)(?=\n- \[Link\])/)
    const linkMatch = block.match(/\[Link\]\s+(.+)/)

    return {
      title: titleMatch?.[1] || '',
      time: timeMatch?.[1] || '',
      category: categoryMatch?.[1] || '',
      rank: rankMatch ? Number.parseFloat(rankMatch[1]) : 0,
      content: contentMatch?.[1]?.trim() || '',
      link: linkMatch?.[1] || ''
    }
  })

  return {
    articles,
    rawText: summary,
    isStructured: articles.length > 0
  }
}


export function parseStockTrendSummary(summary: string): ParsedStockTrend {
  console.log('Parsing stock trend summary:', summary)
  const lines = summary.trim().split('\n')

  const stockLine = lines.find(line => line.includes("股票趨勢過去"))
  const stockMatch = stockLine?.match(/^(\S+)\s股票趨勢/) // 提取 HPG 之類的

  const stockName = stockMatch?.[1] || ''
  const data: StockTrendPoint[] = []

  for (const line of lines) {
    const match = line.match(/^(\d{4}-\d{2}-\d{2}):\s+([\d.]+)\s+VND\s+\(([-\d.]+)%\)/)
    if (match) {
      const [, date, priceStr, changeStr] = match
      data.push({
        date,
        price: Number.parseFloat(priceStr),
        change: Number.parseFloat(changeStr),
      })
    }
  }
  console.log('Parsed stock data:', data)
  return {
    stockName,
    data,
    rawText: summary,
    isStructured: data.length > 0,
  }
}

export function parseIntradayTrendSummary(summary: string): IntradayTrend {
  const rawText = summary.trim()
  const headerMatch = rawText.match(/^Intraday hourly trend for (\w+) on (\d{4}-\d{2}-\d{2}):/)

  if (!headerMatch) {
    return {
      stockName: '',
      date: '',
      data: [],
      rawText,
      isStructured: false,
    }
  }

  const [, stockName, date] = headerMatch
  const lines = rawText.split('\n').slice(1) // skip header line
  const data: IntradayTrend["data"] = []

  for (const line of lines) {
    const match = line.match(/[-*]?\s*(\d{2}:\d{2})：([\d.,]+) VND（([^)]+)）/)
    if (match) {
      const [, time, priceStr, changeStr] = match
      const price = Number.parseFloat(priceStr.replace(/,/g, ''))
      const change = changeStr === '—' ? null : Number.parseFloat(changeStr.replace('%', ''))
      data.push({ time, price, change })
    }
  }

  return {
    stockName,
    date,
    data,
    rawText,
    isStructured: data.length > 0,
  }
}

export function parseVietMacroSummary(summary: string): VietMacroSummary {
  const rawText = summary.trim()
  const headerMatch = rawText.match(
    /^Vietnam Macroeconomic Data from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2}):/
  )

  if (!headerMatch) {
    return {
      startDate: '',
      endDate: '',
      indicators: [],
      rawText,
      isStructured: false,
    }
  }

  const [, startDate, endDate] = headerMatch
  const lines = rawText.split('\n').slice(1)

  const indicators: VietMacroIndicator[] = []

  for (const line of lines) {
    const match = line.match(
      /^-\s*(.+?):\s*([-\d.,]+)?\s*(.*?)\s*\(as of (\d{4}-\d{2}-\d{2})\)/
    )
    if (match) {
      const [, title, value = '', unit = '', date] = match
      indicators.push({ title: title.trim(), value: value.trim(), unit: unit.trim(), date })
    }
  }

  return {
    startDate,
    endDate,
    indicators,
    rawText,
    isStructured: indicators.length > 0,
  }
}

export function parseVietMacroTrend(summary: string): ParsedMacroTrend {
  const lines = summary.trim().split('\n')
  const trends: MacroTrendEntry[] = []

  let currentTitle = ''
  let currentValues: MacroTrendEntry['values'] = []

  const trendHeaderPattern = /^Vietnam Macroeconomic Trends/i
  const titlePattern = /^(.+):$/
  const valueLinePattern = /^\s*-\s*(\d{4}-\d{2}-\d{2}):\s*([\d.,]+)\s*(.+)$/

  const isStructured = trendHeaderPattern.test(summary)

  for (const line of lines) {
    const titleMatch = line.match(titlePattern)
    const valueMatch = line.match(valueLinePattern)

    if (titleMatch) {
      if (currentTitle && currentValues.length > 0) {
        trends.push({ title: currentTitle, values: currentValues })
      }
      currentTitle = titleMatch[1].trim()
      currentValues = []
    } else if (valueMatch) {
      const [, date, valueStr, unit] = valueMatch
      const value = parseFloat(valueStr.replace(/,/g, ''))
      currentValues.push({ date, value: isNaN(value) ? null : value, unit: unit.trim() })
    }
  }

  if (currentTitle && currentValues.length > 0) {
    trends.push({ title: currentTitle, values: currentValues })
  }

  return {
    trends,
    rawText: summary,
    isStructured: isStructured && trends.length > 0,
  }
}