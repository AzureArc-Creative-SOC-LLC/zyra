import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useCart, priceToNumber } from '../context/cart-context'
import { promoValidate, userOrderCreate, ApiError } from '../lib/api'
import './Cart.css'

const fmt = (n) => `$${n.toFixed(2)}`

const COUNTRIES = [
  'United Kingdom',
  'Ireland',
  'France',
  'Germany',
  'Netherlands',
  'Spain',
  'United Arab Emirates',
  'United States',
  'Other',
]

const makeOrderId = () =>
  'ZYR-' +
  Date.now().toString(36).toUpperCase().slice(-5) +
  '-' +
  Math.random().toString(36).toUpperCase().slice(2, 5)

function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: COUNTRIES[0],
  })
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const [placedOrder, setPlacedOrder] = useState(null)

  const [promoInput, setPromoInput] = useState('')
  const [applied, setApplied] = useState(null) // { code, percent }
  const [validating, setValidating] = useState(false)
  const [promoMsg, setPromoMsg] = useState(null) // { tone: 'ok'|'err', text }

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) {
      setPromoMsg({ tone: 'err', text: 'Enter a code.' })
      return
    }
    setValidating(true)
    setPromoMsg(null)
    try {
      const res = await promoValidate(code)
      const percent = res && typeof res.percent === 'number' ? res.percent : 0
      if (!percent) {
        setApplied(null)
        setPromoMsg({ tone: 'err', text: 'Invalid code.' })
      } else {
        setApplied({ code, percent })
        setPromoMsg({ tone: 'ok', text: `${percent}% off applied.` })
      }
    } catch (err) {
      setApplied(null)
      if (err instanceof ApiError && err.status === 404) {
        setPromoMsg({ tone: 'err', text: 'Invalid code.' })
      } else {
        setPromoMsg({ tone: 'err', text: err.message || 'Could not validate code.' })
      }
    } finally {
      setValidating(false)
    }
  }

  const removePromo = () => {
    setApplied(null)
    setPromoInput('')
    setPromoMsg(null)
  }

  const discount = applied
    ? Math.round(subtotal * applied.percent) / 100
    : 0
  const total = Math.max(0, subtotal - discount)

  useEffect(() => {
    if (placedOrder) return undefined
    if (items.length === 0) {
      const t = setTimeout(() => navigate('/cart'), 200)
      return () => clearTimeout(t)
    }
    return undefined
  }, [items.length, navigate, placedOrder])

  useEffect(() => {
    if (!placedOrder) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') closeModalAndContinue() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedOrder])

  const onField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const placeOrder = async (e) => {
    e.preventDefault()
    if (placing) return
    if (!form.firstName || !form.lastName || !form.email || !form.address1 || !form.city || !form.postcode) {
      setError('Please fill in the required contact and shipping fields.')
      return
    }
    setError(null)
    setPlacing(true)

    const trim = (s) => (s == null ? '' : String(s).trim())

    // Build the line items as a real array of { name, quantity, unitPrice, sku }
    // — one entry per cart line — so the server uses the structured items row
    // directly.
    const itemsArray = items.map((it) => ({
      name: trim(it.name),
      quantity: Math.max(1, Number(it.qty) || 1),
      unitPrice: priceToNumber(it.price),
      sku: String(it.id || ''),
    }))

    // Sole order-creation endpoint: POST /api/user-orders as plain JSON.
    const payload = {
      email: trim(form.email),
      customerName: `${trim(form.firstName)} ${trim(form.lastName)}`.trim(),
      firstName: trim(form.firstName),
      lastName: trim(form.lastName),
      phone: trim(form.phone),
      address: trim(form.address1),
      city: trim(form.city),
      postcode: trim(form.postcode),
      country: trim(form.country),
      itemsArray,
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discount.toFixed(2)),
      total: Number(total.toFixed(2)),
      promoCode: applied ? applied.code : null,
      promoDiscount: applied ? applied.percent : undefined,
      payment_method: 'manual',
    }

    let serverOrderNumber = null
    try {
      const res = await userOrderCreate(payload)
      serverOrderNumber = res && res.orderNumber
    } catch (err) {
      setPlacing(false)
      const raw = (err && err.message) || ''
      const friendly = /too long|character varying|value too long/i.test(raw)
        ? "Something in your details is too long for our system. If it keeps happening, please contact support — we'll place the order manually."
        : raw || 'Could not place order. Please try again.'
      setError(friendly)
      return
    }

    const order = {
      id: serverOrderNumber || makeOrderId(),
      placedAt: new Date().toISOString(),
      customer: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
      },
      shipping: {
        line1: form.address1,
        line2: form.address2,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
      },
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        image: it.image,
        price: it.price,
        qty: it.qty,
        lineTotal: priceToNumber(it.price) * it.qty,
      })),
      subtotal,
      shipping_fee: 0,
      discount,
      promo: applied ? { code: applied.code, percent: applied.percent } : null,
      total,
    }
    try {
      sessionStorage.setItem('zl:lastOrder', JSON.stringify(order))
    } catch { /* storage disabled */ }
    setPlacing(false)
    setPlacedOrder(order)
  }

  const closeModalAndContinue = () => {
    clearCart()
    setPlacedOrder(null)
    navigate('/')
  }

  return (
    <div className="zl-shop-page">
      <div className="zl-shop-page__inner">
        <div className="zl-shop-page__head">
          <div>
            <p className="zl-eyebrow">Checkout</p>
            <h1 className="zl-shop-page__title">Complete your order</h1>
          </div>
          <Link to="/cart" className="zl-shop-page__back">← Back to cart</Link>
        </div>

        <form onSubmit={placeOrder} className="zl-shop-grid" noValidate>
          <div className="zl-checkout-form">
            <section className="zl-checkout-form__section">
              <h2>Contact</h2>
              <div className="zl-checkout-form__grid">
                <input
                  className="zl-input"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => onField('firstName', e.target.value)}
                  required
                  autoComplete="given-name"
                />
                <input
                  className="zl-input"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => onField('lastName', e.target.value)}
                  required
                  autoComplete="family-name"
                />
                <input
                  className="zl-input"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => onField('email', e.target.value)}
                  required
                  autoComplete="email"
                />
                <input
                  className="zl-input"
                  type="tel"
                  placeholder="Mobile number"
                  value={form.phone}
                  onChange={(e) => onField('phone', e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </section>

            <section className="zl-checkout-form__section">
              <h2>Shipping address</h2>
              <div className="zl-checkout-form__grid">
                <input
                  className="zl-input zl-full"
                  placeholder="Address line 1"
                  value={form.address1}
                  onChange={(e) => onField('address1', e.target.value)}
                  required
                  autoComplete="address-line1"
                />
                <input
                  className="zl-input zl-full"
                  placeholder="Address line 2 (optional)"
                  value={form.address2}
                  onChange={(e) => onField('address2', e.target.value)}
                  autoComplete="address-line2"
                />
                <input
                  className="zl-input"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => onField('city', e.target.value)}
                  required
                  autoComplete="address-level2"
                />
                <input
                  className="zl-input"
                  placeholder="Postcode"
                  value={form.postcode}
                  onChange={(e) => onField('postcode', e.target.value)}
                  required
                  autoComplete="postal-code"
                />
                <div className="zl-select-wrap zl-full">
                  <select
                    className="zl-select"
                    value={form.country}
                    onChange={(e) => onField('country', e.target.value)}
                    autoComplete="country-name"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </section>

            <p className="zl-note">
              For laboratory R&amp;D use only · Not for human or veterinary consumption.
            </p>
          </div>

          <aside className="zl-summary">
            <h2 className="zl-summary__title">Order summary</h2>
            <ul className="zl-summary__items">
              {items.map((it) => (
                <li key={it.id}>
                  <div className="zl-summary__thumb">
                    <img src={it.image} alt={it.name} />
                  </div>
                  <div className="zl-summary__it-body">
                    <p className="zl-summary__it-name">{it.name}</p>
                    <p className="zl-summary__it-sub">{it.subtitle || 'Research peptide'}</p>
                  </div>
                  <div className="zl-summary__it-right">
                    <span className="zl-summary__qty">× {it.qty}</span>
                    <p className="zl-summary__it-line">
                      {fmt(priceToNumber(it.price) * it.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="zl-promo">
              {applied ? (
                <div className="zl-promo__applied">
                  <span>
                    <strong>{applied.code}</strong>
                    <span className="zl-promo__pct"> · {applied.percent}% off</span>
                  </span>
                  <button
                    type="button"
                    className="zl-promo__remove"
                    onClick={removePromo}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="zl-promo__row">
                  <input
                    className="zl-input zl-promo__input"
                    placeholder="Discount code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); applyPromo() }
                    }}
                  />
                  <button
                    type="button"
                    className="zl-promo__apply"
                    onClick={applyPromo}
                    disabled={validating}
                  >
                    {validating ? '…' : 'Apply'}
                  </button>
                </div>
              )}
              {promoMsg && (
                <p className={`zl-promo__msg zl-promo__msg--${promoMsg.tone}`}>
                  {promoMsg.text}
                </p>
              )}
            </div>

            <dl className="zl-summary__rows">
              <div>
                <dt>Subtotal</dt>
                <dd>{fmt(subtotal)}</dd>
              </div>
              <div>
                <dt>Tracked shipping</dt>
                <dd>Free</dd>
              </div>
              {discount > 0 && (
                <div>
                  <dt>Discount</dt>
                  <dd className="zl-summary__discount">−{fmt(discount)}</dd>
                </div>
              )}
              <div className="zl-summary__divider" aria-hidden="true" />
              <div className="zl-summary__total">
                <dt>Total</dt>
                <dd>{fmt(total)}</dd>
              </div>
            </dl>

            {error && <p className="zl-error">{error}</p>}

            <button
              type="submit"
              className="zl-btn-solid zl-summary__cta"
              disabled={placing}
            >
              {placing ? 'Placing order…' : 'Place Order'}
            </button>
            <Link to="/cart" className="zl-summary__continue">Back to cart</Link>
            <p className="zl-summary__note">
              For laboratory R&amp;D use only · Not for human or veterinary consumption
            </p>
          </aside>
        </form>
      </div>

      {placedOrder && (
        <div
          className="zl-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="zl-modal-title"
          onClick={closeModalAndContinue}
        >
          <div
            className="zl-modal__card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="zl-modal__check" aria-hidden="true">
              <Check size={28} strokeWidth={2.4} />
            </div>
            <h2 id="zl-modal-title" className="zl-modal__title">Order placed</h2>
            <p className="zl-modal__lead">
              Thanks {form.firstName || 'researcher'} — we&apos;ve received your order.
              A confirmation will be sent to{' '}
              <span className="zl-modal__email">{form.email || 'your inbox'}</span>.
            </p>
            <dl className="zl-modal__meta">
              <div>
                <dt>Order #</dt>
                <dd>{placedOrder.id}</dd>
              </div>
              <div className="zl-modal__meta-total">
                <dt>Total paid</dt>
                <dd>{fmt(placedOrder.total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="zl-btn-solid zl-modal__cta"
              onClick={closeModalAndContinue}
            >
              Continue shopping
            </button>
            <p className="zl-modal__note">For laboratory R&amp;D use only</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
