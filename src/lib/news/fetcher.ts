import { env } from "@/lib/env";
import { fallbackArticles } from "./mock-data";
import type { Article, NewsCategory } from "./types";

type NewsApiArticle = { title?: string; description?: string; content?: string; url?: string; urlToImage?: string; publishedAt?: string; source?: { name?: string } };
type GdeltArticle = { url?: string; title?: string; seendate?: string; domain?: string; socialimage?: string; language?: string };
type NewsDataArticle = { title?: string; description?: string; content?: string; link?: string; image_url?: string; pubDate?: string; source_name?: string };

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function ensureUniqueIds(articles: Article[]): Article[] {
  const counts = new Map<string, number>();
  return articles.map((article) => {
    const count = (counts.get(article.id) || 0) + 1;
    counts.set(article.id, count);
    return count === 1 ? article : { ...article, id: `${article.id}-${count}` };
  });
}

function normalize(article: NewsApiArticle | GdeltArticle, category: string): Article | null {
  const title = article.title?.trim();
  const url = article.url?.trim();
  if (!title || !url) return null;
  const isGdeltArticle = "seendate" in article;
  if (isGdeltArticle) {
    return { id: slugify(title), title, description: "Read the latest reporting from this source.", url, imageUrl: article.socialimage || null, publishedAt: article.seendate || new Date().toISOString(), sourceName: article.domain || "GDELT", category };
  }
  const newsApiArticle = article as NewsApiArticle;
  return { id: slugify(title), title, description: newsApiArticle.description || "Read the latest reporting from this source.", content: newsApiArticle.content, url, imageUrl: newsApiArticle.urlToImage || null, publishedAt: newsApiArticle.publishedAt || new Date().toISOString(), sourceName: newsApiArticle.source?.name || "News source", category };
}

async function fromNewsApi(category: string): Promise<Article[]> {
  if (!env.NEWS_API_ORG_KEY) return [];
  const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${env.NEWS_API_ORG_KEY}`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`NewsAPI returned ${response.status}`);
  const data = (await response.json()) as { articles?: NewsApiArticle[] };
  return (data.articles || []).map((article) => normalize(article, category)).filter((article): article is Article => Boolean(article));
}

async function fromGoogleNews(category: string): Promise<Article[]> {
  if (!env.GOOGLE_NEWS_API_KEY) return [];
  const response = await fetch("https://google.serper.dev/news", { method: "POST", headers: { "X-API-KEY": env.GOOGLE_NEWS_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ q: `${category} news`, gl: "us", hl: "en", num: 12 }), next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`Google News returned ${response.status}`);
  const data = (await response.json()) as { news?: Array<NewsApiArticle & { source?: string; imageUrl?: string; date?: string }> };
  return (data.news || []).map((article) => normalize({ ...article, source: { name: article.source }, urlToImage: article.imageUrl, publishedAt: article.date }, category)).filter((article): article is Article => Boolean(article));
}

async function fromNewsData(category: string): Promise<Article[]> {
  if (!env.NEWS_DATA_API_KEY) return [];
  const params = new URLSearchParams({ apikey: env.NEWS_DATA_API_KEY, category, language: "en", country: "us" });
  const response = await fetch(`https://newsdata.io/api/1/latest?${params.toString()}`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`NewsData.io returned ${response.status}`);
  const data = (await response.json()) as { results?: NewsDataArticle[] };
  return (data.results || []).map((article): Article | null => {
    if (!article.title?.trim() || !article.link?.trim()) return null;
    return { id: slugify(article.title), title: article.title.trim(), description: article.description || "Read the latest reporting from this source.", content: article.content, url: article.link, imageUrl: article.image_url || null, publishedAt: article.pubDate || new Date().toISOString(), sourceName: article.source_name || "NewsData.io", category };
  }).filter((article): article is Article => Boolean(article));
}

async function fromGdelt(category: string): Promise<Article[]> {
  const query = encodeURIComponent(`${category} sourcelang:english`);
  const response = await fetch(`${env.GDELT_DOC_API_URL}?query=${query}&mode=ArtList&maxrecords=12&format=json&sort=HybridRel`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`GDELT returned ${response.status}`);
  const data = (await response.json()) as { articles?: GdeltArticle[] };
  return (data.articles || []).map((article) => normalize(article, category)).filter((article): article is Article => Boolean(article));
}

export async function getNews(category: NewsCategory | string = "technology"): Promise<Article[]> {
  const providers = [fromNewsApi, fromGoogleNews, fromNewsData, fromGdelt];
  for (const provider of providers) {
    try {
      const articles = await provider(category);
      if (articles.length) return ensureUniqueIds(articles);
    } catch {
      continue;
    }
  }
  return ensureUniqueIds(fallbackArticles.filter((article) => category === "all" || article.category === category || category === "technology"));
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const categories: NewsCategory[] = ["technology", "business", "sports", "entertainment", "health", "science"];
  for (const category of categories) {
    const articles = await getNews(category);
    const match = articles.find((article) => article.id === id || slugify(article.title) === id || article.id.startsWith(`${id}-`));
    if (match) return match;
  }
  return fallbackArticles.find((article) => article.id === id || slugify(article.title) === id || article.id.startsWith(`${id}-`));
}