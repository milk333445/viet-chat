'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { parseStockTrendSummary } from '@/lib/utils';
import { Info, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const fastApiBase = process.env.NEXT_PUBLIC_FASTAPI_API_URL;

type TrendPoint = { date: string; price: number };

type Props = {
  summary: string;
  triggerText?: string;
};

export function StockTrendSheet({
  summary,
  triggerText = '查看股價趨勢',
}: Props) {
  const { stockName, data, rawText, isStructured } =
    parseStockTrendSummary(summary);

  const [range, setRange] = useState<string | undefined>(undefined);
  const [trendData, setTrendData] = useState<TrendPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockTrendData = async (
    stockName: string,
    range: string,
  ): Promise<TrendPoint[]> => {
    const res = await fetch(`${fastApiBase}/api/viet/price/trendpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_name: stockName, days: Number(range) }),
    });

    if (!res.ok) throw new Error('API 請求失敗');
    const json = await res.json();
    return json.trend as TrendPoint[];
  };

  useEffect(() => {
    if (!range) return;
    setLoading(true);
    setError(null);
    fetchStockTrendData(stockName, range)
      .then(setTrendData)
      .catch((err) => {
        setTrendData(null);
        setError('無法載入新資料，請稍後再試');
      })
      .finally(() => setLoading(false));
  }, [range, stockName]);

  const displayData = trendData ?? data;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="!w-[800px] !max-w-full overflow-y-auto"
      >
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
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle>{stockName} 股價走勢</CardTitle>
                  <CardDescription>
                    顯示 {displayData.length} 筆資料
                  </CardDescription>
                </div>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="選擇區間" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7天</SelectItem>
                    <SelectItem value="30">30天</SelectItem>
                    <SelectItem value="90">90天</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="text-sm text-muted-foreground px-4">
                    載入中...
                  </div>
                ) : displayData.length === 0 ? (
                  <Alert>
                    <Info className="size-4" />
                    <AlertTitle>查無資料</AlertTitle>
                    <AlertDescription className="whitespace-pre-line">
                      找不到「{stockName}」在所選區間內的股價資料。
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayData}>
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
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-medium">
                  總共 {displayData.length} 筆資料{' '}
                  <TrendingUp className="size-4" />
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
  );
}
