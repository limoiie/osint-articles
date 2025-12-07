"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Article } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

interface ArticleSheetProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showMetadata?: boolean; // Flag to control whether to show metadata or markdown
}

export function ArticleSheet({
  article,
  open,
  onOpenChange,
  showMetadata = false,
}: ArticleSheetProps) {
  if (!article) return null;

  const hasArticleData =
    article.crawl_success && article.extraction_success && article.article;
  const failureReason = !article.crawl_success
    ? "Failed to crawl this article"
    : !article.extraction_success
    ? "Failed to extract content from this article"
    : "No article data available";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl">
        <SheetHeader>
          <SheetTitle className="pr-6 text-xl">
            {article.original_title}
          </SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-2 pt-2">
            {hasArticleData && article.article && article.article.source && (
              <Badge variant="outline">{article.article.source}</Badge>
            )}
            {!hasArticleData && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              View original article
            </a>
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none px-8">
            {!hasArticleData ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-lg bg-destructive/10 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-destructive">
                    Content Unavailable
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {failureReason}
                  </p>
                  {article.error && (
                    <details className="mt-4 text-left">
                      <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                        Show error details
                      </summary>
                      <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs text-foreground">
                        {article.error}
                      </pre>
                    </details>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    You can still view the original article using the link
                    above.
                  </p>
                </div>
              </div>
            ) : showMetadata ? (
              <div className="space-y-6 py-6">
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-foreground">
                    Summary
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {article.article?.summary}
                  </p>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-medium text-foreground">Source:</span>
                    <span className="text-muted-foreground">
                      {article.article?.source}
                    </span>
                  </div>
                  {article.article?.published_date && (
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-medium text-foreground">
                        Published:
                      </span>
                      <span className="text-muted-foreground">
                        {format(
                          new Date(article.article?.published_date),
                          "PPP"
                        )}
                      </span>
                    </div>
                  )}
                  {article.article?.updated_date && (
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-medium text-foreground">
                        Updated:
                      </span>
                      <span className="text-muted-foreground">
                        {format(new Date(article.article?.updated_date), "PPP")}
                      </span>
                    </div>
                  )}
                </div>

                {article.article?.authors &&
                  article.article.authors.length > 0 && (
                    <div>
                      <h5 className="mb-2 text-sm font-semibold text-foreground">
                        Authors
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {article.article.authors.join(", ")}
                      </p>
                    </div>
                  )}

                {article.article?.categories &&
                  article.article.categories.length > 0 && (
                    <div>
                      <h5 className="mb-2 text-sm font-semibold text-foreground">
                        Categories
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {article.article.categories.map((category, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {article.article?.tags && article.article.tags.length > 0 && (
                  <div>
                    <h5 className="mb-2 text-sm font-semibold text-foreground">
                      Tags
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {article.article?.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {article.article?.key_points &&
                  article.article?.key_points.length > 0 && (
                    <div>
                      <h5 className="mb-3 text-sm font-semibold text-foreground">
                        Key Points
                      </h5>
                      <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                        {article.article.key_points.map((point, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-foreground"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-semibold text-foreground"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-semibold text-foreground"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  p: ({ node, ...props }) => (
                    <p
                      className="text-sm leading-relaxed text-foreground"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc space-y-1 pl-6 text-sm text-foreground"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal space-y-1 pl-6 text-sm text-foreground"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  li: ({ node, ...props }) => (
                    <li className="text-sm" {...props} />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-primary pl-4 italic text-muted-foreground"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code
                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className="block rounded-md bg-muted p-4 font-mono text-xs text-foreground"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  pre: ({ node, ...props }) => (
                    <pre
                      className="overflow-x-auto rounded-md bg-muted p-4"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto">
                      <table
                        className="min-w-full border-collapse border border-border"
                        {...props}
                      />
                    </div>
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  th: ({ node, ...props }) => (
                    <th
                      className="border border-border bg-muted px-4 py-2 text-left font-semibold"
                      {...props}
                    />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  td: ({ node, ...props }) => (
                    <td className="border border-border px-4 py-2" {...props} />
                  ),
                }}
              >
                {article.article?.markdown_content ?? ""}
              </ReactMarkdown>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
