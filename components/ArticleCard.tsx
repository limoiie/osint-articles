"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ImageOff, MoreHorizontal, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ArticleCardProps {
  article: Article;
  onCardClick: () => void;
}

export function ArticleCard({ article, onCardClick }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.url, "_blank", "noopener,noreferrer");
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick();
    }
  };

  const relevancePercentage = (article.relevance_score / 10) * 100;
  const hasArticleData =
    article.crawl_success && article.extraction_success && article.article;
  const failureReason = !article.crawl_success
    ? "Failed to crawl"
    : !article.extraction_success
    ? "Failed to extract content"
    : "No article data available";

  return (
    <Card
      className={cn(
        "py-2 group relative overflow-hidden transition-all",
        hasArticleData
          ? "cursor-pointer hover:border-primary hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          : "opacity-75"
      )}
      onClick={hasArticleData ? onCardClick : undefined}
      onKeyDown={hasArticleData ? handleKeyDown : undefined}
      tabIndex={hasArticleData ? 0 : undefined}
      role="article"
      aria-label={`Article: ${article.original_title}${
        !hasArticleData ? " (unavailable)" : ""
      }`}
    >
      <div className="flex gap-4 p-4">
        {article.thumbnail_url && !imageError ? (
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={article.thumbnail_url}
              alt={article.original_title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="128px"
              onError={() => setImageError(true)}
              unoptimized={article.thumbnail_url.includes("gstatic.com")}
              loading="lazy"
            />
          </div>
        ) : article.thumbnail_url && imageError ? (
          <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-md bg-muted">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 flex-1 text-base leading-tight">
              {article.original_title}
            </CardTitle>
            <div className="flex shrink-0 items-center gap-1">
              {hasArticleData && article.article && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      onClick={handleMoreClick}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      aria-label="Show more details"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96" side="top" align="end">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold text-foreground">
                          Summary
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {article.article.summary}
                        </p>
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-foreground">
                            Source:
                          </span>
                          <span className="text-muted-foreground">
                            {article.article.source}
                          </span>
                        </div>
                        {article.article.published_date && (
                          <div className="flex justify-between">
                            <span className="font-medium text-foreground">
                              Published:
                            </span>
                            <span className="text-muted-foreground">
                              {format(
                                new Date(article.article.published_date),
                                "PPP"
                              )}
                            </span>
                          </div>
                        )}
                        {article.article.updated_date && (
                          <div className="flex justify-between">
                            <span className="font-medium text-foreground">
                              Updated:
                            </span>
                            <span className="text-muted-foreground">
                              {format(
                                new Date(article.article.updated_date),
                                "PPP"
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {article.article.authors &&
                        article.article.authors.length > 0 && (
                          <div>
                            <h5 className="mb-1 text-sm font-medium text-foreground">
                              Authors
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              {article.article.authors.join(", ")}
                            </p>
                          </div>
                        )}

                      {article.article.categories &&
                        article.article.categories.length > 0 && (
                          <div>
                            <h5 className="mb-1 text-sm font-medium text-foreground">
                              Categories
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {article.article.categories.map(
                                (category, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {category}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {article.article.tags &&
                        article.article.tags.length > 0 && (
                          <div>
                            <h5 className="mb-1 text-sm font-medium text-foreground">
                              Tags
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {article.article.tags.map((tag, idx) => (
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

                      {article.article.key_points &&
                        article.article.key_points.length > 0 && (
                          <div>
                            <h5 className="mb-2 text-sm font-medium text-foreground">
                              Key Points
                            </h5>
                            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                              {article.article.key_points.map((point, idx) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <button
                onClick={handleExternalLinkClick}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Open article in new tab"
              >
                <SquareArrowOutUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <CardDescription className="line-clamp-2 text-sm">
            {article.original_snippet}
          </CardDescription>
          {!hasArticleData && (
            <div className="rounded-md bg-destructive/10 px-3 py-2">
              <p className="text-xs font-medium text-destructive">
                {failureReason}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-32 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Relevance</span>
                <Badge variant="secondary" className="text-xs">
                  {article.relevance_score.toFixed(2)}
                </Badge>
              </div>
              <Progress value={relevancePercentage} className="h-1.5" />
            </div>
            <div className="ml-auto flex shrink-0 flex-wrap items-center gap-1.5">
              {hasArticleData && article.article && article.article.source && (
                <Badge variant="default" className="text-xs font-medium">
                  {article.article.source}
                </Badge>
              )}
              {article.rank > 0 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  #{article.rank}
                </Badge>
              )}
              {!hasArticleData && (
                <Badge variant="destructive" className="text-xs font-medium">
                  Unavailable
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
