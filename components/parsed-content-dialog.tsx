// components/parsed-content-dialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown"; // 確保這路徑正確

export function ParsedContentDialog({ result }: { result: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">查看解析內容</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>解析內容</DialogTitle>
        </DialogHeader>
        <div className="prose max-w-none">
          <Markdown>{result}</Markdown>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>關閉</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
