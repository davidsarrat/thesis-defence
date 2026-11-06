// The talk's offline copy (David, 27 Oct 2026: «que se cargue esto y se haga lo de descarga caché»; 29 Oct: «por si se
// muere el localhost», in every browser). Registered by lib/pages-cache.js on github.io and in the local talk repo's copy,
// with ?v=<source sha>, so every build gets a cache of its own.
// Every file the deck loads is kept as it arrives; once the deck has started, the page asks for the rest of the site
// (cache-manifest.json) to be stored in the background. Later visits load from this cache, offline too.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev'
const CACHE = `talk-${VERSION}`
const SCOPE = self.registration.scope
const ROOT = new URL(SCOPE).pathname
// Always from the network: the deploy's identity and the list of its files.
const LIVE = ['deploy-info.json', 'cache-manifest.json']
// Each build has a cache of its own, so a stored file answers whatever headers a request carries (Vary is ignored).
const ANY = { ignoreVary: true }

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith('talk-') && name !== CACHE) await caches.delete(name)
  await self.clients.claim()
})()))

// Hashed build files (assets/) never change. Any other file is checked with the server before it is stored, so a copy
// an earlier build left in the browser's HTTP cache never ends up in this one.
const checked = request => new URL(request.url).pathname.startsWith(`${ROOT}assets/`) ? request : new Request(request, { cache: 'no-cache' })

async function cached(request) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request, ANY)
  if (hit) return hit
  try {
    const response = await fetch(checked(request))
    if (response.status === 200 && response.type === 'basic') cache.put(request, response.clone()).catch(() => {})
    return response
  } catch (error) {
    // Offline: the same file stored under another query string still serves.
    return (await cache.match(request, { ignoreSearch: true, ...ANY })) || Promise.reject(error)
  }
}

// The build the server has now (deploy-info.json), or null when it cannot say (offline, or no such file).
async function liveVersion() {
  try {
    const info = await (await fetch(`${SCOPE}deploy-info.json`, { cache: 'no-store' })).json()
    return String(info.source || '').split('@').pop() || null
  } catch { return null }
}

// A page: the network first (a new build shows at once), the stored copy when offline. The deck itself is stored under
// the site's root (any other page under its own address). When the server has a new build, this copy belongs to the old
// one: it is dropped at once, so the new page never gets old files, and the new page registers its own worker.
async function page(request) {
  const url = new URL(request.url)
  const deck = url.pathname === ROOT || url.pathname === `${ROOT}index.html`
  const key = deck ? SCOPE : url.origin + url.pathname
  const version = deck ? liveVersion() : null
  try {
    const response = await fetch(request)
    const live = await version
    if (live && live !== VERSION) await caches.delete(CACHE)
    else if (response.status === 200) (await caches.open(CACHE)).put(key, response.clone()).catch(() => {})
    return response
  } catch (error) {
    // The first visit is not controlled yet, so the deck may only be stored by the background copy (as index.html).
    const cache = await caches.open(CACHE)
    return (await cache.match(key, ANY)) || (deck && await cache.match(`${SCOPE}index.html`, ANY)) || (await cache.match(request, { ignoreSearch: true, ...ANY }))
      || Promise.reject(error)
  }
}

self.addEventListener('fetch', event => {
  const { request } = event
  // Range requests (video seeking) go to the network untouched.
  if (request.method !== 'GET' || !request.url.startsWith(SCOPE) || request.headers.has('range')) return
  const path = request.url.slice(SCOPE.length).split(/[?#]/)[0]
  if (LIVE.includes(path)) return
  event.respondWith(request.mode === 'navigate' ? page(request) : cached(request))
})

async function report(data) {
  for (const client of await self.clients.matchAll({ includeUncontrolled: true })) client.postMessage({ type: 'pages-cache', ...data })
}

// The rest of the site, four files at a time, skipping what is already stored.
async function precache() {
  const manifest = await (await fetch(`${SCOPE}cache-manifest.json`, { cache: 'no-store' })).json()
  const cache = await caches.open(CACHE)
  const queue = [...manifest.files], total = queue.length
  let done = 0, failed = 0
  async function worker() {
    while (queue.length) {
      const url = SCOPE + queue.shift()
      try {
        if (!(await cache.match(url, ANY))) {
          const response = await fetch(url, { cache: 'no-cache' })
          if (response.status === 200) {
            // The page also answers for the site's root, the address the talk is opened at.
            if (url === `${SCOPE}index.html`) await cache.put(SCOPE, response.clone())
            await cache.put(url, response)
          } else failed++
        }
      } catch { failed++ }
      done++
      if (done % 25 === 0) await report({ state: 'saving', done, total })
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker))
  await report({ state: failed ? 'partial' : 'saved', done, total, failed, version: VERSION })
}

let running = null
self.addEventListener('message', event => {
  if (event.data?.type !== 'precache') return
  running ||= precache().catch(error => report({ state: 'error', error: String(error) })).finally(() => { running = null })
  event.waitUntil(running)
})
