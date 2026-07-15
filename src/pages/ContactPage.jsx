import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import '@fontsource-variable/geist'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import './ContactPage.css'

import heroImg from '../assets/images/004-best.webp'

const Arrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

const ChannelIcon = ({ name }) => {
  const P = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (name) {
    case 'email':
      return <svg {...P}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
    case 'whatsapp':
      return (
        <svg {...P}>
          <path d="M4 20l1.4-4.2A8 8 0 1 1 8 19.6z" />
          <path d="M9 10.5c0 3 2 5 5 5" strokeWidth="1.2" />
        </svg>
      )
    case 'phone':
      return <svg {...P}><path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
    case 'pin':
      return <svg {...P}><path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
    case 'clock':
      return <svg {...P}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    default: return null
  }
}

/* ---------- Hero ---------- */
const ContactHero = () => {
  const title = 'TALK'
  return (
    <header className="zl-banner zl-contact-banner">
      <div className="zl-banner__bg" aria-hidden="true" style={{ backgroundImage: `url(${heroImg})` }} />
      <div className="zl-banner__scrim" aria-hidden="true" />

      <div className="zl-banner__labels">
        <span>RESEARCH & COAs</span>
        <span>CUSTOM SYNTHESIS</span>
        <span>WHATSAPP · LIVE</span>
        <span>REPLY IN 1H</span>
      </div>

      <h1 className="zl-banner__title" aria-label="Talk to us">
        {title.split('').map((ch, i) => (
          <span
            key={i}
            className="zl-banner__title-letter"
            style={{ animationDelay: `${600 + i * 110}ms` }}
            aria-hidden="true"
          >
            {ch}
          </span>
        ))}
        <span
          className="zl-banner__title-sub"
          style={{ animationDelay: `${600 + title.length * 110}ms` }}
          aria-hidden="true"
        >
          to us.
        </span>
      </h1>
    </header>
  )
}

/* ---------- Contact channels ---------- */
const channels = [
  {
    icon: 'email',
    label: 'research & coa',
    value: 'research@zyralabs.com',
    href: 'mailto:research@zyralabs.com',
    hint: 'CoA, batch records, HPLC traces.',
  },
  {
    icon: 'email',
    label: 'sales & wholesale',
    value: 'sales@zyralabs.com',
    href: 'mailto:sales@zyralabs.com',
    hint: 'Bulk pricing, tiered accounts, retainers.',
  },
  {
    icon: 'whatsapp',
    label: 'whatsapp · live',
    value: '+971 54 380 0625',
    href: 'https://wa.me/971543800625',
    hint: 'Fastest — replies within the hour.',
    external: true,
  },
  {
    icon: 'phone',
    label: 'front desk',
    value: '+971 4 000 0000',
    href: 'tel:+97140000000',
    hint: 'Sun – Fri · 09:00 – 21:00 GST.',
  },
]

