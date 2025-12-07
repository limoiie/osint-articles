"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownReportSheetProps {
  markdownReport: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export function MarkdownReportSheet({
  markdownReport,
  open,
  onOpenChange,
  title = "Analysis Report",
}: MarkdownReportSheetProps) {
  if (!markdownReport) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl">
        <SheetHeader>
          <SheetTitle className="pr-6 text-xl">{title}</SheetTitle>
          <SheetDescription>
            Detailed analysis report for this dataset
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-8rem)] pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownReport}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
