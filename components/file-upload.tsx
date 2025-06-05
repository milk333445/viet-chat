'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type FileUploadProps = {
  onUpload: (file: File) => void
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onUpload(file)  // ✅ 正確地呼叫 props 中的 callback
      toast.success('檔案已選擇')
    }
  }

  return (
    <div className="grid gap-3 w-full max-w-sm">
      <Label htmlFor="file-upload" className="text-sm font-medium">選擇檔案</Label>

      {/* 隱藏的原始 input */}
      <Input
        id="file-upload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          {fileName ? '重新選擇' : '上傳檔案'}
        </Button>
        {fileName && (
          <span className="text-sm text-muted-foreground truncate max-w-[160px]">
            {fileName}
          </span>
        )}
      </div>
    </div>
  )
}
