/* Central Order Management microservice — thin client.
   Base URL and endpoints per API_DOCUMENTATION.md. */

const BASE = 'https://www.microservices.tech'
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
