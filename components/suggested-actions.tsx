'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { VisibilityType } from './visibility-selector';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  append,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: '查詢',
      label: 'HPG 股票的即時價格',
      action: '請問 HPG 股票目前的價格是多少？',
    },
    {
      title: '查看',
      label: 'FPT 股票近一週的趨勢',
      action: '幫我看看 FPT 股票近一週的價格趨勢如何？',
    },
    {
      title: '查看',
      label: 'FPT 股票日內價格變化',
      action: '幫我看看 FPT 今年7月2日日內交易價格變化?',
    },
    {
      title: '瞭解',
      label: '聯準會最近 30 天的發布內容',
      action: '聯準會最近 30 天有發布過什麼重要的內容嗎？請幫我整理一下。',
    },
    {
      title: '摘要',
      label: '最近的利率相關新聞',
      action: '幫我摘要最近與利率相關的新聞內容，要標記時間與來源連結。',
    },
    {
      title: '越南總體數據',
      label: '越南總體數據查詢',
      action: '幫我查過去半年越南公布總經數據摘要。',
    },
    {
      title: '越南總體個別數據',
      label: '越南總體個別數據查詢',
      action: '幫我查過去半年越南公布CPI跟FDI趨勢變化。',
    },
    {
      title: '檔案',
      label: '檔案詢問摘要',
      action: '幫我摘要我上傳的檔案內容，並且寫成一份報告。',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  },
);
