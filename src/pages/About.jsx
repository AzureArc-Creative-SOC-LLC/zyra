import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import '@fontsource-variable/geist'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import './About.css'

import heroImg from '../assets/images/004-best.webp'
import missionImg from '../assets/images/about/mission.webp'
import storyImg from '../assets/images/about/story.webp'
import teamImg1 from '../assets/images/about/team.webp'
import teamImg2 from '../assets/images/about/team2.webp'
import teamImg3 from '../assets/images/about/team3.webp'
import teamImg4 from '../assets/images/about/team4.webp'
import valueImg1 from '../assets/images/about/purity.webp'
import valueImg2 from '../assets/images/about/consistency.webp'
import valueImg3 from '../assets/images/about/documentation.webp'

const Arrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

const AboutHero = () => {
  const title = 'ABOUT'
  return (
    <header className="zl-banner zl-about-banner">
      <div className="zl-banner__bg" aria-hidden="true" style={{ backgroundImage: `url(${heroImg})` }} />
      <div className="zl-banner__scrim" aria-hidden="true" />

      <div className="zl-banner__labels">
        <span>OUR STORY</span>
        <span>SEVEN YEARS</span>
        <span>RESEARCH LAB</span>
      </div>

      <h1 className="zl-banner__title" aria-label="About us">
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
          us.
        </span>
      </h1>
    </header>
  )
}

const Mission = () => (
  <section className="zl-mission">
    <div className="zl-mission__label" data-reveal>( 01 ) mission</div>
    <div className="zl-mission__grid">
      <div className="zl-mission__copy">
        <h2 data-reveal>
          Research-grade formulations,{' '}
          <em>engineered</em> for reproducibility.
        </h2>
        <p data-reveal>
          We exist to remove uncertainty from bench-side research. Every injection
          leaving our lab is synthesized under strict standard operating
          procedures, independently assayed for identity and purity, and
          cold-chain packaged for a worldwide research community that
          cannot afford lot-to-lot drift.
        </p>
        <div className="zl-mission__points" data-reveal>
          <div className="zl-mission__point">
            <span className="zl-mission__point-num">01</span>
            <div>
              <h4>Reproducibility first</h4>
              <p>Uniform batch chemistry means comparable data — the only kind that survives peer review.</p>
            </div>
          </div>
          <div className="zl-mission__point">
            <span className="zl-mission__point-num">02</span>
            <div>
              <h4>Transparent documentation</h4>
              <p>Every shipment is backed by an HPLC-verified certificate of analysis, signed by the batch chemist.</p>
            </div>
          </div>
          <div className="zl-mission__point">
            <span className="zl-mission__point-num">03</span>
            <div>
              <h4>Human support</h4>
              <p>Talk to the person who ran the assay — not a call centre. WhatsApp replies within the hour.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="zl-mission__media" data-reveal>
        <div className="zl-mission__media-wrap">
          <img src={missionImg} alt="Zyra Labs bench" loading="lazy" />
        </div>
        <div className="zl-mission__badge">
          <span className="zl-mission__badge-num">100%</span>
          <span className="zl-mission__badge-label">batch-tested before dispatch</span>
        </div>
      </div>
    </div>
  </section>
)

