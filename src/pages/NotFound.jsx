import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo({ title: 'Page not found' })
  return (
    <>
      <PageTitle title="Page not found" image="tailored suit/WhatsApp Image 2026-08-14 at 11.52.44.jpeg" crumbs={[{ label: 'Home', to: '/' }, { label: '404' }]} />
      <section className="section">
        <div className="container narrow empty-state">
          <h2>This page has gone to the tailor</h2>
          <p>The link may be old or mistyped.</p>
          <Link to="/" className="btn btn--dark">Back to home</Link>
        </div>
      </section>
    </>
  )
}
