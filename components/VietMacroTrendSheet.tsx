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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { parseVietMacroTrend } from "@/lib/utils"

interface Props {
  summary: string
  triggerText?: string
}

export function VietMacroTrendSheet({ summary, triggerText = '查看經濟指標趨勢' }: Props) {
  const { trends, isStructured, rawText } = parseVietMacroTrend(summary)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[700px] !max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>宏觀經濟趨勢</SheetTitle>
          <SheetDescription>呈現所選指標在時間序列上的變化</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {!isStructured ? (
            <Alert>
              <Info className="size-4" />
              <AlertTitle>查無資料</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {rawText || '目前找不到符合條件的資料'}
              </AlertDescription>
            </Alert>
          ) : (
            trends.map((trend, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{trend.title}</CardTitle>
                  <CardDescription>顯示 {trend.values.length} 筆資料</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend.values}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
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
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  單位：{trend.values[0]?.unit ?? '-'} ｜ 資料來源：資料庫快照
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
