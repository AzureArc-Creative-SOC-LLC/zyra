import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authForgotPassword } from '../lib/api'
import './Cart.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'working' | 'sent'
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'working') return
    if (!email) {
      setError('Enter your email.')
      return
    }
    setError(null)
    setStatus('working')
    try {
      const res = await authForgotPassword({ email: email.trim() })
      setMessage(
        (res && res.message) ||
          'If an account exists with this email, a password reset link has been sent.',
      )
      setStatus('sent')
    } catch (err) {
      setStatus('idle')
      setError(err && err.message ? err.message : 'Could not send reset link. Try again.')
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
          <Link to="/signin" className="zl-shop-page__back">← Back to sign in</Link>
        </div>

        <div className="zl-auth">
          <div className="zl-auth__hero" aria-hidden="true">
            <span className="zl-auth__brand">ZYRA labs · researcher access</span>
            <p className="zl-auth__quote">
              Locked <em>out?</em><br />
              We&apos;ll help you <em>back in.</em>
            </p>
            <div className="zl-auth__hero-foot">
              <span><strong>Secure reset</strong> · time-limited link, single-use token.</span>
              <span><strong>Zero data leak</strong> · we never confirm whether an email is on file.</span>
              <span><strong>Human support</strong> · reply to any order email for help.</span>
            </div>
          </div>

          <div className="zl-auth__form-wrap">
            <h2 className="zl-auth__form-title">
              Forgot <em>password.</em>
            </h2>
            <p className="zl-auth__lead">
              Enter the email you signed up with — we&apos;ll send a link to reset your password.
            </p>

            {status === 'sent' ? (
              <div className="zl-auth__form">
                <p className="zl-auth__lead" style={{ marginTop: 0 }}>{message}</p>
                <p className="zl-auth__lead" style={{ marginTop: 0 }}>
                  Didn&apos;t get an email? Check spam, or{' '}
                  <a
                    href="#retry"
                    onClick={(e) => { e.preventDefault(); setStatus('idle'); setMessage(null) }}
                  >
                    try again
                  </a>.
                </p>
                <Link to="/signin" className="zl-btn-solid zl-auth__cta" style={{ textAlign: 'center' }}>
                  Back to sign in
                </Link>
              </div>
            ) : (
              <form className="zl-auth__form" onSubmit={submit} noValidate>
                <label className="zl-auth__field">
                  <span>Email</span>
                  <input
                    className="zl-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@lab.com"
                    autoComplete="email"
                    required
                  />
                </label>

                {error && <p className="zl-error">{error}</p>}

                <button
                  type="submit"
                  className="zl-btn-solid zl-auth__cta"
                  disabled={status === 'working'}
                >
                  {status === 'working' ? 'Sending link…' : 'Send reset link'}
                </button>

                <p className="zl-auth__switch">
                  Remembered it?{' '}
                  <Link to="/signin">Sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
