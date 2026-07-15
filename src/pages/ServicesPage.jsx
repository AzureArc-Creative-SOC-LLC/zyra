import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import '@fontsource-variable/geist'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import './ServicesPage.css'
import { products as catalogProducts } from './dealsProducts'

import heroImg from '../assets/images/004-best.webp'
import processImg from '../assets/images/product-show2.jpeg'

const Arrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

/* ---------- Hero ---------- */
const ServicesHero = () => {
  const title = 'OUR'
  return (
    <header className="zl-banner zl-services-banner">
      <div className="zl-banner__bg" aria-hidden="true" style={{ backgroundImage: `url(${heroImg})` }} />
      <div className="zl-banner__scrim" aria-hidden="true" />

      <div className="zl-banner__labels">
        <span>STOCK PEPTIDES</span>
        <span>CUSTOM SYNTHESIS</span>
        <span>COLD-CHAIN</span>
        <span>GLOBAL SHIPPING</span>
      </div>

      <h1 className="zl-banner__title" aria-label="Our services">
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
          services.
        </span>
      </h1>
    </header>
  )
}

/* ---------- Process ---------- */
const Process = () => {
  const steps = [
    { n: '01', t: 'Enquire', d: 'Send a quick note over WhatsApp or the form. Tell us what you need, quantity, and any spec.' },
    { n: '02', t: 'Verify', d: 'We confirm scope, timelines, and share a quote. For custom work you get a spec sheet to sign off.' },
    { n: '03', t: 'Synthesize', d: 'The batch is synthesized under SOP, HPLC-verified, and lyophilized in a class-100 fill room.' },
    { n: '04', t: 'Ship', d: 'Signed CoA travels with the injection. Cold-chain dispatch within 24h, live-tracked to your door.' },
  ]
  return (
    <section className="zl-process">
      <div className="zl-process__head" data-reveal>
        <div className="zl-eyebrow zl-eyebrow--on-dark">( 02 ) process</div>
        <h2>Four steps from<br /><em>enquiry</em> to your bench.</h2>
      </div>
      <div className="zl-process__grid">
        <div className="zl-process__media" data-reveal>
          <img src={processImg} alt="Zyra Labs workflow" loading="lazy" />
          <div className="zl-process__media-tag">Turnaround<strong>3 – 21 days</strong></div>
        </div>
        <ol className="zl-process__steps">
          {steps.map((s, i) => (
            <li key={s.n} className="zl-process__step" data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
              <span className="zl-process__num">{s.n}</span>
              <div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Catalogue — product card grid ---------- */
const Catalogue = () => (
  <section className="zl-catalog">
    <div className="zl-catalog__head" data-reveal>
      <div className="zl-eyebrow">( 01 ) catalogue</div>
      <h2>Stock <em>peptides</em> — ready to ship.</h2>
      <p>A snapshot of what&apos;s on the shelf right now. Every listing includes CoA on request and ships within 24h.</p>
    </div>

    <div className="zl-catalog__grid">
      {catalogProducts.map((it, i) => (
        <article
          key={it.id}
          className="zl-pcard"
          data-reveal
          style={{ '--reveal-delay': `${i * 90}ms` }}
        >
          <Link to={`/product/${it.id}`} className="zl-pcard__media" aria-label={`Open ${it.title}`}>
            <img src={it.image} alt={it.title} loading="lazy" />
            <span className="zl-pcard__badge">/{String(i + 1).padStart(2, '0')}</span>
            <span className="zl-pcard__wl" aria-hidden="true">In stock</span>
          </Link>
          <div className="zl-pcard__body">
            <div className="zl-pcard__row">
              <span className="zl-pcard__kicker">{it.subtitle}</span>
              <span className="zl-pcard__price">{it.price}</span>
            </div>
            <h3 className="zl-pcard__title">
              <Link to={`/product/${it.id}`}>{it.title}</Link>
            </h3>
            <p className="zl-pcard__desc">{it.description}</p>
            <div className="zl-pcard__foot">
              <Link to={`/product/${it.id}`} className="zl-pcard__btn">
                <span>View product</span>
                <Arrow />
              </Link>
              <Link to="/contact" className="zl-pcard__link">Request CoA</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
)

/* ---------- FAQ ---------- */
const faqs = [
  { q: 'Do you provide a Certificate of Analysis?', a: 'Yes — every injection ships with a signed CoA including HPLC trace, mass-spec identity confirmation, and endotoxin results. Additional reports available on request.' },
  { q: 'How long does custom synthesis take?', a: 'Typical turnaround is 3 – 6 weeks depending on sequence length, modifications, and scale. We share a firm timeline with your quote before you commit.' },
  { q: 'What countries do you ship to?', a: 'We currently ship to 42 countries under a validated 96-hour cold-chain envelope. Customs paperwork is pre-cleared where applicable.' },
  { q: 'Is there a minimum order?', a: 'No minimum on stock peptides — single injections are available. Custom synthesis starts at 5mg. Wholesale pricing unlocks at 10 injections per SKU.' },
  { q: 'Can I speak to a chemist directly?', a: 'Yes. Verified research clients get direct WhatsApp access to a bench chemist for handling, reconstitution, and study-design questions.' },
]

const FAQ = () => {
  const [open, setOpen] = useState(0)
  return (
    <section className="zl-faq">
      <div className="zl-faq__head" data-reveal>
        <div className="zl-eyebrow">( 03 ) faq</div>
        <h2>Frequently <em>asked</em>.</h2>
      </div>
      <div className="zl-faq__list">
        {faqs.map((f, i) => (
          <div key={f.q} className={`zl-faq__item ${open === i ? 'is-open' : ''}`} data-reveal>
            <button
              type="button"
              className="zl-faq__q"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              <span>{f.q}</span>
              <span className="zl-faq__toggle">
                <span />
                <span />
              </span>
            </button>
            <div className="zl-faq__a">
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- CTA ---------- */
const ServicesCTA = () => (
  <section className="zl-cta-band">
    <div className="zl-cta-band__inner">
      <span className="zl-cta-band__kicker" data-reveal>the next batch has your name on it</span>
      <h2 data-reveal>Ready to start a <em>research</em> order?</h2>
      <div className="zl-cta-band__actions" data-reveal>
        <Link to="/contact" className="zl-btn zl-btn--primary">
          <span>Talk to the lab</span>
          <Arrow />
        </Link>
        <Link to="/" className="zl-btn zl-btn--ghost">
          <span>Browse catalogue</span>
          <Arrow />
        </Link>
      </div>
    </div>
  </section>
)

/* ---------- Motion ---------- */
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

function ServicesPage() {
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
    <div className="zl-page zl-services" ref={rootRef}>
      <Seo
        title="Shop Research Peptides"
        path="/services"
        description="Browse Zyra Labs' catalogue of research-grade peptides and clinical supplements — BPC-157, tirzepatide, retatrutide and more. Each product ships with a certificate of analysis and full batch documentation."
      />
      <ServicesHero />
      <Catalogue />
      <Process />
      <FAQ />
      <ServicesCTA />
      <SiteFooter />
    </div>
  )
}

export default ServicesPage
