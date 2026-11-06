// The talk's offline copy (David, 27 Oct 2026: «que se cargue esto y se haga lo de descarga caché»; 29 Oct: «por si se
// muere el localhost», in every browser). Registered by lib/pages-cache.js on github.io and in the local talk repo's copy,
// with ?v=<source sha>, so every build gets a cache of its own.
// Every file the deck loads is kept as it arrives; once the deck has started, the page asks for the rest of the site
// (cache-manifest.json) to be stored in the background. Later visits load from this cache, offline too.
// A new build only downloads what changed (David, 6 Nov 2026: «lo del service worker ese adaptativo en github pages»).
// GitHub Pages gives every file a new ETag on each deploy, so the browser alone would download the whole talk again.
// Instead, each stored file keeps the hash of the content received next to it, cache-manifest.json gives the hash of
// every file of the new build, and the new build's cache takes over from the old one every file whose hash is the same.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev'
const CACHE = `talk-${VERSION}`
const SCOPE = self.registration.scope
const ROOT = new URL(SCOPE).pathname
// Always from the network: the deploy's identity and the list of its files.
const LIVE = ['deploy-info.json', 'cache-manifest.json']
// Each build has a cache of its own, so a stored file answers whatever headers a request carries (Vary is ignored).
const ANY = { ignoreVary: true }
// Kept in each cache next to the site's files: the hash of each stored file, and a mark once the server has a newer build.
const OWN = `${SCOPE}__talk/`, STALE = `${OWN}stale`, KEPT = `${OWN}kept`
const hashKey = file => `${OWN}sha/${file}`

self.addEventListener('install', event => event.waitUntil((async () => {
  await keepUnchanged().catch(() => {})
  await self.skipWaiting()
})()))
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith('talk-') && name !== CACHE) await caches.delete(name)
  await self.clients.claim()
})()))

// A file's name in the manifest (its path under the site, each part URI-encoded), from a request's or a stored URL.
const decoded = part => { try { return decodeURIComponent(part) } catch { return part } }
const fileOf = url => url.slice(SCOPE.length).split(/[?#]/)[0].split('/').map(part => encodeURIComponent(decoded(part))).join('/')
const hashed = url => new URL(url).pathname.startsWith(`${ROOT}assets/`)

// The SHA-256 of a body as the manifest writes it (scripts/pages-manifest.cjs): base64url, first 22 characters.
async function sha(buffer) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 22)
}

// Stores a file from the network, with the hash of what was actually received.
async function store(cache, key, response) {
  const body = await response.clone().arrayBuffer()
  await cache.put(key, response)
  await cache.put(hashKey(fileOf(typeof key === 'string' ? key : key.url)), new Response(await sha(body)))
}
const storedHash = async (cache, file) => (await cache.match(hashKey(file)))?.text()

// The hashes of the build the server has now, or null (offline, or a build without them).
async function serverHashes() {
  try { return (await (await fetch(`${SCOPE}cache-manifest.json`, { cache: 'no-store' })).json()).hashes || null } catch { return null }
}

// A new build: every file whose content did not change moves over from the earlier builds' caches, with its hash.
async function keepUnchanged() {
  const hashes = await serverHashes()
  if (!hashes) return
  const cache = await caches.open(CACHE)
  let kept = 0
  for (const name of await caches.keys()) {
    if (!name.startsWith('talk-') || name === CACHE) continue
    const old = await caches.open(name)
    for (const [file, hash] of Object.entries(hashes)) {
      const url = SCOPE + file
      if (await cache.match(url, ANY) || await storedHash(old, file) !== hash) continue
      const hit = await old.match(url, ANY)
      if (!hit) continue
      // The page also answers for the site's root, the address the talk is opened at.
      if (file === 'index.html') await cache.put(SCOPE, hit.clone())
      await cache.put(url, hit)
      await cache.put(hashKey(file), new Response(hash))
      kept++
    }
  }
  // How many files the new build took over (window.__pagesCache.kept), kept in the cache: a browser may stop the worker
  // between its install and the background copy.
  await cache.put(KEPT, new Response(String(kept)))
}

