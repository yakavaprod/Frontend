import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const sections = [
  {
    title: '1. Why YAKAVA uses cookies',
    text: 'Cookies help the website function correctly, remember user preferences, support security, and improve the performance and usability of the platform.'
  },
  {
    title: '2. Essential cookies',
    text: 'Some cookies are necessary for YAKAVA to function. For example, they may help maintain a login session or remember information required for certain features.'
  },
  {
    title: '3. Preference cookies',
    text: 'YAKAVA may use cookies to remember choices you make while using the platform so that your experience is more convenient on return visits.'
  },
  {
    title: '4. Analytics',
    text: 'If analytics services are added in the future, those services may use cookies to help understand website usage and improve performance.'
  },
  {
    title: '5. Third-party services',
    text: 'Some YAKAVA features may connect to third-party services such as payment providers, email services, or the YAKAVA Discord community, which may use their own cookies.'
  },
  {
    title: '6. Managing cookies',
    text: 'Most browsers allow you to view, delete, block, or restrict cookies. Please note that blocking essential cookies may cause some YAKAVA features to work incorrectly.'
  },
  {
    title: '7. Contact',
    text: 'For questions about cookies or privacy at YAKAVA, contact us at book.yakava@gmail.com.'
  }
]

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <main className="wrap" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.25rem' }}>
          <span className="eyebrow">Cookie Policy</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.06em', lineHeight: 1, margin: '1rem 0 1.25rem', color: 'var(--white)' }}>
            YA KAVA Cookie Policy
          </h1>

          <p style={{ color: 'var(--muted)', lineHeight: 1.8, margin: '0 0 2rem' }}>
            YAKAVA uses cookies and similar technologies to help the website function and remember certain choices.
          </p>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {sections.map((section) => (
              <article key={section.title} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px' }}>
                <h2 style={{ margin: '0 0 0.8rem', fontSize: '1.15rem', color: 'var(--white)' }}>{section.title}</h2>
                <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>{section.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
