import { Link } from 'react-router-dom'
import './CTA.css'

export default function CTA() {
  return (
    <section className="cta">
      <div className="wrap cta__row">
        <button className="cta__rec" type="button" aria-hidden="true" tabIndex={-1}>
          <span className="cta__rec-dot" />
        </button>
        <div>
          <span className="eyebrow">Creator network</span>
          <h2 className="cta__title">Join YA KAVA PROD.</h2>
          <p className="cta__lead">Learn new skills, discover useful digital products, and start selling your creative work in one place.</p>
        </div>
        <div className="cta__actions">
          <Link to="/signup" className="hero__btn hero__btn--primary">Create your account</Link>
          <a href="#marketplace" className="hero__btn hero__btn--ghost">Explore the marketplace</a>
        </div>
      </div>
    </section>
  )
}
