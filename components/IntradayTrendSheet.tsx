'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, TrendingUp } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Line,
} from "recharts"

import { parseIntradayTrendSummary } from "@/lib/utils"

type Props = {
  summary: string
  triggerText?: string
}

export function IntradayTrendSheet({ summary, triggerText = "查看即時趨勢" }: Props) {
  const { stockName, date, data, rawText, isStructured } = parseIntradayTrendSummary(summary)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[700px] !max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>即時股價趨勢</SheetTitle>
          <SheetDescription>
            顯示 {stockName || "指定股票"} 在 {date || "指定日期"} 的每小時價格波動
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
                <CardTitle>{stockName} 即時趨勢圖</CardTitle>
                <CardDescription>日期：{date}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="time" 
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis 
                        domain={['auto', 'auto']} 
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <RechartTooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-medium">
                  總共 {data.length} 筆時段資料 <TrendingUp className="size-4" />
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
