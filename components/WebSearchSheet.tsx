'use client';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { parseWebSearchResult } from '@/lib/utils';

type ArticleDetail = {
  url: string;
  title?: string;
  snippet?: string;
  published?: string;
  score?: number;
  error?: string;
  engine?: string;
};

type Props = {
  resultText: string;
  triggerText?: string;
};

const fastApiBase = process.env.NEXT_PUBLIC_FASTAPI_API_URL;
async function fetchArticleDetails(urls: string[]): Promise<ArticleDetail[]> {
  const res = await fetch(`${fastApiBase}/api/agent/articles/detail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  });

  if (!res.ok) {
    throw new Error('無法取得文章詳情');
  }

  const data = await res.json();
  console.log('[fetchArticleDetails] 成功取得資料:', data);
  return data;
}

export function WebSearchSheet({ resultText, triggerText = '查看搜尋來源' }: Props) {
  const { urls, rawText, isStructured } = parseWebSearchResult(resultText);
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isStructured || urls.length === 0) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const urlList = urls.map((a) => a.url);
        const data = await fetchArticleDetails(urlList);
        setArticles(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resultText]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[800px] !max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>網頁搜尋來源</SheetTitle>
          <SheetDescription>LLM 查詢結果所依據的網路資料來源</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {!isStructured ? (
            <Alert variant="destructive">
              <Info className="size-4" />
              <AlertTitle>查無來源</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {rawText || '未能擷取任何來源連結'}
              </AlertDescription>
            </Alert>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">🔄 讀取中...</p>
          ) : (
            articles?.map((article, index) => (
              <Card key={index}>
                <CardHeader className="pt-2 pb-1 px-4 space-y-1">
                    <CardTitle className="text-sm font-medium leading-snug line-clamp-2">
                        <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-words"
                        >
                        {article.title || article.url}
                        </a>
                    </CardTitle>
                    </CardHeader>
                <CardContent className="text-sm px-4 pb-3 text-muted-foreground space-y-1">
                    <p>
                        <strong>搜尋引擎：</strong> {article.engine}
                    </p>
                    <p>
                        <strong>相關性分數：</strong> {article.score?.toFixed?.(2) ?? '無'}
                    </p>
                    {article.error && (
                        <p className="text-red-500">
                        <strong>錯誤：</strong> {article.error}
                        </p>
                    )}
                    <p className="whitespace-pre-line">
                        <strong>摘要：</strong> {article.snippet}
                    </p>
                    </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
