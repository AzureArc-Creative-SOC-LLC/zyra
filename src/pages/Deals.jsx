import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import '@fontsource-variable/geist'
import './Deals.css'
import { products as catalogProducts } from './dealsProducts'

/* ---------- Home-page media (assets/images/new) ---------- */
import heroImg from '../assets/images/004-best.webp'
import aboutImg1 from '../assets/images/new/home-about1.webp'
import aboutImg2 from '../assets/images/new/home-about2.webp'
import aboutImg3 from '../assets/images/new/home-about33.webp'
import aboutImg4 from '../assets/images/new/home-about4.webp'
import whyImg1 from '../assets/images/new/whyus-1.webp'
import whyImg2 from '../assets/images/new/whyus2.webp'
import whyImg3 from '../assets/images/new/whyus3.webp'
import whyImg4 from '../assets/images/new/whyus4.webp'
import whyImg5 from '../assets/images/new/whyus5.webp'
import whyImg6 from '../assets/images/new/whyus6.webp'
import ctaBg from '../assets/images/new/01-HOME-PAGE-best.png'
import tEmily from '../assets/images/new/review-profile1.webp'
import tSofia from '../assets/images/new/review-profile2.webp'
import tMichael from '../assets/images/new/review-profile3.webp'
import tAisha from '../assets/images/new/review-profile5.webp'
import tJames from '../assets/images/new/review-profile11.webp'
import tOmar from '../assets/images/new/review-profile22.webp'

/* =========================================================================
   Vyral design — implemented as the Deals route.
   Everything is wrapped in <div className="vyral-page"> and the matching
   stylesheet is scoped to that class, so it never collides with the rest of
   the site. The shared site Header stays in place of the design's own nav.
   ========================================================================= */

