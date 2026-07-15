import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PackageSearch, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/auth-context'
import { userOrdersByEmail } from '../lib/api'
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

function Orders() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState({ status: 'idle', orders: [], error: null })

  const load = useCallback(async (email) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const res = await userOrdersByEmail(email)
      const orders = (res && Array.isArray(res.orders)) ? res.orders : []
      setState({ status: 'done', orders, error: null })
    } catch (err) {
      setState({ status: 'error', orders: [], error: (err && err.message) || 'Could not load orders.' })
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user || !user.email) {
      navigate('/signin')
      return
    }
    // Data-fetch on mount / when user changes — setState happens inside load().
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(user.email)
  }, [authLoading, user, navigate, load])

  const renderContent = () => {
    if (authLoading || state.status === 'loading') {
      return <p className="zl-orders__hint">Loading your orders…</p>
    }
    if (state.status === 'error') {
      return (
        <div className="zl-orders__empty">
          <p className="zl-error">{state.error}</p>
          <button type="button" className="zl-btn-solid" onClick={() => user && load(user.email)}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      )
    }
    if (state.status === 'done' && state.orders.length === 0) {
      return (
        <div className="zl-orders__empty">
          <PackageSearch size={38} strokeWidth={1.6} aria-hidden="true" />
          <h2>No orders yet</h2>
          <p className="zl-orders__hint">
            When you place an order it will appear here with tracking info.
          </p>
          <Link to="/services" className="zl-btn-solid">Browse products</Link>
        </div>
      )
    }
    return (
      <ul className="zl-orders__list">
        {state.orders.map((o, idx) => {
          const number = pick(o, ['order_number', 'orderNumber', 'orderId', 'id'], `#${idx + 1}`)
          const created = pick(o, ['created_at', 'createdAt', 'placedAt'])
          const status = pick(o, ['status'], 'pending')
          const paymentStatus = pick(o, ['payment_status', 'paymentStatus'])
          const total = pick(o, ['total', 'total_amount', 'grand_total'], 0)
          const tracking = pick(o, ['tracking_number', 'trackingNumber'])
          const items = Array.isArray(o.items) ? o.items : []
          return (
            <li key={number || idx} className="zl-orders__row">
              <div className="zl-orders__row-head">
                <div>
                  <p className="zl-orders__row-eyebrow">Order</p>
                  <p className="zl-orders__row-num">{number}</p>
                </div>
                <div className="zl-orders__row-meta">
                  <span className={`zl-chip zl-chip--${statusTone(status)}`}>{String(status || 'pending')}</span>
                  {paymentStatus && (
                    <span className={`zl-chip zl-chip--${statusTone(paymentStatus)}`}>
                      pay: {String(paymentStatus)}
                    </span>
                  )}
                </div>
              </div>
              <dl className="zl-orders__row-facts">
                <div><dt>Placed</dt><dd>{fmtDate(created)}</dd></div>
                <div><dt>Total</dt><dd>{fmt(total)}</dd></div>
                {tracking && <div><dt>Tracking</dt><dd>{tracking}</dd></div>}
              </dl>
              {items.length > 0 && (
                <ul className="zl-orders__row-items">
                  {items.slice(0, 4).map((it, i) => (
                    <li key={i}>
                      <span>{pick(it, ['name', 'title', 'product_name'], 'Item')}</span>
                      <span>× {pick(it, ['quantity', 'qty'], 1)}</span>
                    </li>
                  ))}
                  {items.length > 4 && (
                    <li className="zl-orders__row-items-more">+{items.length - 4} more</li>
                  )}
                </ul>
              )}
              <div className="zl-orders__row-actions">
                <Link
                  to={`/track-order?order=${encodeURIComponent(number)}&email=${encodeURIComponent(user?.email || '')}`}
                  className="zl-btn-ghost"
                >
                  View details
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="zl-shop-page">
      <div className="zl-shop-page__inner">
        <div className="zl-shop-page__head">
          <div>
            <p className="zl-eyebrow">Account</p>
            <h1 className="zl-shop-page__title">My orders</h1>
          </div>
          <Link to="/services" className="zl-shop-page__back">← Continue shopping</Link>
        </div>

        <div className="zl-orders">
          {renderContent()}
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}

export default Orders
