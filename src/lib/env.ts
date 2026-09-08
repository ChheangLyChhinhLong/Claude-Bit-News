import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_NAME: z.string().default("Claude Bit News"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEWS_API_ORG_KEY: z.string().optional(),
  GOOGLE_NEWS_API_KEY: z.string().optional(),
  NEWS_DATA_API_KEY: z.string().optional(),
  MASSIVE_API_KEY: z.string().optional(),
  GDELT_DOC_API_URL: z.string().url().default("https://api.gdeltproject.org/api/v2/doc/doc"),
  NEXT_PUBLIC_GOOGLE_ADSENSE_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEWS_API_ORG_KEY: process.env.NEWS_API_ORG_KEY,
  GOOGLE_NEWS_API_KEY: process.env.GOOGLE_NEWS_API_KEY,
  NEWS_DATA_API_KEY: process.env.NEWS_DATA_API_KEY,
  MASSIVE_API_KEY: process.env.MASSIVE_API_KEY,
  GDELT_DOC_API_URL: process.env.GDELT_DOC_API_URL,
  NEXT_PUBLIC_GOOGLE_ADSENSE_ID: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID,
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
});