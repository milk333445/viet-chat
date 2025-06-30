'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { parseVietMacroTrend } from '@/lib/utils';
import { Info } from 'lucide-react';

interface Props {
  summary: string;
  triggerText?: string;
}

import { MacroTrendCard } from './VietMacroTrendCard';

export function VietMacroTrendSheet({
  summary,
  triggerText = '查看經濟指標趨勢',
}: Props) {
  const { trends, isStructured, rawText } = parseVietMacroTrend(summary);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="!w-[700px] !max-w-full overflow-y-auto"
      >
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
              <MacroTrendCard
                key={idx}
                title={trend.title}
                values={trend.values}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
