import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import healthVideo from '../assets/images/home/health.mp4'
import trendingVideo from '../assets/images/home/trending.mp4'
import familyVideo from '../assets/images/home/family.mp4'
import trendingImg from '../assets/images/new/01-HOME-PAGE-best.png'
import './Page.css'

/* Hero plays each video fully, then crossfades to the next theme.
   NOTE: 3 video files exist — "lifestyle" reuses the trending clip.
   Drop a home/lifestyle.mp4 in assets and swap the import to replace it. */
const HERO_SLIDES = [
  {
    theme: 'Trending',
    image: trendingImg,
    titleTop: 'Trending',
    titleEm: '&',
    titleBottom: 'Culture',
    metaA: 'Pulse Trends',
    metaB: 'What the world is watching now',
    tagline: 'The stories, clips, and moments the world is watching now.',
  },
  {
    theme: 'Health',
    video: healthVideo,
    titleTop: 'Health',
    titleEm: '&',
    titleBottom: 'Wellness',
    metaA: 'Pulse Health',
    metaB: 'Fitness, wellbeing & mindful living',
    tagline: 'Move well, rest well, and live each day with intention.',
  },
  {
    theme: 'Family',
    video: familyVideo,
    titleTop: 'Family',
    titleEm: '&',
    titleBottom: 'Parenting',
    metaA: 'Pulse Family',
    metaB: 'Guidance for modern family life',
    tagline: 'Practical guidance for every stage of family life.',
  },
  {
    theme: 'Lifestyle',
    video: trendingVideo,
    titleTop: 'Lifestyle',
    titleEm: '&',
    titleBottom: 'Living',
    metaA: 'Pulse Lifestyle',
    metaB: 'Style, home & everyday inspiration',
    tagline: 'Style, home, and small ideas for better everyday living.',
  },
]

/* Testimonials — alternating quote and photo cards, staggered. */
const TESTIMONIALS = [
  {
    type: 'quote',
    text: 'Pulse is the first thing I open each morning. One clean feed, everything I care about — no clutter, no noise.',
    name: 'Amara K.',
  },
  {
    type: 'photo',
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop',
    grad: 'linear-gradient(160deg, #D9C6A8, #A98B63)',
    tag: 'Pulse readers',
  },
  {
    type: 'quote',
    text: 'I used to hop between five apps to keep up. Now I am genuinely informed in ten minutes a day.',
    name: 'Daniel R.',
  },
  {
    type: 'photo',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop',
    grad: 'linear-gradient(160deg, #CDBBA1, #92775A)',
    tag: 'In the newsroom',
  },
  {
    type: 'quote',
    text: 'The trending section is scary-good. I always walk into conversations already knowing what is going on.',
    name: 'Leïla M.',
  },
  {
    type: 'photo',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop',
    grad: 'linear-gradient(160deg, #DBC9AC, #A6885F)',
    tag: 'Live coverage',
  },
]

