const SESSION_COOKIE = 'jabna_session'
const SESSION_MAX_AGE = 604800

type SecretEnv = {
  SITE_PASSWORD?: string
  SESSION_SECRET?: string
}

export function authHeaders(): Headers {
  const headers = new Headers()
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  headers.set('Cache-Control', 'private, no-store')
  return headers
}

export function safeReturnPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = ''
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): ArrayBuffer {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer
}

async function signingKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function sign(value: string, secret: string): Promise<string> {
  const signature = await crypto.subtle.sign('HMAC', await signingKey(secret), new TextEncoder().encode(value))
  return `${value}.${toBase64Url(signature)}`
}

async function verify(value: string, secret: string): Promise<boolean> {
  const separator = value.lastIndexOf('.')
  if (separator <= 0) return false
  const payload = value.slice(0, separator)
  const signature = value.slice(separator + 1)
  const timestamp = Number(payload)
  if (!Number.isSafeInteger(timestamp) || Date.now() - timestamp > SESSION_MAX_AGE * 1000 || timestamp > Date.now() + 60_000) return false
  try {
    return await crypto.subtle.verify('HMAC', await signingKey(secret), fromBase64Url(signature), new TextEncoder().encode(payload))
  } catch {
    return false
  }
}

function cookieValue(request: Request): string | null {
  const cookies = request.headers.get('Cookie')?.split(';') ?? []
  const match = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))
  return match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : null
}

export async function isAuthenticated(request: Request, env: SecretEnv): Promise<boolean> {
  if (!env.SESSION_SECRET) return false
  const cookie = cookieValue(request)
  return cookie ? verify(cookie, env.SESSION_SECRET) : false
}

export async function createSessionCookie(env: SecretEnv): Promise<string | null> {
  if (!env.SESSION_SECRET) return null
  const payload = String(Date.now())
  const value = await sign(payload, env.SESSION_SECRET)
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}`
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
}

export async function passwordMatches(submitted: string, env: SecretEnv): Promise<boolean> {
  if (!env.SITE_PASSWORD || !env.SESSION_SECRET) return false
  const key = await signingKey(env.SESSION_SECRET)
  const [expected, actual] = await Promise.all([
    crypto.subtle.sign('HMAC', key, new TextEncoder().encode(env.SITE_PASSWORD)),
    crypto.subtle.sign('HMAC', key, new TextEncoder().encode(submitted)),
  ])
  return equalBytes(new Uint8Array(expected), new Uint8Array(actual))
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  let difference = left.length ^ right.length
  for (let index = 0; index < Math.max(left.length, right.length); index++) difference |= (left[index] ?? 0) ^ (right[index] ?? 0)
  return difference === 0
}

export { SESSION_COOKIE }