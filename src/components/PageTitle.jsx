import { Link } from 'react-router-dom'
import Backdrop from './Backdrop'

export default function PageTitle({ title, image, position = 'center 30%', crumbs = [] }) {
  return (
    <section className="page-title">
      <Backdrop image={image} position={position} />
      <div className="container page-title-inner" key={title}>
        <h1>{title}</h1>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label}>
              {i > 0 && <span className="sep">/</span>}
              {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
