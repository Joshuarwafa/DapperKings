import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Newsletter from './Newsletter'
import { SearchIcon } from './Icons'
import { posts, popularSlugs } from '../data/posts'
import { site } from '../config/site'
import { formatDate, img, monthKey, monthLabel } from '../lib/format'

const countBy = (items, key) =>
  items.reduce((acc, item) => {
    const k = key(item)
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

export default function Sidebar({ filters, setFilter }) {
  const categories = useMemo(() => Object.entries(countBy(posts, (p) => p.category)).sort(), [])
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), [])
  const months = useMemo(
    () => Object.entries(countBy(posts, (p) => monthKey(p.date))).sort((a, b) => b[0].localeCompare(a[0])),
    [],
  )
  const popular = popularSlugs.map((slug) => posts.find((p) => p.slug === slug)).filter(Boolean)

  return (
    <aside className="sidebar">
      <Reveal className="author-widget">
        <img src={img(site.designer.photo)} alt={site.designer.name} />
        <h4>{site.designer.name}</h4>
        <div className="role">{site.designer.title}</div>
        <p>Made-to-measure suits, wedding wear and occasion outfits, cut and finished for the way you live.</p>
        <Link to="/book" className="btn btn--auto btn--small">Book a fitting</Link>
      </Reveal>

      <Reveal className="widget" id="search">
        <h3 className="widget-title">Search</h3>
        <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            id="search-input"
            type="search"
            value={filters.query}
            onChange={(e) => setFilter('query', e.target.value)}
            placeholder="Search the journal…"
            aria-label="Search the journal"
            autoComplete="off"
          />
          <span className="search-icon"><SearchIcon /></span>
        </form>
      </Reveal>

      <Reveal className="widget">
        <h3 className="widget-title">Popular Posts</h3>
        <ul className="popular-list">
          {popular.map((p) => (
            <li key={p.slug}>
              <Link to={`/journal/${p.slug}`} className="thumb">
                <img src={img(p.image)} alt="" loading="lazy" />
              </Link>
              <div>
                <h5><Link to={`/journal/${p.slug}`}>{p.title}</Link></h5>
                <time dateTime={p.date}>{formatDate(p.date)}</time>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="widget">
        <h3 className="widget-title">Categories</h3>
        <ul className="cat-list">
          {categories.map(([name, count]) => (
            <li key={name}>
              <button
                type="button"
                className={`link-btn ${filters.category === name ? 'is-active' : ''}`}
                aria-pressed={filters.category === name}
                onClick={() => setFilter('category', name)}
              >
                {name}
              </button>
              <span>({String(count).padStart(2, '0')})</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="newsletter">
        <h3 className="widget-title">Newsletter</h3>
        <p>New looks, styling notes and fitting dates — straight to your inbox.</p>
        <Newsletter />
      </Reveal>

      <Reveal className="widget">
        <h3 className="widget-title">Tags</h3>
        <div className="tags">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={filters.tag === tag ? 'is-active' : ''}
              aria-pressed={filters.tag === tag}
              onClick={() => setFilter('tag', tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal className="widget">
        <h3 className="widget-title">Archives</h3>
        <ul className="cat-list">
          {months.map(([key, count]) => (
            <li key={key}>
              <button
                type="button"
                className={`link-btn ${filters.month === key ? 'is-active' : ''}`}
                aria-pressed={filters.month === key}
                onClick={() => setFilter('month', key)}
              >
                {monthLabel(key)}
              </button>
              <span>({String(count).padStart(2, '0')})</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </aside>
  )
}