const Channels = () => (
  <section className="zl-channels">
    <div className="zl-channels__head" data-reveal>
      <div className="zl-eyebrow">( 01 ) channels</div>
      <h2>Reach the <em>right</em> desk directly.</h2>
      <p>We keep the queue human. Every message goes to the right person on the first hop.</p>
    </div>
    <div className="zl-channels__grid">
      {channels.map((c, i) => (
        <a
          key={c.label}
          href={c.href}
          {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="zl-channel"
          data-reveal
          style={{ '--reveal-delay': `${i * 80}ms` }}
        >
          <div className="zl-channel__icon">
            <ChannelIcon name={c.icon} />
          </div>
          <div className="zl-channel__body">
            <span className="zl-channel__label">{c.label}</span>
            <span className="zl-channel__value">{c.value}</span>
            <span className="zl-channel__hint">{c.hint}</span>
          </div>
          <span className="zl-channel__arrow"><Arrow /></span>
        </a>
      ))}
    </div>
  </section>
)

/* ---------- Contact form ---------- */
const topics = ['CoA request', 'Custom synthesis', 'Wholesale pricing', 'Shipping enquiry', 'Something else']

const ContactForm = () => {
  const [status, setStatus] = useState('idle')
  const [values, setValues] = useState({ name: '', email: '', company: '', topic: topics[0], message: '' })

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    if (!values.name || !values.email || !values.message) return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 900)
  }

  return (
    <section className="zl-form-block">
      <div className="zl-form-block__inner">
        <div className="zl-form-block__intro" data-reveal>
          <div className="zl-eyebrow zl-eyebrow--on-dark">( 02 ) message the lab</div>
          <h2>Send a note.<br /><em>Get a chemist</em> back.</h2>
          <p>Fill in a few details and we&apos;ll reply from the desk that&apos;s best equipped to help — usually within the hour during lab hours.</p>
          <ul className="zl-form-block__list">
            <li>
              <span className="zl-form-block__dot" /> Verified purity spec on request
            </li>
            <li>
              <span className="zl-form-block__dot" /> Documentation attached with reply
            </li>
            <li>
              <span className="zl-form-block__dot" /> No sales queue, no chatbot
            </li>
          </ul>
        </div>

        <form className="zl-form" onSubmit={onSubmit} data-reveal>
          <div className="zl-form__grid">
            <label className="zl-field">
              <span>Name</span>
              <input name="name" value={values.name} onChange={onChange} placeholder="Your full name" required autoComplete="name" />
            </label>
            <label className="zl-field">
              <span>Email</span>
              <input name="email" type="email" value={values.email} onChange={onChange} placeholder="you@lab.com" required autoComplete="email" />
            </label>
            <label className="zl-field">
              <span>Company / Institution</span>
              <input name="company" value={values.company} onChange={onChange} placeholder="Optional" autoComplete="organization" />
            </label>
            <label className="zl-field">
              <span>Topic</span>
              <div className="zl-select">
                <select name="topic" value={values.topic} onChange={onChange}>
                  {topics.map((t) => <option key={t}>{t}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </label>
            <label className="zl-field zl-field--wide">
              <span>Message</span>
              <textarea name="message" rows={5} value={values.message} onChange={onChange} placeholder="Compound, quantity, timeline, anything specific we should know…" required />
            </label>
          </div>

          <div className="zl-form__foot">
            <p className="zl-form__note">Your details are used only to reply to this enquiry.</p>
            <button
              type="submit"
              className={`zl-btn zl-btn--primary zl-form__submit ${status === 'sending' ? 'is-sending' : ''} ${status === 'sent' ? 'is-sent' : ''}`}
              disabled={status !== 'idle'}
            >
              <span>
                {status === 'idle' && 'Send message'}
                {status === 'sending' && 'Sending…'}
                {status === 'sent' && 'Message sent — we\'ll reply shortly'}
              </span>
              {status !== 'sent' && <Arrow />}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

/* ---------- Visit ---------- */
const Visit = () => (
  <section className="zl-visit">
    <div className="zl-visit__head" data-reveal>
      <div className="zl-eyebrow">( 03 ) visit</div>
      <h2>Come by the <em>bench</em>.</h2>
      <p>Verified research clients are welcome to see the process first-hand. Book a slot in advance and we&apos;ll clear a chemist to walk you through synthesis and QA.</p>
    </div>

    <div className="zl-visit__grid">
      <aside className="zl-visit__info" data-reveal>
        <div className="zl-visit__info-card">
          <div className="zl-visit__info-icon"><ChannelIcon name="clock" /></div>
          <div>
            <h4>Hours</h4>
            <p>
              <strong>Sun – Fri</strong> · 09:00 – 21:00 GST<br />
              <strong>Saturday</strong> · Closed<br />
              WhatsApp replies 7 days
            </p>
          </div>
        </div>
        <div className="zl-visit__info-card">
          <div className="zl-visit__info-icon"><ChannelIcon name="whatsapp" /></div>
          <div>
            <h4>Fast lane</h4>
            <p>
              WhatsApp <a href="https://wa.me/971543800625" target="_blank" rel="noopener noreferrer">+971 54 380 0625</a><br />
              typical reply: under 60 minutes.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </section>
)

/* ---------- Reveal + Lenis ---------- */
function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const els = [...root.querySelectorAll('[data-reveal]')]
    els.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top > window.innerHeight - 80) el.classList.add('zl-reveal-pre')
    })
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.remove('zl-reveal-pre'))
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove('zl-reveal-pre')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rootRef])
}

function ContactPage() {
  const rootRef = useRef(null)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useReveal(rootRef)

  return (
    <div className="zl-page zl-contact" ref={rootRef}>
      <Seo
        title="Contact"
        path="/contact"
        description="Get in touch with Zyra Labs — request a certificate of analysis, ask about batch testing, or reach our team in Dubai Science Park by email or WhatsApp."
      />
      <ContactHero />
      <Channels />
      <ContactForm />
      <Visit />
      <SiteFooter />
    </div>
  )
}

export default ContactPage
