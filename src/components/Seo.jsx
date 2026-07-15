import { useEffect } from 'react'

/* Per-route document head manager.

   Zyra is a client-rendered Vite SPA, so there is no server to emit per-page
   <head> tags. This hook upserts the title, description, canonical, and
   social-card meta imperatively on mount/route-change, and injects optional
   page-scoped JSON-LD. It intentionally mutates the SAME tags seeded in
   index.html (matching by name/property) rather than appending duplicates, so
   the static shell provides crawl-safe defaults and this refines them per route.

   Google renders JS and will pick these up; for non-rendering crawlers the
   static index.html defaults still apply. Prerendering (see roadmap) would make
   every route's tags visible without JS. */

const SITE = 'https://zyralabs.com'
const DEFAULT_TITLE = 'Zyra Labs — Research-Grade Peptides & Clinical Supplements'
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`

function upsertMeta(attr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  // Stringify structured data outside the effect so object identity churn
  // doesn't retrigger it every render.
  const ld = jsonLd ? JSON.stringify(jsonLd) : null
  const url = `${SITE}${path.startsWith('/') ? path : `/${path}`}`
  const fullTitle = title ? `${title} — Zyra Labs` : DEFAULT_TITLE

  useEffect(() => {
    document.title = fullTitle
    if (description) upsertMeta('name', 'description', description)
    upsertMeta(
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    )
    upsertLink('canonical', url)

    upsertMeta('property', 'og:title', fullTitle)
    if (description) upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', image)

    upsertMeta('name', 'twitter:title', fullTitle)
    if (description) upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    let script = document.head.querySelector('script[data-seo-jsonld]')
    if (ld) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-jsonld', '')
        document.head.appendChild(script)
      }
      script.textContent = ld
    } else if (script) {
      script.remove()
    }
  }, [fullTitle, description, url, image, type, noindex, ld])

  return null
}
