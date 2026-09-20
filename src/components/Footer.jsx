import { Link } from 'react-router-dom'
import {
  FaEnvelope,
  FaInstagram,
  FaLink,
  FaMusic,
  FaSpotify,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa6'
import {
  HiOutlineAcademicCap,
  HiOutlineShoppingCart,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineLightBulb,
  HiOutlineCreditCard,
} from 'react-icons/hi2'
import './Footer.css'

const CREATOR_SUITE = [
  {
    icon: <HiOutlineAcademicCap />,
    title: 'Learning Platform',
    description: 'Skill courses, expert playbooks, and creative systems to level up your craft.',
  },
  {
    icon: <HiOutlineShoppingCart />,
    title: 'Digital Marketplace',
    description: 'Buy and sell templates, presets, kits, courses, and creative assets.',
  },
  {
    icon: <HiOutlineSparkles />,
    title: 'Creator Tools',
    description: 'Dashboard, analytics, vault, and product management in one place.',
  },
  {
    icon: <HiOutlineCreditCard />,
    title: 'Revenue & Payments',
    description: 'Instant payouts, transparent pricing, and financial insights for creators.',
  },
  {
    icon: <HiOutlineUsers />,
    title: 'Community Network',
    description: 'Connect with artists, producers, and creatives on our Discord server.',
  },
  {
    icon: <HiOutlineLightBulb />,
    title: 'Growth Guides',
    description: 'Strategic resources to monetize your work and expand your audience.',
  },
]

const FOOTER_COLUMNS = [
  {
    heading: 'Marketplace',
    links: [
      { label: 'Digital Products', href: '/products' },
      { label: 'Creator Kits', href: '/products' },
      { label: 'Premium Assets', href: '/products' },
      { label: 'Marketplace Rules', href: '/products' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Skill Courses', href: '/' },
      { label: 'Creative Systems', href: '/' },
      { label: 'Workflows', href: '/' },
      { label: 'Growth Guides', href: '/' },
    ],
  },
  {
    heading: 'Store',
    links: [
      { label: 'List Your Product', href: '/' },
      { label: 'Creator Dashboard', href: '/dashboard' },
      { label: 'Pricing', href: '/' },
      { label: 'Support', href: '/support' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Community', href: '/community' },
      { label: 'Support', href: '/support' },
      { label: 'Terms & Privacy', href: '/terms-of-use' },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: 'Email', href: 'mailto:book.yakava@gmail.com', icon: <FaEnvelope />, color: '#F5F7FA' },
  { label: 'Instagram', href: 'https://www.instagram.com/yakavaprod', icon: <FaInstagram />, color: '#E1306C' },
  { label: 'Spotify', href: 'https://open.spotify.com/artist/28XYp1T38hPsz4z83IhvZG?si=fm-WEmdoS-6r1hVgEp--9g&nd=1&dlsi=877d7571f43a4f18', icon: <FaSpotify />, color: '#1DB954' },
  { label: 'YouTube', href: 'https://www.youtube.com/yakavaprod', icon: <FaYoutube />, color: '#FF0000' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@yakavaprod', icon: <FaTiktok />, color: '#00F2EA' },
  { label: 'Link.me', href: 'https://link.me/yakavaprod', icon: <FaLink />, color: '#8B5CF6' },
  { label: 'YouTube Music', href: 'https://music.youtube.com/channel/yakavaprod?si=DnYncpZxh41I_baV', icon: <FaMusic />, color: '#FF0033' },
]

export default function Footer() {
  return (
    <footer className="foot">
      {/* Creator Suite Section */}
      <div className="foot-suite">
        <div className="wrap foot-suite__inner">
          <div className="foot-suite__intro">
            <span className="eyebrow" style={{ fontSize: '0.75rem' }}>Creator Suite</span>
            <h2 className="foot-suite__title">Complete tools for creators</h2>
            <p className="foot-suite__description">
              YA KAVA STORE brings together everything you need to learn, create, and grow. All in one platform built for the creator economy.
            </p>
          </div>

          <div className="foot-suite__grid">
            {CREATOR_SUITE.map((item, idx) => (
              <div className="suite-card" key={idx}>
                <div className="suite-card__icon">{item.icon}</div>
                <h3 className="suite-card__title">{item.title}</h3>
                <p className="suite-card__description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="foot-links">
        <div className="wrap foot-links__grid">
          <div className="foot-brand">
            <a href="/" className="nav__mark">
              <img src="/Images/Logos/Yakava.jpeg" alt="YA KAVA STORE logo" className="nav__logo" />
              <span>YA KAVA STORE</span>
            </a>
            <p>Professional tools for creators to learn, create, and grow.</p>

            <div className="foot-social">
              {SOCIAL_LINKS.map(({ label, href, icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="foot-social-link"
                  aria-label={label}
                  title={label}
                  style={{ color }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div className="foot-col" key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer noopener">{link.label}</a>
                    ) : (
                      <Link to={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="foot-bottom">
        <div className="wrap foot-bottom__inner">
          <div className="foot-legal">
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
            <Link to="/privacy-policy">GDPR</Link>
          </div>
          <span>© {new Date().getFullYear()} YA KAVA STORE. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