/* ---------- Icon — inline-SVG icon set ---------- */
const Icon = ({ name, size = 18, stroke = 1.5, style, ...rest }) => {
  const P = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style,
    ...rest,
  }
  switch (name) {
    case 'arrow-up-right':
      return <svg {...P}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
    case 'arrow-right':
      return <svg {...P}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
    case 'arrow-down':
      return <svg {...P}><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>
    case 'plus':
      return <svg {...P}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    case 'minus':
      return <svg {...P}><path d="M5 12h14" /></svg>
    case 'x':
      return <svg {...P}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    case 'check':
      return <svg {...P}><path d="M20 6 9 17l-5-5" /></svg>
    case 'play':
      return <svg {...P} fill="currentColor" stroke="none"><path d="M6 4.5v15l13-7.5z" /></svg>
    case 'search':
      return <svg {...P}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    case 'menu':
      return <svg {...P}><path d="M4 7h16" /><path d="M4 17h16" /></svg>
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style} {...rest}>
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
    case 'tiktok':
      return (
        <svg {...P}>
          <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 4c.5 2.5 2.5 4.5 5 5" />
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

/* ---------- Img — real image when src is given, striped placeholder otherwise ---------- */
const Img = ({ src, alt = '', label, style }) => {
  if (src) {
    return (
      <div className="vy-img-wrap vy-img-wrap--grain" style={style}>
        <img className="vy-img-fill" src={src} alt={alt || label || ''} loading="lazy" />
      </div>
    )
  }
  return (
    <div className="vy-img-wrap vy-placeholder" style={style}>
      <span className="vy-placeholder__label">{label || alt || 'PLACEHOLDER'}</span>
    </div>
  )
}

/* ---------- Button — doubled-label hover animation ---------- */
const Button = ({ variant = 'primary', icon = 'arrow-up-right', children, label, onClick, ...rest }) => {
  const text = label || children
  return (
    <button className={`vy-btn vy-btn--${variant}`} onClick={onClick} {...rest}>
      <span className="vy-btn-double">
        <span>{text}</span>
        <span>{text}</span>
      </span>
      {icon && <Icon name={icon} size={14} />}
    </button>
  )
}

/* ---------- Hero — real background image with the cursor-lens effect ---------- */
const Hero = () => (
  <header className="vy-hero" id="home" data-screen-label="Hero">
    <div className="vy-hero__bg-blur" aria-hidden="true" style={{ backgroundImage: `url(${heroImg})` }} />
    <div className="vy-hero__bg-sharp" aria-hidden="true" style={{ backgroundImage: `url(${heroImg})` }}>
      <span className="vy-hero__lens-plus" aria-hidden="true">+</span>
    </div>

    <div className="vy-hero__labels">
      <span>RESEARCH PEPTIDES</span>
      <span>SUPPLEMENTS</span>
      <span>VERIFIED PURITY</span>
    </div>

    <h1 className="vy-hero__title" aria-label="Zyra Labs">
      {'ZYRA'.split('').map((ch, i) => (
        <span
          key={i}
          className="vy-hero__title-letter"
          style={{ animationDelay: `${600 + i * 110}ms` }}
          aria-hidden="true"
        >
          {ch}
        </span>
      ))}
      <span
        className="vy-hero__title-sub"
        style={{ animationDelay: `${600 + 4 * 110}ms` }}
        aria-hidden="true"
      >
        labs
      </span>
    </h1>
  </header>
)

/* ---------- Marquee — autoscrolling divider strip ---------- */
const Marquee = () => {
  const item = (
    <span>
      research peptides <em>delivered</em>
      <span className="vy-marquee__dot" />
      verified purity, every batch
      <span className="vy-marquee__dot" />
      trusted by <em>researchers worldwide</em>
      <span className="vy-marquee__dot" />
    </span>
  )
  return (
    <div className="vy-marquee" data-reveal>
      <div className="vy-marquee__track">
        {item}
        {item}
        {item}
        {item}
      </div>
    </div>
  )
}

/* ---------- About — centered stats + scroll-driven asymmetric grid ---------- */
const About = () => (
  <section className="vy-about" id="about" data-screen-label="About">
    <div className="vy-about__body">
      <p className="vy-about__copy" data-reveal>
        Zyra Labs is committed to advancing high-quality peptide and supplement
        research through clean, reliable, and precisely developed
        formulations. Our goal is simple — to provide controlled, consistent,
        and easy-to-use products designed for structured research applications.
      </p>

      <div className="vy-about__stats">
        <div className="vy-stat" data-reveal>
          <div className="vy-stat__num"><strong>10k</strong><span>+</span></div>
          <div className="vy-stat__label">trusted customers</div>
        </div>
        <div className="vy-stat" data-reveal style={{ '--reveal-delay': '120ms' }}>
          <div className="vy-stat__num"><strong>99</strong><span>%</span></div>
          <div className="vy-stat__label">verified purity</div>
        </div>
        <div className="vy-stat" data-reveal style={{ '--reveal-delay': '240ms' }}>
          <div className="vy-stat__num"><strong>24</strong><span>/7</span></div>
          <div className="vy-stat__label">whatsapp support</div>
        </div>
      </div>
    </div>

    <div className="vy-about__grid" data-stretch-grid>
      <div className="vy-project__media" data-stretch-tile data-reveal data-reveal-img data-base-h="600">
        <Img src={aboutImg1} alt="About 01" />
      </div>
      <div className="vy-project__media" data-stretch-tile data-reveal data-reveal-img data-base-h="540" style={{ '--reveal-delay': '100ms' }}>
        <Img src={aboutImg2} alt="About 02" />
      </div>
      <div className="vy-project__media" data-stretch-tile data-reveal data-reveal-img data-base-h="390" style={{ '--reveal-delay': '200ms' }}>
        <Img src={aboutImg3} alt="About 03" />
      </div>
      <div className="vy-project__media" data-stretch-tile data-reveal data-reveal-img data-base-h="220" style={{ '--reveal-delay': '300ms' }}>
        <Img src={aboutImg4} alt="About 04" />
      </div>
    </div>
  </section>
)

/* ---------- Testimonials — three reviewer cards with stars + avatar ---------- */
const Stars = ({ count = 5 }) => (
  <div className="vy-testimonial__stars" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.95 6.36 6.97.73-5.24 4.7 1.5 6.84L12 17.9 5.82 21.13l1.5-6.84-5.24-4.7 6.97-.73z" />
      </svg>
    ))}
  </div>
)

