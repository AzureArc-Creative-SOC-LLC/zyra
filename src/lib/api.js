/* Central Order Management microservice — thin client.
   Base URL and endpoints per API_DOCUMENTATION.md. */

const BASE = 'https://www.microservices.tech' // production
// const BASE = 'http://localhost:5003' // TESTING — local user-order-service

// zyra is a static Vite SPA, not Next.js — it has no server-side API routes
// of its own. Order confirmation email is sent by a tiny companion server
// (see /server) that this frontend calls after the order is created; that
// server forwards to the shared order-confirmation email module. In
// production this is same-origin (nginx proxies /api/send-order-confirmation
// to the companion server); while testing it's a bare local port.
const EMAIL_BASE = '' // production (same-origin, proxied by nginx)
// const EMAIL_BASE = 'http://localhost:4002' // TESTING — local companion email server

const TOKEN_KEY = 'zl:token'

/* ---------- JWT helpers ---------- */
export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}
export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch { /* storage disabled */ }
}
export const clearToken = () => setToken(null)

/* ---------- Generic fetch (JSON) ----------
   Returns parsed JSON. Throws an ApiError with .status and .body on non-2xx.
   Every microservice response shape ({error}, {ok:false,error}, {message}) is
   folded into a single readable message. */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function request(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const opts = { method, headers: { Accept: 'application/json', ...headers } }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  if (auth) {
    const t = getToken()
    if (t) opts.headers.Authorization = `Bearer ${t}`
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, opts)
  } catch (e) {
    throw new ApiError(e.message || 'Network error', 0, null)
  }

  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { /* non-JSON body */ }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed with ${res.status}`
    throw new ApiError(message, res.status, data)
  }
  return data
}

/* ---------- Newsletter ---------- */
export const newsletterSubscribe = ({ email, consent, source = 'footer' }) =>
  request('/api/newsletter/subscribe', {
    method: 'POST',
    body: { email, consent: !!consent, source, website: '' },
  })

/* ---------- Promo ---------- */
export const promoValidate = (code) =>
  request('/api/promos/validate', {
    method: 'POST',
    body: { code },
  })

/* ---------- Orders (details-only intake — no on-site payment) ----------
   Sole order-creation endpoint. Flat body shape + `itemsArray` (a real
   array of line items) so the server uses the structured items row directly. */
export const userOrderCreate = (payload) =>
  request('/api/user-orders', {
    method: 'POST',
    body: payload,
  })

export const userOrdersByEmail = (email) =>
  request(`/api/user-orders/by-email?email=${encodeURIComponent(email)}`)

export const userOrderGet = (orderNumber) =>
  request(`/api/user-orders/${encodeURIComponent(orderNumber)}`)

/* ---------- Order confirmation email ----------
   Posts to this frontend's own companion server (server/index.js), which
   forwards to the shared order-confirmation email module. This is a
   different origin from BASE — it never talks to the shared backend.

   Built entirely from the order backend's own success response
   (orderRes, as returned by userOrderCreate) — not from local checkout
   form/cart state — so the email always reflects what was actually
   persisted (items, totals, address), not what the client guessed before
   the order was created.

   Never throws: a failed send should not block the checkout success flow,
   so failures are only logged. */
export async function sendOrderConfirmationEmail(orderRes) {
  try {
    const shippingAddress = [
      orderRes.shippingAddress,
      orderRes.shippingCity,
      orderRes.shippingPostcode,
      orderRes.shippingCountry,
    ].filter(Boolean).join(', ')

    const res = await fetch(`${EMAIL_BASE}/api/send-order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: orderRes.customerName, email: orderRes.customerEmail },
        order: {
          orderNumber: orderRes.orderNumber,
          currency: orderRes.currency,
          items: (orderRes.items || []).map((it) => ({
            name: it.name,
            quantity: it.quantity,
            price: it.unitPrice,
          })),
          subtotal: orderRes.subtotal,
          shipping: 0,
          discount: orderRes.discountAmount,
          total: orderRes.total,
          shippingAddress,
        },
      }),
    })
    if (!res.ok) {
      console.error('[api] order confirmation email failed', { status: res.status, body: await res.text() })
    }
  } catch (e) {
    console.error('[api] order confirmation email request failed', e)
  }
}

/* ---------- Auth ---------- */
export const authRegister = (payload) =>
  request('/api/auth/register', {
    method: 'POST',
    body: payload,
  })

export const authLogin = ({ email, password }) =>
  request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })

export const authVerify = () =>
  request('/api/auth/verify', { method: 'GET', auth: true })

export const authForgotPassword = ({ email }) =>
  request('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })

export const authResetPassword = ({ token, password }) =>
  request('/api/auth/reset-password', {
    method: 'POST',
    body: { token, password },
  })
