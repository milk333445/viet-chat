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
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { parseFedSummary } from "@/lib/utils"

type Props = {
  summary: string
  triggerText?: string
}

export function FedMeetingSheet({ summary, triggerText = "查看 Fed 會議紀錄" }: Props) {
  const { meetings, rawText } = parseFedSummary(summary)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[700px] !max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>聯準會會議摘要</SheetTitle>
          <SheetDescription>檢索來自 FOMC 的歷史會議資料</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {meetings.length === 0 ? (
            <Alert variant="destructive">
              <Info className="w-4 h-4" />
              <AlertTitle>查無資料</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {rawText || "目前沒有可用的會議記錄，請稍後再試。"}
              </AlertDescription>
            </Alert>
          ) : (
            meetings.map((m, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>📅 會議日期：{m.meetingDate}</CardTitle>
                  <CardDescription>公布日期：{m.releaseDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm leading-relaxed">
                  <Collapsible>
                    <div className="flex items-center justify-between">
                      <strong>📣 Statement</strong>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs px-2">
                          查看內容
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="whitespace-pre-line mt-2">
                      {m.statement}
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="mt-2">
                    <a
                      href={m.statementLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mr-4"
                    >
                      📄 Full Statement
                    </a>
                    <a
                      href={m.minutesLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      📝 Full Minutes
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
