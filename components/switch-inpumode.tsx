import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"; // 確保你有這個元件
import { MessageCircleIcon, SearchIcon, BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle({
  inputMode,
  setInputMode,
}: {
  inputMode: "normal" | "deep_research" | "agent";
  setInputMode: (mode: "normal" | "deep_research" | "agent") => void;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2 bg-background p-2 rounded-xl">
        {/* Agent 模式 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={inputMode === "agent" ? "default" : "ghost"}
              className="flex items-center gap-1 rounded-full px-4 py-1 text-sm"
              onClick={() => setInputMode("agent")}
            >
              <BotIcon className="size-4" />
              Agent 模式
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            使用多工具推理的 AI 模式，適合處理複雜問題
          </TooltipContent>
        </Tooltip>

        {/* 一般對話 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={inputMode === "normal" ? "default" : "ghost"}
              className="flex items-center gap-1 rounded-full px-4 py-1 text-sm"
              onClick={() => setInputMode("normal")}
            >
              <MessageCircleIcon className="size-4" />
              一般對話(實驗)
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            基本聊天模式，無需使用外部工具
          </TooltipContent>
        </Tooltip>

        {/* 深度檢索 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={inputMode === "deep_research" ? "default" : "ghost"}
              className="flex items-center gap-1 rounded-full px-4 py-1 text-sm"
              onClick={() => setInputMode("deep_research")}
            >
              <SearchIcon className="size-4" />
              深度檢索(實驗)
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            查詢網路資訊或資料庫以補充答案
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
