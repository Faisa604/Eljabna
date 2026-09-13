import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

// Legacy blog posts (محليات/سياسة/اقتصاد...) — kept for backwards compatibility
// Primary content for "الجبنة" lives in src/data/issues.ts (ISSUES + ARTICLES)
// To migrate an issue to markdown, create content/issues/*.md with the schema below.
const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    categories: z.array(z.string()),
    slug: z.string().optional(),
    image: z.string(),
    date: z.string(),
    author: z.string(),
    featured: z.boolean().optional().default(false),
    content: z.string(),
  }),
  transform: async (doc) => {
    return {
      ...doc,
      slug: doc.slug ?? doc._meta.fileName.replace(/\.md$/, ''),
    }
  },
})

const issues = defineCollection({
  name: 'issues',
  directory: 'content/issues',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    numberLabel: z.string(),
    n: z.number(),
    date: z.string(),
    day: z.string(),
    character: z.string(),
    headline: z.string(),
    summary: z.string(),
    image: z.string(),
    webp: z.string().optional(),
    jpg: z.string().optional(),
    original: z.string().optional(),
    alt: z.string(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
})

export default defineConfig({
  collections: [posts, issues],
})
