'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function ManualFileUploadDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!filename || !content) {
      toast.warning('請輸入檔名與內容')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/files/manual-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '建立失敗')

      toast.success('已新增檔案')
      setOpen(false)
      setFilename('')
      setContent('')
      onSuccess?.()
    } catch (err: any) {
      toast.error(err.message || '無法新增檔案')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">手動新增內容</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>手動新增內容檔案</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="請輸入檔名，例如 note.md"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
          <Textarea
            placeholder="輸入內容..."
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
