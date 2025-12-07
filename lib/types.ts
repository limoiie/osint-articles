export interface YamlMetadata {
  query: string;
  processed_at: string;
  total_articles: number;
  successful: number;
}

export interface ArticleMetadata {
  title: string;
  summary: string;
  source: string;
  published_date: string;
  updated_date: string;
  authors: string[];
  categories: string[];
  tags: string[];
  key_points: string[];
  entities_mentioned: string[];
  has_paywall: boolean;
  content_type: string;
  markdown_content?: string;
}

export interface Article {
  url: string;
  original_title: string;
  original_snippet: string;
  thumbnail_url: string;
  relevance_score: number;
  relevance_interpretation: string;
  rank: number;
  crawl_success: boolean;
  extraction_success: boolean;
  article?: ArticleMetadata;
  error?: string;
}

export interface YamlData {
  name: string;
  metadata: YamlMetadata;
  articles: Article[];
}

export interface DataFileInfo {
  filename: string;
  data: YamlData;
}

