import { HiOutlineStar, HiOutlineUsers, HiOutlinePlay } from 'react-icons/hi'
import './FeaturedCourses.css'

const COURSES = [
  {
    title: 'FL Studio: Beat Making From Zero',
    creator: 'K. Mutabazi',
    tag: 'Music Production',
    level: 'Beginner',
    rating: '4.9',
    students: '3,180',
    price: 'RWF 18,000',
    swatch: 'swatch--1',
  },
  {
    title: 'Mixing & Mastering for Afrobeat',
    creator: 'Dana P.',
    tag: 'Mixing',
    level: 'Intermediate',
    rating: '4.8',
    students: '2,410',
    price: 'RWF 24,500',
    swatch: 'swatch--2',
  },
  {
    title: 'Ship a Full-Stack App with React',
    creator: 'S. Musoni',
    tag: 'Development',
    level: 'Intermediate',
    rating: '4.9',
    students: '5,760',
    price: 'RWF 21,000',
    swatch: 'swatch--3',
  },
  {
    title: 'Sound Design for Trap & Drill',
    creator: 'Q. Iradukunda',
    tag: 'Sound Design',
    level: 'All levels',
    rating: '4.7',
    students: '1,920',
    price: 'RWF 15,500',
    swatch: 'swatch--4',
  },
]

export default function FeaturedCourses() {
  return (
    <section className="courses" id="courses">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Module rack / 01</span>
            <h2 className="section-title">Courses worth finishing</h2>
          </div>
          <a href="#" className="section-link">All courses →</a>
        </div>

        <div className="courses__grid">
          {COURSES.map((c) => (
            <article className="course-card" key={c.title}>
              <div className={`course-card__art ${c.swatch}`}>
                <button className="course-card__play" aria-label={`Preview ${c.title}`}>
                  <HiOutlinePlay />
                </button>
                <span className="course-card__level">{c.level}</span>
              </div>
              <div className="course-card__body">
                <span className="course-card__tag">{c.tag}</span>
                <h3 className="course-card__title">{c.title}</h3>
                <p className="course-card__creator">by {c.creator}</p>
                <div className="course-card__meta">
                  <span><HiOutlineStar /> {c.rating}</span>
                  <span><HiOutlineUsers /> {c.students}</span>
                </div>
                <div className="course-card__foot">
                  <span className="course-card__price">{c.price}</span>
                  <a href="#" className="course-card__cta">Enroll</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
