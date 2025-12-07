"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleSheet } from "@/components/ArticleSheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article, YamlData } from "@/lib/types";

export default function ArticlesPage() {
  const params = useParams();
  const filename = decodeURIComponent(params.filename as string);
  const [data, setData] = useState<YamlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/data/${encodeURIComponent(filename)}`
        );
        if (!response.ok) {
          throw new Error("Failed to load data file");
        }
        const result = await response.json();
        result.articles = result.articles
          .filter(
            (article: Article) =>
              article.crawl_success &&
              article.extraction_success &&
              article.article
          )
          .sort(
            (a: Article, b: Article) => b.relevance_score - a.relevance_score
          );
        result.metadata.total_articles = result.articles.length;
        result.metadata.successful = result.articles.filter(
          (article: Article) =>
            article.crawl_success &&
            article.extraction_success &&
            article.article
        ).length;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filename]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-96" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Error loading data
            </h2>
            <p className="mt-2 text-muted-foreground">
              {error || "Data file not found"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{data.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{data.name}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Query:</span> {data.metadata.query}
            </div>
            <div>
              <span className="font-medium">Total Articles:</span>{" "}
              {data.metadata.total_articles}
            </div>
            <div>
              <span className="font-medium">Successful:</span>{" "}
              {data.metadata.successful}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {data.articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              No articles found
            </h2>
            <p className="mt-2 text-muted-foreground">
              This data file does not contain any articles
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Articles ({data.articles.length})
            </h2>
            <div className="flex flex-col gap-6">
              {data.articles.map((article, idx) => (
                <ArticleCard
                  key={`${article.url}-${idx}`}
                  article={article}
                  onCardClick={() => handleArticleClick(article)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <ArticleSheet
        article={selectedArticle}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
