import './CreatorHighlights.css'

const CREATORS = [
  { name: 'BM Records', role: 'Independent record label', stat: '12,400 downloads', swatch: 'cs--1' },
  { name: 'S. Musoni', role: 'Full-stack instructor', stat: '5,760 students', swatch: 'cs--2' },
  { name: 'Trapstation', role: 'Drum kit producer', stat: 'RWF 4.1M in sales', swatch: 'cs--3' },
  { name: 'Reel & Tape', role: 'Preset & plugin maker', stat: '9 products live', swatch: 'cs--4' },
]

export default function CreatorHighlights() {
  return (
    <section className="creators" id="creators">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Module rack / 03</span>
            <h2 className="section-title">Creators on the roster</h2>
          </div>
          <a href="#" className="section-link">Become a creator →</a>
        </div>

        <div className="creators__grid">
          {CREATORS.map((c) => (
            <article className="creator-card" key={c.name}>
              <div className={`creator-card__avatar ${c.swatch}`}>{c.name.charAt(0)}</div>
              <h3>{c.name}</h3>
              <p className="creator-card__role">{c.role}</p>
              <p className="creator-card__stat">{c.stat}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
