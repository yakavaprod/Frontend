import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function About() {
  return (
    <>
      <Navbar />
      <main className="wrap" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <section style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1.25rem 0' }}>
         
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', letterSpacing: '-0.06em', lineHeight: 1, margin: '1rem 0 1.25rem', color: 'var(--white)' }}>
            Built for creators who want more than hustle.
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '1.08rem', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
            YA KAVA PROD is a creator-first ecosystem designed to help artists, educators, designers, and digital builders learn, package, sell, and grow their work with confidence.
          </p>

          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 0 2rem' }}>
            We bring together the tools for learning, digital commerce, community, and monetization into one clear platform so creators can focus on their craft while building sustainable income.
          </p>

          <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.25rem', color: 'var(--white)' }}>What we do</h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>
                We help creators monetize useful digital products, master skills, and create a real audience around their work.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.25rem', color: 'var(--white)' }}>How we help</h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>
                From education to product creation, payment support, and creator collaboration, everything is built for growth.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.25rem', color: 'var(--white)' }}>Why it matters</h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>
                Creative talent deserves a better infrastructure to earn, connect, and build a future with more freedom.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem 1.5rem', borderRadius: '22px' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.7rem', color: 'var(--white)' }}>Our mission</h2>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>
              To give creators in Africa and beyond the systems, tools, and community they need to turn skill into income and ideas into impact.
            </p>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/products" className="yk-btn yk-btn-primary">Explore the marketplace</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
