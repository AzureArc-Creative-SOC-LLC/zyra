import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authResetPassword } from '../lib/api'
import './Cart.css'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'working' | 'done'
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'working') return
    if (!token) {
      setError('This reset link is missing its token. Request a new link.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    setStatus('working')
    try {
      await authResetPassword({ token, password })
      setStatus('done')
      setTimeout(() => navigate('/signin'), 2000)
    } catch (err) {
      setStatus('idle')
      setError(err && err.message ? err.message : 'Could not reset password. Try again.')
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
              Set a new <em>password.</em><br />
              Get back to <em>research.</em>
            </p>
            <div className="zl-auth__hero-foot">
              <span><strong>Min 6 characters</strong> · longer is stronger.</span>
              <span><strong>One-time link</strong> · expires after use.</span>
              <span><strong>Trouble?</strong> · request a fresh reset email.</span>
            </div>
          </div>

          <div className="zl-auth__form-wrap">
            <h2 className="zl-auth__form-title">
              Reset <em>password.</em>
            </h2>
            <p className="zl-auth__lead">
              Choose a new password for your researcher account.
            </p>

            {status === 'done' ? (
              <div className="zl-auth__form">
                <p className="zl-auth__lead" style={{ marginTop: 0 }}>
                  Password updated. Redirecting you to sign in…
                </p>
                <Link to="/signin" className="zl-btn-solid zl-auth__cta" style={{ textAlign: 'center' }}>
                  Sign in now
                </Link>
              </div>
            ) : (
              <form className="zl-auth__form" onSubmit={submit} noValidate>
                <label className="zl-auth__field">
                  <span>New password</span>
                  <input
                    className="zl-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>
                <label className="zl-auth__field">
                  <span>Confirm password</span>
                  <input
                    className="zl-input"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>

                {error && <p className="zl-error">{error}</p>}

                <button
                  type="submit"
                  className="zl-btn-solid zl-auth__cta"
                  disabled={status === 'working'}
                >
                  {status === 'working' ? 'Updating…' : 'Update password'}
                </button>

                <p className="zl-auth__switch">
                  Need a new link?{' '}
                  <Link to="/forgot-password">Request reset email</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
