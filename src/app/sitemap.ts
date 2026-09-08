import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { fallbackArticles } from "@/lib/news/mock-data";

export default function sitemap(): MetadataRoute.Sitemap { return [{ url: env.NEXT_PUBLIC_SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 }, ...fallbackArticles.map((article) => ({ url: `${env.NEXT_PUBLIC_SITE_URL}/article/${article.id}`, lastModified: new Date(article.publishedAt), changeFrequency: "daily" as const, priority: 0.7 }))]; }