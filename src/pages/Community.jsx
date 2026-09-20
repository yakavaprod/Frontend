import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const COMMUNITY_ITEMS = [
  {
    title: 'Creator Lounge',
    description: 'A space to share work, ask questions, and get feedback from fellow creatives.',
  },
  {
    title: 'Collaboration Hub',
    description: 'Meet producers, designers, editors, and developers for partnerships and projects.',
  },
  {
    title: 'Live Events',
    description: 'Join workshops, asset drops, network sessions, and community challenges.',
  },
  {
    title: 'Growth Support',
    description: 'Learn from proven creator systems and get practical insight from the community.',
  },
]

export default function Community() {
  return (
    <>
      <Navbar />
      <main className="wrap" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 0' }}>
          <span className="eyebrow">Our Community</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.06em', lineHeight: 1, margin: '1rem 0 1.25rem', color: 'var(--white)' }}>
            Connect with creators building real momentum.
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '1.08rem', lineHeight: 1.8, maxWidth: '760px', margin: '0 0 2.5rem' }}>
            YA KAVA community is where creative people meet, collaborate, learn, and grow together. It is designed to support creators at every stage of their journey.
          </p>

          <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
            {COMMUNITY_ITEMS.map((item) => (
              <div key={item.title} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px' }}>
                <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.2rem', color: 'var(--white)' }}>{item.title}</h3>
                <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '2rem 1.5rem', borderRadius: '22px' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.7rem', color: 'var(--white)' }}>Join the network</h2>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>
              Whether you are launching a product, refining your craft, or looking for collaborators, this community gives you access to people and opportunities that move creative work forward.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <a href="https://discord.gg" target="_blank" rel="noreferrer" className="yk-btn yk-btn-primary">Join the community</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
