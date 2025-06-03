import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Markdown } from './markdown';
import { Button } from './ui/button';
import { sanitizeText } from '@/lib/utils';

export const ToolResultCollapsible = ({
  result,
  toolName,
}: {
  result: string;
  toolName: string;
}) => {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline">{toolName} 工具結果</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <Markdown>{sanitizeText(result)}</Markdown>
      </CollapsibleContent>
    </Collapsible>
  );
};