// Once the server has a newer build, this cache belongs to an old one. Until the new build's worker takes over (it
// installs as soon as the new page registers it), only files the new build has unchanged are served from here, and
// nothing new is stored.
let stale = null, fresh = null
async function markStale(live) {
  stale = true
  if (fresh?.version !== live) fresh = { version: live, hashes: serverHashes() }
  await (await caches.open(CACHE)).put(STALE, new Response(live)).catch(() => {})
}
async function isStale(cache) {
  if (stale === null) stale = !!(await cache.match(STALE))
  return stale
}
async function unmarkStale(cache) {
  if (!(await isStale(cache))) return
  stale = false; fresh = null
  await cache.delete(STALE).catch(() => {})
}
async function unchanged(cache, file) {
  fresh ||= { version: null, hashes: serverHashes() }
  const hashes = await fresh.hashes
  return !!hashes?.[file] && await storedHash(cache, file) === hashes[file]
}

// GitHub's servers answer an odd file with a 503 now and then (6 Nov 2026: one or two of the site's 800 files in a
// first visit): such an answer is asked once more, a second later.
async function fetchAgain(request, init) {
  const response = await fetch(request, init)
  if (response.status < 500) return response
  await new Promise(resolve => setTimeout(resolve, 1000))
  return fetch(request, init)
}

// Hashed build files (assets/) never change. Any other file is checked with the server before it is stored, so a copy
// an earlier build left in the browser's HTTP cache never ends up in this one.
const checked = request => hashed(request.url) ? request : new Request(request, { cache: 'no-cache' })

async function cached(request) {
  const cache = await caches.open(CACHE)
  const old = await isStale(cache)
  const usable = !old || hashed(request.url) || await unchanged(cache, fileOf(request.url))
  const hit = usable && await cache.match(request, ANY)
  if (hit) return hit
  try {
    const response = await fetchAgain(checked(request))
    if (!old && response.status === 200 && response.type === 'basic') store(cache, request, response.clone()).catch(() => {})
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
// the site's root (any other page under its own address). When the server has a new build, the page is not stored:
// this cache is marked as old (above), and the new page registers its own worker.
async function page(request) {
  const url = new URL(request.url)
  const deck = url.pathname === ROOT || url.pathname === `${ROOT}index.html`
  const key = deck ? SCOPE : url.origin + url.pathname
  const version = deck ? liveVersion() : null
  try {
    const response = await fetch(request)
    const live = await version
    const cache = await caches.open(CACHE)
    if (live && live !== VERSION) await markStale(live)
    else {
      if (live) await unmarkStale(cache)
      if (response.status === 200) cache.put(key, response.clone()).catch(() => {})
    }
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

// The rest of the site, four files at a time, skipping what is already stored (what the earlier build kept included).
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
          const response = await fetchAgain(url, { cache: 'no-cache' })
          if (response.status === 200) {
            // The page also answers for the site's root, the address the talk is opened at.
            if (url === `${SCOPE}index.html`) await cache.put(SCOPE, response.clone())
            await store(cache, url, response)
          } else failed++
        }
      } catch { failed++ }
      done++
      if (done % 25 === 0) await report({ state: 'saving', done, total })
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker))
  const kept = Number(await (await cache.match(KEPT))?.text() || 0)
  await report({ state: failed ? 'partial' : 'saved', done, total, failed, kept, version: VERSION })
}

// An old build's worker does not fill its cache: the page asks again a minute later, when the new build's worker has
// taken over.
let running = null
self.addEventListener('message', event => {
  if (event.data?.type !== 'precache') return
  running ||= caches.open(CACHE).then(isStale).then(old => old ? null : precache())
    .catch(error => report({ state: 'error', error: String(error) })).finally(() => { running = null })
  event.waitUntil(running)
})
