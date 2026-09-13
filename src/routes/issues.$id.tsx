import { createFileRoute, Link } from '@tanstack/react-router'
import { ISSUES, ARTICLES } from '@/data/issues'
import { CHARACTERS } from '@/data/characters'
import ShareButton from '@/components/share-button'

export const Route = createFileRoute('/issues/$id')({
  loader: async ({ params }) => {
    const issue = ISSUES.find((i) => i.id === params.id)
    if (!issue) throw new Error('Issue not found')
    const article = ARTICLES.find((a) => a.issueId === issue.id) ?? null
    const idx = ISSUES.findIndex((i) => i.id === issue.id)
    const prev = idx < ISSUES.length - 1 ? ISSUES[idx + 1] : null
    const next = idx > 0 ? ISSUES[idx - 1] : null
    return { issue, article, prev, next }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.issue.headline} — ${loaderData.issue.numberLabel} | الجبنة` },
          { name: 'description', content: loaderData.issue.summary },
          { property: 'og:title', content: `${loaderData.issue.headline} — الجبنة` },
          { property: 'og:description', content: loaderData.issue.summary },
          { property: 'og:image', content: loaderData.issue.jpg },
        ]
      : [],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { issue, article, prev, next } = Route.useLoaderData()
  const character = CHARACTERS.find((c) => c.issueIds.includes(issue.id))

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs font-kufi text-ink-muted mb-6">
        <Link to="/" className="hover:text-accent">الرئيسية</Link>
        <span>/</span>
        <Link to="/" hash="archive" className="hover:text-accent">الأرشيف</Link>
        <span>/</span>
        <span className="text-ink font-bold">{issue.numberLabel}</span>
      </nav>

      {/* header strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-kufi mb-4">
        <span className="bg-accent text-white px-2.5 py-1 font-bold">{issue.numberLabel}</span>
        <span className="border border-ink/15 bg-white px-2.5 py-1">{issue.character}</span>
        <span className="text-ink-muted">{issue.day} · {issue.date}</span>
      </div>

      <h1 className="font-kufi text-[28px] sm:text-[40px] font-extrabold leading-tight headline-balance">
        {issue.headline}
      </h1>
      <p className="font-naskh text-[15px] leading-relaxed text-ink-soft mt-3 max-w-[65ch]">{issue.summary}</p>

      <div className="mt-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        {/* cover */}
        <div className="bg-paper-dim/40 p-4 border border-ink/10 self-start">
          <div className="bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-ink/10">
            <picture>
              <source srcSet={issue.webp} type="image/webp" />
              <img src={issue.jpg} alt={issue.alt} width={900} height={1350} className="w-full h-auto aspect-[2/3] object-cover" />
            </picture>
          </div>
          <div className="mt-3 flex gap-2">
            <a href={issue.original} download className="flex-1 text-center border border-ink/15 bg-white font-kufi text-xs font-bold py-2.5 hover:bg-paper-dim transition-colors">
              تحميل الأصلي
            </a>
            <Link to="/" hash="archive" className="flex-1 text-center bg-ink text-paper font-kufi text-xs font-bold py-2.5 hover:bg-accent transition-colors">
              العودة للأرشيف
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {issue.tags.map((t) => (
              <Link key={t} to="/category/$category" params={{ category: t }} className="text-[11px] font-kufi px-2 py-0.5 border border-ink/10 bg-paper-warm/60 text-ink-muted hover:text-accent">
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* article */}
        <div className="paper-card p-6 sm:p-8">
          {article ? (
            <>
              {character && (
                <div className="mb-5 grid grid-cols-[82px_1fr] items-center gap-4 border-b border-dashed border-rule pb-4">
                  <img src={character.image} alt={`كاركتير ${character.name}`} width={900} height={900} className="w-20 h-20 object-cover border border-ink/10" />
                  <div>
                    <p className="font-kufi text-[10px] text-accent font-bold tracking-wide">{character.kicker}</p>
                    <p className="font-kufi text-base font-extrabold">{character.name}</p>
                    <p className="font-naskh text-xs text-ink-muted mt-1">{character.bio}</p>
                  </div>
                </div>
              )}
              <h2 className="font-kufi text-[22px] font-extrabold">{article.title}</h2>
              <p className="font-kufi text-xs text-ink-muted mt-1">بقلم هيئة تحرير الجبنة</p>
              <div className="mt-4 font-naskh text-[15px] leading-[1.95] text-ink-soft">
                <p className="drop-cap">{article.intro}</p>
                {article.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3">{p}</p>
                ))}
              </div>
              <blockquote className="pull-quote mt-6 pr-4 py-4">
                <p className="font-kufi text-[16px] font-bold text-accent">“ {article.quote} ”</p>
                <cite className="block font-naskh text-xs text-ink-muted mt-2 not-italic">— {article.character}</cite>
              </blockquote>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/posts/$slug" params={{ slug: article.issueId }} className="inline-flex items-center gap-2 bg-accent text-white font-kufi text-xs font-bold px-4 py-2.5 hover:bg-accent-soft transition-colors">
                  قراءة صفحة المقال المنفصلة ←
                </Link>
                <ShareButton title={`${issue.numberLabel}: ${issue.headline}`} path={`/issues/${issue.id}`} />
              </div>
            </>
          ) : (
            <p className="font-naskh text-sm text-ink-muted">لا يوجد مقال نصي لهذا العدد بعد — الغلاف هو الحكاية.</p>
          )}
        </div>
      </div>

      {/* prev / next */}
      <div className="mt-8 grid sm:grid-cols-2 gap-3 border-t border-ink/10 pt-6">
        {prev ? (
          <Link to="/issues/$id" params={{ id: prev.id }} className="flex gap-3 border border-ink/10 bg-white p-3 hover:border-accent/30 transition-colors">
            <div className="w-16 h-24 bg-paper-dim shrink-0 overflow-hidden">
              <img src={prev.jpg} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <p className="font-kufi text-xs text-ink-muted">العدد السابق</p>
              <p className="font-kufi text-sm font-bold leading-tight mt-1">{prev.numberLabel} — {prev.character}</p>
              <p className="font-naskh text-xs text-ink-soft mt-1 line-clamp-2">{prev.headline}</p>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link to="/issues/$id" params={{ id: next.id }} className="flex gap-3 border border-ink/10 bg-white p-3 hover:border-accent/30 transition-colors text-left flex-row-reverse">
            <div className="w-16 h-24 bg-paper-dim shrink-0 overflow-hidden">
              <img src={next.jpg} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1">
              <p className="font-kufi text-xs text-ink-muted">العدد التالي</p>
              <p className="font-kufi text-sm font-bold leading-tight mt-1">{next.numberLabel} — {next.character}</p>
              <p className="font-naskh text-xs text-ink-soft mt-1 line-clamp-2">{next.headline}</p>
            </div>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
