type ShareButtonProps = {
  title: string
  path: string
  compact?: boolean
}

export default function ShareButton({ title, path, compact = false }: ShareButtonProps) {
  const share = () => {
    const url = new URL(path, window.location.origin).toString()
    const text = `${title} — جريدة الجبنة\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex items-center justify-center gap-2 border border-[#1f8f4d]/30 bg-[#eef9f1] text-[#166b3a] font-kufi font-bold hover:bg-[#1f8f4d] hover:text-white transition-colors ${
        compact ? 'px-2.5 py-2 text-[11px]' : 'px-4 py-2.5 text-xs'
      }`}
      aria-label={`مشاركة ${title} عبر واتساب`}
    >
      <span aria-hidden className="text-sm leading-none">◉</span>
      مشاركة واتساب
    </button>
  )
}
