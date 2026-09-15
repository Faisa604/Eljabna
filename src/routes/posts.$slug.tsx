import { createFileRoute, Link } from '@tanstack/react-router'
import { marked } from 'marked'
import { allPosts } from '../../.content-collections/generated'
import { ARTICLES, ISSUES } from '@/data/issues'
import { CHARACTERS } from '@/data/characters'
import ShareButton from '@/components/share-button'

export const Route = createFileRoute('/posts/$slug')({
  loader: async ({ params }) => {
    // 1) Try legacy posts
    const legacy = allPosts.find((post) => post.slug === params.slug)
    if (legacy) return { kind: 'legacy' as const, post: legacy }

    // 2) Try Jabna articles by issueId, numeric n, or translated slug
    const jabnaArticle = ARTICLES.find(
      (a) => a.issueId === params.slug || String(a.n) === params.slug || `jabna-${a.n}` === params.slug,
    )
    if (jabnaArticle) {
      const issue = ISSUES.find((i) => i.id === jabnaArticle.issueId)!
      return { kind: 'jabna' as const, article: jabnaArticle, issue }
    }

    // 3) Also allow slug to be the issue id itself
    const byIssueId = ISSUES.find((i) => i.id === params.slug)
    if (byIssueId) {
      const article = ARTICLES.find((a) => a.issueId === byIssueId.id)
      if (article) return { kind: 'jabna' as const, article, issue: byIssueId }
    }

    throw new Error('Post not found')
  },
  component: RouteComponent,
})

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ar', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function RouteComponent() {
  const data = Route.useLoaderData()

  if (data.kind === 'legacy') {
    const post = data.post
    return (
      <article className="max-w-2xl mx-auto px-4 py-10">
        <Link
          to="/category/$category"
          params={{ category: post.categories[0] }}
          className="text-accent text-xs font-bold tracking-wide"
        >
          {post.categories[0]}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mt-2 mb-3">{post.title}</h1>
        <p className="text-lg text-ink-soft mb-4">{post.summary}</p>
        <div className="rule-thin pt-3 flex items-center justify-between text-sm text-ink-soft">
          <span>بقلم: {post.author}</span>
          <span>{formatDate(post.date)}</span>
        </div>

        <div className="aspect-[16/9] bg-paper-dim rule-thin overflow-hidden my-6">
          <img src={`/${post.image}`} alt="" className="w-full h-full object-cover" />
        </div>

        <div
          className="prose-article drop-cap"
          dangerouslySetInnerHTML={{ __html: marked(post.content) }}
        />
      </article>
    )
  }

  const { article, issue } = data
  const character = CHARACTERS.find((c) => c.issueIds.includes(issue.id))
  return (
    <article className="max-w-[980px] mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center gap-2 text-xs font-kufi mb-4">
        <Link to="/" className="text-ink-muted hover:text-accent">
          الرئيسية ←
        </Link>
        <span className="text-rule">/</span>
        <Link to="/issues/$id" params={{ id: issue.id }} className="bg-ink text-paper px-2 py-1 font-bold">
          {issue.numberLabel}
        </Link>
        <span className="border border-ink/15 bg-white px-2 py-1">{article.character}</span>
        <span className="text-ink-muted">{issue.date}</span>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6 lg:gap-8">
        <div>
          {character && (
            <div className="mb-6 grid grid-cols-[88px_1fr] items-center gap-4 border-y border-dashed border-rule py-4">
              <img src={character.image} alt={`كاركتير ${character.name}`} width={900} height={900} className="w-[88px] h-[88px] object-cover border border-ink/10" />
              <div>
                <p className="font-kufi text-[10px] text-accent font-bold tracking-wide">{character.kicker}</p>
                <p className="font-kufi text-base font-extrabold mt-0.5">{character.name}</p>
                <p className="font-naskh text-xs text-ink-muted mt-1">{character.bio}</p>
              </div>
            </div>
          )}
          <h1 className="font-kufi text-[28px] sm:text-[36px] font-extrabold leading-tight headline-balance">
            {article.title}
          </h1>
          <p className="font-kufi text-xs text-ink-muted mt-2">بقلم: {article.author ?? 'هيئة تحرير الجبنة'} — ملف الشخصيات</p>

          {issue.video && (
            <div className="mt-6 overflow-hidden border border-ink/15 bg-ink p-2">
              <video controls playsInline preload="metadata" poster={issue.video.poster} aria-label={issue.video.title} className="w-full rounded-sm">
                <source src={issue.video.src} type="video/mp4" />
                <a href={issue.video.src} download className="font-kufi text-sm text-paper underline">تحميل فيديو اللقاء</a>
              </video>
            </div>
          )}

          <div className="mt-6 font-naskh text-[15px] leading-[1.95] text-ink-soft">
            <p className="drop-cap">{article.intro}</p>
            {article.paragraphs.map((p, i) => (
              <p key={i} className="mt-3">
                {p}
              </p>
            ))}
          </div>

          <blockquote className="pull-quote mt-6 pr-4 py-4">
            <p className="font-kufi text-[17px] font-bold leading-relaxed text-accent">“ {article.quote} ”</p>
            <cite className="block font-naskh text-xs text-ink-muted mt-2 not-italic">— من أقوال {article.character}</cite>
          </blockquote>

          {article.editorialNote && <p className="mt-5 border-r-2 border-accent pr-3 font-naskh text-sm text-ink-muted">{article.editorialNote}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <Link
                key={t}
                to="/category/$category"
                params={{ category: t }}
                className="text-[11px] font-kufi px-2 py-1 bg-paper-dim/60 border border-ink/10 text-ink-muted hover:border-accent hover:text-accent transition-colors"
              >
                {t}
              </Link>
            ))}
            <ShareButton title={article.title} path={`/posts/${article.issueId}`} compact />
          </div>
        </div>

        <div className="bg-paper-dim/40 p-4 border border-ink/10 self-start">
          <div className="bg-white p-2 shadow-md border border-ink/10">
            <picture>
              <source srcSet={issue.webp} type="image/webp" />
              <img src={issue.jpg} alt={issue.alt} width={900} height={1350} className="w-full h-auto aspect-[2/3] object-cover" />
            </picture>
          </div>
          <p className="font-naskh text-xs leading-relaxed text-ink-soft mt-3">
            {issue.headline} — {issue.summary}
          </p>
          <Link
            to="/issues/$id"
            params={{ id: issue.id }}
            className="mt-3 block text-center bg-ink text-paper font-kufi text-xs font-bold py-2.5 hover:bg-accent transition-colors"
          >
            عرض العدد كاملاً
          </Link>
        </div>
      </div>
    </article>
  )
}
