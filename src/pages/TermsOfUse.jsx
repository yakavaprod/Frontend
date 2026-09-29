import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const sections = [
  {
    title: '1. Who can use YAKAVA?',
    text: 'YAKAVA is available to people who are 14 years of age or older. If you are 14 or 15, you may need permission or consent from your parent or legal guardian for certain processing of your personal information.'
  },
  {
    title: '2. What YAKAVA provides',
    text: 'YAKAVA provides access to a growing collection of digital products and creator-focused resources. You may use YAKAVA to discover products, watch Reels, make purchases, leave ratings or comments where available, and interact with the platform.'
  },
  {
    title: '3. Digital products',
    text: 'YAKAVA sells digital products rather than physical goods. When you purchase a product, you receive the right to use it according to the license or usage conditions provided with that product. Buying a product does not give ownership of the underlying copyright unless specifically stated.'
  },
  {
    title: '4. Products sold through YAKAVA',
    text: 'YAKAVA controls the products offered through the marketplace. If you want to sell through YAKAVA, you must contact us first so that we can review your product and agree on commercial terms.'
  },
  {
    title: '5. Payments',
    text: 'YAKAVA may support payment methods such as MoMo. You are responsible for accurate payment information and compliance with the payment method you use. A purchase is confirmed only after payment is validated.'
  },
  {
    title: '6. Refunds and purchase problems',
    text: 'Digital purchases are generally final, but if you have a genuine issue such as an incorrect charge, duplicate purchase, or access problem, contact YAKAVA support for a review.'
  },
  {
    title: '7. Your account',
    text: 'If you create an account, you are responsible for keeping your login details secure. We may restrict or suspend an account where we reasonably believe it is being used fraudulently or unlawfully.'
  },
  {
    title: '8. Comments, ratings and likes',
    text: 'YAKAVA may allow users to rate products or comment on content. You are responsible for what you submit, and content that is abusive, fraudulent, or harmful may be removed.'
  },
  {
    title: '9. Things you must not do',
    text: 'You may not abuse, disrupt, hack, copy, resell, bypass payments, or interfere with the security or operation of the platform. Any unlawful or harmful behavior is prohibited.'
  },
  {
    title: '10. Intellectual property',
    text: 'YAKAVA brand, platform design, content, and other materials are protected by intellectual-property laws. Purchasing a product does not transfer ownership of YAKAVA or creator intellectual property.'
  },
  {
    title: '11. Contact YAKAVA',
    text: 'For questions about these Terms, purchases, accounts, or other YAKAVA matters, contact us through the official community or email: book.yakava@gmail.com.'
  }
]

export default function TermsOfUse() {
  return (
    <>
      <Navbar />
      <main className="wrap" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.25rem' }}>
          <span className="eyebrow">Terms of Use</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.06em', lineHeight: 1, margin: '1rem 0 1.25rem', color: 'var(--white)' }}>
            YA KAVA Terms of Use
          </h1>

          <p style={{ color: 'var(--muted)', lineHeight: 1.8, margin: '0 0 2rem' }}>
            Welcome to YA KAVA STORE. By using the platform, you agree to the following terms and conditions.
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
