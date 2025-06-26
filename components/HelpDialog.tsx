'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"

export function HelpDialog() {
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-primary text-lg">使用教學</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed">

          {/* 歡迎區塊 */}
          <div className="bg-muted/40 rounded-md p-4">
            <p>
              歡迎使用 <strong className="text-primary">富邦投信智能小幫手</strong>！<br />
              本系統支援以 <strong className="text-amber-700">自然語言</strong> 查詢越南市場資訊，
              並可上傳檔案協助分析報表或新聞內容。
            </p>
          </div>

          {/* 主要功能 */}
          <div>
            <Separator className="my-4" />
            <h3 className="font-semibold text-base text-blue-600 mb-1">主要功能</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>提問市場問題，例如「越南通膨趨勢如何？」</li>
              <li>上傳文件並由系統摘要、提取重點</li>
              <li>查詢歷史對話紀錄，追蹤過往提問</li>
            </ul>
          </div>

          {/* 工具區 */}
          <div>
            <Separator className="my-4" />
            <h3 className="font-semibold text-base text-green-700 mb-1">可使用的功能</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>查詢越南股票的即時價格與漲跌幅</li>
              <li>了解某支股票近幾天的價格走勢</li>
              <li>查看特定日期內的每小時股價變化</li>
              <li>取得最新美聯儲會議資訊與政策內容</li>
              <li>查詢越南最新總體經濟數據（如 GDP、CPI）</li>
              <li>追蹤經濟指標的歷史變化趨勢</li>
              <li>搜尋越南市場相關的即時新聞</li>
              <li>查看您上傳的文件清單</li>
              <li>讓系統閱讀並解釋您的 PDF 或 Excel 檔案</li>
            </ul>
          </div>

          {/* 範例區 */}
          <div>
            <Separator className="my-4" />
            <h3 className="font-semibold text-base text-purple-700 mb-1">範例提問</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>「請幫我查找最新的越南 GDP 數據」</li>
              <li>「比較 HPX 和 VHM 的股價趨勢」</li>
              <li>「請幫我讀一下我上傳的 PDF 財報內容」</li>
            </ul>
          </div>

          {/* Footer 提示 */}
          <p className="text-muted-foreground italic text-xs">
            若有更多使用問題，請聯絡金控數科 Max。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
