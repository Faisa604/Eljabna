import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import Masthead from '@/components/masthead'
import SiteFooter from '@/components/site-footer'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'جريدة الجبنة — الأعداد والمقالات' },
      {
        name: 'description',
        content: 'الأرشيف الإلكتروني لجريدة الجبنة الساخرة: ثمانية أعداد وشخصيات ومقالات من قلب القعدة السودانية.',
      },
      // Open Graph
      { property: 'og:title', content: 'جريدة الجبنة — الأعداد والمقالات' },
      {
        property: 'og:description',
        content: 'الأرشيف الإلكتروني لجريدة الجبنة الساخرة: ثمانية أعداد وشخصيات ومقالات من قلب القعدة السودانية.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'ar_SD' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'جريدة الجبنة — الأعداد والمقالات' },
      {
        name: 'twitter:description',
        content: 'الأرشيف الإلكتروني لجريدة الجبنة الساخرة: ثمانية أعداد وشخصيات ومقالات من قلب القعدة السودانية.',
      },
      { name: 'theme-color', content: '#7a1e1e' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700;800&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap',
      },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Masthead />
        <main id="main">{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  )
}
