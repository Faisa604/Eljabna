import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ARTICLES, ISSUES, type Issue } from '@/data/issues'
import CharacterGallery from '@/components/character-gallery'
import ShareButton from '@/components/share-button'
import { CHARACTERS } from '@/data/characters'

export const Route = createFileRoute('/')({
  component: ElJabnaPage,
})

const FILTERS = ['كل الأعداد', 'الشخصيات', 'اجتماعي', 'ساخر', 'شعري'] as const

function ElJabnaPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('كل الأعداد')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState<{ src: string; original: string; alt: string } | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // modal: esc to close, lock scroll
  useEffect(() => {
    if (!modal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [modal])

  const normalizedQuery = query.trim().toLowerCase()

  const filteredIssues = useMemo(() => {
    return ISSUES.filter((issue) => {
      const matchFilter = filter === 'كل الأعداد' ? true : issue.tags.includes(filter)
      if (!matchFilter) return false
      if (!normalizedQuery) return true
      const hay = `${issue.headline} ${issue.summary} ${issue.character} ${issue.numberLabel} ${issue.date}`.toLowerCase()
      return hay.includes(normalizedQuery)
    })
  }, [filter, normalizedQuery])

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((a) => {
      const matchFilter = filter === 'كل الأعداد' ? true : a.tags.includes(filter as string)
      if (!matchFilter) return false
      if (!normalizedQuery) return true
      const hay = `${a.title} ${a.character} ${a.intro} ${a.paragraphs.join(' ')} ${a.quote} العدد ${a.n}`.toLowerCase()
      return hay.includes(normalizedQuery)
    })
  }, [filter, normalizedQuery])

  const handleCoverClick = (issue: Issue) => {
    setModal({ src: issue.webp, original: issue.original, alt: issue.alt })
  }

  return (
    <div className="overflow-x-hidden">
      {/* Skip link */}
      <a href="#archive" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-4 focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:z-50">
        تخطي إلى الأرشيف
      </a>

      {/* HERO — latest issue */}
      <section className="max-w-[1280px] mx-auto px-4 pt-6 pb-8">
        {/* slim tagline under header already; now hero card */}
        <div className="paper-card overflow-hidden">
          {/* header strip inside hero */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-ink text-paper px-4 py-2 text-xs font-kufi">
            <span className="tracking-widest">العدد الأحدث — سبتمبر ٢٠٢٦</span>
            <span className="hidden sm:inline opacity-70">كلام الناس في الجبنة أحلى · ما الحقيقة إلا طرفة أخرى</span>
            <span className="bg-paper text-ink px-2 py-1 text-[11px] font-bold">جديد</span>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-0">
            {/* text */}
            <div className="p-6 sm:p-8 lg:p-10 order-2 lg:order-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs font-kufi">
                <span className="bg-accent text-white px-2.5 py-1 font-bold tracking-wide">العدد الأحدث</span>
                <span className="border border-ink/15 px-2.5 py-1 bg-white">العدد ٧</span>
                <span className="text-ink-muted">١٠ سبتمبر ٢٠٢٦ · الخميس</span>
                <span className="hidden sm:inline w-1 h-1 bg-ink/30 rounded-full" />
                <span className="text-accent font-bold">البت الحديقة</span>
              </div>

              <h2 className="font-kufi text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold leading-[1.15] mt-4 headline-balance">
                يا سمسم <span className="text-accent">الجمال ما محتاج شهادتك</span>
              </h2>

              <p className="font-naskh text-[16px] sm:text-[17px] leading-[1.9] text-ink-soft mt-4 max-w-[60ch]">
                تعود البت الحديقة بصورة أقرب ورد أوضح، وتواجه تعليق سمسم بثقة وسخرية لا تخلو من الشعر.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/posts/$slug"
                  params={{ slug: ISSUES[0].id }}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-soft text-white font-kufi text-sm font-bold px-6 py-3 transition-colors shadow-sm"
                >
                  اقرأ العدد السابع
                  <span aria-hidden>←</span>
                </Link>
                <a
                  href="#archive"
                  className="inline-flex items-center gap-2 border border-ink/15 bg-white hover:bg-paper-dim font-kufi text-sm font-semibold px-5 py-3 transition-colors"
                >
                  تصفح كل الأعداد
                </a>
                <span className="text-xs text-ink-muted font-naskh hidden sm:inline">سبعة أعداد · ست شخصيات · قعدة واحدة</span>
              </div>

              {/* small meta rules */}
              <div className="mt-8 pt-4 border-t border-dashed border-rule flex flex-wrap gap-4 text-xs font-kufi text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-accent rounded-full" /> ساخر
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-ink rounded-full" /> شعري
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-brass rounded-full" /> اجتماعي
                </span>
                <span className="mr-auto hidden sm:inline">الجريدة تصدر من الخرطوم — للضحكة والذكرى</span>
              </div>

              {/* quote teaser */}
              <blockquote className="pull-quote mt-6 pr-4 py-3 text-sm font-naskh leading-relaxed text-ink-soft">
                <span className="font-kufi font-bold text-accent">″</span> الجمال في العين البتعرف تشوف — وسمسم خليك في السمسم وخلي الجمال لأهلو <span className="font-kufi font-bold text-accent">″</span>
              </blockquote>
            </div>

            {/* cover */}
            <div className="order-1 lg:order-2 bg-paper-dim/40 p-4 sm:p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-ink/10">
              <button
                onClick={() => handleCoverClick(ISSUES[0])}
                className="group relative w-full max-w-[420px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                aria-label="عرض غلاف العدد ٧ بحجم كبير"
              >
                <div className="absolute -inset-2 bg-accent/5 rotate-[0.6deg] hidden sm:block" aria-hidden />
                <div className="relative bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-ink/10">
                  <picture>
                    <source srcSet={ISSUES[0].webp} type="image/webp" />
                    <img
                      src={ISSUES[0].jpg}
                      alt={ISSUES[0].alt}
                      width={900}
                      height={1350}
                      className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:scale-[1.005]"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </picture>
                  <div className="absolute inset-2 border border-white/40 pointer-events-none hidden sm:block" />
                  <span className="absolute bottom-3 right-3 bg-ink text-paper font-kufi text-[11px] px-2 py-1">اضغط للتكبير</span>
                </div>
                <p className="sr-only">العدد ٧ — البت الحديقة</p>
              </button>
            </div>
          </div>

          {/* bottom thin line */}
          <div className="h-[1px] bg-rule/60" />
          <div className="px-4 sm:px-8 py-2 flex items-center justify-between text-[11px] font-kufi text-ink-muted bg-paper-warm/50">
            <span>تصميم جرائد سودانية — ورق عتيق وحبر أسود وأحمر عنابي</span>
            <span className="hidden sm:inline">النيل · الكباري · القعدة</span>
          </div>
        </div>
      </section>

      {/* FILTER + SEARCH BAR */}
      <section className="max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between border border-ink/10 bg-white p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="فلترة الأعداد">
            <span className="font-kufi text-xs font-bold text-ink-muted ml-1 hidden sm:inline">تصفية:</span>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`px-3 py-1.5 text-xs font-kufi font-bold border transition-colors ${
                  filter === f
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-paper-dim/40 text-ink hover:bg-white border-ink/15 hover:border-ink/25'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[360px]">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في العناوين، الشخصيات، والمقالات…"
                className="search-input w-full bg-paper-warm/60 border border-ink/15 focus:border-accent focus:bg-white outline-none px-4 py-2 pr-10 text-sm font-naskh placeholder:text-ink-muted/70 transition-colors"
                type="search"
                aria-label="بحث في الجريدة"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 grid place-items-center bg-ink text-paper text-xs hover:bg-accent transition-colors"
                  aria-label="مسح البحث"
                >
                  ×
                </button>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-kufi text-ink-muted whitespace-nowrap">
              {filteredIssues.length} نتيجة
            </span>
          </div>
        </div>
      </section>

      {/* ARCHIVE */}
      <section id="archive" className="max-w-[1280px] mx-auto px-4 pt-10 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3 mb-6">
          <div>
            <h2 className="font-kufi text-[26px] sm:text-[30px] font-extrabold leading-none">أرشيف الجبنة — الأعداد السبعة</h2>
            <p className="font-naskh text-sm text-ink-muted mt-2">من العدد ٧ إلى العدد ١ — سبتمبر ٢٠٢٦ · كل غلاف حكاية، وكل حكاية قعدة</p>
          </div>
          <div className="text-xs font-kufi text-ink-muted flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>الأحدث مميّز بإطار عنابي</span>
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="border border-dashed border-rule bg-paper-dim/30 p-10 text-center">
            <p className="font-kufi text-lg font-bold">لا توجد نتائج مطابقة</p>
            <p className="font-naskh text-sm text-ink-muted mt-2">جرّب كلمات أخرى مثل: كرتي، البت الحديقة، سمسم، هيتو، أو غيّر الفلتر إلى «كل الأعداد».</p>
            <button onClick={() => { setQuery(''); setFilter('كل الأعداد') }} className="mt-4 px-4 py-2 bg-ink text-paper font-kufi text-xs hover:bg-accent transition-colors">
              مسح البحث والفلتر
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIssues.map((issue) => {
              const isLatest = issue.n === 7
              return (
                <article
                  key={issue.id}
                  id={issue.id}
                  className={`group relative flex flex-col bg-white border overflow-hidden transition-shadow hover:shadow-lg ${
                    isLatest ? 'border-accent shadow-md ring-1 ring-accent/20' : 'border-ink/10'
                  }`}
                >
                  {isLatest && (
                    <div className="absolute top-0 right-0 bg-accent text-white font-kufi text-[11px] px-2.5 py-1 z-10">
                      الأحدث
                    </div>
                  )}
                  {/* cover */}
                  <button
                    onClick={() => handleCoverClick(issue)}
                    className="relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={`عرض غلاف ${issue.numberLabel} — ${issue.headline}`}
                  >
                    <div className="aspect-[2/3] bg-paper-dim overflow-hidden">
                      <picture>
                        <source srcSet={issue.webp} type="image/webp" />
                        <img
                          src={issue.jpg}
                          alt={issue.alt}
                          width={900}
                          height={1350}
                          loading={issue.n === 7 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500"
                        />
                      </picture>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-ink/85 text-paper text-[11px] font-kufi px-2 py-1 backdrop-blur-sm">
                      عرض الغلاف
                    </span>
                  </button>

                  {/* content */}
                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex items-center gap-2 text-[11px] font-kufi">
                      <span className={`px-2 py-1 font-bold ${isLatest ? 'bg-accent text-white' : 'bg-ink text-paper'}`}>
                        {issue.numberLabel}
                      </span>
                      <span className="text-ink-muted">{issue.day} · {issue.date}</span>
                      {isLatest && <span className="mr-auto w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />}
                    </div>

                    <p className="font-kufi text-xs text-accent font-bold mt-2">{issue.character}</p>
                    <h3 className="font-kufi text-[18px] font-extrabold leading-tight mt-1 headline-balance group-hover:text-accent transition-colors">
                      {issue.headline}
                    </h3>
                    <p className="font-naskh text-[13px] leading-[1.8] text-ink-soft mt-2 line-clamp-3">{issue.summary}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {issue.tags.map((t) => (
                        <span key={t} className="text-[11px] font-kufi px-2 py-0.5 border border-ink/10 bg-paper-warm/60 text-ink-muted">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        to="/posts/$slug"
                        params={{ slug: issue.id }}
                        className="text-center bg-ink text-paper font-kufi text-xs font-bold py-2.5 hover:bg-accent transition-colors"
                      >
                        اقرأ المقال
                      </Link>
                      <button
                        onClick={() => handleCoverClick(issue)}
                        className="border border-ink/15 bg-white font-kufi text-xs font-bold py-2.5 hover:bg-paper-dim transition-colors"
                      >
                        عرض الغلاف
                      </button>
                    </div>

                    <ShareButton title={`${issue.numberLabel}: ${issue.headline}`} path={`/issues/${issue.id}`} compact />

                    <a
                      href={issue.original}
                      download
                      className="mt-2 text-center text-[11px] font-kufi text-ink-muted hover:text-accent underline underline-offset-4 decoration-dotted"
                    >
                      تحميل الغلاف بدقة كاملة
                    </a>
                  </div>

                  {/* bottom rule */}
                  <div className="h-[3px] bg-ink/5 group-hover:bg-accent/20 transition-colors" />
                </article>
              )
            })}
          </div>
        )}

        {/* small editorial rule */}
        <div className="mt-8 flex items-center gap-3 text-xs font-kufi text-ink-muted">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rule to-transparent" />
          <span>الأرشيف مطبوع بحبر أسود على ورق عتيق — الأعداد ١–٧</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rule to-transparent" />
        </div>
      </section>

      <CharacterGallery />

      {/* ARTICLES */}
      <section id="articles" className="max-w-[1280px] mx-auto px-4 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3 mb-6">
          <div>
            <h2 className="font-kufi text-[26px] sm:text-[30px] font-extrabold leading-none">شخصيات ومقالات الجبنة</h2>
            <p className="font-naskh text-sm text-ink-muted mt-2">قراءات ساخرة من قلب القعدة — كل مقال يبدأ بغلاف وينتهي بضحكة</p>
          </div>
          <span className="text-xs font-kufi bg-ink text-paper px-3 py-1">
            {filteredArticles.length} مقال
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="border border-dashed border-rule bg-paper-dim/30 p-10 text-center">
            <p className="font-kufi font-bold">لا توجد مقالات مطابقة للبحث</p>
            <p className="font-naskh text-sm text-ink-muted mt-1">جرّب البحث بكلمات مثل «البت الحديقة» أو «كرتي» أو غيّر الفلتر.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredArticles
              .slice()
              .sort((a, b) => b.n - a.n)
              .map((article) => {
                const issue = ISSUES.find((i) => i.id === article.issueId)!
                const character = CHARACTERS.find((c) => c.issueIds.includes(article.issueId))
                return (
                  <article
                    key={article.issueId}
                    id={`article-${article.n}`}
                    className="paper-card overflow-hidden scroll-mt-[140px] flex flex-col"
                  >
                    <div className="grid grid-cols-[104px_1fr] sm:grid-cols-[132px_1fr] bg-paper-dim/35 border-b border-ink/10">
                      <div className="overflow-hidden border-l border-ink/10">
                        <img
                          src={character?.image ?? issue.jpg}
                          alt={character ? `كاركتير ${character.name}` : issue.alt}
                          width={900}
                          height={900}
                          loading="lazy"
                          className="w-full h-full min-h-[140px] object-cover"
                        />
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-kufi">
                          <span className="bg-accent text-white px-2 py-1 font-bold">{issue.numberLabel}</span>
                          <span className="text-accent font-bold">{article.character}</span>
                          <span className="text-ink-muted">{issue.date}</span>
                        </div>
                        <h3 className="font-kufi text-xl sm:text-2xl font-extrabold leading-tight mt-3 headline-balance">{article.title}</h3>
                        <p className="font-kufi text-[11px] text-ink-muted mt-1">بقلم هيئة تحرير الجبنة</p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <p className="font-naskh text-[15px] leading-[1.9] text-ink-soft line-clamp-4">{article.intro}</p>
                      <blockquote className="pull-quote mt-4 pr-4 py-3 pl-3">
                        <p className="font-kufi text-sm font-bold leading-relaxed text-accent">“ {article.quote} ”</p>
                      </blockquote>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {article.tags.map((t) => (
                          <span key={t} className="text-[10px] font-kufi px-2 py-1 bg-paper-dim/60 border border-ink/10 text-ink-muted">{t}</span>
                        ))}
                      </div>
                      <div className="mt-auto pt-5 grid sm:grid-cols-2 gap-2">
                        <Link
                          to="/posts/$slug"
                          params={{ slug: article.issueId }}
                          className="text-center bg-ink text-paper font-kufi text-xs font-bold py-2.5 hover:bg-accent transition-colors"
                        >
                          اقرأ المقال كاملًا ←
                        </Link>
                        <ShareButton title={article.title} path={`/posts/${article.issueId}`} compact />
                      </div>
                    </div>
                  </article>
                )
              })}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-[1280px] mx-auto px-4 pt-12 pb-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="paper-card p-6 sm:p-8">
            <p className="font-kufi text-xs tracking-[0.16em] text-accent font-bold">عن الجريدة</p>
            <h2 className="font-kufi text-[26px] sm:text-[32px] font-extrabold leading-tight mt-2 headline-balance">الخبر عندنا يبدأ من القعدة</h2>
            <div className="mt-4 font-naskh text-[15px] leading-[1.9] text-ink-soft">
              <p>
                «الجبنة» صحيفة اجتماعية ساخرة تحفظ العبارات والحكايات اليومية في هيئة أعداد صحفية خفيفة.
                لا نطارد السبق، نطارد الجملة التي تتقال وتتعلق في الذاكرة. نكتب كما يتكلم الناس في القعدة،
                بنبرة سودانية دافئة، بلمسة سكر زيادة، وبضحكة تخفف ثقل اليوم.
              </p>
              <p className="mt-3">
                الشخصيات والمقالات جزء من عالم الجريدة الخاص، بين كرتي وعرق الجبنة، وعكاشة وصمت ما بعد الحرب،
                وعدوي وسرعة الكلام، وهيتو وأغاني المصالحة، ودكتور أسامة وتحقيق الأسطورة، والبت الحديقة التي لا
                تحتاج إلى شهادة. المحتوى مقدم في إطار فكاهي وإبداعي، للضحكة والذكرى قبل أي شيء.
              </p>
            </div>

            <div className="mt-6 border border-amber-200 bg-amber-50/70 p-4 flex gap-3">
              <span className="shrink-0 w-7 h-7 grid place-items-center bg-amber-600 text-white text-sm font-bold">!</span>
              <p className="font-naskh text-sm leading-relaxed text-amber-900">
                <span className="font-kufi font-bold">تنبيه:</span> هذه جريدة ساخرة خيالية، ولا تمثل أخبارًا موثقة أو تصريحات رسمية. أي تشابه هو من باب الخيال الساخر وحفظ الذاكرة الشعبية.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-kufi">
              <span className="bg-ink text-paper px-3 py-1.5">صُنعت للضحكة والذكرى</span>
              <span className="border border-ink/15 bg-white px-3 py-1.5 text-ink-muted">سبتمبر ٢٠٢٦ · الخرطوم</span>
              <span className="border border-ink/15 bg-white px-3 py-1.5 text-ink-muted">٧ أعداد</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-ink bg-ink text-paper p-6">
              <h3 className="font-kufi text-lg font-bold">كلام الناس في الجبنة أحلى</h3>
              <p className="font-naskh text-sm leading-relaxed text-paper/75 mt-2">
                ما الحقيقة إلا طرفة أخرى — شعارنا الصغير الذي نضعه أعلى كل غلاف، تذكير بأن السخرية ليست هروبًا، بل طريقة لفهم الواقع بقلب أخف.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-kufi">
                <div className="border border-paper/15 py-2 bg-white/5">ساخر</div>
                <div className="border border-paper/15 py-2 bg-white/5">اجتماعي</div>
                <div className="border border-paper/15 py-2 bg-white/5">شعري</div>
              </div>
            </div>

            <div className="border border-ink/10 bg-white p-6">
              <h3 className="font-kufi text-sm font-bold">معلومات النشر</h3>
              <dl className="mt-3 space-y-2 text-sm font-naskh">
                <div className="flex justify-between border-b border-dotted border-rule py-1">
                  <dt className="text-ink-muted">الاسم</dt><dd className="font-bold">الجبنة</dd>
                </div>
                <div className="flex justify-between border-b border-dotted border-rule py-1">
                  <dt className="text-ink-muted">النوع</dt><dd className="font-bold">صحيفة اجتماعية ساخرة مستقلة</dd>
                </div>
                <div className="flex justify-between border-b border-dotted border-rule py-1">
                  <dt className="text-ink-muted">الأعداد</dt><dd className="font-bold">١ – ٧</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-ink-muted">الفترة</dt><dd className="font-bold">سبتمبر ٢٠٢٦</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs font-naskh text-ink-muted leading-relaxed">
                الجريدة خفيفة وسريعة ومتجاوبة — بدون تتبع، بدون تشغيل تلقائي، وبتحميل كسول للصور تحت الطية. كل الروابط والفلاتر والبحث تعمل بدون خادم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* bottom ticker */}
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="border-y border-ink bg-paper-dim/40 py-2 overflow-hidden">
          <div className="flex items-center gap-6 whitespace-nowrap font-kufi text-xs text-ink-muted animate-[ticker_20s_linear_infinite] hover:[animation-play-state:paused]">
            <span>العدد ١ كرتي — مارقين قبل اليمين يصعد</span><span className="w-1 h-1 bg-accent rounded-full" />
            <span>العدد ٢ عكاشة — التواصل نادر</span><span className="w-1 h-1 bg-accent rounded-full" />
            <span>العدد ٣ عدوي — اصطكاكة رابعة</span><span className="w-1 h-1 bg-accent rounded-full" />
            <span>العدد ٤ هيتو — ترسل لي غنية</span><span className="w-1 h-1 bg-accent rounded-full" />
            <span>العدد ٥ د. أسامة — معضلة البت الحديقة</span><span className="w-1 h-1 bg-accent rounded-full" />
            <span>العدد ٦ البت الحديقة — أنا البت الحديقة</span><span className="w-1 h-1 bg-accent rounded-full" />
            <span>العدد ٧ رد البت الحديقة — الجمال ما محتاج شهادتك</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modal.alt}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            aria-label="إغلاق"
            onClick={() => setModal(null)}
            className="absolute inset-0 bg-ink/85 backdrop-blur-[2px]"
          />
          <div className="relative max-w-[920px] w-full max-h-[90vh] flex flex-col bg-paper shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-ink text-paper shrink-0">
              <p className="font-kufi text-xs sm:text-sm leading-tight truncate">{modal.alt}</p>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={modal.original}
                  download
                  className="hidden sm:inline-flex items-center gap-1.5 bg-white text-ink font-kufi text-xs font-bold px-3 py-1.5 hover:bg-paper-dim transition-colors"
                >
                  تحميل الأصلي
                </a>
                <button
                  onClick={() => setModal(null)}
                  className="w-8 h-8 grid place-items-center bg-accent text-white hover:bg-accent-soft transition-colors"
                  aria-label="إغلاق النافذة"
                  autoFocus
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-auto bg-ink/5 p-3 sm:p-4 flex items-center justify-center">
              <img
                src={modal.original}
                alt={modal.alt}
                className="max-w-full max-h-[72vh] w-auto h-auto object-contain shadow-xl border border-ink/10 bg-white"
                decoding="async"
              />
            </div>
            <div className="px-4 py-2 bg-paper-warm border-t border-ink/10 flex flex-wrap items-center justify-between gap-2 text-xs font-kufi text-ink-muted shrink-0">
              <span>اضغط خارج الصورة أو زر Esc للإغلاق</span>
              <a href={modal.original} download className="sm:hidden text-accent font-bold underline underline-offset-4">
                تحميل الصورة الأصلية
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[ticker_20s_linear_infinite] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