function HomeTestimonials() {
  const sectionRef = useRef(null)
  const rowRef = useRef(null)

  /* Glide the card row sideways as the section scrolls past — the
     immersive horizontal drift driven by vertical scroll. */
  useEffect(() => {
    const section = sectionRef.current
    const row = rowRef.current
    if (!section || !row) return undefined
    const clamp = (n) => Math.max(0, Math.min(1, n))
    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const p = clamp((vh - rect.top) / (vh + rect.height))
      const overflow = Math.max(0, row.scrollWidth - window.innerWidth)
      row.style.transform = `translate3d(${(-overflow * p).toFixed(1)}px, 0, 0)`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  /* Smooth staggered reveal when the section first comes into view. */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    if (!('IntersectionObserver' in window)) {
      section.classList.add('is-in')
      return undefined
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          section.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  return (
    <section className="tmonials" id="community" ref={sectionRef}>
      <div className="tmonials__head">
        <span className="tmonials__stars" aria-hidden="true">
          ★★★★★
        </span>
        <span className="tmonials__headtext">Loved by our community</span>
      </div>

      <div className="tmonials__row" ref={rowRef}>
        {TESTIMONIALS.map((t, i) =>
          t.type === 'quote' ? (
            <article
              className="tcard"
              key={i}
              style={{ '--d': `${i * 80}ms` }}
            >
              <span className="tcard__stars" aria-hidden="true">
                ★★★★★
              </span>
              <p className="tcard__quote">{t.text}</p>
              <div className="tcard__by">
                <span className="tcard__avatar" aria-hidden="true" />
                <span className="tcard__byinfo">
                  <strong>{t.name}</strong>
                  <em>Verified reader</em>
                </span>
              </div>
            </article>
          ) : (
            <div
              className="tcard tcard--photo"
              key={i}
              style={{ '--d': `${i * 80}ms` }}
            >
              <div
                className="tcard__img"
                style={{ backgroundImage: `url(${t.img}), ${t.grad}` }}
              />
              <span className="tcard__tag">{t.tag}</span>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

/* About section — a gold line draws between rounded images as you scroll. */
const ABOUT_STEPS = [
  {
    titleA: 'Stories from',
    titleB: 'every corner',
    label: 'Daily Feed',
  },
  {
    titleA: 'News that',
    titleB: 'actually matters',
    label: 'Every Topic',
  },
  {
    titleA: 'One feed,',
    titleB: 'every category',
    label: 'Pulse Stories',
  },
  {
    titleA: 'Made for',
    titleB: 'every reader',
    label: 'Your Pulse',
  },
]

function HomeAbout() {
  const trackRef = useRef(null)
  const pathRef = useRef(null)

  /* Draw the gold line as the section scrolls through the viewport.
     The draw finishes exactly when the LAST image reaches the lower
     part of the viewport, so the line always reaches it. */
  useEffect(() => {
    const track = trackRef.current
    const path = pathRef.current
    if (!track || !path) return undefined
    const photos = track.querySelectorAll('.about__photo')
    const lastImg = photos[photos.length - 1]
    if (!lastImg) return undefined
    const onScroll = () => {
      const sec = track.getBoundingClientRect()
      const last = lastImg.getBoundingClientRect()
      const vh = window.innerHeight
      const scrolled = -sec.top
      const remaining = last.top + last.height / 2 - vh * 0.62
      const total = scrolled + remaining
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 1
      path.style.strokeDashoffset = String(1 - p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  /* Reveal titles and photos as they enter view. */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const els = track.querySelectorAll('[data-areveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.35 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="about" id="discover">
      <div className="about__track" ref={trackRef}>
        <svg
          className="about__line"
          viewBox="0 0 1000 2800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d="M500 0 C700 100 870 200 780 336 C700 540 160 720 240 1008 C320 1320 870 1420 780 1680 C700 1960 160 2100 240 2352 C200 2470 300 2560 380 2648"
            fill="none"
            stroke="#C49A3F"
            strokeWidth="2"
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
        </svg>

        <span className="about__eyebrow">( About Pulse )</span>

        {ABOUT_STEPS.map((s, i) => (
          <div className="about__step" key={i}>
            <h2
              className={`about__title about__title--${i + 1}`}
              data-areveal
            >
              {s.titleA}
              <br />
              {s.titleB}
            </h2>
            <div
              className={`about__photo about__photo--${i + 1}`}
              data-areveal
            >
              <div className="about__photo-img" />
              <span className="about__photo-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* Services — 4 cards start stacked at centre, then spread to the
   corners on scroll. Each card links to its header-nav category. */
const SERVICES = [
  {
    name: 'Trending',
    to: '/deals',
    img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80&auto=format&fit=crop',
    grad: 'linear-gradient(160deg, #3a3733, #1b1a18)',
    x: -32,
    y: -18,
    rot: -4,
  },
  {
    name: 'Family',
    to: '/consumer',
    img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=700&q=80&auto=format&fit=crop',
    grad: 'linear-gradient(160deg, #423b34, #1d1b18)',
    x: 32,
    y: -18,
    rot: 4,
  },
  {
    name: 'Lifestyle',
    to: '/automotive',
    img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=700&q=80&auto=format&fit=crop',
    grad: 'linear-gradient(160deg, #38342f, #1a1917)',
    x: -32,
    y: 18,
    rot: 4,
  },
  {
    name: 'Business',
    to: '/business',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80&auto=format&fit=crop',
    grad: 'linear-gradient(160deg, #403a33, #1c1a17)',
    x: 32,
    y: 18,
    rot: -4,
  },
]

function HomeServices() {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])
  const centerRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const clamp = (n) => Math.max(0, Math.min(1, n))
    const onScroll = () => {
      /* below the breakpoint the cards stack via CSS — clear the
         inline transforms so the layout isn't overridden. */
      if (window.innerWidth <= 860) {
        cardRefs.current.forEach((card) => {
          if (card) card.style.transform = ''
        })
        if (centerRef.current) centerRef.current.style.opacity = ''
        return
      }
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const travel = section.offsetHeight - vh
      const p = travel > 0 ? clamp(-rect.top / travel) : 0
      /* easeInOutCubic for a smooth spread */
      const e =
        p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      SERVICES.forEach((s, i) => {
        const card = cardRefs.current[i]
        if (!card) return
        const scale = 0.6 + 0.4 * e
        card.style.transform =
          `translate(-50%, -50%) translate(${s.x * e}vw, ${s.y * e}vh) ` +
          `rotate(${s.rot * e}deg) scale(${scale})`
      })
      if (centerRef.current) {
        centerRef.current.style.opacity = String(clamp((p - 0.5) / 0.38))
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const goToCommunity = () => {
    document
      .getElementById('community')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="services" ref={sectionRef}>
      <div className="services__stage">
        <div className="services__center" ref={centerRef}>
          <span className="services__eyebrow">Every beat covered</span>
          <h2 className="services__title">
            Your world,
            <br />
            one <em>feed</em>
          </h2>
          <button
            type="button"
            className="services__cta"
            onClick={goToCommunity}
          >
            Explore<span aria-hidden="true">→</span>
          </button>
        </div>

        {SERVICES.map((s, i) => (
          <Link
            key={s.name}
            ref={(el) => (cardRefs.current[i] = el)}
            to={s.to}
            className="svc-card"
            style={{ zIndex: 5 + i }}
          >
            <div
              className="svc-card__img"
              style={{ backgroundImage: `url(${s.img}), ${s.grad}` }}
            />
            <span className="svc-card__name">
              {s.name}
              <i aria-hidden="true">→</i>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function HomeFooter() {
  return (
    <footer className="hfooter">
      <div className="hfooter__inner">
        <div className="hfooter__brand">
          <div className="hfooter__mark">
            <span className="hfooter__dot">P</span>
            <span className="hfooter__name">Pulse</span>
          </div>
          <p className="hfooter__tagline">
            Your daily feed of stories, ideas, and moments — across every
            category of modern life.
          </p>
        </div>

        <div className="hfooter__col">
          <h4>Categories</h4>
          <Link to="/deals">Trending</Link>
          <Link to="/consumer">Family</Link>
          <Link to="/automotive">Lifestyle</Link>
          <Link to="/business">Business</Link>
          <Link to="/family">Consumer</Link>
          <Link to="/industrial">Industrial</Link>
        </div>

        <div className="hfooter__col">
          <h4>Company</h4>
          <a href="#discover">Our story</a>
          <a href="#community">Community</a>
          <a href="#community">Newsroom</a>
          <a href="#discover">Careers</a>
        </div>

        <div className="hfooter__news">
          <h4>The Pulse Letter</h4>
          <p>
            One weekly email — the stories that mattered, nothing that
            didn&rsquo;t.
          </p>
          <form
            className="hfooter__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
            />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="hfooter__base">
        <span>© 2026 Pulse Media. All rights reserved.</span>
        <div className="hfooter__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  )
}

function Home() {
  const [active, setActive] = useState(0)
  const videoRefs = useRef([])

  /* Play the active video from the start; pause the rest.
     For image slides (no <video> ref), auto-advance after IMAGE_HOLD_MS. */
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === active) {
        v.currentTime = 0
        const p = v.play()
        if (p && p.catch) p.catch(() => {})
      } else {
        v.pause()
      }
    })

    if (HERO_SLIDES[active].image) {
      const t = setTimeout(() => goNext(), 6000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [active])

  const goNext = () => setActive((a) => (a + 1) % HERO_SLIDES.length)

  const handleScroll = () => {
    document
      .getElementById('discover')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const slide = HERO_SLIDES[active]

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg">
          {HERO_SLIDES.map((s, i) =>
            s.image ? (
              <img
                key={i}
                className={`hero__video${i === active ? ' is-active' : ''}`}
                src={s.image}
                alt=""
                aria-hidden="true"
              />
            ) : (
              <video
                key={i}
                ref={(el) => (videoRefs.current[i] = el)}
                className={`hero__video${i === active ? ' is-active' : ''}`}
                src={s.video}
                muted
                playsInline
                preload="auto"
                onEnded={goNext}
              />
            )
          )}
        </div>
        <div className="hero__veil" />

        <div className="hero__meta">
          <span className="hero__meta-item">{slide.metaA}</span>
          <span className="hero__meta-item">{slide.metaB}</span>
        </div>

        <div className="hero__head" key={active}>
          <h1 className="hero__title">
            <span className="hero__title-row">{slide.titleTop}</span>
            <span className="hero__title-row">
              <em className="hero__title-em">{slide.titleEm}</em>
              {slide.titleBottom}
            </span>
          </h1>
          <p className="hero__tagline">{slide.tagline}</p>
        </div>

        <button
          className="hero__dot"
          onClick={handleScroll}
          aria-label="Scroll down"
        />

        <div className="hero__footer">
          <span className="hero__index">
            {String(active + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
            <i>{slide.theme}</i>
          </span>
          <div className="hero__bars">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                className={`hero__bar${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Show ${s.theme}`}
              />
            ))}
          </div>
        </div>
      </section>

      <HomeAbout />

      <HomeServices />

      <HomeTestimonials />

      <HomeFooter />
    </div>
  )
}

export default Home
