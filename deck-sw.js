// The deck's own cache (dev server only: biohub and local runs). On every page load the worker fetches
// /__deck-versions.json, a version per source file and asset (tools/deck-versions.mjs). A module or asset whose version
// is unchanged is served from this cache without asking the server; a changed one is fetched and stored. The reset
// button (global-top.vue) empties the cache. Anything the worker does not recognise goes to the network untouched.
const CACHE = 'deck-cache-v1'
// Safari (WebKit) is left alone until it is tested there: the worker removes itself and never answers requests.
const SAFARI = /^((?!chrome|chromium|crios|edg|fxios|android).)*safari/i.test(self.navigator.userAgent)
const META = '/__deck-cache-meta'
let manifest = null, manifestPromise = null, slideFiles = null

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(SAFARI
  ? caches.delete(CACHE).then(() => self.registration.unregister())
  : self.clients.claim()))

async function loadManifest() {
  try {
    const response = await fetch('/__deck-versions.json', { cache: 'no-store' })
    if (!response.ok) return (manifest = null)
    manifest = await response.json()
    if (!slideFiles) slideFiles = await readMeta()
    prune()
    return manifest
  } catch { return (manifest = null) }
}

async function readMeta() {
  try { const hit = await (await caches.open(CACHE)).match(META); return hit ? (await hit.json()).slideFiles || null : null } catch { return null }
}

self.addEventListener('message', event => {
  const data = event.data || {}
  if (data.type === 'slides' && Array.isArray(data.files)) {
    slideFiles = data.files
    event.waitUntil(caches.open(CACHE).then(cache => cache.put(META, new Response(JSON.stringify({ slideFiles })))))
  } else if (data.type === 'reset') {
    manifest = null; manifestPromise = null; slideFiles = null
    event.waitUntil(caches.delete(CACHE).then(() => event.source?.postMessage({ type: 'reset-done' })))
  }
})

// The version a request is cached under, or null to leave it to the network.
function versionFor(url, m) {
  const path = decodeURIComponent(url.pathname)
  if (path.startsWith('/@server-reactive') || path.startsWith('/@vite/') || path.startsWith('/__') || path === '/deck-sw.js') return null
  // Hot-reload updates and server-start stamps (?t=) go to the network: never stale, and never orphaned in the cache.
  if (url.searchParams.has('t')) return null
  const slide = /^\/@slidev\/slides\/(\d+)\//.exec(path)
  if (slide) {
    const file = slideFiles?.[Number(slide[1]) - 1], version = file && m.files[file]
    return version ? `${version}.${m.slidesMd}.${m.toolchain}` : `g${m.global}`
  }
  if (path.startsWith('/@slidev/') || path.startsWith('/@id/')) return `g${m.global}`
  // Slidev's per-slide views of a markdown file, e.g. /slides/x.md__slidev_41.md or /slides.md__slidev_2.frontmatter.
  const view = /^\/(.+?\.md)__slidev_\d+\.\w+$/.exec(path)
  if (view) { const version = m.files[view[1]]; return version ? `${version}.${m.slidesMd}.${m.toolchain}` : null }
  if (path.startsWith('/@fs/') || path.startsWith('/node_modules/')) return `t${m.toolchain}`
  const rel = path.slice(1)
  const version = m.files[rel] ?? m.files['public/' + rel]
  return version ? `${version}.${m.toolchain}` : null
}

const keyFor = (url, version) => { const key = new URL(url); key.searchParams.set('__dv', version); return key.toString() }

async function prune() {
  const m = manifest; if (!m) return
  const cache = await caches.open(CACHE)
  for (const request of await cache.keys()) {
    const url = new URL(request.url); if (url.pathname === META) continue
    const version = url.searchParams.get('__dv'); url.searchParams.delete('__dv')
    if (versionFor(url, m) !== version) cache.delete(request)
  }
}

self.addEventListener('fetch', event => {
  const request = event.request
  if (SAFARI || request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (request.mode === 'navigate') { manifestPromise = loadManifest(); return }
  // Fail-safe: whatever goes wrong in the cache path, the request goes to the network as if there were no worker.
  event.respondWith(serve(request, url).catch(() => fetch(request)))
})

async function serve(request, url) {
  const m = manifest || await (manifestPromise ||= loadManifest())
  const version = m && versionFor(url, m)
  if (!version) return fetch(request)
  const cache = await caches.open(CACHE), key = keyFor(url, version)
  const hit = await cache.match(key)
  if (hit) return hit
  // A full fetch: a conditional request would come back 304 and leave nothing to store.
  let fresh
  try { fresh = new Request(request, { cache: 'reload' }) } catch { fresh = request }
  const response = await fetch(fresh)
  if (response.status === 200 && response.type === 'basic') cache.put(key, response.clone()).catch(() => {})
  return response
}
