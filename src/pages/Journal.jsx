import { useMemo } from 'react'
import { Link, Outlet, useMatch } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import BlogList from '../components/BlogList'
import PostDetail from '../components/PostDetail'
import Sidebar from '../components/Sidebar'
import { useJournalFilters } from '../hooks/useJournalFilters'
import { useSeo } from '../hooks/useSeo'
import { scrollToId } from '../hooks/useScroll'
import { posts } from '../data/posts'
import { monthKey } from '../lib/format'

const PER_PAGE = 3
const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date))

// Shared layout so the sidebar (and its search box) stays mounted between list and article.
export function JournalLayout() {
  const match = useMatch('/journal/:slug')
  const post = match ? posts.find((p) => p.slug === match.params.slug) : null
  const journal = useJournalFilters()

  return (
    <>
      {post ? (
        <PageTitle
          title={post.title}
          image={post.image}
          position={post.position}
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Journal', to: '/journal' }, { label: post.category }]}
        />
      ) : (
        <PageTitle
          title={match ? 'Article not found' : 'Journal'}
          image="tailored suit/WhatsApp Image 2026-08-14 at 11.51.19.jpeg"
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Journal' }]}
        />
      )}
      <div className="container">
        <div className="blog-wrap">
          <Outlet />
          <Sidebar filters={journal.filters} setFilter={journal.setFilter} />
        </div>
      </div>
    </>
  )
}

export function JournalList() {
  useSeo({ title: 'Journal', description: 'Style notes on fit, fabric and dressing for weddings and events.' })
  const { filters, page, setFilter, setPage, clearFilters } = useJournalFilters()

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return sortedPosts.filter(
      (p) =>
        (!filters.category || p.category === filters.category) &&
        (!filters.tag || p.tags.includes(filters.tag)) &&
        (!filters.month || monthKey(p.date) === filters.month) &&
        (!q || [p.title, p.excerpt, p.category, ...p.tags].join(' ').toLowerCase().includes(q)),
    )
  }, [filters.query, filters.category, filters.tag, filters.month])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pageCount)

  return (
    <BlogList
      posts={filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)}
      total={filtered.length}
      page={current}
      pageCount={pageCount}
      onPage={(n) => {
        setPage(n)
        scrollToId('posts')
      }}
      filters={filters}
      setFilter={setFilter}
      clearFilters={clearFilters}
    />
  )
}

export function JournalPost() {
  const match = useMatch('/journal/:slug')
  const post = posts.find((p) => p.slug === match?.params.slug)
  const { setFilter } = useJournalFilters()
  useSeo(post ? { title: post.title, description: post.excerpt, image: post.image } : { title: 'Article not found' })

  if (!post) {
    return (
      <main className="blog-main empty-state">
        <h2>We couldn't find that article</h2>
        <p>It may have been moved or renamed.</p>
        <Link to="/journal" className="btn btn--dark">Back to the journal</Link>
      </main>
    )
  }

  return (
    <PostDetail
      post={post}
      sortedPosts={sortedPosts}
      onCategory={(c) => setFilter('category', c)}
      onTag={(t) => setFilter('tag', t)}
    />
  )
}
