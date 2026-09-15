interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
  SITE_PASSWORD: string
  SESSION_SECRET: string
}