const Story = () => {
  const timeline = [
    { year: '2019', title: 'Zyra Labs founded', body: 'Two chemists open a single-bench research chemistry lab.' },
    { year: '2021', title: 'HPLC in-house', body: 'Independent HPLC and mass-spec instrumentation installed. Full assay control moves under one roof.' },
    { year: '2023', title: '10,000+ researchers', body: 'The 10,000th verified research client places an order. Cold-chain shipping expands to 40+ countries.' },
    { year: '2025', title: 'Peptide facility', body: 'Dedicated peptide synthesis wing goes live, doubling capacity for BPC-157, TB-500, and GLP-1 analogs.' },
    { year: '2026', title: 'Custom synthesis', body: 'Custom research synthesis service opens to labs, universities, and independent researchers globally.' },
  ]
  return (
    <section className="zl-story">
      <div className="zl-story__head">
        <div className="zl-story__label" data-reveal>( 02 ) story</div>
        <h2 data-reveal>Seven years of<br /><em>quiet, obsessive</em> iteration.</h2>
      </div>
      <div className="zl-story__grid">
        <div className="zl-story__media" data-reveal>
          <img src={storyImg} alt="Zyra Labs bench workflow" loading="lazy" />
          <div className="zl-story__caption">Lab 05</div>
        </div>
        <ol className="zl-story__timeline">
          {timeline.map((t, i) => (
            <li key={t.year} className="zl-story__step" data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
              <span className="zl-story__year">{t.year}</span>
              <div className="zl-story__body">
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const Values = () => {
  const values = [
    { img: valueImg1, kicker: 'purity', title: 'Verified ≥99% purity', body: 'HPLC and mass-spec confirmation on every lot. No exceptions, no averaging across batches.' },
    { img: valueImg2, kicker: 'consistency', title: 'Batch-to-batch consistency', body: 'Standard operating procedures locked at every step of synthesis, lyophilization, and fill.' },
    { img: valueImg3, kicker: 'documentation', title: 'Full documentation', body: 'A signed CoA, HPLC trace, and endotoxin result travels with every injection that leaves the lab.' },
  ]
  return (
    <section className="zl-values">
      <div className="zl-values__head">
        <div className="zl-values__label" data-reveal>( 03 ) values</div>
        <h2 data-reveal>What&apos;s <em>non-negotiable</em>.</h2>
      </div>
      <div className="zl-values__grid">
        {values.map((v, i) => (
          <article className="zl-value" key={v.kicker} data-reveal style={{ '--reveal-delay': `${i * 100}ms` }}>
            <div className="zl-value__img">
              <img src={v.img} alt={v.title} loading="lazy" />
            </div>
            <div className="zl-value__body">
              <span className="zl-value__kicker">{v.kicker}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const Team = () => {
  const team = [
    { img: teamImg1, name: 'Dr. Layla Faour', role: 'Head of Peptide Chemistry' },
    { img: teamImg2, name: 'James Whitford', role: 'Lab Director · QA' },
    { img: teamImg3, name: 'Sofia Bennett', role: 'Analytical Chemistry Lead' },
    { img: teamImg4, name: 'Michael Reed', role: 'Client Research Liaison' },
  ]
  return (
    <section className="zl-team">
      <div className="zl-team__head">
        <div className="zl-team__label" data-reveal>( 04 ) team</div>
        <h2 data-reveal>The chemists <em>signing</em> your CoA.</h2>
        <p data-reveal>A tight, senior team of research chemists and analysts. Every injection ships with the name of the person who verified its purity.</p>
      </div>
      <div className="zl-team__grid">
        {team.map((m, i) => (
          <figure className="zl-team-card" key={m.name} data-reveal style={{ '--reveal-delay': `${i * 90}ms` }}>
            <div className="zl-team-card__img">
              <img src={m.img} alt={m.name} loading="lazy" />
            </div>
            <figcaption>
              <span className="zl-team-card__name">{m.name}</span>
              <span className="zl-team-card__role">{m.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

const AboutCTA = () => (
  <section className="zl-cta-band">
    <div className="zl-cta-band__inner">
      <span className="zl-cta-band__kicker" data-reveal>ready when you are</span>
      <h2 data-reveal>Need a CoA, a custom<br />synthesis quote, or bulk pricing?</h2>
      <div className="zl-cta-band__actions" data-reveal>
        <Link to="/contact" className="zl-btn zl-btn--primary">
          <span>Talk to the lab</span>
          <Arrow />
        </Link>
        <Link to="/services" className="zl-btn zl-btn--ghost">
          <span>Explore services</span>
          <Arrow />
        </Link>
      </div>
    </div>
  </section>
)

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

function About() {
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
    <div className="zl-page zl-about" ref={rootRef}>
      <Seo
        title="About"
        path="/about"
        description="Meet Zyra Labs — the team, mission, and quality standards behind our research-grade peptides. Every batch is third-party tested for purity and shipped cold-chain from Dubai Science Park."
      />
      <AboutHero />
      <Mission />
      <Story />
      <Values />
      <Team />
      <AboutCTA />
      <SiteFooter />
    </div>
  )
}

export default About
