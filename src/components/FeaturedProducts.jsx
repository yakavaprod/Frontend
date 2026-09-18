import { HiOutlinePlay } from 'react-icons/hi'
import './FeaturedProducts.css'

const PRODUCTS = [
  { title: 'Midnight Drill Kit Vol. 3', creator: 'Trapstation', type: 'Drum Kit', bpm: '142', key: '—', price: 'RWF 9,500' },
  { title: 'Kigali Nights (Afrobeat Loop Pack)', creator: 'Kivu Sound', type: 'Sample Pack', bpm: '104', key: 'Cm', price: 'RWF 12,000' },
  { title: 'Neon Bounce', creator: 'YB Beats', type: 'Beat / Lease', bpm: '128', key: 'F#m', price: 'RWF 7,000' },
  { title: 'React Dashboard UI Kit', creator: 'S. Musoni', type: 'Template', bpm: '—', key: '—', price: 'RWF 14,000' },
  { title: 'Analog Warmth Preset Bank', creator: 'Reel & Tape', type: 'Presets', bpm: '—', key: '—', price: 'RWF 6,500' },
  { title: 'Golden Hour', creator: 'Lumen', type: 'Beat / Exclusive', bpm: '96', key: 'Ab', price: 'RWF 38,000' },
]

function Waveform() {
  const bars = Array.from({ length: 28 }, (_, i) => 6 + Math.abs(Math.sin(i * 0.9)) * 22)
  return (
    <div className="wave" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} style={{ height: `${h}px` }} />
      ))}
    </div>
  )
}

export default function FeaturedProducts() {
  return (
    <section className="market" id="marketplace">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Module rack / 02</span>
            <h2 className="section-title">Fresh off the marketplace</h2>
          </div>
          <a href="#" className="section-link">Browse all products →</a>
        </div>

        <div className="market__grid">
          {PRODUCTS.map((p) => (
            <article className="product-row" key={p.title}>
              <button className="product-row__play" aria-label={`Preview ${p.title}`}>
                <HiOutlinePlay />
              </button>
              <Waveform />
              <div className="product-row__info">
                <h3>{p.title}</h3>
                <p>{p.creator} · {p.type}</p>
              </div>
              <div className="product-row__tags">
                <span>{p.bpm !== '—' ? `${p.bpm} BPM` : '—'}</span>
                <span>{p.key !== '—' ? p.key : '—'}</span>
              </div>
              <div className="product-row__price">{p.price}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
