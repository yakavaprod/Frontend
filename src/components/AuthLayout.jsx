import { Link } from 'react-router-dom'
import './AuthLayout.css'

export default function AuthLayout({ eyebrow, title, lead, children, footer }) {
  return (
    <div className="auth">
      <div className="auth__form-side">
        <div className="auth__form-inner">
          <Link to="/" className="nav__mark auth__mark">
            <img src="/Images/Logos/Yakava.jpeg" alt="YA KAVA STORE logo" className="nav__logo" />
            <span>YA KAVA STORE</span>
          </Link>

          <span className="eyebrow">{eyebrow}</span>
          <h1 className="auth__title">{title}</h1>
          <p className="auth__lead">{lead}</p>

          {children}

          <p className="auth__footer">{footer}</p>
        </div>
      </div>

      <div className="auth__visual" aria-hidden="true">
        <div className="auth__visual-inner">
          <div className="rack-panel">
            <div className="rack-panel__row">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className={`rack-jack ${i % 2 === 0 ? 'rack-jack--live' : ''}`} />
              ))}
            </div>
            <div className="rack-panel__meter">
              <span className="rack-panel__meter-fill" />
            </div>
            <div className="rack-panel__row">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className={`rack-jack ${i % 3 === 0 ? 'rack-jack--live' : ''}`} />
              ))}
            </div>
          </div>
          <blockquote className="auth__quote">
            &ldquo;Sold my first drum kit in the same week I finished the mixing course.&rdquo;
            <cite>— BM Records, Red Rocks Entertainment</cite>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
