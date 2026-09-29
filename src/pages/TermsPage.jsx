import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const sections = [
  { title: '1. Acceptance of Terms', text: 'By accessing or using YA KAVA, you agree to be bound by these Terms & Conditions and our privacy notices.' },
  { title: '2. Digital Products', text: 'All products sold are digital and are delivered instantly after successful payment or free activation. Access is granted to the purchaser only and may be limited to account-specific use.' },
  { title: '3. Payment & Checkout', text: 'Validated payment is required for paid products unless a product is marked free. We verify prices and payment status server-side before fulfillment.' },
  { title: '4. License', text: 'You receive a license to use the purchased digital product as described in the product listing. You may not resell, redistribute, or share access without explicit permission.' },
  { title: '5. Refunds & Disputes', text: 'Digital products are generally non-refundable once delivered, but we review genuine issues like duplicate charges, incorrect access, or failed verification.' },
  { title: '6. Account Responsibility', text: 'You are responsible for maintaining your account credentials and for all activity associated with your account.' },
  { title: '7. Contact', text: 'For any issues, contact us by email at book.yakava@gmail.com or through the support center on the site.' },
]

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="wrap" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.25rem' }}>
          <span className="eyebrow">Terms & Conditions</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.06em', lineHeight: 1, margin: '1rem 0 1.25rem', color: 'var(--white)' }}>
            YA KAVA Terms & Conditions
          </h1>

          <p style={{ color: 'var(--muted)', lineHeight: 1.8, margin: '0 0 2rem' }}>
            These terms govern your use of YA KAVA and any purchase completed through the marketplace.
          </p>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {sections.map((section) => (
              <article key={section.title} className="glass-panel" style={{ padding: '1.5rem 1.5rem', borderRadius: '18px' }}>
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
