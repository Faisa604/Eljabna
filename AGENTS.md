# AGENTS.md

This document orients AI agents and developers working on this codebase.

## Project Overview

"جريدة الجبنة" (El-Jabna) is an Arabic-language satirical newspaper
website — editorial front page with 7 illustrated issues (كرتي، عكاشة،
عدوي، هيتو، أسامة، البت الحديقة ×2), archive grid, character strip,
article readings, and about section. Single-page with anchor navigation
+ dedicated issue/article routes. Evolved from the initial "الرصيف"
starter into a fully illustrated archive (Sept 2026).

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (custom `@theme` tokens in `styles.css`) |
| Content | Content Collections (type-safe Markdown frontmatter) |
| Language | TypeScript 5, strict mode |
| Deployment | Cloudflare Workers (SSR via Cloudflare Vite plugin) |

## Directory Structure

```
├── content/posts/*.md        # Legacy articles (kept for compatibility)
├── content/issues/*.md       # Optional markdown for issues (schema in content-collections.ts)
├── content-collections.ts    # Zod schema for posts + issues
├── public/covers/            # Issue covers (original + webp variants)
│   ├── original/             # Full-resolution originals
│   └── webp/                 # Optimized webp (900w + 1200w + 480w thumb)
├── src/
│   ├── data/issues.ts        # Source of truth: ISSUES[7] + ARTICLES[7]
│   ├── components/
│   │   ├── masthead.tsx      # Site header: date bar, title, anchor nav
│   │   ├── site-footer.tsx   # Footer with contact/section info
│   │   ├── blog-posts.tsx    # Legacy grid (kept, category route uses ISSUES now)
│   │   └── ui/card.tsx        # UI primitive (template leftover)
│   ├── routes/
│   │   ├── __root.tsx        # RTL <html>, Google Fonts, Masthead/Footer shell
│   │   ├── index.tsx         # Home: hero + archive + characters + articles + about
│   │   ├── category.$category.tsx  # Tag-filtered archive (ساخر/اجتماعي/شعري...)
│   │   ├── issues.$id.tsx    # Dedicated issue page (cover + article)
│   │   └── posts.$slug.tsx   # Legacy post page (now also serves Jabna articles)
│   ├── router.tsx
│   └── styles.css            # Tailwind import + newspaper color/font tokens
├── wrangler.jsonc           # Cloudflare Worker entry and compatibility settings
└── vite.config.ts
```

## Content Model

Primary content lives in `src/data/issues.ts` (type-safe `ISSUES` + `ARTICLES`).
Optional markdown mirror lives in `content/issues/*.md` (see `content-collections.ts`).

Legacy articles live in `content/posts/*.md` (kept for compatibility). Frontmatter:
- `title`, `summary`, `content` (body, Markdown) — Arabic
- `categories: string[]` — first entry is displayed tag (legacy: محليات/سياسة/...)
- `author`, `date`, `image`, `slug` (optional), `featured` (optional)

Jabna tags (used in ISSUES/ARTICLES + filtering): `الشخصيات`، `اجتماعي`، `ساخر`، `شعري`.
Add a new issue by editing `src/data/issues.ts` (and optionally dropping a `.md` in `content/issues/`).

## Design Notes

- The site is RTL (`dir="rtl"`, `lang="ar"`) throughout.
- Fonts are loaded from Google Fonts in `__root.tsx`: Reem Kufi for the
  masthead title (`font-kufi`), Markazi Text for headlines, Noto Naskh
  Arabic for body text — chosen for an editorial/print newspaper feel
  rather than a generic sans-serif look.
- Color and font tokens are defined once via Tailwind's `@theme` block in
  `src/styles.css` (`--color-paper`, `--color-ink`, `--color-accent`, etc.)
  rather than scattered literals.
- `blog-posts.tsx` is shared between the home page and category pages; it
  renders a large lead story, up to two secondary stories, and a grid for
  the remainder.

## Development Commands

```bash
pnpm run dev       # Start Vite dev server
pnpm run build     # Production build
pnpm run preview   # Preview through the Cloudflare runtime
pnpm run deploy    # Build and deploy with Wrangler
```

## Conventions

- Components: PascalCase file exports, kebab-case filenames.
- Import paths use the `@/` alias for `src/*`.
- Zod schema in `content-collections.ts` is the source of truth for article
  shape; update it first when adding a new frontmatter field.
