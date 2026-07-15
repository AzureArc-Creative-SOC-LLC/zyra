import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, LogOut, PackageSearch, Truck } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { useAuth } from '../context/auth-context'
import './Header.css'

const navLinks = [
  { href: '#home', type: 'anchor', label: 'Home' },
  { to: '/about', type: 'route', label: 'About' },
  { to: '/services', type: 'route', label: 'Shop' },
  { href: '#why-us', type: 'anchor', label: 'Why Us' },
  { href: '#testimonials', type: 'anchor', label: 'Testimonial' },
  { to: '/contact', type: 'route', label: 'Contact' },
]

const initialsOf = (nameOrEmail) => {
  if (!nameOrEmail) return '?'
  const clean = String(nameOrEmail).trim()
  if (!clean) return '?'
  if (clean.includes('@')) return clean[0].toUpperCase()
  const parts = clean.split(/\s+/).filter(Boolean)
  const first = parts[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1] : ''
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || first[0].toUpperCase()
}

function Header() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [acctOpen, setAcctOpen] = useState(false)
  const acctRef = useRef(null)

  // Close the mobile menu and account dropdown whenever the route changes.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
    if (acctOpen) setAcctOpen(false)
  }, [location.pathname])
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Prevent body scroll when the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  // Close the account dropdown on outside click / Escape.
  useEffect(() => {
    if (!acctOpen) return undefined
    const onDown = (e) => {
      if (acctRef.current && !acctRef.current.contains(e.target)) setAcctOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setAcctOpen(false) }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [acctOpen])

  const handleNavClick = (e, href) => {
    const id = href.replace('#', '')
    setMenuOpen(false)
    // Cross-page anchor: navigate to landing with state; Deals handles the scroll.
    if (location.pathname !== '/') {
      e.preventDefault()
      navigate('/', { state: { scrollTo: id } })
      return
    }
    // Same-page anchor: scroll immediately.
    const target = document.getElementById(id)
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSignOut = () => {
    setAcctOpen(false)
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  const displayName = user && (user.name || user.email || 'Researcher')

  return (
    <header className={`header ${menuOpen ? 'is-menu-open' : ''}`}>
      <NavLink to="/" className="header__brand" aria-label="Zyra Labs — home">
        <span className="header__wordmark" aria-hidden="true">
          <span className="header__wordmark-cap">Z</span>
          <span className="header__wordmark-italic">y</span>
          <span className="header__wordmark-cap">R</span>
          <span className="header__wordmark-cap">A</span>
          <span className="header__wordmark-sub">labs</span>
        </span>
      </NavLink>

      <nav className="header__nav">
        {navLinks.map((link) => (
          link.type === 'route' ? (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `header__link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ) : (
            <a
              key={link.href}
              href={link.href}
              className="header__link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          )
        ))}
      </nav>

      <div className="header__actions">
        {user ? (
          <div className="header__acct" ref={acctRef}>
            <button
              type="button"
              className={`header__acct-trigger ${acctOpen ? 'is-open' : ''}`}
              aria-haspopup="menu"
              aria-expanded={acctOpen}
              onClick={() => setAcctOpen((v) => !v)}
            >
              <span className="header__acct-avatar" aria-hidden="true">
                {initialsOf(user.name || user.email)}
              </span>
              <span className="header__acct-name">
                {(user.name && user.name.split(' ')[0]) || (user.email || '').split('@')[0]}
              </span>
            </button>
            <div className={`header__acct-menu ${acctOpen ? 'is-open' : ''}`} role="menu">
              <div className="header__acct-info">
                <span className="header__acct-info-name">{displayName}</span>
                {user.email && (
                  <span className="header__acct-info-email">{user.email}</span>
                )}
              </div>
              <div className="header__acct-divider" aria-hidden="true" />
              <NavLink
                to="/orders"
                className="header__acct-item"
                role="menuitem"
                onClick={() => setAcctOpen(false)}
              >
                <PackageSearch size={16} />
                <span>My orders</span>
              </NavLink>
              <NavLink
                to="/track-order"
                className="header__acct-item"
                role="menuitem"
                onClick={() => setAcctOpen(false)}
              >
                <Truck size={16} />
                <span>Track order</span>
              </NavLink>
              <NavLink
                to="/cart"
                className="header__acct-item"
                role="menuitem"
                onClick={() => setAcctOpen(false)}
              >
                <ShoppingBag size={16} />
                <span>My cart {count > 0 ? `(${count})` : ''}</span>
              </NavLink>
              <div className="header__acct-divider" aria-hidden="true" />
              <button
                type="button"
                className="header__acct-item header__acct-item--danger"
                role="menuitem"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        ) : (
          <NavLink to="/signin" className="header__cart" aria-label="Sign in">
            <User size={18} strokeWidth={1.8} />
          </NavLink>
        )}
        <NavLink to="/cart" className="header__cart" aria-label={`Cart, ${count} items`}>
          <ShoppingBag size={18} strokeWidth={1.8} />
          {count > 0 && <span className="header__cart-count">{count}</span>}
        </NavLink>
        <button
          type="button"
          className="header__menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="header-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        id="header-mobile-menu"
        className={`header__mobile ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="header__mobile-nav">
          {navLinks.map((link) => (
            link.type === 'route' ? (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="header__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="header__mobile-link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            )
          ))}
          {user ? (
            <>
              <div className="header__mobile-user">
                <span className="header__acct-avatar" aria-hidden="true">
                  {initialsOf(user.name || user.email)}
                </span>
                <div className="header__mobile-user-body">
                  <span className="header__mobile-user-name">{displayName}</span>
                  {user.email && (
                    <span className="header__mobile-user-email">{user.email}</span>
                  )}
                </div>
              </div>
              <NavLink
                to="/orders"
                className="header__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                <PackageSearch size={18} /> My orders
              </NavLink>
              <NavLink
                to="/track-order"
                className="header__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                <Truck size={18} /> Track order
              </NavLink>
              <button
                type="button"
                className="header__mobile-link header__mobile-link--danger"
                onClick={handleSignOut}
              >
                <LogOut size={18} /> Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/track-order"
                className="header__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                <Truck size={18} /> Track order
              </NavLink>
              <NavLink
                to="/signin"
                className="header__mobile-link header__mobile-link--cart"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} /> Sign in
              </NavLink>
            </>
          )}
          <NavLink
            to="/cart"
            className="header__mobile-link header__mobile-link--cart"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag size={18} /> Cart {count > 0 ? `(${count})` : ''}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
