import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const lessons = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/lessons" }),
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    summary: z.string(),
    track: z.enum(["compute", "storage", "network", "database", "ai", "ml"]),
    difficulty: z.enum(["入门", "进阶"]),
    tags: z.array(z.string()),
    sourceUrls: z.array(z.url()),
    reviewedAt: z.string(),
    order: z.number(),
    cert: z.enum(["AZ-104", "AZ-305", "AZ-700", "扩展学习"])
  })
});

export const collections = { lessons };
