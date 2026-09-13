export default function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t-4 border-ink bg-ink text-paper">
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-kufi text-3xl font-extrabold">الجبنة</h2>
            <p className="font-kufi text-xs tracking-[0.2em] text-paper/70 mt-1">صحيفة ساخرة مستقلة</p>
            <p className="font-naskh text-sm leading-relaxed text-paper/75 mt-4 max-w-[42ch]">
              «الجبنة» صحيفة اجتماعية ساخرة تحفظ العبارات والحكايات اليومية في هيئة أعداد صحفية خفيفة. صُنعت
              للضحكة والذكرى — من قلب القعدة السودانية.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 border border-paper/15 px-3 py-1.5 bg-white/5">
              <span className="w-2 h-2 bg-accent-light rounded-full animate-pulse" />
              <span className="font-kufi text-xs">الأعداد ١–٧ · سبتمبر ٢٠٢٦</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-kufi text-sm font-bold text-paper/90 border-r-2 border-accent pr-2">خريطة الجريدة</h3>
            <ul className="mt-3 space-y-2 text-sm text-paper/70 font-naskh">
              <li><a href="#archive" className="hover:text-paper transition-colors">الأعداد — الأرشيف الكامل</a></li>
              <li><a href="#characters" className="hover:text-paper transition-colors">الشخصيات — وجوه الجبنة</a></li>
              <li><a href="#articles" className="hover:text-paper transition-colors">المقالات — حكايات القعدة</a></li>
              <li><a href="#about" className="hover:text-paper transition-colors">عن الجريدة — الخبر من القعدة</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-kufi text-sm font-bold text-paper/90 border-r-2 border-accent pr-2">ملاحظة</h3>
            <p className="mt-3 text-xs leading-relaxed text-paper/60 font-naskh border border-paper/10 p-3 bg-white/[0.03]">
              هذه جريدة ساخرة خيالية، ولا تمثل أخبارًا موثقة أو تصريحات رسمية. الشخصيات والمقالات جزء من
              عالم الجريدة الخاص، والمحتوى مقدم في إطار فكاهي وإبداعي.
            </p>
            <p className="mt-3 text-xs text-paper/50 font-kufi">© ٢٠٢٦ الجبنة — جميع الضحكات محفوظة</p>
          </div>
        </div>

        <div className="mt-10 pt-4 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p className="font-kufi tracking-wide text-paper/60">
            <span className="text-paper">الجبنة</span> · صحيفة اجتماعية ساخرة مستقلة · ٢٠٢٦
          </p>
          <p className="font-kufi text-paper/80">صُنعت للضحكة والذكرى.</p>
        </div>
      </div>
    </footer>
  )
}
