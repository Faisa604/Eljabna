import { Link } from '@tanstack/react-router'

import { type Post } from '../../.content-collections/generated'

function ArticleByline({ post }: { post: Post }) {
  return (
    <p className="text-xs text-ink-soft/80 mt-1">
      {post.author} · {formatDate(post.date)}
    </p>
  )
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ar', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export default function BlogPosts({
  title,
  posts,
}: {
  title: string
  posts: Post[]
}) {
  if (posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-ink-soft">لا توجد مقالات في هذا القسم حتى الآن.</p>
      </div>
    )
  }

  const [lead, ...rest] = posts
  const secondary = rest.slice(0, 2)
  const remainder = rest.slice(2)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="rule-thin mb-6 pt-2 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <span className="text-xs text-ink-soft">
          {posts.length} {posts.length === 1 ? 'مقال' : 'مقالات'}
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <Link to="/posts/$slug" params={{ slug: lead.slug! }} className="group block">
            <div className="aspect-[16/9] bg-paper-dim rule-thin overflow-hidden mb-4">
              <img
                src={`/${lead.image}`}
                alt=""
                className="w-full h-full object-cover grayscale-[15%] group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <span className="text-accent text-xs font-bold tracking-wide">
              {lead.categories[0]}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mt-1 group-hover:text-accent transition-colors">
              {lead.title}
            </h2>
            <p className="mt-3 text-ink-soft text-lg leading-relaxed">{lead.summary}</p>
            <ArticleByline post={lead} />
          </Link>
        </article>

        <aside className="lg:col-span-1 flex flex-col gap-6">
          {secondary.map((post) => (
            <Link
              to="/posts/$slug"
              params={{ slug: post.slug! }}
              key={post._meta.path}
              className="group block rule-thin pt-4 first:pt-0 first:border-t-0"
            >
              <span className="text-accent text-[11px] font-bold tracking-wide">
                {post.categories[0]}
              </span>
              <h3 className="text-lg font-semibold leading-snug mt-1 group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <ArticleByline post={post} />
            </Link>
          ))}
        </aside>
      </div>

      {remainder.length > 0 && (
        <div className="mt-10 rule-double pt-6">
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {remainder.map((post) => (
              <Link
                to="/posts/$slug"
                params={{ slug: post.slug! }}
                key={post._meta.path}
                className="group block"
              >
                <span className="text-accent text-[11px] font-bold tracking-wide">
                  {post.categories[0]}
                </span>
                <h3 className="text-lg font-semibold leading-snug mt-1 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{post.summary}</p>
                <ArticleByline post={post} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
