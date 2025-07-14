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
    <div className="flex items-center gap-2 bg-background p-2 rounded-xl">
        {/* Agent 模式 */}
      <Button
        type="button"
        variant={inputMode === "agent" ? "default" : "ghost"}
        className="flex items-center gap-1 rounded-full px-4 py-1 text-sm"
        onClick={() => setInputMode("agent")}
      >
        <BotIcon className="size-4" />
        Agent 模式
      </Button>
      {/* 一般對話 */}
      <Button
        type="button"
        variant={inputMode === "normal" ? "default" : "ghost"}
        className="flex items-center gap-1 rounded-full px-4 py-1 text-sm"
        onClick={() => setInputMode("normal")}
      >
        <MessageCircleIcon className="size-4" />
        一般對話
      </Button>

      {/* 深度檢索 */}
      <Button
        type="button"
        variant={inputMode === "deep_research" ? "default" : "ghost"}
        className="flex items-center gap-1 rounded-full px-4 py-1 text-sm"
        onClick={() => setInputMode("deep_research")}
      >
        <SearchIcon className="size-4" />
        深度檢索
      </Button>

    </div>
  );
}
