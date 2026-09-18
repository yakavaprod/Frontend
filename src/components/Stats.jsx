import './Stats.css'

const STATS = [
  { value: '41,200+', label: 'Creators patched in', level: 0.86 },
  { value: '9,400+', label: 'Courses & lessons', level: 0.62 },
  { value: '128K+', label: 'Beats, kits & assets sold', level: 0.94 },
  { value: '88%', label: 'Revenue share to creators', level: 0.88 },
]

export default function Stats() {
  return (
    <section className="stats">
      <div className="wrap stats__grid">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__meter" aria-hidden="true">
              <span className="stat__fill" style={{ '--level': s.level }} />
            </div>
            <div className="stat__value">{s.value}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
