import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useToast } from './Toast'
import { ArrowLeft, ArrowRight, LinkIcon, WhatsAppIcon } from './Icons'
import { formatDate, img, readingTime } from '../lib/format'

export default function PostDetail({ post, sortedPosts, onCategory, onTag }) {
  const notify = useToast()
  const index = sortedPosts.findIndex((p) => p.slug === post.slug)
  const newer = sortedPosts[index - 1]
  const older = sortedPosts[index + 1]
  const related = sortedPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 2)

  const copyLink = () => {
    if (!navigator.clipboard) {
      notify('Copy the link from your address bar')
      return
    }
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => notify('Link copied to clipboard'))
      .catch(() => notify('Could not copy the link'))
  }

  const shareWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${window.location.href}`)}`

  return (
    <main className="blog-main article">
      <Reveal className="post-meta">
        <span>
          <button type="button" className="link-btn accent" onClick={() => onCategory(post.category)}>
            {post.category}
          </button>
        </span>
        <span>{formatDate(post.date)}</span>
        <span>{readingTime(post)} min read</span>
      </Reveal>

      <Reveal as="p" className="article-lead">
        {post.excerpt}
      </Reveal>

      <Reveal className="article-figure">
        <img src={img(post.image)} alt={post.alt} style={{ objectPosition: post.position }} />
      </Reveal>

      <div className="article-body">
        {post.body.map((para, i) => (
          <Reveal as="p" key={i}>
            {para}
          </Reveal>
        ))}
      </div>

      <Reveal className="article-cta">
        <h3>Love this look?</h3>
        <p>Book a consultation and we will design one made only for you.</p>
        <Link to="/book" className="btn btn--auto">Book a fitting</Link>
      </Reveal>

      <div className="article-footer">
        <div className="tags">
          {post.tags.map((tag) => (
            <button type="button" key={tag} onClick={() => onTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
        <div className="share">
          <a className="share-btn" href={shareWhatsApp} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Share
          </a>
          <button type="button" className="share-btn" onClick={copyLink}>
            <LinkIcon /> Copy link
          </button>
        </div>
      </div>

      <nav className="post-nav" aria-label="More articles">
        {older ? (
          <Link to={`/journal/${older.slug}`} className="post-nav-item">
            <span className="post-nav-label"><ArrowLeft /> Previous</span>
            <span className="post-nav-title">{older.title}</span>
          </Link>
        ) : <span />}
        {newer && (
          <Link to={`/journal/${newer.slug}`} className="post-nav-item post-nav-item--next">
            <span className="post-nav-label">Next <ArrowRight /></span>
            <span className="post-nav-title">{newer.title}</span>
          </Link>
        )}
      </nav>

      {related.length > 0 && (
        <section className="related">
          <h3 className="widget-title">You may also like</h3>
          <div className="related-grid">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link to={`/journal/${p.slug}`} className="related-card">
                  <div className="related-media">
                    <img src={img(p.image)} alt="" style={{ objectPosition: p.position }} loading="lazy" />
                  </div>
                  <span className="related-cat">{p.category}</span>
                  <h4>{p.title}</h4>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
