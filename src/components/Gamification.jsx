import { HiOutlineFire, HiOutlineBadgeCheck, HiOutlineSparkles, HiOutlineGift } from 'react-icons/hi'
import './Gamification.css'

const ITEMS = [
  { icon: <HiOutlineFire />, title: 'Daily streaks', copy: 'Log a lesson or a listen and keep the streak lit. Miss a day, the meter resets.' },
  { icon: <HiOutlineSparkles />, title: 'XP & levels', copy: 'Every course finished and product shipped earns XP toward your creator rank.' },
  { icon: <HiOutlineBadgeCheck />, title: 'Badges & certificates', copy: 'Finish a track and walk away with proof — shareable, verifiable, yours.' },
  { icon: <HiOutlineGift />, title: 'Mystery drops', copy: 'Limited-time creator drops and daily rewards, unlocked as you show up.' },
]

export default function Gamification() {
  return (
    <section className="gami">
      <div className="wrap">
        <div className="gami__panel">
          <div className="gami__intro">
            <span className="eyebrow">Signal boost</span>
            <h2 className="section-title">Progress that shows its work</h2>
            <p>YA KAVA PROD tracks every rep — not to gamify busywork, but so momentum is visible on the days it doesn't feel like it.</p>
          </div>
          <div className="gami__grid">
            {ITEMS.map((it) => (
              <div className="gami-item" key={it.title}>
                <span className="gami-item__icon">{it.icon}</span>
                <h3>{it.title}</h3>
                <p>{it.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
