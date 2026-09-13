import { useState, useEffect } from 'react'

const NAV = [
  { id: 'top', label: 'الرئيسية', href: '#top' },
  { id: 'archive', label: 'الأعداد', href: '#archive' },
  { id: 'characters', label: 'الشخصيات', href: '#characters' },
  { id: 'articles', label: 'المقالات', href: '#articles' },
  { id: 'about', label: 'عن الجريدة', href: '#about' },
]

export default function Masthead() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')

  useEffect(() => {
    const ids = NAV.map((n) => n.id)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // lock body scroll when menu open on mobile
  useEffect(() => {
    if (open) document.documentElement.style.overflow = 'hidden'
    else document.documentElement.style.overflow = ''
    return () => { document.documentElement.style.overflow = '' }
  }, [open])

  return (
    <header id="top" className="sticky top-0 z-40 bg-paper/95 backdrop-blur-[8px] border-b-0 no-print">
      {/* top info bar */}
      <div className="bg-ink text-paper text-[11px] sm:text-xs">
        <div className="max-w-[1280px] mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
          <span className="font-kufi tracking-wide">الخرطوم — سبتمبر ٢٠٢٦</span>
          <span className="hidden md:inline opacity-80">من أجل وطن أكثر ضحكًا — صحيفة اجتماعية ساخرة مستقلة</span>
          <span className="font-kufi">العدد ٧ · الخميس ١٠ سبتمبر</span>
        </div>
      </div>

      {/* masthead */}
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-stretch gap-3 py-3 sm:py-4">
          {/* left slogan box */}
          <div className="hidden lg:flex w-[140px] shrink-0 border border-ink/15 bg-paper-dim/40 flex-col items-center justify-center text-center p-2">
            <p className="font-kufi text-[12px] leading-tight font-bold">كلام الناس</p>
            <p className="font-kufi text-[12px] leading-tight font-bold">في الجبنة أحلى</p>
            <div className="mt-1.5 w-10 h-0.5 bg-accent" />
          </div>

          {/* center masthead */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
            <a href="#top" className="block group">
              <h1 className="masthead-title text-[42px] sm:text-[56px] lg:text-[68px] tracking-tight text-ink group-hover:text-accent transition-colors">
                الجبنة
              </h1>
            </a>
            <p className="font-kufi text-[10px] sm:text-xs tracking-[0.18em] text-accent font-bold mt-1">
              صحيفة ساخرة مستقلة
            </p>
            <p className="hidden sm:block font-naskh text-[11px] text-ink-muted mt-1 tracking-wide">
              ما الحقيقة إلا طرفة أخرى · من أجل وطن أكثر ضحكًا
            </p>
          </div>

          {/* right slogan box */}
          <div className="hidden lg:flex w-[140px] shrink-0 border border-ink/15 bg-paper-dim/40 flex-col items-center justify-center text-center p-2">
            <p className="font-kufi text-[12px] leading-tight font-bold">ما الحقيقة</p>
            <p className="font-kufi text-[12px] leading-tight font-bold">إلا طرفة أخرى</p>
            <div className="mt-1.5 w-10 h-0.5 bg-accent" />
          </div>

          {/* mobile menu button */}
          <button
            aria-label="القائمة"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden self-center shrink-0 w-10 h-10 grid place-items-center border border-ink/15 bg-paper-dim/50 hover:bg-paper-dim transition-colors"
          >
            <span className="sr-only">القائمة</span>
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block w-5 h-0.5 bg-ink transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-5 h-0.5 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* nav */}
      <nav
        id="primary-nav"
        className={`${open ? 'block' : 'hidden'} lg:block border-y border-ink/10 bg-paper-dim/30`}
        aria-label="التنقل الرئيسي"
      >
        <div className="max-w-[1280px] mx-auto px-4">
          <ul className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-0 lg:gap-1 py-1 lg:py-0">
            {NAV.map((item) => (
              <li key={item.id} className="border-b lg:border-b-0 border-ink/10 last:border-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 lg:py-2.5 text-[14px] font-kufi font-semibold tracking-wide transition-colors border-l border-transparent lg:text-center ${
                    active === item.id ? 'text-accent bg-accent/5 lg:border-accent' : 'text-ink hover:text-accent hover:bg-white/60'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {/* slogans inline mobile */}
            <li className="lg:hidden px-4 py-2 flex items-center justify-center gap-6 text-[11px] font-kufi text-ink-muted border-t border-ink/10 bg-paper-warm/50">
              <span>كلام الناس في الجبنة أحلى</span>
              <span className="w-1 h-1 bg-accent rounded-full" />
              <span>ما الحقيقة إلا طرفة أخرى</span>
            </li>
          </ul>
        </div>
      </nav>

      {/* thin dark-red line */}
      <div className="h-[3px] bg-accent w-full" />
    </header>
  )
}
