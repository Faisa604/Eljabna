import { CHARACTERS } from '@/data/characters'

export default function CharacterGallery() {
  return (
    <section id="characters" className="max-w-[1280px] mx-auto px-4 pt-10 scroll-mt-[150px]">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3 mb-6">
        <div>
          <p className="font-kufi text-xs tracking-[0.15em] text-accent font-bold">رسوم الجبنة الأصلية</p>
          <h2 className="font-kufi text-[26px] sm:text-[30px] font-extrabold leading-none mt-2">ست شخصيات · سبعة أعداد</h2>
          <p className="font-naskh text-sm text-ink-muted mt-2">وجوه القعدة مرسومة بحبر الصحافة ولمسة عنابية</p>
        </div>
        <span className="font-kufi text-xs text-ink-muted border border-ink/15 bg-white px-3 py-1.5">البت الحديقة · عددان</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CHARACTERS.map((character, index) => (
          <article key={character.slug} className="character-card group paper-card overflow-hidden">
            <a href={`#${character.issueIds[character.issueIds.length - 1]}`} className="grid grid-cols-[118px_1fr] sm:grid-cols-[145px_1fr] min-h-[170px]">
              <div className="relative overflow-hidden bg-paper-dim border-l border-ink/10">
                <img
                  src={character.image}
                  alt={`رسم كاركتير لشخصية ${character.name}`}
                  width={900}
                  height={900}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-2 bottom-2 bg-ink text-paper font-kufi text-[10px] px-2 py-1">كاركتير</span>
              </div>
              <div className="p-4 flex flex-col">
                <p className="font-kufi text-[10px] tracking-wide text-accent font-bold">{character.kicker}</p>
                <h3 className="font-kufi text-lg font-extrabold leading-tight mt-1 group-hover:text-accent transition-colors">{character.name}</h3>
                <p className="font-naskh text-[13px] leading-[1.7] text-ink-soft mt-2">{character.bio}</p>
                <p className="mt-auto pt-3 font-kufi text-[11px] text-accent font-bold">اقرأ الحكاية ←</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
