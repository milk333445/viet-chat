'use client'

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TrendingUp, Info } from 'lucide-react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
} from 'recharts'

import { parseStockTrendSummary } from '@/lib/utils'

type Props = {
  summary: string
  triggerText?: string
}

export function StockTrendSheet({ summary, triggerText = '查看股價趨勢' }: Props) {
  const { stockName, data, rawText, isStructured } = parseStockTrendSummary(summary)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[800px] !max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>股價趨勢圖</SheetTitle>
          <SheetDescription>
            顯示最近交易日內「{stockName || '指定股票'}」的價格走勢
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {!isStructured ? (
            <Alert variant="destructive">
              <Info className="size-4" />
              <AlertTitle>查無資料</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {rawText || '目前找不到股價資料，請稍後再試。'}
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{stockName} 股價走勢</CardTitle>
                <CardDescription>
                  最近 {data.length} 個交易日的收盤價格與漲跌幅
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(d) => d.slice(5)} // 顯示 MM-DD
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(v) => `${v}₫`}
                    />
                    <RechartTooltip />
                    <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={true} />
                    </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-medium">
                  總共 {data.length} 筆資料 <TrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  價格單位：VND ｜ 資料來源：資料庫快照
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
