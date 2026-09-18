import './Testimonials.css'

const NOTES = [
  {
    quote: 'Sold my first drum kit in the same week I finished the mixing course. The vault keeps every update synced — customers never message me for a re-download.',
    name: 'Kivu Sound',
    role: 'Sample pack label, Kigali',
  },
  {
    quote: 'I came for the FL Studio course and stayed for the marketplace. YA KAVA PROD is the first place that treated my beats like a real product, not a forum upload.',
    name: 'YB Beats',
    role: 'Producer',
  },
  {
    quote: 'Built and shipped a UI kit in a weekend, then watched the sales dashboard do the rest. The analytics are the reason I stopped selling on Gumroad.',
    name: 'S. Musoni',
    role: 'Developer & instructor',
  },
]

export default function Testimonials() {
  return (
    <section className="notes">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Session notes</span>
            <h2 className="section-title">From the roster</h2>
          </div>
        </div>
        <div className="notes__grid">
          {NOTES.map((n) => (
            <figure className="note-card" key={n.name}>
              <span className="note-card__tape" aria-hidden="true" />
              <blockquote>&ldquo;{n.quote}&rdquo;</blockquote>
              <figcaption>
                <span className="note-card__name">{n.name}</span>
                <span className="note-card__role">{n.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
