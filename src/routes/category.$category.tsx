import { createFileRoute, Link } from '@tanstack/react-router'
import { allPosts } from '../../.content-collections/generated'
import BlogPosts from '@/components/blog-posts'
import { ISSUES } from '@/data/issues'

export const Route = createFileRoute('/category/$category')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const category = params.category
    const legacyPosts = allPosts
      .filter((post) => post.categories.includes(category))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const jabnaIssues = ISSUES.filter((issue) => issue.tags.includes(category))

    return { category, legacyPosts, jabnaIssues }
  },
})

function RouteComponent() {
  const { category, legacyPosts, jabnaIssues } = Route.useLoaderData()

  // Jabna tags take priority — render Jabna archive cards
  if (jabnaIssues.length > 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="rule-thin mb-6 pt-2 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">{category}</h1>
          <span className="text-xs text-ink-soft">
            {jabnaIssues.length} {jabnaIssues.length === 1 ? 'عدد' : 'أعداد'} ·{' '}
            <Link to="/" className="text-accent hover:underline">
              العودة للأرشيف
            </Link>
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jabnaIssues.map((issue) => (
            <Link
              key={issue.id}
              to="/issues/$id"
              params={{ id: issue.id }}
              className="group block bg-white border border-ink/10 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[2/3] bg-paper-dim overflow-hidden">
                <picture>
                  <source srcSet={issue.webp} type="image/webp" />
                  <img
                    src={issue.jpg}
                    alt={issue.alt}
                    className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500"
                    loading="lazy"
                  />
                </picture>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-[11px] font-kufi">
                  <span className="bg-ink text-paper px-2 py-1 font-bold">{issue.numberLabel}</span>
                  <span className="text-ink-muted">{issue.day} · {issue.date}</span>
                </div>
                <p className="font-kufi text-xs text-accent font-bold mt-2">{issue.character}</p>
                <h3 className="font-kufi text-[16px] font-extrabold leading-tight mt-1 group-hover:text-accent transition-colors">
                  {issue.headline}
                </h3>
                <p className="font-naskh text-[13px] leading-[1.7] text-ink-soft mt-2 line-clamp-2">{issue.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        {legacyPosts.length > 0 && (
          <div className="mt-10 border-t border-dashed border-rule pt-6">
            <h2 className="font-kufi text-lg font-bold mb-4">مقالات قديمة في نفس التصنيف</h2>
            <BlogPosts title={category} posts={legacyPosts} />
          </div>
        )}
      </div>
    )
  }

  // Fallback to legacy BlogPosts
  return <BlogPosts title={category} posts={legacyPosts} />
}
