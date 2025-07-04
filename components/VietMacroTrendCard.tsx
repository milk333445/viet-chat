'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const fastApiBase = process.env.NEXT_PUBLIC_FASTAPI_API_URL;

type TrendValue = {
  date: string;
  value: number | null;
  unit: string;
};

interface MacroTrendCardProps {
  title: string;
  values: TrendValue[]; // 初始資料（全部）
}

export function MacroTrendCard({ title, values }: MacroTrendCardProps) {
  const [range, setRange] = useState<string | undefined>(undefined);
  const [filteredValues, setFilteredValues] = useState<TrendValue[]>(values);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendData = async (
    indicator: string,
    range: string,
  ): Promise<TrendValue[]> => {
    const res = await fetch(`${fastApiBase}/api/viet/macro/trendpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ indicator, range }),
    });
    if (!res.ok) throw new Error('API 請求失敗');
    const json = await res.json();
    return json.trend as TrendValue[];
  };

  useEffect(() => {
    if (!range) return;
    setLoading(true);
    fetchTrendData(title, range)
      .then(setFilteredValues)
      .catch((err) => {
        setFilteredValues([]);
        setError('無法載入新資料，請稍後再試');
      })
      .finally(() => setLoading(false));
  }, [range, title]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>顯示 {filteredValues.length} 筆資料</CardDescription>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="選擇區間" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7天</SelectItem>
            <SelectItem value="30d">30天</SelectItem>
            <SelectItem value="90d">90天</SelectItem>
            <SelectItem value="180d">180天</SelectItem>
            <SelectItem value="360d">360天</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="text-sm text-muted-foreground px-4">載入中...</div>
        ) : filteredValues.length === 0 ? (
          <Alert>
            <AlertTitle>查無資料</AlertTitle>
            <AlertDescription>
              找不到「{title}」在所選區間內的趨勢資料。
            </AlertDescription>
          </Alert>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredValues}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        單位：{filteredValues[0]?.unit ?? '-'} ｜ 資料來源：資料庫快照
      </CardFooter>
    </Card>
  );
}
