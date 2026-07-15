import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PackageSearch, Truck, CircleDollarSign, MapPin } from 'lucide-react'
import { userOrderGet, ApiError } from '../lib/api'
import SiteFooter from '../components/SiteFooter'
import './Cart.css'

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

const pick = (row, keys, fallback = '') => {
  for (const k of keys) {
    if (row && row[k] != null && row[k] !== '') return row[k]
  }
  return fallback
}

const statusTone = (raw) => {
  const s = String(raw || '').toLowerCase()
  if (['delivered', 'completed', 'paid', 'received', 'success'].includes(s)) return 'ok'
  if (['cancelled', 'canceled', 'rejected', 'failed', 'refunded'].includes(s)) return 'bad'
  if (['shipped', 'dispatched', 'in_transit', 'processing'].includes(s)) return 'info'
  return 'wait'
}

// Simple progress model for the tracking timeline.
const STEPS = [
  { key: 'placed',    label: 'Order placed' },
  { key: 'paid',      label: 'Payment received' },
  { key: 'shipped',   label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

const computeStep = (order) => {
  const status = String(pick(order, ['status'], '')).toLowerCase()
  const pay = String(pick(order, ['payment_status', 'paymentStatus'], '')).toLowerCase()
  if (['delivered', 'completed'].includes(status)) return 3
  if (['shipped', 'dispatched', 'in_transit'].includes(status)) return 2
  if (['received', 'paid', 'success'].includes(pay) || status === 'processing') return 1
  return 0
}

function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialOrder = searchParams.get('order') || ''
  const initialEmail = searchParams.get('email') || ''

  const [form, setForm] = useState({ orderNumber: initialOrder, email: initialEmail })
  const [state, setState] = useState({ status: 'idle', data: null, error: null })

  const lookup = useCallback(async ({ orderNumber, email }) => {
    setState({ status: 'loading', data: null, error: null })
    try {
      const res = await userOrderGet(orderNumber.trim())
      const order = res && res.order
      if (!order) {
        setState({ status: 'error', data: null, error: 'Order not found.' })
        return
      }
      // Confirm the email matches the order — otherwise anyone could look up any order number.
      const orderEmail = String(pick(order, ['customer_email', 'email'], '')).toLowerCase().trim()
      if (email && orderEmail && orderEmail !== email.toLowerCase().trim()) {
        setState({ status: 'error', data: null, error: 'The email does not match this order.' })
        return
      }
      setState({ status: 'done', data: res, error: null })
    } catch (err) {
      let msg = (err && err.message) || 'Could not find that order.'
      if (err instanceof ApiError && err.status === 404) msg = 'Order not found.'
      setState({ status: 'error', data: null, error: msg })
    }
  }, [])

  // Auto-lookup if arriving with prefilled URL params.
  useEffect(() => {
    // setState happens inside lookup() — data-fetch is the entire point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialOrder) lookup({ orderNumber: initialOrder, email: initialEmail })
  }, [initialOrder, initialEmail, lookup])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.orderNumber.trim()) {
      setState({ status: 'error', data: null, error: 'Enter your order number.' })
      return
    }
    setSearchParams({
      order: form.orderNumber.trim(),
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
    })
    lookup(form)
  }

  const onField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const renderTracking = () => {
    if (state.status !== 'done' || !state.data) return null
    const { order, items = [], payments = [] } = state.data
    const number = pick(order, ['order_number', 'orderNumber', 'orderId', 'id'])
    const status = pick(order, ['status'], 'pending')
    const payStatus = pick(order, ['payment_status', 'paymentStatus'], 'pending')
    const total = pick(order, ['total', 'total_amount'], 0)
    const tracking = pick(order, ['tracking_number', 'trackingNumber'])
    const placed = pick(order, ['created_at', 'createdAt'])
    const shippedAt = pick(order, ['shipped_at', 'shippedAt'])
    const deliveredAt = pick(order, ['delivered_at', 'deliveredAt'])
    const line1 = pick(order, ['shipping_address', 'address'])
    const city = pick(order, ['shipping_city', 'city'])
    const postcode = pick(order, ['shipping_zip', 'postcode', 'shipping_postcode'])
    const country = pick(order, ['shipping_country', 'country'])

    const activeStep = computeStep(order)
    const stepTimes = [placed, payments[0] && pick(payments[0], ['created_at']), shippedAt, deliveredAt]

    return (
      <div className="zl-track">
        <div className="zl-track__head">
          <div>
            <p className="zl-eyebrow">Order</p>
            <h2 className="zl-track__num">{number}</h2>
            <p className="zl-track__placed">Placed {fmtDate(placed)}</p>
          </div>
          <div className="zl-track__badges">
            <span className={`zl-chip zl-chip--${statusTone(status)}`}>{String(status)}</span>
            <span className={`zl-chip zl-chip--${statusTone(payStatus)}`}>pay: {String(payStatus)}</span>
          </div>
        </div>

        <ol className="zl-track__steps">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              className={`zl-track__step ${i <= activeStep ? 'is-done' : ''} ${i === activeStep ? 'is-current' : ''}`}
            >
              <span className="zl-track__step-dot" aria-hidden="true" />
              <div>
                <p className="zl-track__step-label">{s.label}</p>
                {stepTimes[i] && (
                  <p className="zl-track__step-time">{fmtDate(stepTimes[i])}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="zl-track__grid">
          <section className="zl-track__card">
            <h3><Truck size={16} /> Shipping</h3>
            {tracking ? (
              <p><strong>Tracking #</strong> {tracking}</p>
            ) : (
              <p className="zl-orders__hint">No tracking number yet.</p>
            )}
            <p>
              {[line1, city, postcode, country].filter(Boolean).join(', ') || '—'}
            </p>
          </section>

          <section className="zl-track__card">
            <h3><CircleDollarSign size={16} /> Payment</h3>
            <p><strong>Status:</strong> {String(payStatus)}</p>
            <p><strong>Total:</strong> {fmt(total)}</p>
          </section>

          <section className="zl-track__card zl-track__card--wide">
            <h3><MapPin size={16} /> Items</h3>
            {items.length === 0 ? (
              <p className="zl-orders__hint">No items on this order.</p>
            ) : (
              <ul className="zl-orders__row-items">
                {items.map((it, i) => (
                  <li key={i}>
                    <span>{pick(it, ['name', 'title', 'product_name'], 'Item')}</span>
                    <span>× {pick(it, ['quantity', 'qty'], 1)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="zl-shop-page">
      <div className="zl-shop-page__inner">
        <div className="zl-shop-page__head">
          <div>
            <p className="zl-eyebrow">Track order</p>
            <h1 className="zl-shop-page__title">Where&apos;s my order?</h1>
          </div>
          <Link to="/" className="zl-shop-page__back">← Back to home</Link>
        </div>

        <form className="zl-track__form" onSubmit={onSubmit} noValidate>
          <label className="zl-auth__field">
            <span>Order number</span>
            <input
              className="zl-input"
              value={form.orderNumber}
              onChange={(e) => onField('orderNumber', e.target.value)}
              placeholder="ORD-XXXXX or ZYR-XXXXX"
              required
            />
          </label>
          <label className="zl-auth__field">
            <span>Email on order</span>
            <input
              className="zl-input"
              type="email"
              value={form.email}
              onChange={(e) => onField('email', e.target.value)}
              placeholder="you@lab.com"
              autoComplete="email"
            />
          </label>
          <button
            type="submit"
            className="zl-btn-solid zl-track__cta"
            disabled={state.status === 'loading'}
          >
            {state.status === 'loading' ? 'Looking up…' : (
              <><PackageSearch size={16} /> Track order</>
            )}
          </button>
        </form>

        {state.status === 'error' && <p className="zl-error">{state.error}</p>}

        {renderTracking()}
      </div>
      <SiteFooter />
    </div>
  )
}

export default TrackOrder
