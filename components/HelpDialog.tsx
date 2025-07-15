'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import {
  BotIcon,
  SearchIcon,
  BrainIcon,
} from 'lucide-react';


export function HelpDialog() {
  const modes = [
    {
      icon: <BotIcon className="w-6 h-6 text-primary" />,
      title: 'Agent 模式',
      desc: '可使用內建工具即時查詢越南股票、總經數據與即時新聞，並閱讀上傳的 PDF 或 Excel 文件，適合處理即時查詢與數據輔助任務。',
      features: [
        '查詢股票即時價格與近五日走勢',
        '查詢 GDP、CPI 等經濟指標',
        '查看即時新聞與央行政策摘要',
        '讀取與摘要財報 PDF / Excel',
      ],
      examples: [
        '「查詢 Vinamilk 昨天的收盤價」',
        '「讀取我上傳的財報並摘要重點」',
        '「請幫我找 5 月份 CPI 資料」',
      ],
    },
    {
      icon: <BrainIcon className="w-6 h-6 text-primary" />,
      title: '一般問答模式',
      desc: '支援語意釐清、詞句翻譯與說明市場專有名詞，適合用於日常提問、報告潤飾與語句修正。',
      features: [
        '解釋財經與投資術語',
        '中英越三語句子翻譯',
        '幫助修改與優化市場觀察語句',
      ],
      examples: [
        '「什麼是 ROE？和 ROA 差在哪？」',
        '「幫我翻譯這段成英文摘要」',
        '「這句話太口語，幫我改正式一點」',
      ],
    },
    {
      icon: <SearchIcon className="w-6 h-6 text-primary" />,
      title: 'Deep Search 模式',
      desc: '具備多輪自動搜尋與資料整合能力，會反思知識缺口並補強資訊，提供具引用來源的完整回答，適合主題研究與內容撰寫。',
      features: [
        '根據提問自動生成搜尋關鍵字',
        '從多筆來源彙整觀點並補充缺口',
        '回答內容附引用來源與摘要',
      ],
      examples: [
        '「請整理越南鋼鐵出口趨勢」',
        '「幫我分析越南電動車政策演變」',
        '「彙整 VinFast 的國際市場布局」',
      ],
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <span className="size-4 mr-2 inline-block">
            <HelpCircle size={16} />
          </span>
          使用教學
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-lg">使用教學</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 leading-relaxed">
          {/* 歡迎區塊 */}
          <div className="bg-muted/40 rounded-md p-4">
            <p>
              歡迎使用 <strong className="text-primary">富邦投信智能小幫手 VinaBot</strong>！<br />
              您可透過 <strong className="text-amber-700">自然語言</strong> 查詢越南市場資訊，
              並上傳檔案協助閱讀財報、新聞或統計資料、或進行深度檢索。
            </p>
          </div>

          {/* 模式 Carousel */}
          <div>
            <Separator className="my-4" />
            <h3 className="font-semibold text-base mb-2">支援三種模式</h3>

            <Carousel className="relative w-full">
              <CarouselContent className="px-4">
                {modes.map((mode, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <div className="p-2">
                      <Card className="h-full shadow-md">
                        <CardContent className="p-6 flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{mode.icon}</span>
                            <h4 className="font-semibold text-lg text-primary">{mode.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{mode.desc}</p>

                          <div>
                            <h5 className="font-medium text-base mb-1">主要功能</h5>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {mode.features.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium text-base mb-1">範例提問</h5>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {mode.examples.map((ex, i) => (
                                <li key={i}>{ex}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="-left-2 w-10 h-10 [&>svg]:w-6 [&>svg]:h-6 z-10" />
              <CarouselNext className="-right-2 w-10 h-10 [&>svg]:w-6 [&>svg]:h-6 z-10" />
            </Carousel>

            <p className="text-xs italic text-muted-foreground mt-2 text-center">
              建議依任務類型切換模式：即時查詢越南資訊選 Agent、主題研究選 Deep Search、日常提問用 一般問答。
            </p>
          </div>

          {/* Footer 提示 */}
          <p className="text-muted-foreground italic text-xs text-center">
            若有更多使用問題，請聯絡金控數科 Max (分機 57546)。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
