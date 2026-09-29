import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const sections = [
  {
    title: '1. Information you give us',
    text: 'We may collect personal information such as your name, email address, account details, purchase information, and any other information you choose to provide when creating an account, contacting support, or making a purchase.'
  },
  {
    title: '2. Purchase information',
    text: 'When you buy a digital product, we may keep the details needed to identify the transaction and support access, payment, or refund issues.'
  },
  {
    title: '3. Why we use your information',
    text: 'We use your information to manage your account, process purchases, provide access to products, respond to support requests, and improve the platform and user experience.'
  },
  {
    title: '4. Email communications',
    text: 'If you provide your email address, we may use it to send account updates, purchase notices, support communication, or service updates you requested.'
  },
  {
    title: '5. Information is not for sale',
    text: 'We do not sell personal information as a product. We may share data with service providers only when necessary to operate the platform, process payments, or meet legal requirements.'
  },
  {
    title: '6. Keeping your information secure',
    text: 'We take reasonable technical and organizational steps to protect personal data against unauthorized access, misuse, or disclosure. No system is completely risk-free, but we apply security measures appropriate to the service.'
  },
  {
    title: '7. How long we keep information',
    text: 'We keep information as long as needed for the purpose it was collected, including account management, transaction support, legal compliance, and dispute resolution.'
  },
  {
    title: '8. Your privacy rights',
    text: 'You may ask to access, correct, delete, or restrict your personal information, and to withdraw consent where processing is based on consent. Contact us at book.yakava@gmail.com.'
  },
  {
    title: '9. Users under 16',
    text: 'YAKAVA allows users from age 14, but where personal information belongs to someone under 16, appropriate parental or guardian consent may be required under Rwandan data protection laws.'
  },
  {
    title: '10. Contact',
    text: 'For privacy questions or requests, contact YA KAVA at book.yakava@gmail.com.'
  }
]

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="wrap" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.25rem' }}>
          <span className="eyebrow">Privacy Policy</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.06em', lineHeight: 1, margin: '1rem 0 1.25rem', color: 'var(--white)' }}>
            YA KAVA Privacy Policy
          </h1>

          <p style={{ color: 'var(--muted)', lineHeight: 1.8, margin: '0 0 2rem' }}>
            At YAKAVA, we want you to understand what information we collect, why we use it, and what choices you have.
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
