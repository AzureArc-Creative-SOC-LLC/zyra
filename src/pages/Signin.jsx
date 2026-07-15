import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import './Cart.css'

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

function Signin() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', remember: true })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const onField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'working') return
    if (!form.email || !form.password) return
    if (mode === 'signup' && !form.name) {
      setError('Enter your name.')
      return
    }
    setStatus('working')
    setError(null)
    try {
      if (mode === 'signin') {
        await login({ email: form.email, password: form.password })
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          // Register requires these three fields. The server only validates
          // presence, not shape, so send neutral defaults from the signup UI.
          date_of_birth: '1990-01-01',
          nationality: 'Prefer not to say',
          country_of_residence: 'Prefer not to say',
        })
      }
      setStatus('done')
      navigate('/')
    } catch (err) {
      setStatus('idle')
      setError(err && err.message ? err.message : 'Sign in failed. Please try again.')
    }
  }

  return (
    <div className="zl-shop-page zl-shop-page--auth">
      <div className="zl-shop-page__inner">
        <div className="zl-auth__topbar">
          <Link to="/" className="zl-auth__wordmark" aria-label="Zyra Labs — home">
            <span className="zl-auth__wordmark-cap">Z</span>
            <span className="zl-auth__wordmark-italic">y</span>
            <span className="zl-auth__wordmark-cap">R</span>
            <span className="zl-auth__wordmark-cap">A</span>
            <span className="zl-auth__wordmark-sub">labs</span>
          </Link>
          <Link to="/" className="zl-shop-page__back">← Back to home</Link>
        </div>

        <div className="zl-auth">
          <div className="zl-auth__hero" aria-hidden="true">
            <span className="zl-auth__brand">ZYRA labs · researcher access</span>
            <p className="zl-auth__quote">
              Pharmaceutical <em>rigor,</em><br />
              in every injection.
            </p>
            <div className="zl-auth__hero-foot">
              <span><strong>HPLC-verified</strong> · every batch, every lot.</span>
              <span><strong>Cold-chain shipping</strong> · 24-hour dispatch.</span>
              <span><strong>Signed CoA</strong> · with every order.</span>
            </div>
          </div>

          <div className="zl-auth__form-wrap">
            <h2 className="zl-auth__form-title">
              {mode === 'signin' ? (
                <>Welcome <em>back.</em></>
              ) : (
                <>Start your <em>research.</em></>
              )}
            </h2>
            <p className="zl-auth__lead">
              {mode === 'signin'
                ? 'Sign in to see your orders, batch documentation, and reorder.'
                : 'Create a researcher account to track orders and receive CoAs.'}
            </p>

            <form className="zl-auth__form" onSubmit={submit}>
              {mode === 'signup' && (
                <label className="zl-auth__field">
                  <span>Full name</span>
                  <input
                    className="zl-input"
                    value={form.name}
                    onChange={(e) => onField('name', e.target.value)}
                    placeholder="Dr. Layla Faour"
                    autoComplete="name"
                    required
                  />
                </label>
              )}
              <label className="zl-auth__field">
                <span>Email</span>
                <input
                  className="zl-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => onField('email', e.target.value)}
                  placeholder="you@lab.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="zl-auth__field">
                <span>Password</span>
                <input
                  className="zl-input"
                  type="password"
                  value={form.password}
                  onChange={(e) => onField('password', e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={8}
                />
              </label>

              <div className="zl-auth__row">
                {mode === 'signin' ? (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => onField('remember', e.target.checked)}
                      />
                      Remember me
                    </label>
                    <Link to="/forgot-password">Forgot password?</Link>
                  </>
                ) : (
                  <span>By continuing you agree to our terms &amp; privacy policy.</span>
                )}
              </div>

              {error && <p className="zl-error">{error}</p>}
              <button
                type="submit"
                className="zl-btn-solid zl-auth__cta"
                disabled={status === 'working'}
              >
                {status === 'working'
                  ? 'Working…'
                  : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>

              <div className="zl-auth__divider">or</div>

              <div className="zl-auth__oauth">
                <button type="button" onClick={(e) => e.preventDefault()}>
                  <GoogleIcon /> Continue with Google
                </button>
              </div>

              <p className="zl-auth__switch">
                {mode === 'signin' ? (
                  <>Don&apos;t have an account?{' '}
                    <a
                      href="#toggle"
                      onClick={(e) => { e.preventDefault(); setMode('signup') }}
                    >Create one</a>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <a
                      href="#toggle"
                      onClick={(e) => { e.preventDefault(); setMode('signin') }}
                    >Sign in</a>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
