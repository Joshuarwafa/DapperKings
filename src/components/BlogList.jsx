import { Fragment } from 'react'
import PostCard from './PostCard'
import Pagination from './Pagination'
import Reveal from './Reveal'
import { quote } from '../data/posts'
import { monthLabel } from '../lib/format'

const filterLabel = {
  query: (v) => `“${v}”`,
  category: (v) => v,
  tag: (v) => `#${v}`,
  month: (v) => monthLabel(v),
}

export default function BlogList({ posts, total, page, pageCount, onPage, filters, setFilter, clearFilters }) {
  const active = Object.entries(filters).filter(([, v]) => v && String(v).trim())
  const showQuote = active.length === 0 && page === 1

  return (
    <main id="posts" className="blog-main">
      {active.length > 0 && (
        <div className="filter-bar" role="status">
          <span className="filter-count">
            {total} {total === 1 ? 'article' : 'articles'} for
          </span>
          {active.map(([key, value]) => (
            <button type="button" key={key} className="chip" onClick={() => setFilter(key, key === 'query' ? '' : value)}>
              {filterLabel[key](value)} <span aria-hidden="true">×</span>
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          <button type="button" className="link-btn clear-all" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <h2>Nothing found</h2>
          <p>No articles match your search. Try a different word or clear the filters.</p>
          <button type="button" className="btn btn--dark" onClick={clearFilters}>
            Show all articles
          </button>
        </div>
      ) : (
        posts.map((post, i) => (
          <Fragment key={post.slug}>
            <PostCard post={post} query={filters.query} onCategory={(c) => setFilter('category', c)} delay={i * 60} />
            {showQuote && i === 1 && (
              <Reveal as="article" className="post post--quote">
                <blockquote>
                  {quote.text}
                  <cite>{quote.author}</cite>
                </blockquote>
              </Reveal>
            )}
          </Fragment>
        ))
      )}

      <Pagination page={page} pageCount={pageCount} onChange={onPage} />
    </main>
  )
}
