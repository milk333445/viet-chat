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
} from '@/components/ui/card'

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseNewsSummary } from '@/lib/utils' // 你自己放的位置

type Props = {
  summary: string
  triggerText?: string
}

export function NewsSummarySheet({ summary, triggerText = '查看新聞摘要來源' }: Props) {
  console.log('Summary:', { summary })
  const { articles, rawText, isStructured } = parseNewsSummary(summary)
  console.log('Summary:', { summary })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[700px] !max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>越南新聞摘要</SheetTitle>
          <SheetDescription>由關鍵字搜尋並透過 LLM 摘要的新聞內容</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {!isStructured ? (
            <Alert variant="destructive">
              <Info className="w-4 h-4" />
              <AlertTitle>查無資料</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {rawText || '目前找不到相關新聞，請稍後再試。'}
              </AlertDescription>
            </Alert>
          ) : (
            articles.map((article, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{article.title}</CardTitle>
                  <CardDescription>
                    {article.time} ｜ 📂 類別 : {article.category} ｜ ⭐️ 相關性: {article.rank}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Collapsible>
                    <div className="flex items-center justify-between">
                      <strong>📝 摘要內容</strong>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs px-2">
                          查看內容
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="whitespace-pre-line mt-2">
                      {article.content}
                    </CollapsibleContent>
                  </Collapsible>
                  <div className="mt-2">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      🔗 前往原文
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
