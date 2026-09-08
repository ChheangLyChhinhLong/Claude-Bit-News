export function AdBanner({ size = "rectangle" }: { size?: "leaderboard" | "mobile" | "rectangle" | "native" }) {
  const dimensions = { leaderboard: "min-h-[90px]", mobile: "min-h-[50px]", rectangle: "min-h-[250px]", native: "min-h-[120px]" }[size];
  if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) return <div className={`grain ${dimensions} flex items-center justify-center border border-dashed border-[#c7cec5] bg-[#e9ece5] text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a958c]`} aria-label="Advertisement">Advertisement</div>;
  return <ins className={`adsbygoogle block ${dimensions}`} data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID} data-ad-format="auto" data-full-width-responsive="true" />;
}