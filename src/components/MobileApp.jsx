import { FaApple, FaGoogle } from 'react-icons/fa6'
import './MobileApp.css'

export default function MobileApp() {
  return (
    <section className="mobile-app">
      <div className="wrap mobile-app__inner">
        <div className="mobile-app__content">
          <span className="eyebrow mobile-app__eyebrow">Available on iOS & Android</span>
          
          <h2 className="mobile-app__title">
            Your catalog<br />in your pocket
          </h2>
          
          <p className="mobile-app__description">
            Access your catalog, monitor streaming data, withdraw your earnings and manage your work from any phone or tablet.
          </p>

          <div className="mobile-app__buttons">
            <a 
              href="/" 
              className="app-btn app-btn--apple"
              aria-label="Access YA KAVA on Apple devices"
            >
              <FaApple />
              <div>
                <span className="app-btn__label">Access on</span>
                <span className="app-btn__name">Apple devices</span>
              </div>
            </a>
            
            <a 
              href="/" 
              className="app-btn app-btn--google"
              aria-label="Access YA KAVA on Android devices"
            >
              <FaGoogle />
              <div>
                <span className="app-btn__label">Access on</span>
                <span className="app-btn__name">Android devices</span>
              </div>
            </a>
          </div>
        </div>

        <div className="mobile-app__visual">
          <div className="phone-mockup">
            <div className="phone-mockup__frame">
              <div className="phone-mockup__screen">
                <div className="phone-mockup__notch" />
                <div className="phone-mockup__content phone-mockup__content--image">
                  <img
                    src="/Images/yakava1.png"
                    alt="YA KAVA official product image"
                    className="phone-mockup__image"
                  />

                  <div className="phone-mockup__overlay">
                    <div className="phone-mockup__brand-bar">
                      <div className="phone-mockup__brand">
                        <img
                          src="/Images/Logos/logo.png"
                          alt="YA KAVA PROD logo"
                          className="phone-mockup__logo"
                        />
                        <div className="phone-mockup__brand-text">
                          <span className="phone-mockup__brand-name">YA KAVA</span>
                          <span className="phone-mockup__brand-subtitle">PROD</span>
                        </div>
                      </div>
                      <span className="phone-mockup__live">Live</span>
                    </div>

                    <div className="phone-mockup__hero">
                      <span className="phone-mockup__tag">Creator education + marketplace</span>
                      <h2 className="phone-mockup__headline">
                        Learn<br />
                        <span className="phone-mockup__accent">Create</span><br />
                        <span className="phone-mockup__accent">Earn</span>
                      </h2>
                    </div>

                    <p className="phone-mockup__description">
                      Build skills, create better work, and turn creativity into income.
                    </p>

                    <ul className="phone-mockup__features">
                      <li className="phone-mockup__feature-item"><span className="phone-mockup__feature-dot" />Learn</li>
                      <li className="phone-mockup__feature-item"><span className="phone-mockup__feature-dot" />Create</li>
                      <li className="phone-mockup__feature-item"><span className="phone-mockup__feature-dot" />Buy</li>
                      <li className="phone-mockup__feature-item"><span className="phone-mockup__feature-dot" />Sell</li>
                      <li className="phone-mockup__feature-item"><span className="phone-mockup__feature-dot" />Earn</li>
                    </ul>

                    <button className="phone-mockup__btn">Get Started</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
