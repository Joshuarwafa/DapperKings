import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Highlight from './Highlight'
import { dateParts, img, readingTime } from '../lib/format'

export default function PostCard({ post, query, onCategory, delay = 0 }) {
  const { day, monthYear } = dateParts(post.date)
  const href = `/journal/${post.slug}`

  return (
    <Reveal as="article" className="post" delay={delay}>
      <Link to={href} className="post-media" aria-label={post.title}>
        <img src={img(post.image)} alt={post.alt} style={{ objectPosition: post.position }} loading="lazy" />
        <div className="date-badge">
          <span className="d">{day}</span>
          <span className="m">{monthYear}</span>
        </div>
      </Link>
      <div className="post-body">
        <div className="post-meta">
          <span>
            <button type="button" className="link-btn accent" onClick={() => onCategory(post.category)}>
              {post.category}
            </button>
          </span>
          <span>By Dapper</span>
          <span>{readingTime(post)} min read</span>
        </div>
        <h2 className="post-title">
          <Link to={href}>
            <Highlight text={post.title} query={query} />
          </Link>
        </h2>
        <p className="post-excerpt">
          <Highlight text={post.excerpt} query={query} />
        </p>
        <Link to={href} className="read-more">
          Read More
        </Link>
      </div>
    </Reveal>
  )
}
