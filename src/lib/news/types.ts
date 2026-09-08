export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: string;
}

export type NewsCategory = "technology" | "business" | "sports" | "entertainment" | "health" | "science";