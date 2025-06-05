'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/file-upload'
import { ArrowLeft } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'

export default function FileManagerPage() {
  const router = useRouter()

  const [files, setFiles] = useState<Array<{
    url: string
    name: string
    type: string
    size: number
    uploadedAt: number
    parsed?: boolean
    summary?: string | null
  }>>([])

  useEffect(() => {
    fetch('/api/files/list')
      .then(res => res.json())
      .then(data => setFiles(data.files))
  }, [])

  const handleDelete = async (fileName: string) => {
    await fetch(`/api/files/delete`, {
      method: 'POST',
      body: JSON.stringify({ name: fileName }),
      headers: { 'Content-Type': 'application/json' },
    })
    setFiles(prev => prev.filter(f => f.name !== fileName))
    toast.success('檔案已刪除')
  }

  const handleParse = async (fileName: string) => {
  toast(`開始解析 ${fileName}...`)

  const res = await fetch('/api/files/mock-parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: fileName }),
  })

  const data = await res.json()

  if (res.ok && data.success) {
    toast.success(`${fileName} 解析成功`)

    // 重新載入解析後資料
    fetch('/api/files/list')
      .then(res => res.json())
      .then(data => setFiles(data.files))
  } else {
    toast.error(`${fileName} 解析失敗：${data.error || '未知錯誤'}`)
  }
}

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-screen-lg">
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">檔案管理中心</h1>

        <div className="mb-6">
          <FileUpload
            onUpload={(file) => {
              const formData = new FormData()
              formData.append('file', file)

              fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
              })
                .then(res => res.json())
                .then(data => {
                  if (!data.url || !data.name) {
                    toast.error('回傳資料不完整')
                    return
                  }

                  setFiles(prev => {
                    const alreadyExists = prev.some(f => f.url === data.url)
                    if (alreadyExists) return prev
                    return [...prev, {
                      url: data.url,
                      name: data.name,
                      type: data.contentType || 'unknown',
                      size: data.size || 0,
                      uploadedAt: Date.now(),
                      parsed: false,
                      summary: null
                    }]
                  })

                  toast.success('檔案上傳成功')
                })
                .catch(() => toast.error('上傳失敗'))
            }}
          />
        </div>

        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>檔案名稱</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>預覽</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>摘要</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.url}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>
                {file.parsed ? (
                    <span className="text-green-600 font-medium">已解析</span>
                ) : (
                    <Button size="sm" onClick={() => handleParse(file.name)}>
                    解析
                    </Button>
                )}
                </TableCell>
                <TableCell>
                  {file.type?.startsWith("image") ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      圖片
                    </a>
                  ) : file.type === "application/pdf" ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      PDF
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">不支援預覽</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(file.name)}>
                    刪除
                  </Button>
                </TableCell>
                <TableCell>
                {typeof file.summary === 'string' ? (
                <span className="text-sm text-gray-700">
                    {file.summary.slice(0, 50)}...
                </span>
                ) : (
                <span className="text-muted-foreground text-sm">尚未解析</span>
                )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
