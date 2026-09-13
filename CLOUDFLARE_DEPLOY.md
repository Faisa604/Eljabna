# نشر جريدة الجبنة على Cloudflare

## الإعداد الموصى به

هذه النسخة تعمل كتطبيق **TanStack Start SSR على Cloudflare Workers**. من لوحة
Cloudflare افتح **Workers & Pages**، أنشئ Worker عبر استيراد مستودع GitHub، ثم
اضبط إعدادات البناء كما يلي:

| الإعداد | القيمة |
|---|---|
| Build command | `pnpm run build` |
| Deploy command | `pnpm exec wrangler deploy` |
| Non-production deploy command | `pnpm exec wrangler versions upload` |
| Root directory | فارغ، أو مسار المشروع إن لم يكن في جذر المستودع |
| Output directory | غير مطلوب في Workers Builds |

> إذا طلبت الواجهة حقل **Pages build output directory** إجباريًا، فأنت داخل
> مسار Pages الثابت القديم. ارجع واختر Worker/Workers Builds حتى يعمل SSR.

## بنية البناء

بعد تشغيل `pnpm run build` تكون المخرجات المهمة:

```text
dist/
├── client/                 # الأصول الثابتة والصور وملفات JavaScript/CSS
└── server/
    ├── index.js            # نقطة تشغيل Cloudflare Worker وSSR
    ├── wrangler.json       # إعداد نشر مولّد يربط Worker بأصول client
    ├── assets/
    └── .vite/manifest.json
```

لن يتولد مجلد `/functions` أو ملف `_worker.js`. هذا متوقع في تكامل Cloudflare
Vite الحديث: نقطة تشغيل SSR هي `dist/server/index.js`، وWrangler يقرأ ملف
`dist/server/wrangler.json` المولد وينشر Worker مع محتويات `dist/client`.

لا تضع `dist/client` كـ Pages output directory؛ فهو يحتوي الأصول الثابتة فقط،
ولا يمثل تطبيق SSR كاملًا.

## أوامر مفيدة

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
pnpm exec wrangler deploy --dry-run
pnpm run deploy
```

يتطلب النشر الفعلي تسجيل الدخول مرة واحدة عبر `pnpm exec wrangler login`، أو
إعداد رمز Cloudflare API في خدمة البناء.
