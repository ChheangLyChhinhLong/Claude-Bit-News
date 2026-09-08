import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import { SiteHeader } from "@/components/site-header";
import { getArticle } from "@/lib/news/fetcher";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const article = await getArticle((await params).id);
  return { title: article?.title || "Article", description: article?.description, openGraph: article ? { title: article.title, description: article.description, images: article.imageUrl ? [article.imageUrl] : [] } : undefined };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const article = await getArticle((await params).id);
  if (!article) return <><SiteHeader /><main className="mx-auto max-w-3xl px-5 py-24"><h1 className="display-face text-5xl font-bold">Story not found</h1><Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1d5c45]"><ArrowLeft size={16} /> Back to Claude Bit News</Link></main></>;
  const suppliedText = [article.content, article.description].find((text) => text && !/only available in paid plans|subscribe to read|sign in to read/i.test(text)) || article.description;
  const paragraphs = suppliedText.split(/(?<=[.!?])\s+/).reduce<string[]>((items, sentence, index) => { const slot = Math.floor(index / 3); items[slot] = `${items[slot] || ""} ${sentence}`.trim(); return items; }, []);
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: article.title, description: article.description, datePublished: article.publishedAt, image: article.imageUrl ? [article.imageUrl] : [], author: { "@type": "Organization", name: "Claude Bit News" }, publisher: { "@type": "Organization", name: "Claude Bit News" }, mainEntityOfPage: `${env.NEXT_PUBLIC_SITE_URL}/article/${article.id}` };
  return <><SiteHeader /><main className="mx-auto max-w-4xl px-5 pb-20 lg:px-8"><Link href="/" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6a756e] hover:text-[#1d5c45]"><ArrowLeft size={15} /> All stories</Link><article className="mt-10"><div className="max-w-3xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e86e42]">{article.category} / {article.sourceName}</p><h1 className="display-face text-5xl font-bold leading-[0.96] md:text-7xl">{article.title}</h1><p className="mt-6 text-xl leading-8 text-[#657168]">{article.description}</p><p className="mt-5 text-xs text-[#879189]">Published {new Date(article.publishedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p></div>{article.imageUrl ? <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-2xl"><Image src={article.imageUrl} alt="" fill unoptimized priority sizes="(max-width: 768px) 100vw, 900px" className="object-cover" /></div> : null}<div className="mx-auto mt-10 max-w-2xl text-lg leading-8 text-[#3f4b43]">{paragraphs.map((paragraph, index) => <div key={paragraph}>{index === 1 ? <div className="my-8"><AdBanner size="native" /></div> : null}<p className="mb-6">{paragraph}</p></div>)}</div></article></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></>;
}