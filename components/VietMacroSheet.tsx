'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { parseVietMacroSummary } from '@/lib/utils'

type Props = {
  summary: string
  triggerText?: string
}

export function VietMacroSheet({ summary, triggerText = '查看總經摘要' }: Props) {
  const { indicators, startDate, endDate, rawText, isStructured } = parseVietMacroSummary(summary)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[700px] !max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>越南總經摘要</SheetTitle>
          <SheetDescription>
            顯示 {startDate} ~ {endDate} 期間的最新指標
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {!isStructured ? (
            <Alert variant="destructive">
              <Info className="size-4" />
              <AlertTitle>查無資料</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {rawText || '目前找不到總經資料，請稍後再試。'}
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>指標名稱</TableHead>
                  <TableHead>數值</TableHead>
                  <TableHead>單位</TableHead>
                  <TableHead>資料日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indicators.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.value || '—'}</TableCell>
                    <TableCell>{item.unit || '—'}</TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