const Testimonials = () => {
  const items = [
    {
      name: 'Emily Carter',
      role: 'Wellness Consultant',
      tint: 'tone-a',
      img: tEmily,
      quote:
        'Fast support and remarkably consistent products. Zyra Labs has become my go-to source for research-grade peptides.',
    },
    {
      name: 'Sofia Bennett',
      role: 'Fitness Coordinator · Abu Dhabi',
      tint: 'tone-b',
      img: tSofia,
      quote:
        'Secure delivery, excellent communication, and a team that genuinely understands what reliability means in this field.',
    },
    {
      name: 'Michael Reed',
      role: 'Research Assistant · London',
      tint: 'tone-c',
      img: tMichael,
      quote:
        'The consistency across batches is what keeps me coming back. Helpful guidance and a smooth ordering experience throughout.',
    },
    {
      name: 'Aisha Khan',
      role: 'Naturopath · Riyadh',
      tint: 'tone-a',
      img: tAisha,
      quote:
        'Documentation and traceability are flawless. I trust their batches the way I trust my own bench notes — completely.',
    },
    {
      name: 'James Whitford',
      role: 'Lab Director · Manchester',
      tint: 'tone-b',
      img: tJames,
      quote:
        'We compared four suppliers over six months. Zyra Labs was the only one whose purity numbers held up under independent retesting.',
    },
    {
      name: 'Omar Hassan',
      role: 'Sports Physiotherapist · Doha',
      tint: 'tone-c',
      img: tOmar,
      quote:
        'Shipping is quick, packaging is intact every single time, and the WhatsApp line actually replies in minutes. Genuinely rare.',
    },
  ]

  const [visible, setVisible] = useState(3)
  const [active, setActive] = useState(0)
  const hoverRef = useRef(false)

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)')
    const mqMd = window.matchMedia('(min-width: 640px)')
    const update = () => setVisible(mqLg.matches ? 3 : mqMd.matches ? 2 : 1)
    update()
    mqLg.addEventListener('change', update)
    mqMd.addEventListener('change', update)
    return () => {
      mqLg.removeEventListener('change', update)
      mqMd.removeEventListener('change', update)
    }
  }, [])

  const maxIndex = Math.max(0, items.length - visible)
  const safeActive = Math.min(active, maxIndex)

  useEffect(() => {
    if (active > maxIndex) setActive(maxIndex)
  }, [active, maxIndex])

  useEffect(() => {
    const id = setInterval(() => {
      if (!hoverRef.current) {
        setActive((a) => (a >= maxIndex ? 0 : a + 1))
      }
    }, 4500)
    return () => clearInterval(id)
  }, [maxIndex])

  const slidePct = 100 / visible

  return (
    <section className="vy-reel vy-testimonials-section" id="testimonials">
      <div className="vy-section-head" data-reveal>
        <span className="vy-section-head__label">testimonials</span>
        <h2 className="vy-section-head__title">
          What our{' '}
          <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.02em' }}>
            researchers
          </em>{' '}
          say.
        </h2>
      </div>

      <div
        className="vy-testimonials vy-testimonials--carousel"
        onMouseEnter={() => { hoverRef.current = true }}
        onMouseLeave={() => { hoverRef.current = false }}
      >
        <div className="vy-testimonials__viewport">
          <div
            className="vy-testimonials__track"
            style={{ transform: `translateX(-${safeActive * slidePct}%)` }}
          >
            {items.map((t, i) => (
              <figure
                key={t.name}
                className={`vy-testimonial vy-testimonial--slide ${t.tint}`}
                style={{ flex: `0 0 ${slidePct}%` }}
              >
                <div className="vy-testimonial__inner">
                  <span className="vy-testimonial__mark" aria-hidden="true">&ldquo;</span>
                  <Stars />
                  <blockquote className="vy-testimonial__quote">{t.quote}</blockquote>
                  <figcaption className="vy-testimonial__cap">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="vy-testimonial__avatar vy-testimonial__avatar--img"
                      loading="lazy"
                    />
                    <span className="vy-testimonial__who">
                      <span className="vy-testimonial__name">{t.name}</span>
                      <span className="vy-testimonial__role">{t.role}</span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
        <div className="vy-testimonials__dots" role="tablist" aria-label="Testimonial slides">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === safeActive}
              aria-label={`Show slide ${i + 1}`}
              className={`vy-testimonials__dot ${i === safeActive ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>

      <div className="vy-testimonials__meta" data-reveal>
        <div className="vy-testimonials__metric">
          <strong>4.9</strong>
          <span>average rating · 1,200+ reviews</span>
        </div>
        <div className="vy-testimonials__metric">
          <strong>98%</strong>
          <span>customers would order again</span>
        </div>
        <div className="vy-testimonials__metric">
          <strong>24h</strong>
          <span>typical WhatsApp response time</span>
        </div>
      </div>
    </section>
  )
}

/* ---------- Services — gray list with floating hover preview ---------- */
const Services = () => {
  const items = catalogProducts

  const wrapRef = useRef(null)
  const previewRef = useRef(null)
  const [hover, setHover] = useState(null)
  const [lastService, setLastService] = useState(null)

  const onRowEnter = (it, rowEl) => {
    setHover(it)
    setLastService(it)
    const wrap = wrapRef.current
    const prev = previewRef.current
    if (!wrap || !prev || !rowEl) return
    const wr = wrap.getBoundingClientRect()
    const rr = rowEl.getBoundingClientRect()
    const y = rr.top - wr.top + rr.height / 2
    prev.style.top = y + 'px'
  }

  const previewService = hover || lastService

  return (
    <section className="vy-services" id="services" data-screen-label="Services">
      <div className="vy-section-head" data-reveal>
        <span className="vy-section-head__label">products</span>
        <h2 className="vy-section-head__title">
          Research-grade{' '}
          <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.02em' }}>
            peptides
          </em>
          .
        </h2>
      </div>

      <div className="vy-service-list" ref={wrapRef}>
        {items.map((it, idx) => (
          <Link
            key={it.id}
            to={`/product/${it.id}`}
            className="vy-service-row"
            onMouseEnter={(e) => onRowEnter(it, e.currentTarget)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="vy-service-row__title">{it.title}</span>
            <span className="vy-service-row__num">( {String(idx + 1).padStart(2, '0')} )</span>
          </Link>
        ))}

        <div ref={previewRef} className={`vy-service-preview ${hover ? 'is-shown' : ''}`} aria-hidden={!hover}>
          {previewService && (
            <Link
              to={`/product/${previewService.id}`}
              style={{ position: 'absolute', inset: 0, display: 'block' }}
              aria-label={`Open ${previewService.title}`}
            >
              <img
                className="vy-img-fill"
                src={previewService.image}
                alt={previewService.title}
                style={{ position: 'absolute', inset: 0 }}
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- WhyUs — sticky headline with benefit cards scrolling past ---------- */
const WhyUsCard = ({ p, i }) => (
  <article
    className="vy-project vy-whyus-card"
    data-reveal
    data-reveal-img
    style={{ '--reveal-delay': i * 60 + 'ms' }}
  >
    <div className="vy-project__media">
      <Img src={p.img} alt={p.title} />
    </div>
    <div className="vy-project__meta">
      <span className="vy-project__title">{p.title}</span>
      <span className="vy-project__year">( {String(i + 1).padStart(2, '0')} )</span>
    </div>
    <p className="vy-whyus-card__desc">{p.desc}</p>
  </article>
)

const WhyUs = () => {
  const tiles = [
    {
      id: 'purity',
      title: 'Purity First',
      desc: 'Each product is checked thoroughly to maintain clean, high-quality formulations our customers can rely on.',
      img: whyImg1,
    },
    {
      id: 'consistency',
      title: 'Reliable Consistency',
      desc: 'Uniform production standards ensure every batch performs the same — exactly what structured research demands.',
      img: whyImg2,
    },
    {
      id: 'packaging',
      title: 'Secure Packaging',
      desc: 'Sealed and protected so products arrive intact, stable, and ready for research use the moment they land.',
      img: whyImg3,
    },
    {
      id: 'verified',
      title: 'Verified Documentation',
      desc: 'Strict testing and clear documentation back every order — full transparency from production to delivery.',
      img: whyImg4,
    },
    {
      id: 'support',
      title: 'Quick WhatsApp Support',
      desc: 'Fast, direct assistance whenever you need it. Real people, real answers, with no waiting on hold.',
      img: whyImg5,
    },
    {
      id: 'trusted',
      title: 'Trusted by Thousands',
      desc: 'Researchers and wellness professionals worldwide choose Zyra Labs for clean formulations and consistent results.',
      img: whyImg6,
    },
  ]
  return (
    <section className="vy-portfolio vy-whyus" id="why-us" data-screen-label="Why Us">
      <div className="vy-portfolio__intro" data-reveal>
        <p>
          Why Zyra Labs — the standards behind every product we ship. Clean
          formulations, secure packaging, and a support team that knows what
          consistency means for serious research work.
        </p>
      </div>

      <div className="vy-portfolio__pin-wrap">
        <div className="vy-portfolio__pin" aria-hidden="true">
          <h2>Why Us</h2>
        </div>
        <div className="vy-portfolio__tiles vy-whyus__tiles">
          {tiles.map((p, i) => (
            <WhyUsCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Contact — big-text prompt + contact details over hero image ---------- */
const Contact = () => (
  <section className="vy-cta" id="contact">
    <div className="vy-cta__bg-blur" aria-hidden="true" style={{ backgroundImage: `url(${ctaBg})` }} />
    <div className="vy-cta__bg-sharp" aria-hidden="true" style={{ backgroundImage: `url(${ctaBg})` }}>
      <span className="vy-cta__lens-plus" aria-hidden="true">+</span>
    </div>
    <div className="vy-cta__content">
      <h2 className="vy-cta__title" data-reveal>
        Talk to the team
        <br />
        behind every <em>batch.</em>
      </h2>
      <p className="vy-cta__lead" data-reveal>
        Need a certificate of analysis, a custom synthesis quote, or pricing
        on a bulk research order? Write to the lab and you&rsquo;ll usually
        hear back within the hour — signed off by the chemist who ran the
        batch.
      </p>
      <div className="vy-contact" data-reveal>
        <a className="vy-contact__row" href="mailto:research@zyralabs.com">
          <span className="vy-contact__label">research &amp; COAs</span>
          <span className="vy-contact__value">research@zyralabs.com</span>
        </a>
        <a className="vy-contact__row" href="mailto:sales@zyralabs.com">
          <span className="vy-contact__label">sales &amp; wholesale</span>
          <span className="vy-contact__value">sales@zyralabs.com</span>
        </a>
        <a
          className="vy-contact__row"
          href="https://wa.me/971543800625"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="vy-contact__label">whatsapp · live</span>
          <span className="vy-contact__value">+971 54 380 0625</span>
        </a>
      </div>
      <p className="vy-cta__hours" data-reveal>
        Lab 05 · Sun – Fri · 09:00 – 21:00 GST · cold-chain shipping worldwide in 2 – 4 business days
      </p>
    </div>
  </section>
)

/* ---------- Footer — design's own dark footer ---------- */
/* =========================================================================
   motion — parallax, scroll reveals, hero lens, stretch grid, cursor.
   Ported from the design's vanilla motion.js into a scoped routine.
   ========================================================================= */
function initMotion(root) {
  const cleanups = []

  /* ===== Reveal on scroll ===== */
  const els = [...root.querySelectorAll('[data-reveal]')]
  els.forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.top > window.innerHeight - 80) el.classList.add('vy-reveal-pre')
  })
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove('vy-reveal-pre')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())
  } else {
    els.forEach((el) => el.classList.remove('vy-reveal-pre'))
  }

  /* ===== Cursor lens — hero + CTA share the same square effect ===== */
  const setupLens = (el) => {
    if (!el) return
    let lensRaf = 0
    const r0 = el.getBoundingClientRect()
    let tx = r0.width / 2
    let ty = r0.height / 2
    let cx = tx
    let cy = ty
    el.style.setProperty('--cx', cx + 'px')
    el.style.setProperty('--cy', cy + 'px')
    const lensLoop = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      el.style.setProperty('--cx', cx + 'px')
      el.style.setProperty('--cy', cy + 'px')
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        lensRaf = requestAnimationFrame(lensLoop)
      } else {
        lensRaf = 0
      }
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tx = e.clientX - r.left
      ty = e.clientY - r.top
      if (!lensRaf) lensRaf = requestAnimationFrame(lensLoop)
    }
    const onLeave = () => {
      const r = el.getBoundingClientRect()
      tx = r.width / 2
      ty = r.height / 2
      if (!lensRaf) lensRaf = requestAnimationFrame(lensLoop)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    cleanups.push(() => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (lensRaf) cancelAnimationFrame(lensRaf)
    })
  }
  setupLens(root.querySelector('.vy-hero'))
  setupLens(root.querySelector('.vy-cta'))

  /* ===== Stretch grid ===== */
  root.querySelectorAll('[data-stretch-grid]').forEach((grid) => {
    const tiles = [...grid.querySelectorAll('[data-stretch-tile]')]
    const bases = tiles.map((t) => parseFloat(t.dataset.baseH || '360'))
    const phases = tiles.map((_, i) => i * 1.4)
    const amps = [90, 110, 70, 50]
    const minH = 200
    const minGap = 12
    const maxGap = 56

    const update = () => {
      const rect = grid.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const passed = vh - rect.top
      const p = Math.max(0, Math.min(1, passed / total))
      const gap = minGap + Math.sin(p * Math.PI) * (maxGap - minGap)
      grid.style.setProperty('--vy-grid-gap', gap + 'px')
      tiles.forEach((t, i) => {
        const driver = (Math.sin(p * Math.PI * 2 + phases[i]) + 1) / 2
        const h = Math.max(minH, bases[i] + (driver - 0.5) * amps[i])
        t.style.setProperty('--tile-h', h + 'px')
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    cleanups.push(() => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    })
  })

  /* ===== Cursor follower (desktop only) ===== */
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div')
    cursor.className = 'vy-cursor'
    root.appendChild(cursor)
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const loop = () => {
      cx += (tx - cx) * 0.22
      cy += (ty - cy) * 0.22
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      cursor.classList.add('is-active')
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const hov = "a, button, [data-cursor='hover']"
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(hov)) cursor.classList.add('is-hover')
    }
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(hov)) cursor.classList.remove('is-hover')
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    cleanups.push(() => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      if (raf) cancelAnimationFrame(raf)
      cursor.remove()
    })
  }

  return () => cleanups.forEach((fn) => fn())
}

/* =========================================================================
   Deals — page composition (the Vyral design as the /deals route)
   ========================================================================= */
function Deals() {
  const rootRef = useRef(null)
  const lenisRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  /* Disable native scroll restoration — we manage initial scroll manually. */
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  /* Lenis — smooth scrolling for the whole page. */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  /* Honor cross-page anchor navigation: if we arrived with state.scrollTo,
     wait for the section to render then Lenis-scroll to it. Otherwise open
     at the hero. Clear the state afterwards so a reload lands at the top. */
  useEffect(() => {
    const targetId = location.state && location.state.scrollTo
    if (!targetId) {
      window.scrollTo(0, 0)
      return undefined
    }
    let cancelled = false
    const attemptScroll = (attempt = 0) => {
      if (cancelled) return
      const el = document.getElementById(targetId)
      const lenis = lenisRef.current
      if (el && lenis) {
        lenis.scrollTo(el, { offset: -80, duration: 1.2 })
        navigate('/', { replace: true, state: null })
        return
      }
      if (attempt < 40) requestAnimationFrame(() => attemptScroll(attempt + 1))
    }
    requestAnimationFrame(() => attemptScroll())
    return () => { cancelled = true }
  }, [location.state, navigate])

  useEffect(() => {
    if (!rootRef.current) return undefined
    return initMotion(rootRef.current)
  }, [])

  return (
    <div className="vyral-page" ref={rootRef} data-screen-label="01 Marketing Site">
      <Seo
        path="/"
        description="Research-grade peptides and clinical-grade supplements — third-party batch-tested for purity, CoA-documented, and dispatched cold-chain from Dubai Science Park. Explore BPC-157, tirzepatide, retatrutide and more."
      />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <WhyUs />
      <Testimonials />
      <Contact />
      <SiteFooter />
    </div>
  )
}

export default Deals
