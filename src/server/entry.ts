import startServer from '@tanstack/react-start/server-entry'
import { authHeaders, clearSessionCookie, createSessionCookie, isAuthenticated, passwordMatches, safeReturnPath } from './auth'

type CloudflareEnv = {
  ASSETS: { fetch(request: Request): Promise<Response> }
  SITE_PASSWORD?: string
  SESSION_SECRET?: string
}

function htmlResponse(body: string, status = 200): Response {
  const headers = authHeaders()
  headers.set('Content-Type', 'text/html; charset=utf-8')
  return new Response(body, { status, headers })
}

function loginPage(returnPath: string, invalid = false): string {
  const message = invalid ? '<p class="error">كلمة المرور ما ظابطة… جرّب تاني.</p>' : ''
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>جريدة الجبنة — دخول القعدة</title><style>body{margin:0;background:#f4ead7;color:#241d19;font-family:Georgia,serif;min-height:100vh;display:grid;place-items:center}.wrap{width:min(92vw,460px);background:#fffdf8;border:1px solid #c8bba5;border-top:5px solid #7a1e1e;padding:2.5rem;box-shadow:0 18px 50px #241d1920}h1{font-size:2.6rem;margin:0 0 .4rem;color:#7a1e1e}h2{font-size:1.35rem;margin:.5rem 0 1.5rem}label{display:block;font-size:1rem;margin-bottom:.5rem}input{box-sizing:border-box;width:100%;padding:.85rem;border:1px solid #b8aa94;background:#fff;font-size:1.1rem}button{width:100%;margin-top:1rem;padding:.9rem;background:#241d19;color:#fffdf8;border:0;font-weight:700;font-size:1rem;cursor:pointer}.error{color:#8d211d;font-weight:700;margin:.8rem 0}.mark{font-size:.8rem;color:#887968}</style></head><body><main class="wrap"><p class="mark">صحيفة ساخرة مستقلة</p><h1>جريدة الجبنة</h1><h2>هذه القعدة خاصة</h2><p>أدخل كلمة المرور لمتابعة القراءة</p>${message}<form method="post" action="/login"><input type="hidden" name="return" value="${escapeHtml(returnPath)}"><label for="password">كلمة المرور</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">دخول القعدة</button></form></main></body></html>`
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

async function workerFetch(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url)
  if (url.pathname === '/login' && request.method === 'GET') return htmlResponse(loginPage(safeReturnPath(url.searchParams.get('return'))))
  if (url.pathname === '/login' && request.method === 'POST') {
    const form = await request.formData()
    const returnPath = safeReturnPath(String(form.get('return') ?? '/'))
    if (!env.SITE_PASSWORD || !env.SESSION_SECRET) return htmlResponse('Server configuration error', 503)
    if (!(await passwordMatches(String(form.get('password') ?? ''), env))) return htmlResponse(loginPage(returnPath, true), 401)
    const cookie = await createSessionCookie(env)
    if (!cookie) return htmlResponse('Server configuration error', 503)
    const headers = new Headers(authHeaders())
    headers.set('Location', returnPath)
    headers.set('Set-Cookie', cookie)
    return new Response(null, { status: 303, headers })
  }
  if (url.pathname === '/logout' && request.method === 'POST') {
    const headers = new Headers(authHeaders())
    headers.set('Location', '/login')
    headers.set('Set-Cookie', clearSessionCookie())
    return new Response(null, { status: 303, headers })
  }
  const publicPath = url.pathname === '/favicon.ico'
  if (!publicPath && !(await isAuthenticated(request, env))) {
    const headers = new Headers(authHeaders())
    headers.set('Location', `/login?return=${encodeURIComponent(`${url.pathname}${url.search}`)}`)
    return new Response(null, { status: 302, headers })
  }
  const response = url.pathname.startsWith('/media/') || url.pathname.startsWith('/covers/') || url.pathname.startsWith('/characters/')
    ? await env.ASSETS.fetch(request)
    : await startServer.fetch(request)
  const headers = new Headers(response.headers)
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  headers.set('Cache-Control', 'private, no-store')
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

export default { fetch: workerFetch }