import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../config/site'
import { img } from '../lib/format'

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

// Sets the page <title>, description and social-share (Open Graph / Twitter) tags.
export function useSeo({ title, description = site.description, image = 'tailored suit/Cover.jpeg' }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.brand}` : `${site.brand} | ${site.tagline}`
    const url = `${site.siteUrl}${pathname}`
    const imageUrl = new URL(img(image), window.location.origin).href

    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', imageUrl)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)
    setCanonical(url)
  }, [title, description, image, pathname])
}

// Structured data so Google can show the business (hours, contact, socials) in search.
export function useBusinessSchema() {
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: site.brand,
      description: site.description,
      url: site.siteUrl,
      telephone: site.phoneLink,
      email: site.email,
      image: new URL(img('tailored suit/Cover.jpeg'), window.location.origin).href,
      address: { '@type': 'PostalAddress', streetAddress: site.address.join(', ') },
      sameAs: Object.values(site.socials),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}
