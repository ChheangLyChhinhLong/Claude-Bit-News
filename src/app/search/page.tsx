import { Search } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { SiteHeader } from "@/components/site-header";
import { getNews } from "@/lib/news/fetcher";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = ((await searchParams).q || "").trim();
  const articles = (await getNews("all")).filter((article) => !query || `${article.title} ${article.description} ${article.category}`.toLowerCase().includes(query.toLowerCase()));
  return <><SiteHeader /><main className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e86e42]">The archive</p><h1 className="display-face mt-3 text-5xl font-bold">Search the signal</h1><form className="mt-8 flex max-w-2xl items-center gap-3 border-b-2 border-[#17211b] pb-3"><Search size={20} className="text-[#e86e42]" /><input name="q" defaultValue={query} placeholder="Try a topic, source, or idea" className="w-full bg-transparent text-lg outline-none placeholder:text-[#9aa49c]" /><button className="text-xs font-bold uppercase tracking-[0.15em] text-[#1d5c45]" type="submit">Search</button></form><p className="mt-10 text-sm text-[#6a756e]">{articles.length} {articles.length === 1 ? "story" : "stories"}{query ? ` matching “${query}”` : " in the latest briefing"}</p><section className="mt-6 grid gap-x-6 gap-y-8 md:grid-cols-3">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</section></main></>;
}