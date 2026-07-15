import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { newsletterSubscribe, ApiError } from '../lib/api'
import './SiteFooter.css'

/* Newsletter form — posts to /api/newsletter/subscribe.
   States: idle → sending → success | error. Rate-limited server-side
   at 5 submits/hour per IP, so surface that message when we hit 429. */
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(true)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!email || !consent) {
      setStatus('error')
      setMessage(!email ? 'Enter your email.' : 'Please tick the consent box.')
      return
    }
    setStatus('sending')
    setMessage(null)
    try {
      const res = await newsletterSubscribe({ email, consent, source: 'footer' })
      setStatus('success')
      setMessage(res && res.already_subscribed
        ? "You're already on the list. See you in the next drop."
        : "Subscribed — welcome to the lab.")
      setEmail('')
    } catch (err) {
      setStatus('error')
      if (err instanceof ApiError && err.status === 429) {
        setMessage('Too many submissions — please try again later.')
      } else {
        setMessage(err.message || 'Could not subscribe. Please try again.')
      }
    }
  }

  return (
    <form className="zl-footer__news" onSubmit={submit} noValidate>
      <div className="zl-footer__news-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@lab.com"
          aria-label="Email address"
          autoComplete="email"
          disabled={status === 'sending'}
          required
        />
        <button
          type="submit"
          className="zl-footer__news-btn"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? '…' : 'Subscribe'}
        </button>
      </div>
      <label className="zl-footer__news-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          I agree to receive lab updates and batch drops. Unsubscribe anytime.
        </span>
      </label>
      {message && (
        <p className={`zl-footer__news-msg zl-footer__news-msg--${status}`} role="status">
          {message}
        </p>
      )}
    </form>
  )
}

const Icon = ({ name, size = 16 }) => {
  const P = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (name) {
    case 'instagram':
      return (
        <svg {...P}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      )
    case 'x-twitter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...P}>
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="M10 9.5v5l4-2.5z" fill="currentColor" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...P}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10v7" />
          <circle cx="8" cy="7" r="0.8" fill="currentColor" />
          <path d="M12 17v-4a2 2 0 0 1 4 0v4" />
          <path d="M12 10v7" />
        </svg>
      )
    default:
      return null
  }
}

function SiteFooter() {
  return (
    <footer className="zl-footer" aria-label="Site footer">
      <div className="zl-footer__inner">
        <div className="zl-footer__top">
          <div className="zl-footer__brandcol">
            <NavLink to="/" className="zl-footer__brand" aria-label="Zyra Labs — home">
              <span className="zl-footer__brand-cap">Z</span>
              <span className="zl-footer__brand-italic">y</span>
              <span className="zl-footer__brand-cap">R</span>
              <span className="zl-footer__brand-cap">A</span>
              <span className="zl-footer__brand-sub">labs</span>
            </NavLink>
            <p className="zl-footer__tag">
              Research-grade peptides and clinical-grade supplements —
              formulated, tested, and dispatched cold-chain from Dubai Science
              Park.
            </p>
            <div className="zl-footer__news-wrap">
              <h4 className="zl-footer__news-title">Join the newsletter</h4>
              <p className="zl-footer__news-lead">
                CoAs, batch drops, and lab notes — no more than once a month.
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="zl-footer__col">
            <h4>the lab</h4>
            <ul>
              <li><NavLink to="/about">about zyra labs</NavLink></li>
              <li><NavLink to="/services">shop peptides</NavLink></li>
              <li><NavLink to="/track-order">track order</NavLink></li>
              <li><NavLink to="/contact">request a CoA</NavLink></li>
            </ul>
          </div>

          <div className="zl-footer__col">
            <h4>account</h4>
            <ul>
              <li><NavLink to="/signin">sign in</NavLink></li>
              <li><NavLink to="/orders">my orders</NavLink></li>
              <li><NavLink to="/cart">your cart</NavLink></li>
              <li><NavLink to="/track-order">track order</NavLink></li>
            </ul>
          </div>

          <div className="zl-footer__col">
            <h4>support</h4>
            <ul>
              <li><a href="mailto:research@zyralabs.com">research@zyralabs.com</a></li>
              <li><a href="mailto:sales@zyralabs.com">sales@zyralabs.com</a></li>
              <li>
                <a href="https://wa.me/971543800625" target="_blank" rel="noopener noreferrer">
                  whatsapp · +971 54 380 0625
                </a>
              </li>
              <li>
                <a href="https://maps.google.com/?q=Dubai+Science+Park" target="_blank" rel="noopener noreferrer">
                  lab 05 · dubai science park
                </a>
              </li>
              <li><span className="zl-footer__info">sun – fri · 09:00 – 21:00 gst</span></li>
            </ul>
          </div>
        </div>

        <div className="zl-footer__bottom">
          <div>© {new Date().getFullYear()} Zyra Labs · all rights reserved</div>
          <div className="zl-footer__socials">
            <a href="https://instagram.com/zyralabs" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={16} /></a>
            <a href="https://twitter.com/zyralabs" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><Icon name="x-twitter" size={14} /></a>
            <a href="https://youtube.com/@zyralabs" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Icon name="youtube" size={16} /></a>
            <a href="https://linkedin.com/company/zyralabs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
