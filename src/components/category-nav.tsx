import Link from "next/link";
import type { NewsCategory } from "@/lib/news/types";

const categories: Array<[string, NewsCategory]> = [["Technology", "technology"], ["Business", "business"], ["Sports", "sports"], ["Culture", "entertainment"], ["Health", "health"], ["Science", "science"]];

export function CategoryNav({ active }: { active?: string }) {
  return <nav className="sticky top-0 z-20 border-b border-[#d9ded5] bg-[#f4f5ef]/95 backdrop-blur-md"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 lg:px-8">{categories.map(([label, slug]) => <Link key={slug} href={`/?category=${slug}`} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${active === slug ? "bg-[#1d5c45] text-white" : "text-[#6a756e] hover:bg-[#e8ece3] hover:text-[#17211b]"}`}>{label}</Link>)}</div></nav>;
}