import Link from "next/link";
import { getDataFiles } from "@/lib/yaml-utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calendar, FileText } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const dataFiles = getDataFiles();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">OSINT Articles</h1>
              <p className="mt-2 text-muted-foreground">
                Browse analyzed news articles from various data sources
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {dataFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No data files found</h2>
            <p className="mt-2 text-muted-foreground">
              Add YAML files to the data directory to get started
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Available Data Files ({dataFiles.length})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dataFiles.map((file) => (
                <Link
                  key={file.filename}
                  href={`/articles/${encodeURIComponent(file.filename)}`}
                  className="transition-transform hover:scale-105"
                >
                  <Card className="h-full cursor-pointer hover:border-primary">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{file.data.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(file.data.metadata.processed_at), "PPP")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Query</p>
                          <p className="text-sm text-foreground">{file.data.metadata.query}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {file.data.metadata.total_articles} articles
                          </Badge>
                          <Badge variant="outline">
                            {file.data.metadata.successful} successful
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
