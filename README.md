# جريدة الجبنة

موقع جريدة ساخرة عربية — أرشيف ٧ أعداد مصوّرة (كرتي، عكاشة، عدوي، هيتو، أسامة، البت الحديقة ×٢) مع قراءات مقالية، فلترة بالوسوم (اجتماعي/ساخر/شعري/الشخصيات)، وبحث فوري. يتضمن الإصدار المطوّر معرضًا لست شخصيات مرسومة بأسلوب كاركتير صحفي، وبطاقات مقالات مختصرة، وصفحات قراءة كاملة، ومشاركة مباشرة عبر واتساب.

تطورت من نسخة "الرصيف" الأولية إلى أرشيف كامل مصوّر (سبتمبر ٢٠٢٦).

## التقنيات المستخدمة

- **TanStack Start** (React 19 + TanStack Router) — التطبيق والتوجيه
- **Vite 7** — أداة البناء
- **Tailwind CSS 4** — التنسيق، مع متغيرات تصميم مخصصة في `src/styles.css`
- **Content Collections** — للمحتوى القديم `content/posts/` + مخطط اختياري `content/issues/`، بينما المصدر الأساسي الحالي هو `src/data/issues.ts`
- **TypeScript** (strict mode)
- **Cloudflare Workers** — استضافة SSR والأصول الثابتة

## تشغيل المشروع محلياً

```bash
pnpm install
pnpm run dev
```

يفتح الموقع على المنفذ 3000. لمعاينة نسخة Cloudflare بعد البناء:

```bash
pnpm run build
pnpm run preview
```

## النشر على Cloudflare

المشروع مهيأ كتطبيق TanStack Start كامل يعمل بـ SSR على Cloudflare Workers.

```bash
pnpm run deploy
```

لربط مستودع GitHub من لوحة **Workers & Pages** استخدم:

- Build command: `pnpm run build`
- Deploy command: `pnpm exec wrangler deploy`
- Root directory: اتركه فارغًا إذا كانت الملفات في جذر المستودع
- Output directory: غير مطلوب في Workers Builds

راجع `CLOUDFLARE_DEPLOY.md` للتفاصيل وشرح بنية المخرجات.

## إضافة عدد جديد

1. أضف كائن جديد إلى `ISSUES` و `ARTICLES` في `src/data/issues.ts` (انسخ بنية عدد موجود، غيّر `id`, `n`, `headline`, `tags`, ومسارات الصور).
2. (اختياري) أضف ملف Markdown مرآة في `content/issues/عدد-08.md` — راجع `content-collections.ts`.
3. ضع صور الغلاف في `public/covers/original/` وشغّل `python convert.py` لتوليد نسخ الـ webp/jpg.

## إضافة شخصية جديدة

1. ضع صورة الكاركتير المحسّنة في `public/characters/` بصيغة WebP مربعة.
2. أضف بيانات الشخصية ومسارات أعدادها في `src/data/characters.ts`.
3. سيظهر الكاركتير تلقائيًا في معرض الشخصيات وبطاقة المقال وصفحات القراءة المرتبطة.

## إضافة مقال قديم (legacy)

أضف ملف Markdown داخل `content/posts/` بحقول `title`, `summary`, `categories`, `author`, `date`, `image`. راجع `content-collections.ts` و `AGENTS.md`.

## البنية

راجع `AGENTS.md` لخريطة المجلدات الكاملة ونموذج المحتوى.
